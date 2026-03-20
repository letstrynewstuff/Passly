

// src/pages/Login.jsx
import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { login as loginApi } from "../api/services/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Passlly wordmark ──────────────────────────────────────────────────────────
const PassllyLogo = () => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-0.5">
      <span style={{
        fontSize: "2.6rem",
        fontWeight: 900,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        pass
      </span>
      <span style={{
        fontSize: "2.6rem",
        fontWeight: 900,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color: "#ffffff",
      }}>
        lly
      </span>
      {/* Dot accent */}
      <span style={{
        width: 8, height: 8,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #a78bfa, #ec4899)",
        display: "inline-block",
        marginLeft: 3,
        marginBottom: 28,
        flexShrink: 0,
      }} />
    </div>
    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>
      Your gateway to every event
    </p>
  </div>
);

const Login = () => {
  const [formData,     setFormData]     = useState({ identifier: "", password: "" });
  const [errors,       setErrors]       = useState({});
  const [isLoading,    setIsLoading]    = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError,   setLoginError]   = useState("");
  const [rememberMe,   setRememberMe]   = useState(true);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = "Username or email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
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
      const response = await loginApi({ identifier: formData.identifier, password: formData.password });
      authLogin({ id: response.id, role: response.role, username: response.username, email: response.email }, response.token);
      if (response.role === "planner") navigate("/planner/profile", { replace: true });
      else navigate("/profile", { replace: true });
    } catch (err) {
      setLoginError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    color: "#ffffff",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  };
  const inputError = { ...inputBase, borderColor: "rgba(244,63,94,0.6)" };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, position: "relative", overflow: "hidden" }}>

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(236,72,153,0.15) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "-5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 420, position: "relative" }}
      >
        {/* Logo */}
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <PassllyLogo />
        </Motion.div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "36px 36px 32px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}>
          {/* Card header */}
          <Motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ marginBottom: 28 }}
          >
            <h2 style={{ color: "#ffffff", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
              Welcome back
            </h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", margin: "6px 0 0" }}>
              Sign in to your Passlly account
            </p>
          </Motion.div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Identifier */}
            <Motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
                Username or Email
              </label>
              <input
                type="text" name="identifier"
                value={formData.identifier} onChange={handleChange}
                placeholder="Enter your username or email"
                style={errors.identifier ? inputError : inputBase}
                onFocus={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.identifier ? "rgba(244,63,94,0.6)" : "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
              />
              {errors.identifier && <p style={{ color: "#f87171", fontSize: "0.78rem", margin: "6px 0 0" }}>{errors.identifier}</p>}
            </Motion.div>

            {/* Password */}
            <Motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  style={{ ...(errors.password ? inputError : inputBase), paddingRight: 48 }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.password ? "rgba(244,63,94,0.6)" : "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p style={{ color: "#f87171", fontSize: "0.78rem", margin: "6px 0 0" }}>{errors.password}</p>}
            </Motion.div>

            {/* Remember me */}
            <Motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <div
                onClick={() => setRememberMe(!rememberMe)}
                style={{
                  width: 18, height: 18, borderRadius: 6, cursor: "pointer", flexShrink: 0,
                  background: rememberMe ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "transparent",
                  border: rememberMe ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                }}
              >
                {rememberMe && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.83rem", cursor: "pointer", userSelect: "none" }}
                onClick={() => setRememberMe(!rememberMe)}
              >
                Remember me
              </span>
            </Motion.div>

            {/* Error */}
            {loginError && (
              <Motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)", color: "#fca5a5", fontSize: "0.83rem" }}
              >
                {loginError}
              </Motion.div>
            )}

            {/* Submit */}
            <Motion.button
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              whileHover={{ scale: !isLoading ? 1.015 : 1 }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={isLoading}
              style={{
                width: "100%", padding: "15px 24px", borderRadius: 14, border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                background: isLoading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                color: isLoading ? "rgba(255,255,255,0.3)" : "#ffffff",
                fontSize: "0.95rem", fontWeight: 700, letterSpacing: "-0.01em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: isLoading ? "none" : "0 8px 32px rgba(124,58,237,0.4)",
                transition: "all 0.2s", marginTop: 4,
                fontFamily: "inherit",
              }}
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in…</>
              ) : (
                <><span>Sign In</span><ArrowRight size={18} /></>
              )}
            </Motion.button>
          </form>

          {/* Footer link */}
          <Motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.83rem", marginTop: 24, margin: "24px 0 0" }}
          >
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => e.target.style.color = "#c4b5fd"}
              onMouseLeave={(e) => e.target.style.color = "#a78bfa"}
            >
              Create one
            </a>
          </Motion.p>
        </div>

        {/* Bottom badge */}
        <Motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ textAlign: "center", marginTop: 20 }}
        >
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
            SECURED BY PASSLLY · END-TO-END ENCRYPTED
          </span>
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default Login;