import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validation.js";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState({ name: "", email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ name: "", email: "", password: "" });
    setServerError("");
    setSuccess("");

    const newError = { name: "", email: "", password: "" };
    let hasError = false;

    if (!name) {
      newError.name = "Name is required";
      hasError = true;
    } else if (!validateName(name)) {
      newError.name = "Invalid Name";
      hasError = true;
    }

    if (!email) {
      newError.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(email)) {
      newError.email = "Invalid Email";
      hasError = true;
    }

    if (!password) {
      newError.password = "Password is required";
      hasError = true;
    } else if (!validatePassword(password)) {
      newError.password = "Enter a Strong Password";
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    setLoading(true);

    try {
      const result = await register(name, email, password);
      if (result.success) {
        setSuccess("Registered successfully! Please login to continue.");
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setServerError(result.message);
      }
    } catch (err) {
      setServerError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f24] to-[#1a2b5a] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/20"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Create Account
        </h2>

        <div className="space-y-4">
          <label htmlFor="name" className="text-white font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error.name && (
            <p className="text-red-400 text-sm mt-1">{error.name}</p>
          )}

          <label htmlFor="email" className="text-white font-medium">
            Email Address
          </label>
          <input
            id="email"
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error.email && (
            <p className="text-red-400 text-sm mt-1">{error.email}</p>
          )}

          <div className="w-full">
            <label htmlFor="password" className="text-white font-medium">
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 text-2xl"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="h-5 mt-1">
              {error.password && (
                <p className="text-red-400 text-sm">{error.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {serverError && (
            <p className="text-red-400 text-center mt-2">{serverError}</p>
          )}
          {success && (
            <p className="text-green-400 text-center mt-2">{success}</p>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
