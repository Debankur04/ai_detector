"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");
    if (token && userId) {
      setUser({ userId, token });
    }
    setLoading(false);
  }, []);

  const signin = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Sign in failed");
    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_id", data.user_id);
    setUser({ userId: data.user_id, token: data.access_token });
    return data;
  };

  const signup = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Sign up failed");
    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_id", data.user_id);
    setUser({ userId: data.user_id, token: data.access_token });
    return data;
  };

  const signout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signup, signout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
