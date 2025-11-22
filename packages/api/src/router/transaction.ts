import { z } from "zod/v4";

import { and, asc, desc, eq, gte, like, lte } from "@unithrift/db";
import {
  listing,
  payment,
  paymentMethodEnum,
  transaction,
  transactionStatusEnum,
} from "@unithrift/db/schema";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

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

  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(transactionStatusEnum.enumValues).optional(),
        paymentMethod: z.enum(paymentMethodEnum.enumValues).optional(),
        minAmount: z.number().optional(),
        maxAmount: z.number().optional(),
        search: z.string().optional(), // Search by ID for now, maybe expand to buyer/seller name later if joined
        sortBy: z.enum(["createdAt", "amount"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        limit,
        offset,
        status,
        paymentMethod,
        minAmount,
        maxAmount,
        search,
        sortBy,
        sortOrder,
      } = input;

      const where = and(
        status ? eq(transaction.status, status) : undefined,
        paymentMethod
          ? eq(transaction.paymentMethod, paymentMethod)
          : undefined,
        minAmount ? gte(transaction.amount, minAmount) : undefined,
        maxAmount ? lte(transaction.amount, maxAmount) : undefined,
        search ? like(transaction.id, `%${search}%`) : undefined,
      );

      const orderBy =
        sortBy === "amount"
          ? sortOrder === "asc"
            ? asc(transaction.amount)
            : desc(transaction.amount)
          : sortOrder === "asc"
            ? asc(transaction.createdAt)
            : desc(transaction.createdAt);

      const items = await ctx.db.query.transaction.findMany({
        where,
        limit,
        offset,
        orderBy: [orderBy],
        with: {
          buyer: true,
          seller: true,
          listing: true,
          payment: true,
        },
      });

      return items;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.uuid(),
        status: z.enum(transactionStatusEnum.enumValues).optional(),
        paymentMethod: z.enum(paymentMethodEnum.enumValues).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedTransaction] = await ctx.db
        .update(transaction)
        .set({
          status: input.status,
          paymentMethod: input.paymentMethod,
          updatedAt: new Date(),
        })
        .where(eq(transaction.id, input.id))
        .returning();

      if (!updatedTransaction) {
        throw new Error("Transaction not found or failed to update");
      }

      return updatedTransaction;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedTransaction] = await ctx.db
        .delete(transaction)
        .where(eq(transaction.id, input.id))
        .returning();

      if (!deletedTransaction) {
        throw new Error("Transaction not found or failed to delete");
      }

      return deletedTransaction;
    }),

  get: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.query.transaction.findFirst({
        where: eq(transaction.id, input.id),
        with: {
          buyer: true,
          seller: true,
          listing: true,
          payment: true,
        },
      });

      if (!item) {
        throw new Error("Transaction not found");
      }

      return item;
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
