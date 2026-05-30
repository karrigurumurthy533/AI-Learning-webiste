import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, Mail, Lock, User, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import authService from "../../services/authService";

const RegisterPage = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      await authService.register(userName, email, password);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      const message = err?.message || "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 px-4">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3 text-emerald-400">
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 text-sm">Start your journey with us</p>
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">User name</label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center ${focusField === 'userName' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <User size={18} />
              </div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onFocus={() => setFocusField("userName")}
                onBlur={() => setFocusField(null)}
                placeholder="John Doe"
                className="w-full pl-10 pr-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center ${focusField === 'email' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusField("email")}
                onBlur={() => setFocusField(null)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center ${focusField === 'password' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusField("password")}
                onBlur={() => setFocusField(null)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">Confirm Password</label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center ${focusField === 'confirm' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusField("confirm")}
                onBlur={() => setFocusField(null)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm p-2 rounded-md">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Creating..." : <>Sign Up <ArrowRight size={16} /></>}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Sign in
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          By creating an account, you agree to our terms & Privacy Policy
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;