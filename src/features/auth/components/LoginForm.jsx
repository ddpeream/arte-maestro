// Presenta el formulario de acceso administrativo.
function LoginForm({
  email,
  password,
  showPassword,
  isLoading,
  isCheckingSession,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}) {
  return (
    <section className="login__panel">
      <div className="login__card">
        <span className="login__eyebrow">Equipo</span>

        <h1>Iniciar sesión</h1>

        <p>
          Entrá con el correo y la contraseña de tu cuenta de administración.
        </p>

        {errorMessage && (
          <div className="login__error" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="login__field">
            <label htmlFor="admin-email">Correo electrónico</label>

            <div className="login__field-control">
              <input
                id="admin-email"
                type="email"
                name="email"
                autoComplete="username"
                inputMode="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="login__field login__field--password">
            <label htmlFor="admin-password">Contraseña</label>

            <div className="login__field-control">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                required
              />

              <button
                type="button"
                className="login__toggle-pass"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                onClick={onTogglePassword}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button
            className="login__submit"
            type="submit"
            disabled={isLoading || isCheckingSession}
          >
            {isCheckingSession
              ? "Verificando sesión…"
              : isLoading
                ? "Verificando…"
                : "Entrar"}
          </button>
        </form>

        <p className="login__foot">
          Esta pantalla es la misma para admin y super admin: el rol se lee de
          tu cuenta y define qué ves adentro. No hay registro público.
        </p>
      </div>
    </section>
  );
}

export default LoginForm;
