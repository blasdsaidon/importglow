import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import LoginForm from "./login-form";
import "./login.css";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin");

  return (
    <main className="login-page">
      <section className="login-card">
        <a className="login-brand" href="/">
          <img src="/importglow-logo.jpeg" alt="" />
          <span><strong>IMPORTGLOW</strong>Panel de administración</span>
        </a>
        <div className="login-copy">
          <p>ACCESO PRIVADO</p>
          <h1>Ingresá para administrar la tienda</h1>
          <span>Usá el correo y la contraseña de la cuenta administradora.</span>
        </div>
        <LoginForm />
        <a className="login-back" href="/">← Volver al catálogo</a>
      </section>
    </main>
  );
}
