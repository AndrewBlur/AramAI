import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import ErrorMessage from "@/components/ErrorMessage";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { isLoggingIn , login} = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    
    try {
      
      const response = await login(formData);
      if(response.ok) navigate("/chat", {replace: true});
      else{
        setErrors({general: "Login failed. Please check your credentials." })
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please check your credentials." });
    } finally {
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--clr-bg-main)] px-6">
      <div className="w-full max-w-md rounded-[var(--corner-lg)] bg-[var(--clr-card-bg)] p-8 sm:p-10 shadow-[var(--shadow-md)]">
        {/* Heading */}
        <h1
          className="mb-6 text-center text-3xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="text-gradient-onboarding-light dark:text-gradient-onboarding-dark">
            Welcome Back
          </span>
        </h1>


        {/* Username input */}
        <input
          type="text"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          onKeyDown={handleKeyDown}
          className="mb-2 w-full rounded-[var(--corner-md)] border border-[var(--clr-border)] bg-[var(--clr-bg-alt)] px-4 py-3 text-[var(--clr-text-main)] placeholder-[var(--clr-text-subtle)] focus:border-[var(--clr-primary-main)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
        />
        {errors.username && (
          <ErrorMessage message={errors.username} />
        )}

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onKeyDown={handleKeyDown}
          className="mb-2 w-full rounded-[var(--corner-md)] border border-[var(--clr-border)] bg-[var(--clr-bg-alt)] px-4 py-3 text-[var(--clr-text-main)] placeholder-[var(--clr-text-subtle)] focus:border-[var(--clr-primary-main)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
        />
        {errors.password && (
          <ErrorMessage message={errors.password} />
        )}
        {/* General error */}
        {errors.general && (
          <ErrorMessage message={errors.general} />
        )}

        {/* Login button */}
        <button
          onClick={handleSubmit}
          disabled={isLoggingIn}
          className="mb-4 w-full rounded-[var(--corner-md)] bg-[var(--clr-primary-main)] px-4 py-3 font-medium text-[var(--clr-text-inverse)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--clr-primary-accent)] disabled:opacity-60"
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>

        {/* Signup link */}
        <p
          className="mt-4 text-center text-sm text-[var(--clr-text-subtle)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-medium text-[var(--clr-emerald-main)] hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;