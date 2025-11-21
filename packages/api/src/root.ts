import { authRouter } from "./router/auth";
// import { listingRouter } from "./router/listing";
// import { transactionRouter } from "./router/transaction";
// import { universityRouter } from "./router/university";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  // university: universityRouter,
  // listing: listingRouter,
  // transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
