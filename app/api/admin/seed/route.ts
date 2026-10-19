import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { seedCatalog } from "@/lib/catalog-db";

export async function POST() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const count = await seedCatalog();
  return NextResponse.json({ count });
}
