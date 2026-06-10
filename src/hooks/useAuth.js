import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../services/firebase";

/**
 * Хук авторизации.
 * Возвращает: user, loading, error, login, register, logout
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(getFriendlyError(e.code));
    }
  };

  const register = async (email, password) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(getFriendlyError(e.code));
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, loading, error, login, register, logout };
}

function getFriendlyError(code) {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Неверный email или пароль";
    case "auth/email-already-in-use":
      return "Этот email уже используется";
    case "auth/weak-password":
      return "Пароль должен быть не менее 6 символов";
    case "auth/invalid-email":
      return "Неверный формат email";
    default:
      return "Что-то пошло не так. Попробуй ещё раз";
  }
}
