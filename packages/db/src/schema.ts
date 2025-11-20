import { relations, sql } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

import { university, user } from "./auth-schema";

// Enums
export const listingStatusEnum = pgEnum("listing_status", [
  "DRAFT",
  "ACTIVE",
  "SOLD",
  "DELETED",
]);
export const listingCategoryEnum = pgEnum("listing_category", [
  "CLOTHING",
  "BOOKS",
  "ELECTRONICS",
  "FURNITURE",
  "STATIONERY",
  "OTHER",
]);
export const listingConditionEnum = pgEnum("listing_condition", [
  "NEW",
  "LIKE_NEW",
  "GOOD",
  "FAIR",
  "POOR",
]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "PENDING",
  "PAID",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "DIRECT",
  "MIDTRANS",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "EXPIRED",
]);

export const listing = pgTable("listing", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  sellerId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  universityId: t
    .text()
    .notNull()
    .references(() => university.id, { onDelete: "cascade" }),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text().notNull(),
  price: t.integer().notNull(),
  category: listingCategoryEnum().notNull(),
  condition: listingConditionEnum().notNull(),
  status: listingStatusEnum().default("DRAFT").notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp()
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`now()`),
}));

export const listingMediaTypeEnum = pgEnum("listing_media_type", [
  "IMAGE",
  "VIDEO",
]);

export const listingMedia = pgTable("listing_media", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  listingId: t
    .uuid()
    .notNull()
    .references(() => listing.id, { onDelete: "cascade" }),
  url: t.text().notNull(),
  publicId: t.text(),
  type: listingMediaTypeEnum().notNull(),
  order: t.integer().default(0).notNull(),
}));

export const transaction = pgTable("transaction", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  buyerId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sellerId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  listingId: t
    .uuid()
    .notNull()
    .references(() => listing.id),
  amount: t.integer().notNull(),
  status: transactionStatusEnum().default("PENDING").notNull(),
  paymentMethod: paymentMethodEnum().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp()
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`now()`),
}));

export const payment = pgTable("payment", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  transactionId: t
    .uuid()
    .notNull()
    .references(() => transaction.id, { onDelete: "cascade" }),
  amount: t.integer().notNull(),
  status: paymentStatusEnum().default("PENDING").notNull(),
  midtransToken: t.text(),
  midtransRedirectUrl: t.text(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp()
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`now()`),
}));

// Relations
export const usersRelations = relations(user, ({ one, many }) => ({
  university: one(university, {
    fields: [user.universityId],
    references: [university.id],
  }),
  listings: many(listing),
  purchases: many(transaction, { relationName: "buyer" }),
  sales: many(transaction, { relationName: "seller" }),
}));

export const universityRelations = relations(university, ({ many }) => ({
  users: many(user),
  listings: many(listing),
}));

export const listingRelations = relations(listing, ({ one, many }) => ({
  seller: one(user, {
    fields: [listing.sellerId],
    references: [user.id],
  }),
  university: one(university, {
    fields: [listing.universityId],
    references: [university.id],
  }),
  media: many(listingMedia),
  transaction: one(transaction),
}));

export const listingMediaRelations = relations(listingMedia, ({ one }) => ({
  listing: one(listing, {
    fields: [listingMedia.listingId],
    references: [listing.id],
  }),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  buyer: one(user, {
    fields: [transaction.buyerId],
    references: [user.id],
    relationName: "buyer",
  }),
  seller: one(user, {
    fields: [transaction.sellerId],
    references: [user.id],
    relationName: "seller",
  }),
  listing: one(listing, {
    fields: [transaction.listingId],
    references: [listing.id],
  }),
  payment: one(payment),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  transaction: one(transaction, {
    fields: [payment.transactionId],
    references: [transaction.id],
  }),
}));

export * from "./auth-schema";
