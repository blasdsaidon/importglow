import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const data = await request.formData();
  const file = data.get("file");
  const productId = String(data.get("productId") || "producto").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Seleccioná una imagen." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo debe ser una imagen." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "La imagen no puede superar 8 MB." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const objectKey = `products/${productId}/${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from("product-images")
    .upload(objectKey, file, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: `No se pudo subir la imagen: ${error.message}` }, { status: 500 });
  const publicUrl = supabase.storage.from("product-images").getPublicUrl(objectKey).data.publicUrl;

  return NextResponse.json({
    image: {
      id: crypto.randomUUID(),
      objectKey,
      url: publicUrl,
      alt: "",
    },
  });
}
