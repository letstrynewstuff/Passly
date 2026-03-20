// src/pages/Register.jsx
import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  User,
  Briefcase,
} from "lucide-react";
import { register } from "../api/services/authApi";
import { useNavigate } from "react-router-dom";

// ─── Passlly wordmark ──────────────────────────────────────────────────────────
const PassllyLogo = () => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-0.5">
      <span
        style={{
          fontSize: "2.6rem",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        pass
      </span>
      <span
        style={{
          fontSize: "2.6rem",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "#ffffff",
        }}
      >
        ly
      </span>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #a78bfa, #ec4899)",
          display: "inline-block",
          marginLeft: 3,
          marginBottom: 28,
          flexShrink: 0,
        }}
      />
    </div>
    <p
      style={{
        color: "rgba(255,255,255,0.35)",
        fontSize: "0.7rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontWeight: 500,
      }}
    >
      Your gateway to every event
    </p>
  </div>
);

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
    if (accountType === "planner" && !formData.companyName.trim())
      newErrors.companyName = "Company / organization name is required";
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

  const inputBase = {
    width: "100%",
    padding: "13px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    color: "#ffffff",
    fontSize: "0.88rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };
  const inputError = { ...inputBase, borderColor: "rgba(244,63,94,0.6)" };
  const onFocus = (e) => {
    e.target.style.borderColor = "rgba(167,139,250,0.5)";
    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
  };
  const onBlur = (err) => (e) => {
    e.target.style.borderColor = err
      ? "rgba(244,63,94,0.6)"
      : "rgba(255,255,255,0.08)";
    e.target.style.boxShadow = "none";
  };

  const labelStyle = {
    display: "block",
    color: "rgba(255,255,255,0.45)",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 7,
  };
  const errStyle = { color: "#f87171", fontSize: "0.76rem", margin: "5px 0 0" };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080810",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(124,58,237,0.22) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(236,72,153,0.14) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 460, position: "relative" }}
      >
        {/* Logo */}
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: "center", marginBottom: 28 }}
        >
          <PassllyLogo />
        </Motion.div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "32px 32px 28px",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
          }}
        >
          {/* Card header */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ marginBottom: 24 }}
          >
            <h2
              style={{
                color: "#ffffff",
                fontSize: "1.3rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Create your account
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.83rem",
                margin: "5px 0 0",
              }}
            >
              Join Passlly and start experiencing events
            </p>
          </Motion.div>

          {/* Account type toggle */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              padding: 5,
              borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {[
              { id: "user", label: "Attendee", icon: User },
              { id: "planner", label: "Event Planner", icon: Briefcase },
            ].map(({ id, label, icon }) => {
              const IconComponent = icon;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAccountType(id)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    background:
                      accountType === id
                        ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                        : "transparent",
                    color:
                      accountType === id ? "#ffffff" : "rgba(255,255,255,0.35)",
                    fontSize: "0.83rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                    boxShadow:
                      accountType === id
                        ? "0 4px 16px rgba(124,58,237,0.35)"
                        : "none",
                  }}
                >
                  <IconComponent size={15} />
                  {label}
                </button>
              );
            })}
          </Motion.div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Username */}
            <Motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                style={errors.username ? inputError : inputBase}
                onFocus={onFocus}
                onBlur={onBlur(errors.username)}
              />
              {errors.username && <p style={errStyle}>{errors.username}</p>}
            </Motion.div>

            {/* Email */}
            <Motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 }}
            >
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                style={errors.email ? inputError : inputBase}
                onFocus={onFocus}
                onBlur={onBlur(errors.email)}
              />
              {errors.email && <p style={errStyle}>{errors.email}</p>}
            </Motion.div>

            {/* First + Last name */}
            <Motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.31 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First"
                  style={errors.firstName ? inputError : inputBase}
                  onFocus={onFocus}
                  onBlur={onBlur(errors.firstName)}
                />
                {errors.firstName && <p style={errStyle}>{errors.firstName}</p>}
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last"
                  style={errors.lastName ? inputError : inputBase}
                  onFocus={onFocus}
                  onBlur={onBlur(errors.lastName)}
                />
                {errors.lastName && <p style={errStyle}>{errors.lastName}</p>}
              </div>
            </Motion.div>

            {/* Password */}
            <Motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.34 }}
            >
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    ...(errors.password ? inputError : inputBase),
                    paddingRight: 48,
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p style={errStyle}>{errors.password}</p>}
            </Motion.div>

            {/* Confirm password */}
            <Motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.37 }}
            >
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    ...(errors.confirmPassword ? inputError : inputBase),
                    paddingRight: 48,
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur(errors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={errStyle}>{errors.confirmPassword}</p>
              )}
            </Motion.div>

            {/* Company name (planner only) */}
            <AnimatePresence>
              {accountType === "planner" && (
                <Motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <label style={labelStyle}>Company / Organization</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your company or brand name"
                    style={errors.companyName ? inputError : inputBase}
                    onFocus={onFocus}
                    onBlur={onBlur(errors.companyName)}
                  />
                  {errors.companyName && (
                    <p style={errStyle}>{errors.companyName}</p>
                  )}
                </Motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <Motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              whileHover={{ scale: isFormValid && !isLoading ? 1.015 : 1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!isFormValid || isLoading}
              style={{
                width: "100%",
                padding: "15px 24px",
                borderRadius: 14,
                border: "none",
                cursor: !isFormValid || isLoading ? "not-allowed" : "pointer",
                background:
                  !isFormValid || isLoading
                    ? "rgba(255,255,255,0.06)"
                    : "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                color:
                  !isFormValid || isLoading
                    ? "rgba(255,255,255,0.25)"
                    : "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow:
                  !isFormValid || isLoading
                    ? "none"
                    : "0 8px 32px rgba(124,58,237,0.4)",
                transition: "all 0.2s",
                marginTop: 4,
                fontFamily: "inherit",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Creating
                  account…
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </Motion.button>
          </form>

          {/* Footer link */}
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.83rem",
              marginTop: 22,
            }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: "#a78bfa",
                fontWeight: 600,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#c4b5fd")}
              onMouseLeave={(e) => (e.target.style.color = "#a78bfa")}
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Bottom badge */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ textAlign: "center", marginTop: 20 }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.15)",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
            }}
          >
            SECURED BY PASSLY · END-TO-END ENCRYPTED
          </span>
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default Register;
