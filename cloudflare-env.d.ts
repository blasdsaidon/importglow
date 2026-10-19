type D1Database = import("@miniflare/d1").D1Database;

interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

interface R2StoredObject {
  body: ReadableStream;
  etag: string;
  httpMetadata?: { contentType?: string };
}

interface R2Bucket {
  get(key: string): Promise<R2StoredObject | null>;
  put(key: string, value: ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  delete(key: string): Promise<void>;
}

declare module "cloudflare:workers" {
  export const env: {
    DB: D1Database;
    BUCKET: R2Bucket;
  };
}
