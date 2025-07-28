"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      if (existingUser) {
        setError("A user with this email already exists.");
        setLoading(false);
        return;
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert user
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ email, username, password: hashedPassword }]);
      if (insertError) {
        if (insertError.code === '23505' || insertError.code === '409' || insertError.message?.includes('already exists')) {
          setError("A user with this email already exists.");
        } else {
          setError("Signup failed. Please try again.");
        }
        setLoading(false);
        return;
      }
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="bg-gray-900/80 rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-teal-400">Sign Up</h2>
        <form className="w-full flex flex-col gap-4 mb-4" onSubmit={handleSubmit}>
          <motion.input
            whileFocus={{ scale: 1.04, boxShadow: "0 0 0 2px #14b8a6" }}
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 transition-all"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.04, boxShadow: "0 0 0 2px #14b8a6" }}
            type="text"
            placeholder="Username"
            className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 transition-all"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.04, boxShadow: "0 0 0 2px #14b8a6" }}
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 transition-all"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.04, boxShadow: "0 0 0 2px #14b8a6" }}
            type="password"
            placeholder="Confirm Password"
            className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 transition-all"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-400 text-sm mb-2">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="launch-btn-home pointer-events-auto font-bold text-lg mt-2"
            style={{ minWidth: 180, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', padding: '0.7rem 2.2rem', borderRadius: 14 }}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex gap-6 mb-4"
        >
          <motion.button
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="bg-gray-800 p-3 rounded-full shadow hover:bg-gray-700 transition-all border border-gray-700"
            aria-label="Sign up with GitHub"
            onClick={async () => {
              setLoading(true);
              const { error } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: '/dashboard' } });
              setLoading(false);
              if (error) setError(error.message);
            }}
          >
            <FaGithub size={28} className="text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, rotate: -10 }}
            className="bg-gray-800 p-3 rounded-full shadow hover:bg-gray-700 transition-all border border-gray-700"
            aria-label="Sign up with Google"
            onClick={async () => {
              setLoading(true);
              const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/dashboard' } });
              setLoading(false);
              if (error) setError(error.message);
            }}
          >
            <FaGoogle size={28} className="text-white" />
          </motion.button>
        </motion.div>
        <div className="text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-400 hover:underline font-bold">Login</Link>
        </div>
      </motion.div>
      <style jsx global>{`
        .launch-btn-home {
          background: rgba(31, 41, 55, 0.15);
          color: #b6bcc6;
          border: 1px solid rgba(75, 85, 99, 0.18);
          font-family: inherit;
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          box-shadow: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }
        .launch-btn-home:after {
          content: '';
          position: absolute;
          left: -40%;
          top: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          transform: skewX(-20deg);
          transition: left 0.4s cubic-bezier(.4,2,.6,1);
          pointer-events: none;
          opacity: 0;
        }
        .launch-btn-home:hover:after, .launch-btn-home:focus:after {
          left: 60%;
          opacity: 1;
        }
        .launch-btn-home:hover, .launch-btn-home:focus {
          background: rgba(20, 184, 166, 0.08);
          color: #14b8a6;
          border-color: rgba(20, 184, 166, 0.15);
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.08);
          transform: translateY(-1px);
          outline: none;
        }
      `}</style>
    </div>
  );
} 