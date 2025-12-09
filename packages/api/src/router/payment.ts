import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "@unithrift/db";
import { listing, payment, transaction } from "@unithrift/db/schema";

import { snap } from "../lib/midtrans";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paymentRouter = createTRPCRouter({
  // Initiate a payment for a listing (creates transaction + payment + Midtrans token)
  initiatePayment: protectedProcedure
    .input(
      z.object({
        listingId: z.uuid(),
        paymentMethod: z
          .enum(["MIDTRANS", "DIRECT"])
          .optional()
          .default("MIDTRANS"),
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
            paymentMethod: input.paymentMethod,
          })
          .returning();

        if (!newTransaction) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create transaction",
          });
        }

        // Generate unique order ID
        const orderId = `ORDER-${newTransaction.id}`;

        // 3. For DIRECT payment, create a simple payment record without Midtrans
        if (input.paymentMethod === "DIRECT") {
          const [newPayment] = await tx
            .insert(payment)
            .values({
              transactionId: newTransaction.id,
              amount: listingItem.price,
              status: "PENDING",
              midtransOrderId: orderId,
              midtransToken: null,
              midtransRedirectUrl: null,
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
            snapToken: null,
            redirectUrl: null,
            isDirect: true,
          };
        }

        // 4. For MIDTRANS payment, create Midtrans transaction
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

          // 5. Create payment record with Midtrans details
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
            isDirect: false,
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
    .input(z.object({ transactionId: z.uuid() }))
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
});
