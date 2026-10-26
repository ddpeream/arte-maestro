// Presenta la identidad visual del acceso administrativo.
function LoginVisual() {
  return (
    <section className="login__visual" aria-label="Arte Maestro">
      <div className="login__brand">
        <span className="login__brand-mark" aria-hidden="true" />
        <span>Arte Maestro</span>
      </div>

      <h2>
        Detrás de
        <br />
        escena
        <em>Panel de administración</em>
      </h2>

      <p>
        Acceso exclusivo para el equipo. Si necesitás entrar y todavía no tenés
        cuenta, pedile al super admin que te autorice.
      </p>
    </section>
  );
}

export default LoginVisual;
