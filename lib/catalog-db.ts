import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { initialProducts, type Category, type Product } from "@/lib/catalog";

type ProductRow = {
  id: string; name: string; category: string; eyebrow: string; description: string;
  badge: string | null; art: string; active: boolean; sort_order: number;
  created_at: string; updated_at: string;
};
type VariantRow = {
  id: string; product_id: string; label: string; price: number; stock: number;
  active: boolean; sort_order: number;
};
type ImageRow = {
  id: string; product_id: string; object_key: string; alt: string; sort_order: number;
};

function imageUrl(objectKey: string): string {
  return getSupabaseAdmin().storage.from("product-images").getPublicUrl(objectKey).data.publicUrl;
}

function throwIfError(error: { message: string } | null, action: string) {
  if (error) throw new Error(`${action}: ${error.message}`);
}

export async function listProducts(includeInactive = false): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  let productsQuery = supabase.from("products").select("*")
    .order("sort_order", { ascending: true }).order("name", { ascending: true });
  if (!includeInactive) productsQuery = productsQuery.eq("active", true);

  const [productsResult, variantsResult, imagesResult] = await Promise.all([
    productsQuery,
    supabase.from("product_variants").select("*").order("sort_order", { ascending: true }),
    supabase.from("product_images").select("*").order("sort_order", { ascending: true }),
  ]);
  throwIfError(productsResult.error, "No se pudo leer el catálogo");
  throwIfError(variantsResult.error, "No se pudieron leer las variantes");
  throwIfError(imagesResult.error, "No se pudieron leer las imágenes");

  const productRows = (productsResult.data ?? []) as ProductRow[];
  const variantRows = (variantsResult.data ?? []) as VariantRow[];
  const imageRows = (imagesResult.data ?? []) as ImageRow[];

  return productRows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category as Category,
    eyebrow: row.eyebrow,
    description: row.description,
    badge: row.badge ?? undefined,
    art: row.art,
    active: row.active,
    variants: variantRows
      .filter((variant) => variant.product_id === row.id && (includeInactive || variant.active))
      .map((variant) => ({
        id: variant.id, label: variant.label, price: variant.price,
        stock: variant.stock, active: variant.active,
      })),
    images: imageRows.filter((image) => image.product_id === row.id).map((image) => ({
      id: image.id,
      objectKey: image.object_key,
      url: imageUrl(image.object_key),
      alt: image.alt,
    })),
  }));
}

export async function storefrontProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return initialProducts;
  try {
    const stored = await listProducts(false);
    return stored.length ? stored : initialProducts;
  } catch (error) {
    console.error("Supabase no está disponible; se muestra el catálogo inicial.", error);
    return initialProducts;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const existing = await supabase.from("products").select("created_at")
    .eq("id", product.id).maybeSingle();
  throwIfError(existing.error, "No se pudo revisar el producto");

  const upsertResult = await supabase.from("products").upsert({
    id: product.id,
    name: product.name.trim(),
    category: product.category,
    eyebrow: product.eyebrow.trim(),
    description: product.description.trim(),
    badge: product.badge?.trim() || null,
    art: product.art,
    active: product.active,
    sort_order: 0,
    created_at: existing.data?.created_at ?? now,
    updated_at: now,
  });
  throwIfError(upsertResult.error, "No se pudo guardar el producto");

  const [deleteVariants, deleteImages] = await Promise.all([
    supabase.from("product_variants").delete().eq("product_id", product.id),
    supabase.from("product_images").delete().eq("product_id", product.id),
  ]);
  throwIfError(deleteVariants.error, "No se pudieron actualizar las variantes");
  throwIfError(deleteImages.error, "No se pudieron actualizar las imágenes");

  if (product.variants.length) {
    const variantsResult = await supabase.from("product_variants").insert(
      product.variants.map((variant, index) => ({
        id: variant.id,
        product_id: product.id,
        label: variant.label.trim(),
        price: Math.max(0, Math.round(variant.price)),
        stock: Math.max(0, Math.round(variant.stock)),
        active: variant.active,
        sort_order: index,
      })),
    );
    throwIfError(variantsResult.error, "No se pudieron guardar las variantes");
  }

  const uploadedImages = product.images.filter((image) => image.objectKey);
  if (uploadedImages.length) {
    const imagesResult = await supabase.from("product_images").insert(
      uploadedImages.map((image, index) => ({
        id: image.id,
        product_id: product.id,
        object_key: image.objectKey!,
        alt: image.alt.trim() || product.name,
        sort_order: index,
      })),
    );
    throwIfError(imagesResult.error, "No se pudieron guardar las imágenes");
  }
}

export async function seedCatalog(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const existing = await supabase.from("products").select("id");
  throwIfError(existing.error, "No se pudo revisar el catálogo");
  const existingIds = new Set((existing.data ?? []).map((product) => product.id as string));
  const missing = initialProducts.filter((product) => !existingIds.has(product.id));
  for (const product of missing) await saveProduct(product);
  return missing.length;
}
