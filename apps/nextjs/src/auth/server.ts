import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";

import { initAuth } from "@unithrift/auth";

import { env } from "~/env";

const normalize = (url: string) => url.replace(/^https?:\/\//, ""); // strips protocol if it exists

const baseUrl =
  env.VERCEL_ENV === "production"
    ? `https://${normalize(env.VERCEL_URL ?? "turbo.t3.gg")}`
    : env.VERCEL_ENV === "preview"
      ? `https://${normalize(env.VERCEL_URL ?? "turbo.t3.gg")}`
      : "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  productionUrl: `https://${normalize(env.VERCEL_URL ?? "turbo.t3.gg")}`,
  secret: env.AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,
  extraPlugins: [nextCookies()],
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
