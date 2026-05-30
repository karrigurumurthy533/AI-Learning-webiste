import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";
import { BrainCircuit, Mail, Lock, ArrowRight } from "lucide-react";
import authService from "../../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authService.login(email, password);

      const user = res?.user;
      const token = res?.token;
     console.log(res," res")
      if (!user || !token) {
        throw new Error("Invalid login response from server");
      }

      login(user, token);
      toast.success("Logged in successfully");
      navigate("/dashboard");

    } catch (err) {
      const message ="Failed to login. Please check your credentials";
      setError(message);
      toast.error("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 px-4">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3 text-emerald-400">
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm">
            Sign in to continue your journey
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Email
            </label>

            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center ${
                focusField === "email" ? "text-emerald-400" : "text-slate-400"
              }`}>
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

          {/* PASSWORD */}
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Password
            </label>

            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center ${
                focusField === "password" ? "text-emerald-400" : "text-slate-400"
              }`}>
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

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm p-2 rounded-md">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-5 text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-400 hover:underline">
            Sign up
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          By continuing, you agree to our terms & Privacy Policy
        </p>

      </div>
    </div>
  );
};

export default LoginPage;