import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import AdminPanel from "./admin-panel";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return <AdminPanel displayName={user.displayName} signOutPath="/api/admin/logout" />;
}
