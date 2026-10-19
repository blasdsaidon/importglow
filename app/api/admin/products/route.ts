import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listProducts, saveProduct } from "@/lib/catalog-db";
import { artForCategory, makeId, type Category, type Product } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json({ products: await listProducts(true) });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const input = await request.json() as Partial<Product>;
  if (!input.name?.trim()) return NextResponse.json({ error: "Ingresá el nombre del producto." }, { status: 400 });
  if (!input.variants?.length) return NextResponse.json({ error: "Agregá al menos una variante." }, { status: 400 });

  const category: Category = input.category === "Perfumes" ? "Perfumes" : "Vapers";
  const product: Product = {
    id: input.id?.trim() || makeId(input.name),
    name: input.name.trim(),
    category,
    eyebrow: input.eyebrow?.trim() || "",
    description: input.description?.trim() || "",
    badge: input.badge?.trim() || undefined,
    art: input.art || artForCategory(category),
    active: input.active !== false,
    images: (input.images || []).slice(0, 6).map((image) => ({
      id: image.id || crypto.randomUUID(),
      objectKey: image.objectKey,
      url: image.url,
      alt: image.alt || input.name!,
    })),
    variants: input.variants.map((variant) => ({
      id: variant.id || crypto.randomUUID(),
      label: variant.label?.trim() || "Variante",
      price: Number(variant.price) || 0,
      stock: Number(variant.stock) || 0,
      active: variant.active !== false,
    })),
  };

  await saveProduct(product);
  return NextResponse.json({ product, message: "Producto guardado." });
}
