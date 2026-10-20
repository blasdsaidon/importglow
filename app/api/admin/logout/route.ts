import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { supabasePublicConfig } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { url, anonKey } = supabasePublicConfig();
  const response = NextResponse.redirect(new URL("/", request.url));
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  });
  await supabase.auth.signOut();
  return response;
}
