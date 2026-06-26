"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";

const AuthContext = createContext({
  expressToken: null,
  expressUser: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  const [expressToken, setExpressToken] = useState(null);
  const [expressUser, setExpressUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to restore token from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("express_token");
    if (stored) {
      setExpressToken(stored);
      // Verify token is still valid
      fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then((r) => {
          if (r.ok) return r.json();
          localStorage.removeItem("express_token");
          setExpressToken(null);
          return null;
        })
        .then((user) => {
          if (user) setExpressUser(user);
        })
        .catch(() => {
          localStorage.removeItem("express_token");
          setExpressToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // When Better Auth session changes, also login to Express if needed
  useEffect(() => {
    if (isPending) return;
    if (session?.user && !expressToken) {
      // Auto-login to Express using Better Auth's user data
      // This is a fallback - ideally the user should sign in via the Express endpoint
      const email = session.user.email;
      const name = session.user.name;
      
      // Check if we have a stored token already
      const stored = localStorage.getItem("express_token");
      if (stored) {
        setExpressToken(stored);
        return;
      }

      // Try to register/login with Express using stored credentials
      // For now, we'll just use the Better Auth user data directly
      // The Express server's GET /auth/me endpoint can verify the JWT
    }
  }, [session, isPending, expressToken]);

  const login = useCallback(async (email, password) => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("express_token", data.token);
      setExpressToken(data.token);
      setExpressUser(data.user);
      return data;
    }
    throw new Error(data.message || "Login failed");
  }, []);

  const register = useCallback(async (name, email, password, photoURL) => {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, photoURL }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("express_token", data.token);
      setExpressToken(data.token);
      setExpressUser(data.user);
      return data;
    }
    throw new Error(data.message || "Registration failed");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("express_token");
    setExpressToken(null);
    setExpressUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ expressToken, expressUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useExpressAuth() {
  return useContext(AuthContext);
}
