import { sql } from "@unithrift/db";
import { listing, transaction, user } from "@unithrift/db/schema";

import { adminProcedure, createTRPCRouter } from "../trpc";

export const dashboardRouter = createTRPCRouter({
  getStats: adminProcedure.query(async ({ ctx }) => {
    // 1. Total Revenue (sum of paid transactions)
    const [revenueResult] = await ctx.db
      .select({
        total: sql<number>`sum(${transaction.amount})`,
      })
      .from(transaction)
      .where(
        sql`${transaction.status} = 'PAID' OR ${transaction.status} = 'SHIPPED' OR ${transaction.status} = 'COMPLETED'`,
      );

    const totalRevenue = revenueResult?.total ?? 0;

    // 2. Total Transactions Count
    const [transactionsCountResult] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(transaction);
    const totalTransactions = transactionsCountResult?.count ?? 0;

    // 3. Total Listings Count
    const [listingsCountResult] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(listing);
    const totalListings = listingsCountResult?.count ?? 0;

    // 4. Total Users Count
    const [usersCountResult] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(user);
    const totalUsers = usersCountResult?.count ?? 0;

    // 5. Recent Transactions
    const recentTransactions = await ctx.db.query.transaction.findMany({
      limit: 5,
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      with: {
        buyer: true,
        listing: true,
      },
    });

    // 6. Sales Chart Data (Last 7 days)
    // This is a bit complex with pure SQL in Drizzle without raw sql helper for date truncation depending on DB (Postgres)
    // Assuming Postgres: date_trunc('day', created_at)
    const salesData = await ctx.db
      .select({
        date: sql<string>`to_char(${transaction.createdAt}, 'YYYY-MM-DD')`,
        amount: sql<number>`sum(${transaction.amount})`,
      })
      .from(transaction)
      .where(
        sql`${transaction.status} IN ('PAID', 'SHIPPED', 'COMPLETED') AND ${transaction.createdAt} > now() - interval '30 days'`,
      )
      .groupBy(sql`to_char(${transaction.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${transaction.createdAt}, 'YYYY-MM-DD')`);

    return {
      totalRevenue,
      totalTransactions,
      totalListings,
      totalUsers,
      recentTransactions,
      salesData,
    };
  }),
});
