// packages/api/src/types/midtrans-webhook.ts
import { z } from "zod";

export const midtransWebhookSchema = z.object({
  transaction_time: z.string(),
  transaction_status: z.enum([
    "capture",
    "settlement",
    "pending",
    "deny",
    "cancel",
    "expire",
    "refund",
    "partial_refund",
    "authorize",
  ]),
  transaction_id: z.string(),
  status_message: z.string(),
  status_code: z.string(),
  signature_key: z.string(),
  payment_type: z.string(),
  order_id: z.string(),
  merchant_id: z.string(),
  gross_amount: z.string(),
  fraud_status: z.enum(["accept", "deny", "challenge"]).optional(),
  currency: z.string().optional(),
  settlement_time: z.string().optional(),
  expiry_time: z.string().optional(),
});

export type MidtransWebhook = z.infer<typeof midtransWebhookSchema>;

export const paymentStatusSchema = z.enum([
  "pending",
  "success",
  "failed",
  "expired",
  "refunded",
]);

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
