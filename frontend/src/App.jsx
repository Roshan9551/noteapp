import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore.js";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<div>Signup Page</div>} />
      <Route
        path="/"
        element={
          isAuthenticated ? <div>Home Page</div> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;
// BrowserRouter => wraps your entire app and enables routing
// Routes and Route — defines which component shows at which URL
// Navigate to="/login" — if user is not logged in and tries to go to / it automatically redirects them to login
