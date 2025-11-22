import { z } from "zod";

import { asc, desc, eq, like, or, sql } from "@unithrift/db";
import { university } from "@unithrift/db/schema";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const universityRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
        sortBy: z.enum(["name", "createdAt"]).default("name"),
        sortOrder: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, offset, search, sortBy, sortOrder } = input;

      const where = search
        ? or(
            like(university.name, `%${search}%`),
            like(university.abbr, `%${search}%`),
          )
        : undefined;

      const orderBy =
        sortBy === "name"
          ? sortOrder === "asc"
            ? asc(university.name)
            : desc(university.name)
          : sortOrder === "asc"
            ? asc(university.createdAt)
            : desc(university.createdAt);

      const items = await ctx.db.query.university.findMany({
        where,
        limit,
        offset,
        orderBy: [orderBy],
      });

      const [countResult] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(university)
        .where(where);
      const total = Number(countResult?.count ?? 0);

      return { items, total };
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        abbr: z.string().min(1),
        domain: z.string().optional(),
        logo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Generate a random ID since the schema defines it as text but doesn't have defaultRandom()
      // In a real app we might use a library like 'nanoid' or 'uuid', but here we can use crypto.randomUUID()
      // or let the database handle it if we change the schema.
      // For now, we'll assume we need to provide it.
      const id = crypto.randomUUID();

      const [newUniversity] = await ctx.db
        .insert(university)
        .values({
          id,
          name: input.name,
          abbr: input.abbr,
          domain: input.domain,
          logo: input.logo,
        })
        .returning();

      if (!newUniversity) {
        throw new Error("Failed to create university");
      }

      return newUniversity;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        abbr: z.string().min(1).optional(),
        domain: z.string().optional(),
        logo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedUniversity] = await ctx.db
        .update(university)
        .set({
          name: input.name,
          abbr: input.abbr,
          domain: input.domain,
          logo: input.logo,
          updatedAt: new Date(), // Manually update timestamp if needed, though onUpdateFn should handle it if using drizzle-orm's update
        })
        .where(eq(university.id, input.id))
        .returning();

      if (!updatedUniversity) {
        throw new Error("University not found or failed to update");
      }

      return updatedUniversity;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedUniversity] = await ctx.db
        .delete(university)
        .where(eq(university.id, input.id))
        .returning();

      if (!deletedUniversity) {
        throw new Error("University not found or failed to delete");
      }

      return deletedUniversity;
    }),
});
