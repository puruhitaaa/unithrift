import { z } from "zod";

import { and, eq, sql } from "@unithrift/db";
import { listing, user } from "@unithrift/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get user with university
    const userProfile = await ctx.db.query.user.findFirst({
      where: eq(user.id, userId),
      with: {
        university: true,
      },
    });

    if (!userProfile) {
      throw new Error("User not found");
    }

    // Get stats
    // Listings: active listings
    const [listingsCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(listing)
      .where(and(eq(listing.sellerId, userId), eq(listing.status, "ACTIVE")));

    // Sold: sold listings
    const [soldCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(listing)
      .where(and(eq(listing.sellerId, userId), eq(listing.status, "SOLD")));

    // Rating: Placeholder for now as there is no rating system yet
    const rating = 0;

    return {
      ...userProfile,
      stats: {
        listings: Number(listingsCount?.count ?? 0),
        sold: Number(soldCount?.count ?? 0),
        rating,
      },
    };
  }),

  updateContactInfo: protectedProcedure
    .input(
      z.object({
        whatsapp: z.string().optional().nullable(),
        instagram: z.string().optional().nullable(),
        line: z.string().optional().nullable(),
        telegram: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [updatedUser] = await ctx.db
        .update(user)
        .set({
          whatsapp: input.whatsapp,
          instagram: input.instagram,
          line: input.line,
          telegram: input.telegram,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId))
        .returning();

      if (!updatedUser) {
        throw new Error("Failed to update contact information");
      }

      return updatedUser;
    }),
});
