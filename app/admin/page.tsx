import { redirect } from "next/navigation";
import { chatGPTSignInPath, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { getAdminUser } from "@/lib/admin-auth";
import AdminPanel from "./admin-panel";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect(chatGPTSignInPath("/admin"));
  return <AdminPanel displayName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}
