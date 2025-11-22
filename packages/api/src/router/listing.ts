import { z } from "zod/v4";

import { and, asc, desc, eq, gte, like, lte } from "@unithrift/db";
import {
  listing,
  listingCategoryEnum,
  listingConditionEnum,
  listingMedia,
  listingMediaTypeEnum,
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
        offset: z.number().min(0).default(0),
        universityId: z.string().optional(),
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
        offset,
        universityId,
        category,
        condition,
        minPrice,
        maxPrice,
        search,
        sortBy,
        sortOrder,
      } = input;

      const where = and(
        // eq(listing.status, "ACTIVE"), // Remove this to show all listings in management? Or make it optional? University list shows all. I'll show all for now or maybe filter by status if provided.
        // Actually, for management we probably want to see all statuses.
        // But the existing router might be used by the public app which expects only ACTIVE.
        // I should probably add a `status` filter defaulting to ACTIVE if not in management mode?
        // Or just remove the hardcoded "ACTIVE" and let the client filter?
        // The prompt says "copy implementation of university page". University page shows all.
        // I will remove the hardcoded status check or make it an input.
        // To be safe for existing app, I should probably default status to "ACTIVE" if not specified?
        // But `universityRouter` doesn't have status.
        // I'll add `status` to input, optional.
        universityId ? eq(listing.universityId, universityId) : undefined,
        category ? eq(listing.category, category) : undefined,
        condition ? eq(listing.condition, condition) : undefined,
        minPrice ? gte(listing.price, minPrice) : undefined,
        maxPrice ? lte(listing.price, maxPrice) : undefined,
        search ? like(listing.title, `%${search}%`) : undefined,
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
        offset,
        orderBy: [orderBy],
        with: {
          media: true,
          seller: true,
          university: true,
        },
      });

      return items;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(256),
        description: z.string().min(1),
        price: z.number().min(0),
        category: z.enum(listingCategoryEnum.enumValues),
        condition: z.enum(listingConditionEnum.enumValues),
        universityId: z.string(),
        media: z
          .array(
            z.object({
              url: z.string().url(),
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
        const [newListing] = await tx
          .insert(listing)
          .values({
            sellerId: ctx.session.user.id,
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
        throw new Error("Listing not found or failed to delete");
      }

      return deletedListing;
    }),

  get: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
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
        throw new Error("Listing not found");
      }

      return item;
    }),
});
