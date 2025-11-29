import midtransClient from "midtrans-client";

if (
  !process.env.MIDTRANS_SERVER_KEY ||
  !process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
) {
  throw new Error(
    "MIDTRANS_SERVER_KEY or NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is not defined in environment variables",
  );
}

// Use explicit MIDTRANS_IS_PRODUCTION env var instead of NODE_ENV
// This ensures correct sandbox/production mode regardless of dev/prod environment
// Set to "true" for production Midtrans keys, "false" for sandbox keys
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});
