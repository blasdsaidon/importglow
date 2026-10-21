"use client";

import { createBrowserClient } from "@supabase/ssr";
import { FormEvent, useEffect, useMemo, useState } from "react";

export default function ActivationForm() {
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ), []);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function restoreInvitationSession() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const code = new URLSearchParams(window.location.search).get("code");

      let authError: Error | null = null;
      if (accessToken && refreshToken) {
        const result = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        authError = result.error;
      } else if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code);
        authError = result.error;
      } else {
        const result = await supabase.auth.getSession();
        authError = result.error;
        if (!result.data.session) authError = new Error("Invitación inválida");
      }

      if (authError) {
        setError("La invitación venció o ya fue utilizada. Pedí un enlace nuevo.");
        return;
      }
      window.history.replaceState({}, document.title, window.location.pathname);
      setReady(true);
    }

    void restoreInvitationSession();
  }, [supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmation") || "");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("No pudimos guardar la contraseña. Pedí un enlace nuevo.");
      setLoading(false);
      return;
    }
    window.location.assign("/admin");
  }

  if (!ready) {
    return error
      ? <p className="login-error" role="alert">{error}</p>
      : <p className="login-status">Validando invitación…</p>;
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <label>Nueva contraseña<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
      <label>Repetir contraseña<input name="confirmation" type="password" autoComplete="new-password" minLength={8} required /></label>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Guardando…" : "Crear contraseña y entrar"}</button>
    </form>
  );
}
