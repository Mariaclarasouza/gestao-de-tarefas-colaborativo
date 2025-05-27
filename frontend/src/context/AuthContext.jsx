import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        token,
        userId: localStorage.getItem("userId"),
        email: payload.email,
        role: payload.role,
        entityId: payload.entityId,
      };
    } catch {
      return null;
    }
  });

  function logout() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
