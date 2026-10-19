import Storefront from "./storefront";
import { storefrontProducts } from "@/lib/catalog-db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await storefrontProducts();
  return <Storefront products={products} />;
}
