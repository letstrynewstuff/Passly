// src/pages/Register.jsx
import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { register } from "../api/services/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [accountType, setAccountType] = useState("user");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    companyName: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // derived boolean used to enable the submit button and hover animation
  const isFormValid = Object.keys(errors).length === 0;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (accountType === "planner" && !formData.companyName.trim()) {
      newErrors.companyName = "Company / organization name is required";
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

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: accountType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(accountType === "planner" && { companyName: formData.companyName }),
      };

      const response = await register(payload);
      localStorage.setItem("token", response.token);
      alert("Registration successful!");
      navigate("/feed");
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed. Please try again.");
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
              Join EventVibe
            </h1>
            <p className="mt-3 text-gray-400">
              Create your account and start discovering or hosting events.
            </p>
          </div>

          <div className="px-8 pb-4">
            <div className="flex bg-gray-800/50 rounded-full p-1.5">
              <button
                type="button"
                onClick={() => setAccountType("user")}
                className={`flex-1 py-3 text-sm font-medium rounded-full transition-all ${
                  accountType === "user"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Normal User
              </button>
              <button
                type="button"
                onClick={() => setAccountType("planner")}
                className={`flex-1 py-3 text-sm font-medium rounded-full transition-all ${
                  accountType === "planner"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Event Planner / Promoter
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 bg-gray-800/50 border ${
                  errors.username
                    ? "border-red-500"
                    : "border-gray-700 focus:border-purple-500"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1.5 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 bg-gray-800/50 border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-700 focus:border-purple-500"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 bg-gray-800/50 border ${
                    errors.firstName
                      ? "border-red-500"
                      : "border-gray-700 focus:border-purple-500"
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all`}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1.5 text-sm text-red-400">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 bg-gray-800/50 border ${
                    errors.lastName
                      ? "border-red-500"
                      : "border-gray-700 focus:border-purple-500"
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all`}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1.5 text-sm text-red-400">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 bg-gray-800/50 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-700 focus:border-purple-500"
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all pr-11`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <AnimatePresence>
              {accountType === "planner" && (
                <Motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 bg-gray-800/50 border ${
                        errors.companyName
                          ? "border-red-500"
                          : "border-gray-700 focus:border-purple-500"
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all`}
                      placeholder="Your company or brand name"
                    />
                    {errors.companyName && (
                      <p className="mt-1.5 text-sm text-red-400">
                        {errors.companyName}
                      </p>
                    )}
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>

            <Motion.button
              whileHover={{ scale: isFormValid && !isLoading ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3.5 rounded-lg font-medium transition-all mt-6 flex items-center justify-center gap-2 ${
                isFormValid && !isLoading
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-900/30"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Motion.button>

            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </Motion.div>
    </div>
  );
};

export default Register;
