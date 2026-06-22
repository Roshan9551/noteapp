import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/useAuthStore";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import axiosInstance from "./lib/axios";

function App() {
  const { isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        login(res.data.user, localStorage.getItem("token"));
      } catch (err) {
        logout();
      }
    };

    if (localStorage.getItem("token")) {
      fetchUser();
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;