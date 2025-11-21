import { z } from "zod/v4";

import { eq } from "@unithrift/db";
import {
  listing,
  payment,
  paymentMethodEnum,
  transaction,
} from "@unithrift/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        listingId: z.uuid(),
        paymentMethod: z.enum(paymentMethodEnum.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Get listing to check price and availability
      const listingItem = await ctx.db.query.listing.findFirst({
        where: eq(listing.id, input.listingId),
      });

      if (!listingItem) throw new Error("Listing not found");
      if (listingItem.status !== "ACTIVE")
        throw new Error("Listing is not available");
      if (listingItem.sellerId === ctx.session.user.id)
        throw new Error("Cannot buy your own listing");

      return ctx.db.transaction(async (tx) => {
        // 2. Create transaction
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

        if (!newTransaction) throw new Error("Failed to create transaction");

        // 3. Create payment record
        await tx.insert(payment).values({
          transactionId: newTransaction.id,
          amount: listingItem.price,
          status: "PENDING",
          // midtransToken will be updated later if method is MIDTRANS
        });

        return newTransaction;
      });
    }),

  listPurchases: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.transaction.findMany({
      where: eq(transaction.buyerId, ctx.session.user.id),
      with: {
        listing: {
          with: {
            media: true,
          },
        },
        payment: true,
      },
    });
  }),

  listSales: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.transaction.findMany({
      where: eq(transaction.sellerId, ctx.session.user.id),
      with: {
        listing: {
          with: {
            media: true,
          },
        },
        payment: true,
        buyer: true,
      },
    });
  }),
});
