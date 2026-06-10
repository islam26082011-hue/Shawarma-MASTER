import { useState } from "react";
import s from "./AuthScreen.module.css";

/**
 * Экран авторизации.
 * Props: login(email, password), register(email, password), error
 */
export default function AuthScreen({ login, register, error }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    if (mode === "login") {
      await login(email.trim(), password);
    } else {
      await register(email.trim(), password);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className={s.screen}>
      <div className={s.card}>
        <div className={s.logo}>🌯</div>
        <h1 className={s.title}>Шаурма-Мастер</h1>
        <p className={s.subtitle}>
          {mode === "login" ? "Войди в свой ларёк" : "Открой свой ларёк"}
        </p>

        <div className={s.fields}>
          <input
            className={s.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
          <input
            className={s.input}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && <p className={s.error}>{error}</p>}

        <button
          className={s.btn}
          onClick={handleSubmit}
          disabled={loading || !email.trim() || !password.trim()}
        >
          {loading
            ? "..."
            : mode === "login"
            ? "Войти"
            : "Зарегистрироваться"}
        </button>

        <button
          className={s.switchBtn}
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login"
            ? "Нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </div>
  );
}
