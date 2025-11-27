import { authRouter } from "./router/auth";
import { dashboardRouter } from "./router/dashboard";
import { listingRouter } from "./router/listing";
import { transactionRouter } from "./router/transaction";
import { universityRouter } from "./router/university";
import { uploadRouter } from "./router/upload";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  dashboard: dashboardRouter,
  university: universityRouter,
  listing: listingRouter,
  transaction: transactionRouter,
  upload: uploadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
