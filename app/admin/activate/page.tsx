import ActivationForm from "./activation-form";
import "../login/login.css";

export const dynamic = "force-dynamic";

export default function AdminActivationPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <a className="login-brand" href="/">
          <img src="/importglow-logo.jpeg" alt="" />
          <span><strong>IMPORTGLOW</strong>Panel de administración</span>
        </a>
        <div className="login-copy">
          <p>ACTIVAR CUENTA</p>
          <h1>Creá tu contraseña</h1>
          <span>Esta contraseña será la que uses para administrar la tienda.</span>
        </div>
        <ActivationForm />
        <a className="login-back" href="/admin/login">← Volver al acceso</a>
      </section>
    </main>
  );
}
