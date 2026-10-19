import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  eyebrow: text("eyebrow").notNull().default(""),
  description: text("description").notNull().default(""),
  badge: text("badge"),
  art: text("art").notNull().default("vape-blue"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const productVariants = sqliteTable("product_variants", {
  id: text("id").notNull(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  price: integer("price").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => [primaryKey({ columns: [table.productId, table.id] })]);

export const productImages = sqliteTable("product_images", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  objectKey: text("object_key").notNull(),
  alt: text("alt").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});
