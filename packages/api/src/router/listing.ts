import { z } from "zod/v4";

import { and, desc, eq, gte, like, lte } from "@unithrift/db";
import {
  listing,
  listingCategoryEnum,
  listingConditionEnum,
  listingMedia,
  listingMediaTypeEnum,
} from "@unithrift/db/schema";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
      } = input;

      const where = and(
        eq(listing.status, "ACTIVE"),
        universityId ? eq(listing.universityId, universityId) : undefined,
        category ? eq(listing.category, category) : undefined,
        condition ? eq(listing.condition, condition) : undefined,
        minPrice ? gte(listing.price, minPrice) : undefined,
        maxPrice ? lte(listing.price, maxPrice) : undefined,
        search ? like(listing.title, `%${search}%`) : undefined,
      );

      const items = await ctx.db.query.listing.findMany({
        where,
        limit,
        offset,
        orderBy: [desc(listing.createdAt)],
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
