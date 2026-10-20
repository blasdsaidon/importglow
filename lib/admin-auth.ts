import { getSupabaseAuthClient } from "@/lib/supabase-auth";

export type AdminUser = {
  displayName: string;
  email: string;
};

export async function getAdminUser(): Promise<AdminUser | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await getSupabaseAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!allowedEmail || user.email.toLowerCase() !== allowedEmail) return null;

  const fullName = typeof user.user_metadata?.full_name === "string"
    ? user.user_metadata.full_name.trim()
    : "";
  return { displayName: fullName || user.email, email: user.email };
}

export async function isAdminRequest(): Promise<boolean> {
  return Boolean(await getAdminUser());
}
