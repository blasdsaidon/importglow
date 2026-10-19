import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { productImages, products, productVariants } from "@/db/schema";
import { initialProducts, type Category, type Product } from "@/lib/catalog";

function imageUrl(objectKey: string): string {
  return `/api/media/${objectKey.split("/").map(encodeURIComponent).join("/")}`;
}

export async function listProducts(includeInactive = false): Promise<Product[]> {
  const db = getDb();
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.name));
  const visibleRows = includeInactive ? rows : rows.filter((row) => row.active);
  if (!visibleRows.length) return [];

  const [variantRows, imageRows] = await Promise.all([
    db.select().from(productVariants).orderBy(asc(productVariants.sortOrder)),
    db.select().from(productImages).orderBy(asc(productImages.sortOrder)),
  ]);

  return visibleRows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category as Category,
    eyebrow: row.eyebrow,
    description: row.description,
    badge: row.badge ?? undefined,
    art: row.art,
    active: row.active,
    variants: variantRows
      .filter((variant) => variant.productId === row.id && (includeInactive || variant.active))
      .map((variant) => ({
        id: variant.id,
        label: variant.label,
        price: variant.price,
        stock: variant.stock,
        active: variant.active,
      })),
    images: imageRows
      .filter((image) => image.productId === row.id)
      .map((image) => ({
        id: image.id,
        objectKey: image.objectKey,
        url: imageUrl(image.objectKey),
        alt: image.alt,
      })),
  }));
}

export async function storefrontProducts(): Promise<Product[]> {
  try {
    const stored = await listProducts(false);
    return stored.length ? stored : initialProducts;
  } catch {
    return initialProducts;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  const existing = await db.select({ createdAt: products.createdAt }).from(products).where(eq(products.id, product.id));

  await db.insert(products).values({
    id: product.id,
    name: product.name.trim(),
    category: product.category,
    eyebrow: product.eyebrow.trim(),
    description: product.description.trim(),
    badge: product.badge?.trim() || null,
    art: product.art,
    active: product.active,
    sortOrder: 0,
    createdAt: existing[0]?.createdAt ?? now,
    updatedAt: now,
  }).onConflictDoUpdate({
    target: products.id,
    set: {
      name: product.name.trim(),
      category: product.category,
      eyebrow: product.eyebrow.trim(),
      description: product.description.trim(),
      badge: product.badge?.trim() || null,
      art: product.art,
      active: product.active,
      updatedAt: now,
    },
  });

  await db.delete(productVariants).where(eq(productVariants.productId, product.id));
  await db.delete(productImages).where(eq(productImages.productId, product.id));

  if (product.variants.length) {
    await db.insert(productVariants).values(product.variants.map((variant, index) => ({
      id: variant.id,
      productId: product.id,
      label: variant.label.trim(),
      price: Math.max(0, Math.round(variant.price)),
      stock: Math.max(0, Math.round(variant.stock)),
      active: variant.active,
      sortOrder: index,
    })));
  }

  const uploadedImages = product.images.filter((image) => image.objectKey);
  if (uploadedImages.length) {
    await db.insert(productImages).values(uploadedImages.map((image, index) => ({
      id: image.id,
      productId: product.id,
      objectKey: image.objectKey!,
      alt: image.alt.trim() || product.name,
      sortOrder: index,
    })));
  }
}

export async function seedCatalog(): Promise<number> {
  const db = getDb();
  const existing = await db.select({ id: products.id }).from(products);
  const existingIds = new Set(existing.map((product) => product.id));
  const missing = initialProducts.filter((product) => !existingIds.has(product.id));
  for (const product of missing) await saveProduct(product);
  return missing.length;
}
