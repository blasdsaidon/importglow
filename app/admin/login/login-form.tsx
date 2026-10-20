"use client";

import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "No pudimos iniciar sesión.");
      setLoading(false);
      return;
    }
    window.location.assign("/admin");
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <label>Correo electrónico<input name="email" type="email" autoComplete="email" required /></label>
      <label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Ingresando…" : "Ingresar al panel"}</button>
    </form>
  );
}
