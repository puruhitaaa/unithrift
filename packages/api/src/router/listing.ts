import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { and, asc, desc, eq, gte, inArray, lte, sql } from "@unithrift/db";
import {
  listing,
  listingCategoryEnum,
  listingConditionEnum,
  listingMedia,
  listingMediaTypeEnum,
  transaction,
} from "@unithrift/db/schema";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const listingRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.number().min(0).default(0), // Use cursor for infinite scroll (offset)
        offset: z.number().min(0).optional(), // Keep for backward compatibility
        universityId: z.string().optional(),
        sellerId: z.string().optional(),
        category: z.enum(listingCategoryEnum.enumValues).optional(),
        condition: z.enum(listingConditionEnum.enumValues).optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["title", "createdAt", "price"]).default("title"),
        sortOrder: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        limit,
        cursor,
        offset,
        universityId,
        sellerId,
        category,
        condition,
        minPrice,
        maxPrice,
        search,
        sortBy,
        sortOrder,
      } = input;

      const realOffset = offset ?? cursor;

      const where = and(
        universityId ? eq(listing.universityId, universityId) : undefined,
        sellerId ? eq(listing.sellerId, sellerId) : undefined,
        category ? eq(listing.category, category) : undefined,
        condition ? eq(listing.condition, condition) : undefined,
        minPrice ? gte(listing.price, minPrice) : undefined,
        maxPrice ? lte(listing.price, maxPrice) : undefined,
        search ? sql`${listing.title} ILIKE ${`%${search}%`}` : undefined,
      );

      const orderBy =
        sortBy === "title"
          ? sortOrder === "asc"
            ? asc(listing.title)
            : desc(listing.title)
          : sortBy === "price"
            ? sortOrder === "asc"
              ? asc(listing.price)
              : desc(listing.price)
            : sortOrder === "asc"
              ? asc(listing.createdAt)
              : desc(listing.createdAt);

      const items = await ctx.db.query.listing.findMany({
        where,
        limit,
        offset: realOffset,
        orderBy: [orderBy],
        with: {
          media: true,
          seller: true,
          university: true,
        },
      });

      const [countResult] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(listing)
        .where(where);
      const total = Number(countResult?.count ?? 0);

      const nextCursor =
        realOffset + items.length < total
          ? realOffset + items.length
          : undefined;

      return { items, total, nextCursor };
    }),

  createPublic: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(256),
        description: z.string().min(1),
        price: z.number().min(0),
        category: z.enum(listingCategoryEnum.enumValues),
        condition: z.enum(listingConditionEnum.enumValues),
        universityId: z.string(),
        sellerId: z.string().optional(), // Temporary: make optional for testing
        media: z
          .array(
            z.object({
              url: z.url(),
              publicId: z.string().optional(),
              type: z.enum(listingMediaTypeEnum.enumValues),
              order: z.number().default(0),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        // Use provided sellerId or fallback to a test user
        const sellerId = input.sellerId ?? "test-seller-id";

        const [newListing] = await tx
          .insert(listing)
          .values({
            sellerId,
            universityId: input.universityId,
            title: input.title,
            description: input.description,
            price: input.price,
            category: input.category,
            condition: input.condition,
            status: "ACTIVE",
          })
          .returning();

        if (!newListing) {
          throw new Error("Failed to create listing");
        }

        if (input.media && input.media.length > 0) {
          await tx.insert(listingMedia).values(
            input.media.map((m) => ({
              listingId: newListing.id,
              url: m.url,
              publicId: m.publicId,
              type: m.type,
              order: m.order,
            })),
          );
        }

        return newListing;
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(256),
        description: z.string().min(1),
        price: z.number().min(0),
        category: z.enum(listingCategoryEnum.enumValues),
        condition: z.enum(listingConditionEnum.enumValues),
        media: z
          .array(
            z.object({
              url: z.url(),
              publicId: z.string().optional(),
              type: z.enum(listingMediaTypeEnum.enumValues),
              order: z.number().default(0),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      const universityId = user.universityId;

      if (!universityId && user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not associated with a university",
        });
      }

      return ctx.db.transaction(async (tx) => {
        const [newListing] = await tx
          .insert(listing)
          .values({
            sellerId: user.id,
            universityId: universityId ?? null,
            title: input.title,
            description: input.description,
            price: input.price,
            category: input.category,
            condition: input.condition,
            status: "ACTIVE",
          })
          .returning();

        if (!newListing) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create listing",
          });
        }

        if (input.media && input.media.length > 0) {
          await tx.insert(listingMedia).values(
            input.media.map((m) => ({
              listingId: newListing.id,
              url: m.url,
              publicId: m.publicId,
              type: m.type,
              order: m.order,
            })),
          );
        }

        return newListing;
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(256).optional(),
        description: z.string().min(1).optional(),
        price: z.number().min(0).optional(),
        category: z.enum(listingCategoryEnum.enumValues).optional(),
        condition: z.enum(listingConditionEnum.enumValues).optional(),
        status: z.enum(["DRAFT", "ACTIVE", "SOLD", "DELETED"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedListing] = await ctx.db
        .update(listing)
        .set({
          title: input.title,
          description: input.description,
          price: input.price,
          category: input.category,
          condition: input.condition,
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(listing.id, input.id))
        .returning();

      if (!updatedListing) {
        throw new Error("Listing not found or failed to update");
      }

      return updatedListing;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedListing] = await ctx.db
        .delete(listing)
        .where(eq(listing.id, input.id))
        .returning();

      if (!deletedListing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found or failed to delete",
        });
      }

      return deletedListing;
    }),

  get: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.query.listing.findFirst({
        where: eq(listing.id, input.id),
        with: {
          media: true,
          seller: true,
          university: true,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found",
        });
      }

      return item;
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.query.listing.findFirst({
        where: eq(listing.id, input.id),
        with: {
          media: {
            orderBy: [asc(listingMedia.order)],
          },
          seller: true,
          university: true,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Listing not found",
        });
      }

      return item;
    }),

  getFreshFinds: publicProcedure
    .input(
      z.object({
        category: z.enum(listingCategoryEnum.enumValues).optional(),
        universityId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = and(
        input.category ? eq(listing.category, input.category) : undefined,
        input.universityId
          ? eq(listing.universityId, input.universityId)
          : undefined,
      );

      const items = await ctx.db.query.listing.findMany({
        where,
        orderBy: [desc(listing.createdAt)],
        limit: 4,
        with: {
          media: true,
          seller: true,
          university: true,
        },
      });

      const [countResult] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(listing)
        .where(where);
      const total = Number(countResult?.count ?? 0);

      return { items, total };
    }),

  getTopPicks: publicProcedure
    .input(
      z.object({
        category: z.enum(listingCategoryEnum.enumValues).optional(),
        universityId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // 1. Find sellers with most completed transactions
      const topSellers = await ctx.db
        .select({
          sellerId: transaction.sellerId,
          count: sql<number>`count(*)`,
        })
        .from(transaction)
        .where(eq(transaction.status, "COMPLETED"))
        .groupBy(transaction.sellerId)
        .orderBy(desc(sql<number>`count(*)`))
        .limit(8);

      const topSellerIds = topSellers.map((s) => s.sellerId);

      let items;
      let total = 0;

      if (topSellerIds.length > 0) {
        const where = and(
          inArray(listing.sellerId, topSellerIds),
          input.category ? eq(listing.category, input.category) : undefined,
          input.universityId
            ? eq(listing.universityId, input.universityId)
            : undefined,
        );

        items = await ctx.db.query.listing.findMany({
          where,
          limit: 8,
          with: {
            media: true,
            seller: true,
            university: true,
          },
        });

        if (items.length > 0) {
          const [countResult] = await ctx.db
            .select({ count: sql<number>`count(*)` })
            .from(listing)
            .where(where);
          total = Number(countResult?.count ?? 0);
          return { items, total };
        }
      }

      // Fallback: Oldest listings
      const where = and(
        input.category ? eq(listing.category, input.category) : undefined,
        input.universityId
          ? eq(listing.universityId, input.universityId)
          : undefined,
      );

      items = await ctx.db.query.listing.findMany({
        where,
        orderBy: [asc(listing.createdAt)],
        limit: 8,
        with: {
          media: true,
          seller: true,
          university: true,
        },
      });

      const [countResult] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(listing)
        .where(where);
      total = Number(countResult?.count ?? 0);

      return { items, total };
    }),
});
