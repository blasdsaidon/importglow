import { env } from "cloudflare:workers";

type StoredObject = {
  body: ReadableStream;
  httpMetadata?: { contentType?: string };
  etag?: string;
};

type MediaBucket = {
  get(key: string): Promise<StoredObject | null>;
};

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key } = await context.params;
  const bucket = (env as unknown as { BUCKET?: MediaBucket }).BUCKET;
  if (!bucket) return new Response("Imagen no disponible", { status: 503 });
  const object = await bucket.get(key.join("/"));
  if (!object) return new Response("Imagen no encontrada", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType || "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
      ...(object.etag ? { etag: object.etag } : {}),
    },
  });
}
