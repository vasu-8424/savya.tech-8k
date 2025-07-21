'use client'
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "../../hooks/use-toast";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="bg-gray-900/80 rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-teal-400">Login</h2>
        <form
          className="w-full flex flex-col gap-4 mb-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            if (!email || !password) {
              setError('All fields are required.');
              toast({
                title: 'Login failed',
                description: 'All fields are required.',
              });
              setLoading(false);
              return;
            }
            // Fetch user from users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('password')
              .eq('email', email)
              .single();
            if (userError || !userData) {
              setError('User not found.');
              toast({
                title: 'Login failed',
                description: 'User not found.',
              });
              setLoading(false);
              return;
            }
            const isValid = await bcrypt.compare(password, userData.password);
            if (!isValid) {
              setError('Invalid password.');
              toast({
                title: 'Login failed',
                description: 'Invalid password.',
              });
              setLoading(false);
              return;
            }
            
            // Password is valid, proceed with login success
            setError(null);
            toast({
              title: 'Login successful',
              description: 'Welcome back! Redirecting to your dashboard...'
            });
            
            // Store user session/authentication state if needed
            // You can store user data in localStorage or context here
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Debug logging
            console.log('Login successful, localStorage set:', {
              userEmail: localStorage.getItem('userEmail'),
              isLoggedIn: localStorage.getItem('isLoggedIn')
            });
            
            // Immediate redirect to dashboard
            window.location.href = '/dashboard';
            setLoading(false);
          }}
        >
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
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 transition-all"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="launch-btn-home pointer-events-auto font-bold text-lg mt-2"
            style={{ minWidth: 180, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', padding: '0.7rem 2.2rem', borderRadius: 14 }}
          >
            {loading ? "Loading..." : "Login"}
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
            aria-label="Login with GitHub"
          >
            {/* GitHub SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14e0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .26.18.57.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, rotate: -10 }}
            className="bg-gray-800 p-3 rounded-full shadow hover:bg-gray-700 transition-all border border-gray-700"
            aria-label="Login with Google"
          >
            {/* Google SVG */}
            <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#14e0ff" d="M43.6 20.5H42V20.4H24v7.2h11.2c-1.6 4.2-5.6 7.2-10.2 7.2-6 0-10.8-4.9-10.8-10.8s4.9-10.8 10.8-10.8c2.4 0 4.6.8 6.4 2.2l5.4-5.4C33.2 7.1 28.8 5.2 24 5.2c-10.4 0-18.8 8.4-18.8 18.8s8.4 18.8 18.8 18.8c9.4 0 17.6-6.8 18.7-15.6.1-.5.1-1 .1-1.5 0-1.2-.1-2.1-.2-3.2z"/><path fill="#fff" d="M6.3 14.7l5.9 4.3C14 16.2 18.6 13 24 13c2.4 0 4.6.8 6.4 2.2l5.4-5.4C33.2 7.1 28.8 5.2 24 5.2c-7.7 0-14.2 4.3-17.7 10.5z"/><path fill="#fff" d="M24 44c4.3 0 8.3-1.4 11.4-3.8l-5.3-4.3c-1.6 1.1-3.7 1.8-6.1 1.8-4.6 0-8.6-3-10.1-7.2l-5.9 4.6C9.7 40.1 16.3 44 24 44z"/><path fill="#fff" d="M43.6 20.5H42V20.4H24v7.2h11.2c-.7 2-2.1 3.7-3.9 4.9l6 4.6c1.7-1.6 3-3.9 3.3-6.5.1-.5.1-1 .1-1.5 0-1.2-.1-2.1-.2-3.2z"/></g></svg>
          </motion.button>
        </motion.div>
        <div className="text-gray-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-teal-400 hover:underline font-bold">Sign up</Link>
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