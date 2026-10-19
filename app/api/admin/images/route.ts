import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

type UploadBucket = {
  put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
};

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

  const bucket = (env as unknown as { BUCKET?: UploadBucket }).BUCKET;
  if (!bucket) return NextResponse.json({ error: "El almacenamiento de imágenes no está disponible." }, { status: 503 });

  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const objectKey = `products/${productId}/${crypto.randomUUID()}.${extension}`;
  await bucket.put(objectKey, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });

  return NextResponse.json({
    image: {
      id: crypto.randomUUID(),
      objectKey,
      url: `/api/media/${objectKey.split("/").map(encodeURIComponent).join("/")}`,
      alt: "",
    },
  });
}
