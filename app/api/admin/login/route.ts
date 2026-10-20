import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { supabasePublicConfig } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const input = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const email = input?.email?.trim().toLowerCase() || "";
  const password = input?.password || "";
  const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email || !password) return NextResponse.json({ error: "Completá correo y contraseña." }, { status: 400 });
  if (!allowedEmail || email !== allowedEmail) return NextResponse.json({ error: "Las credenciales no son válidas." }, { status: 401 });

  const { url, anonKey } = supabasePublicConfig();
  let response: NextResponse = NextResponse.json({ ok: true });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  });
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) response = NextResponse.json({ error: "Las credenciales no son válidas." }, { status: 401 });
  return response;
}
