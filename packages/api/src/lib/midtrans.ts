import midtransClient from "midtrans-client";

if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
  throw new Error("MIDTRANS_SERVER_KEY or MIDTRANS_CLIENT_KEY is not defined");
}

export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});
