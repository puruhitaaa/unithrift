import { authRouter } from "./router/auth";
import { dashboardRouter } from "./router/dashboard";
import { listingRouter } from "./router/listing";
import { paymentRouter } from "./router/payment";
import { transactionRouter } from "./router/transaction";
import { universityRouter } from "./router/university";
import { uploadRouter } from "./router/upload";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  dashboard: dashboardRouter,
  university: universityRouter,
  listing: listingRouter,
  transaction: transactionRouter,
  upload: uploadRouter,
  user: userRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
