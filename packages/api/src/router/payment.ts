import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "@unithrift/db";
import { listing, payment, transaction } from "@unithrift/db/schema";

import type { PaymentStatus } from "../types/midtrans-webhook";
import { snap } from "../lib/midtrans";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { midtransWebhookSchema } from "../types/midtrans-webhook";

export const paymentRouter = createTRPCRouter({
  // Initiate a payment for a listing (creates transaction + payment + Midtrans token)
  initiatePayment: protectedProcedure
    .input(
      z.object({
        listingId: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Get listing to check price and availability
      const listingItem = await ctx.db.query.listing.findFirst({
        where: eq(listing.id, input.listingId),
        with: {
          seller: true,
        },
      });

      if (!listingItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found",
        });
      }

      if (listingItem.status !== "ACTIVE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Listing is not available for purchase",
        });
      }

      if (listingItem.sellerId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot buy your own listing",
        });
      }

      // 2. Create transaction and payment in a DB transaction
      return ctx.db.transaction(async (tx) => {
        // Create transaction record
        const [newTransaction] = await tx
          .insert(transaction)
          .values({
            buyerId: ctx.session.user.id,
            sellerId: listingItem.sellerId,
            listingId: listingItem.id,
            amount: listingItem.price,
            status: "PENDING",
            paymentMethod: "MIDTRANS",
          })
          .returning();

        if (!newTransaction) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create transaction",
          });
        }

        // Generate unique order ID for Midtrans
        const orderId = `ORDER-${newTransaction.id}`;

        // 3. Create Midtrans transaction
        try {
          const parameter = {
            transaction_details: {
              order_id: orderId,
              gross_amount: listingItem.price,
            },
            credit_card: {
              secure: true,
            },
            customer_details: {
              first_name: ctx.session.user.name,
              email: ctx.session.user.email,
              phone: "", // You might want to add phone to user schema
            },
            item_details: [
              {
                id: listingItem.id,
                price: listingItem.price,
                quantity: 1,
                name: listingItem.title,
              },
            ],
          };

          const midtransTransaction = (await snap.createTransaction(
            parameter,
          )) as { token: string; redirect_url: string };

          // 4. Create payment record with Midtrans details
          const [newPayment] = await tx
            .insert(payment)
            .values({
              transactionId: newTransaction.id,
              amount: listingItem.price,
              status: "PENDING",
              midtransOrderId: orderId,
              midtransToken: midtransTransaction.token,
              midtransRedirectUrl: midtransTransaction.redirect_url,
            })
            .returning();

          if (!newPayment) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create payment record",
            });
          }

          return {
            transactionId: newTransaction.id,
            paymentId: newPayment.id,
            snapToken: midtransTransaction.token,
            redirectUrl: midtransTransaction.redirect_url,
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create Midtrans transaction: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          });
        }
      });
    }),

  // Check payment status by transaction ID
  checkPaymentStatus: protectedProcedure
    .input(z.object({ transactionId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const paymentRecord = await ctx.db.query.payment.findFirst({
        where: eq(payment.transactionId, input.transactionId),
      });

      if (!paymentRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment not found",
        });
      }

      return {
        status: paymentRecord.status,
        amount: paymentRecord.amount,
        updatedAt: paymentRecord.updatedAt,
      };
    }),

  // Handle Midtrans webhook notifications
  handleWebhook: publicProcedure
    .input(midtransWebhookSchema)
    .mutation(async ({ ctx, input }) => {
      // 1. Verify signature
      const serverKey = process.env.MIDTRANS_SERVER_KEY;
      const hash = crypto
        .createHash("sha512")
        .update(
          `${input.order_id}${input.status_code}${input.gross_amount}${serverKey}`,
        )
        .digest("hex");

      if (hash !== input.signature_key) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid signature",
        });
      }

      // 2. Map Midtrans status to our payment status
      let paymentStatus: PaymentStatus = "pending";
      let transactionStatus: "PENDING" | "PAID" | "CANCELLED" = "PENDING";

      if (input.transaction_status === "capture") {
        paymentStatus = input.fraud_status === "accept" ? "success" : "pending";
        transactionStatus =
          input.fraud_status === "accept" ? "PAID" : "PENDING";
      } else if (input.transaction_status === "settlement") {
        paymentStatus = "success";
        transactionStatus = "PAID";
      } else if (
        input.transaction_status === "cancel" ||
        input.transaction_status === "deny"
      ) {
        paymentStatus = "failed";
        transactionStatus = "CANCELLED";
      } else if (input.transaction_status === "expire") {
        paymentStatus = "expired";
        transactionStatus = "CANCELLED";
      } else if (
        input.transaction_status === "refund" ||
        input.transaction_status === "partial_refund"
      ) {
        paymentStatus = "refunded";
        transactionStatus = "CANCELLED";
      } else if (input.transaction_status === "pending") {
        paymentStatus = "pending";
        transactionStatus = "PENDING";
      }

      // 3. Update payment and transaction in database
      await ctx.db.transaction(async (tx) => {
        // Find payment by Midtrans order ID
        const paymentRecord = await tx.query.payment.findFirst({
          where: eq(payment.midtransOrderId, input.order_id),
        });

        if (!paymentRecord) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment not found for order ID",
          });
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

        // If payment is successful, mark listing as sold
        if (paymentStatus === "success") {
          const transactionRecord = await tx.query.transaction.findFirst({
            where: eq(transaction.id, paymentRecord.transactionId),
          });

          if (transactionRecord) {
            await tx
              .update(listing)
              .set({
                status: "SOLD",
                updatedAt: new Date(),
              })
              .where(eq(listing.id, transactionRecord.listingId));
          }
        }
      });

      return {
        success: true,
        paymentStatus,
        transactionStatus,
        orderId: input.order_id,
        transactionId: input.transaction_id,
        message: `Payment ${paymentStatus}`,
      };
    }),
});
