import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import RegisterForm from "./pages/Register.jsx";
import LoginForm from "./pages/Login.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<LoginForm />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;