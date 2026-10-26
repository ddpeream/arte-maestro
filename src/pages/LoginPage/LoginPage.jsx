import { useState } from "react";
import { Navigate, useNavigate } from "react-router";

import LoginVisual from "../../features/auth/components/LoginVisual";
import LoginForm from "../../features/auth/components/LoginForm";
import { useAuth } from "../../features/auth/hooks/useAuth";

import "./LoginPage.css";

// Coordina el formulario de acceso al panel administrativo.
function LoginPage() {
  const navigate = useNavigate();

  const { login, isLoading: isCheckingSession, hasPanelAccess } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Inicia sesión y entra al panel si el usuario pertenece al staff activo.
  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Escribí tu correo y tu contraseña.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      if (error?.message === "UNAUTHORIZED_STAFF") {
        setErrorMessage(
          "Esta cuenta no tiene acceso activo al panel de administración.",
        );
      } else {
        setErrorMessage("Correo o contraseña incorrectos.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="login-page">
        <LoginVisual />

        <LoginForm
          email={email}
          password={password}
          showPassword={showPassword}
          isLoading
          isCheckingSession
          errorMessage=""
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword((value) => !value)}
          onSubmit={handleSubmit}
        />
      </main>
    );
  }

  if (hasPanelAccess) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="login-page">
      <LoginVisual />

      <LoginForm
        email={email}
        password={password}
        showPassword={showPassword}
        isLoading={isLoading}
        isCheckingSession={false}
        errorMessage={errorMessage}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={() => setShowPassword((value) => !value)}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

export default LoginPage;
