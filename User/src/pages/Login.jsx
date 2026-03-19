// // src/pages/Login.jsx

import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login as loginApi } from "../api/services/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Username or email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError("");

    try {
      const response = await loginApi({
        identifier: formData.identifier,
        password: formData.password,
      });

      // Save auth
      authLogin(
        {
          id: response.id,
          role: response.role,
          username: response.username,
          email: response.email,
        },
        response.token,
      );

      // ✅ Role-based redirect (automatic)
      if (response.role === "planner") {
        navigate("/planner/profile", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      setLoginError(
        err.message || "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-black flex items-center justify-center p-4">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mt-3 text-gray-400">Log in to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
            {/* Identifier */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 bg-gray-800/50 border ${
                  errors.identifier
                    ? "border-red-500"
                    : "border-gray-700 focus:border-purple-500"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all`}
                placeholder="Enter your username or email"
              />
              {errors.identifier && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 bg-gray-800/50 border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-700 focus:border-purple-500"
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all pr-11`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
              <label className="text-sm text-gray-300">Remember me</label>
            </div>

            {/* Error */}
            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}

            {/* Submit */}
            <Motion.button
              whileHover={{ scale: !isLoading ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg font-medium transition-all mt-6 flex items-center justify-center gap-2 ${
                !isLoading
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-900/30"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Motion.button>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </Motion.div>
    </div>
  );
};

export default Login;
