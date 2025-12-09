import crypto from "crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

import { eq } from "@unithrift/db";
import { db } from "@unithrift/db/client";
import { listing, payment, transaction } from "@unithrift/db/schema";

import { env } from "~/env";

// Inline Midtrans webhook schema to avoid cross-package import issues
const midtransWebhookSchema = z.object({
  transaction_time: z.string(),
  transaction_status: z.enum([
    "capture",
    "settlement",
    "pending",
    "deny",
    "cancel",
    "expire",
    "refund",
    "partial_refund",
    "authorize",
  ]),
  transaction_id: z.string(),
  status_message: z.string(),
  status_code: z.string(),
  signature_key: z.string(),
  payment_type: z.string(),
  order_id: z.string(),
  merchant_id: z.string(),
  gross_amount: z.string(),
  fraud_status: z.enum(["accept", "deny", "challenge"]).optional(),
  currency: z.string().optional(),
  settlement_time: z.string().optional(),
  expiry_time: z.string().optional(),
});

type PaymentStatus = "pending" | "success" | "failed" | "expired" | "refunded";

/**
 * Midtrans Webhook Handler
 *
 * This endpoint receives HTTP notifications from Midtrans when a payment status changes.
 * It does NOT use tRPC because:
 * 1. Midtrans calls this endpoint directly (no auth context)
 * 2. We need to validate the signature from Midtrans
 * 3. We must return a 200 status to acknowledge receipt
 */
export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    // 1. Validate webhook payload structure
    const validationResult = midtransWebhookSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Invalid webhook payload:", validationResult.error);
      return NextResponse.json(
        { error: "Invalid payload structure" },
        { status: 400 },
      );
    }

    const notification = validationResult.data;

    // 2. Verify signature from Midtrans
    const serverKey = env.MIDTRANS_SERVER_KEY;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(
        `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`,
      )
      .digest("hex");

    if (expectedSignature !== notification.signature_key) {
      console.error("Invalid signature:", {
        expected: expectedSignature,
        received: notification.signature_key,
        orderId: notification.order_id,
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Map Midtrans status to our payment status
    let paymentStatus: PaymentStatus = "pending";
    let transactionStatus: "PENDING" | "PAID" | "CANCELLED" = "PENDING";
    let listingStatus: "ACTIVE" | "SOLD" | null = null;

    switch (notification.transaction_status) {
      case "capture":
        // For credit card, capture with fraud_status "accept" means success
        if (notification.fraud_status === "accept") {
          paymentStatus = "success";
          transactionStatus = "PAID";
          listingStatus = "SOLD";
        } else if (notification.fraud_status === "challenge") {
          // Transaction is flagged for review
          paymentStatus = "pending";
          transactionStatus = "PENDING";
        } else {
          paymentStatus = "failed";
          transactionStatus = "CANCELLED";
        }
        break;

      case "settlement":
        paymentStatus = "success";
        transactionStatus = "PAID";
        listingStatus = "SOLD";
        break;

      case "pending":
        paymentStatus = "pending";
        transactionStatus = "PENDING";
        break;

      case "deny":
      case "cancel":
        paymentStatus = "failed";
        transactionStatus = "CANCELLED";
        break;

      case "expire":
        paymentStatus = "expired";
        transactionStatus = "CANCELLED";
        break;

      case "refund":
      case "partial_refund":
        paymentStatus = "refunded";
        transactionStatus = "CANCELLED";
        break;

      case "authorize":
        // Pre-authorization, waiting for capture
        paymentStatus = "pending";
        transactionStatus = "PENDING";
        break;
    }

    // 4. Update database records
    await db.transaction(async (tx) => {
      // Find payment by Midtrans order ID
      const paymentRecord = await tx.query.payment.findFirst({
        where: eq(payment.midtransOrderId, notification.order_id),
      });

      if (!paymentRecord) {
        console.error("Payment not found for order ID:", notification.order_id);
        throw new Error(
          `Payment not found for order ID: ${notification.order_id}`,
        );
      }

      // Update payment status
      await tx
        .update(payment)
        .set({
          status: paymentStatus.toUpperCase() as
            | "PENDING"
            | "SUCCESS"
            | "FAILED"
            | "EXPIRED",
          updatedAt: new Date(),
        })
        .where(eq(payment.id, paymentRecord.id));

      // Update transaction status
      await tx
        .update(transaction)
        .set({
          status: transactionStatus,
          updatedAt: new Date(),
        })
        .where(eq(transaction.id, paymentRecord.transactionId));

      // Update listing status if payment succeeded
      if (listingStatus) {
        const transactionRecord = await tx.query.transaction.findFirst({
          where: eq(transaction.id, paymentRecord.transactionId),
        });

        if (transactionRecord) {
          await tx
            .update(listing)
            .set({
              status: listingStatus,
              updatedAt: new Date(),
            })
            .where(eq(listing.id, transactionRecord.listingId));
        }
      }

      console.log("Webhook processed successfully:", {
        orderId: notification.order_id,
        transactionId: notification.transaction_id,
        paymentStatus,
        transactionStatus,
      });
    });

    // 5. Return 200 OK to acknowledge receipt
    // Midtrans requires this response to confirm webhook delivery
    return NextResponse.json({
      success: true,
      message: "Notification processed",
      orderId: notification.order_id,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    // Return 500 to signal Midtrans to retry the notification
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
