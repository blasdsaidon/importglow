import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", origin).toString();

  return {
    metadataBase: origin,
    title: "ImportGlow | Perfumes y vapers importados",
    description: "Explorá perfumes y vapers importados, elegí tu variante y armá tu pedido directo por WhatsApp.",
    openGraph: {
      title: "ImportGlow | Perfumes y vapers importados",
      description: "Tu próxima obsesión está acá. Elegí tu variante y pedí directo por WhatsApp.",
      locale: "es_AR",
      type: "website",
      images: [{ url: socialImage, width: 1536, height: 864, alt: "ImportGlow: perfumes y vapers" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ImportGlow | Perfumes y vapers importados",
      description: "Elegí tu variante y pedí directo por WhatsApp.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
