import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabasePublicConfig } from "@/lib/supabase";

export async function getSupabaseAuthClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = supabasePublicConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot always write refreshed cookies. Route
          // handlers still keep sessions current when the admin uses the app.
        }
      },
    },
  });
}
