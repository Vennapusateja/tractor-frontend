
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Phone, Lock } from "lucide-react";
import { motion } from "framer-motion";

/* Logo Component */
function Logo() {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-white text-green-700 flex items-center justify-center font-bold text-lg shadow">
        VT
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-wide">VMMR Tractors</h2>
        <p className="text-xs text-green-100">Smart Farming Platform</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ phone, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch {
      setError("Wrong phone or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-700 via-emerald-600 to-green-500 text-white font-body">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <Logo />

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Phone */}
          <div>
            <label className="text-sm text-green-100">Phone</label>
            <div className="flex items-center gap-2 mt-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus-within:ring-2 focus-within:ring-white">
              <Phone size={18} />
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-transparent outline-none w-full placeholder-white/60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-green-100">Password</label>
            <div className="flex items-center gap-2 mt-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus-within:ring-2 focus-within:ring-white">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent outline-none w-full placeholder-white/60"
              />
            </div>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-lg bg-white text-green-700 hover:scale-[1.02] transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-green-100 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="font-semibold underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
