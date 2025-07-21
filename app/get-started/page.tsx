"use client"
import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "../../hooks/use-toast";
import bcrypt from "bcryptjs";

const MainScene = dynamic(() => import("../../components/main-scene"), { ssr: false });

// Neon lightning SVG icon
const LightningIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14e0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// Add RocketIcon SVG
const RocketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
    <path d="M4.5 16.5L9 15l6-6 3-3a2.12 2.12 0 0 0-3-3l-3 3-6 6-1.5 4.5z"/>
    <path d="M15 9l6 6"/>
    <circle cx="9" cy="15" r="1" fill="#14b8a6"/>
  </svg>
);

export default function GetStartedPage() {
  const [form, setForm] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#10141a]">
      {/* Neon back arrow at top left, now redirects to home */}
      <button
        className="absolute top-6 left-6 neon-arrow-btn z-20"
        aria-label="Home"
        onClick={() => router.push('/')} 
        type="button"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14e0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      {/* Globe background */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full">
          <MainScene />
        </div>
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <h1 className="text-3xl md:text-5xl font-extralight text-[#14e0ff] mb-6 drop-shadow-lg tracking-wide">Get Started</h1>
      <p className="text-base text-[#14e0ff]/70 mb-8 max-w-xl text-center font-light">
        Welcome to Savya Technologies! Here you can begin your journey with us.
      </p>
      <div className="flex gap-4 mb-6">
        <button
          className={`launch-btn-home ${form === 'login' ? 'active' : ''}`}
          style={{ minWidth: 180, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', padding: '0.7rem 2.2rem', borderRadius: 14 }}
          onClick={() => setForm('login')}
          type="button"
        >
          <RocketIcon /> LOGIN
        </button>
        <button
          className={`launch-btn-home ${form === 'signup' ? 'active' : ''}`}
          style={{ minWidth: 180, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', padding: '0.7rem 2.2rem', borderRadius: 14 }}
          onClick={() => setForm('signup')}
          type="button"
        >
          <RocketIcon /> SIGN UP
        </button>
      </div>
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {form === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-transparent rounded-2xl shadow-2xl p-6 flex flex-col items-center border border-[#14e0ff]/20"
            >
              <h2 className="text-2xl font-light mb-4 text-[#14e0ff] tracking-wide">Login</h2>
              <form
                className="w-full flex flex-col gap-3 mb-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setLoading(true);
                  if (!email || !password) {
                    setError('All fields are required.');
                    setLoading(false);
                    return;
                  }
                  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
                  if (loginError) {
                    setError(loginError.message);
                  } else {
                    setError(null);
                    router.push('/dashboard');
                  }
                  setLoading(false);
                }}
              >
                <motion.input
                  whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #14e0ff, 0 0 2px #14e0ff" }}
                  type="email"
                  placeholder="Email"
                  className="neon-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <motion.input
                  whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #14e0ff, 0 0 2px #14e0ff" }}
                  type="password"
                  placeholder="Password"
                  className="neon-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 16px #14e0ff, 0 0 2px #14e0ff" }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="neon-btn w-full mt-1"
                >
                  <LightningIcon /> {loading ? 'Loading...' : 'EXECUTE'}
                </motion.button>
              </form>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex gap-4 mb-2"
              >
                <button className="neon-btn-icon" aria-label="Login with GitHub">
                  {/* GitHub SVG */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14e0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .26.18.57.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>
                </button>
                <button className="neon-btn-icon" aria-label="Login with Google">
                  {/* Google SVG */}
                  <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#14e0ff" d="M43.6 20.5H42V20.4H24v7.2h11.2c-1.6 4.2-5.6 7.2-10.2 7.2-6 0-10.8-4.9-10.8-10.8s4.9-10.8 10.8-10.8c2.4 0 4.6.8 6.4 2.2l5.4-5.4C33.2 7.1 28.8 5.2 24 5.2c-10.4 0-18.8 8.4-18.8 18.8s8.4 18.8 18.8 18.8c9.4 0 17.6-6.8 18.7-15.6.1-.5.1-1 .1-1.5 0-1.2-.1-2.1-.2-3.2z"/><path fill="#fff" d="M6.3 14.7l5.9 4.3C14 16.2 18.6 13 24 13c2.4 0 4.6.8 6.4 2.2l5.4-5.4C33.2 7.1 28.8 5.2 24 5.2c-7.7 0-14.2 4.3-17.7 10.5z"/><path fill="#fff" d="M24 44c4.3 0 8.3-1.4 11.4-3.8l-5.3-4.3c-1.6 1.1-3.7 1.8-6.1 1.8-4.6 0-8.6-3-10.1-7.2l-5.9 4.6C9.7 40.1 16.3 44 24 44z"/><path fill="#fff" d="M43.6 20.5H42V20.4H24v7.2h11.2c-.7 2-2.1 3.7-3.9 4.9l6 4.6c1.7-1.6 3-3.9 3.3-6.5.1-.5.1-1 .1-1.5 0-1.2-.1-2.1-.2-3.2z"/></g></svg>
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-transparent rounded-2xl shadow-2xl p-6 flex flex-col items-center border border-[#14e0ff]/20"
            >
              <h2 className="text-2xl font-light mb-4 text-[#14e0ff] tracking-wide">Sign Up</h2>
              <form
                className="w-full flex flex-col gap-3 mb-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setLoading(true);
                  if (!email || !password || !confirmPassword) {
                    setError('All fields are required.');
                    setLoading(false);
                    return;
                  }
                  if (password !== confirmPassword) {
                    setError('Passwords do not match.');
                    setLoading(false);
                    return;
                  }
                  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
                  if (signUpError) {
                    setError(signUpError.message);
                  } else {
                    // Hash password and store in users table
                    try {
                      const hashedPassword = await bcrypt.hash(password, 10);
                      const { error: dbError } = await supabase
                        .from('users')
                        .insert([{ email, password: hashedPassword }]);
                      if (dbError) {
                        setError('Signup succeeded but failed to save user details.');
                      } else {
                        setError(null);
                        toast({
                          title: 'Verify your email',
                          description: 'A verification link has been sent to your email. Please verify before logging in.',
                        });
                        setTimeout(() => {
                          setForm('login');
                        }, 2500);
                      }
                    } catch (err) {
                      setError('Signup succeeded but failed to hash password.');
                    }
                  }
                  setLoading(false);
                }}
              >
                <motion.input
                  whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #14e0ff, 0 0 2px #14e0ff" }}
                  type="email"
                  placeholder="Email"
                  className="neon-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <motion.input
                  whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #14e0ff, 0 0 2px #14e0ff" }}
                  type="password"
                  placeholder="Password"
                  className="neon-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <motion.input
                  whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #14e0ff, 0 0 2px #14e0ff" }}
                  type="password"
                  placeholder="Confirm Password"
                  className="neon-input"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 16px #14e0ff, 0 0 2px #14e0ff" }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="neon-btn w-full mt-1"
                >
                  <LightningIcon /> {loading ? 'Loading...' : 'EXECUTE'}
                </motion.button>
              </form>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex gap-4 mb-2"
              >
                <button className="neon-btn-icon" aria-label="Sign up with GitHub">
                  {/* GitHub SVG */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14e0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .26.18.57.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>
                </button>
                <button className="neon-btn-icon" aria-label="Sign up with Google">
                  {/* Google SVG */}
                  <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#14e0ff" d="M43.6 20.5H42V20.4H24v7.2h11.2c-1.6 4.2-5.6 7.2-10.2 7.2-6 0-10.8-4.9-10.8-10.8s4.9-10.8 10.8-10.8c2.4 0 4.6.8 6.4 2.2l5.4-5.4C33.2 7.1 28.8 5.2 24 5.2c-10.4 0-18.8 8.4-18.8 18.8s8.4 18.8 18.8 18.8c9.4 0 17.6-6.8 18.7-15.6.1-.5.1-1 .1-1.5 0-1.2-.1-2.1-.2-3.2z"/><path fill="#fff" d="M6.3 14.7l5.9 4.3C14 16.2 18.6 13 24 13c2.4 0 4.6.8 6.4 2.2l5.4-5.4C33.2 7.1 28.8 5.2 24 5.2c-7.7 0-14.2 4.3-17.7 10.5z"/><path fill="#fff" d="M24 44c4.3 0 8.3-1.4 11.4-3.8l-5.3-4.3c-1.6 1.1-3.7 1.8-6.1 1.8-4.6 0-8.6-3-10.1-7.2l-5.9 4.6C9.7 40.1 16.3 44 24 44z"/><path fill="#fff" d="M43.6 20.5H42V20.4H24v7.2h11.2c-.7 2-2.1 3.7-3.9 4.9l6 4.6c1.7-1.6 3-3.9 3.3-6.5.1-.5.1-1 .1-1.5 0-1.2-.1-2.1-.2-3.2z"/></g></svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style jsx global>{`
        .neon-btn {
          background: #10141a;
          color: #14e0ff;
          border: 2px solid #14e0ff;
          border-radius: 12px;
          font-family: inherit;
          font-size: 1.18rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          transition: box-shadow 0.2s, border-color 0.2s, color 0.2s;
          box-shadow: 0 0 0 0 #14e0ff00;
          min-width: 180px;
          min-height: 54px;
          padding: 0.7rem 2.2rem;
        }
        .neon-btn:hover, .neon-btn:focus, .neon-btn-active {
          box-shadow: 0 0 18px 3px #14e0ff, 0 0 2px #14e0ff;
          border-color: #14e0ff;
          color: #14e0ff;
        }
        .neon-btn:active {
          box-shadow: 0 0 6px 2px #14e0ff;
        }
        .neon-btn-icon {
          background: #10141a;
          border: 2px solid #14e0ff;
          border-radius: 50%;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.2s, border-color 0.2s;
          color: #14e0ff;
          min-width: 48px;
          min-height: 48px;
        }
        .neon-btn-icon:hover, .neon-btn-icon:focus {
          box-shadow: 0 0 14px 3px #14e0ff, 0 0 2px #14e0ff;
          border-color: #14e0ff;
        }
        .neon-input {
          background: #10141a;
          color: #14e0ff;
          border: 2px solid #14e0ff;
          border-radius: 10px;
          font-size: 1.15rem;
          font-family: inherit;
          font-weight: 400;
          letter-spacing: 0.04em;
          padding: 1rem 1.2rem;
          outline: none;
          box-shadow: 0 0 0 0 #14e0ff00;
          transition: box-shadow 0.2s, border-color 0.2s, color 0.2s;
        }
        .neon-input:focus {
          box-shadow: 0 0 14px 3px #14e0ff, 0 0 2px #14e0ff;
          border-color: #14e0ff;
          color: #14e0ff;
        }
        ::placeholder {
          color: #14e0ff99;
          opacity: 1;
        }
        .neon-arrow-btn {
          background: transparent;
          border: none;
          padding: 0.2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.2s;
          box-shadow: 0 0 0 0 #14e0ff00;
        }
        .neon-arrow-btn:hover, .neon-arrow-btn:focus {
          box-shadow: 0 0 10px 2px #14e0ff, 0 0 2px #14e0ff;
          outline: none;
        }
        .launch-btn {
          background: linear-gradient(90deg, #7c1d1d 0%, #b94a1f 50%, #fbbf24 100%);
          color: #fbbf24;
          border: none;
          border-radius: 14px;
          font-family: inherit;
          font-size: 1.18rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          min-width: 180px;
          min-height: 54px;
          padding: 0.7rem 2.2rem;
          box-shadow: 0 2px 12px 0 #b94a1f33;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.2s, filter 0.2s;
        }
        .launch-btn:after {
          content: '';
          position: absolute;
          left: -40%;
          top: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%);
          transform: skewX(-20deg);
          transition: left 0.4s cubic-bezier(.4,2,.6,1);
          pointer-events: none;
        }
        .launch-btn:hover:after, .launch-btn:focus:after, .launch-btn-active:after {
          left: 60%;
        }
        .launch-btn:hover, .launch-btn:focus, .launch-btn-active {
          filter: brightness(1.08) drop-shadow(0 0 8px #fbbf24cc);
          outline: none;
        }
        .blue-launch-btn {
          background: transparent;
          color: #14b8a6;
          border: 2px solid #14b8a6;
          border-radius: 18px;
          font-family: inherit;
          font-size: 1.18rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          min-width: 180px;
          min-height: 54px;
          padding: 0.7rem 2.2rem;
          box-shadow: none;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.2s, filter 0.2s, background 0.3s, border-color 0.2s;
        }
        .blue-launch-btn:after {
          content: '';
          position: absolute;
          left: -40%;
          top: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%);
          transform: skewX(-20deg);
          transition: left 0.4s cubic-bezier(.4,2,.6,1);
          pointer-events: none;
          opacity: 0;
        }
        .blue-launch-btn:hover:after, .blue-launch-btn:focus:after, .blue-launch-btn-active:after {
          left: 60%;
          opacity: 1;
        }
        .blue-launch-btn:hover, .blue-launch-btn:focus, .blue-launch-btn-active {
          background: linear-gradient(90deg, #0f172a 0%, #14b8a6 60%, #38bdf8 100%);
          color: #14b8a6;
          border-color: #38bdf8;
          box-shadow: 0 0 18px 4px #38bdf8cc;
          filter: brightness(1.08) drop-shadow(0 0 8px #38bdf8cc);
          outline: none;
        }
        .blue-launch-btn-active {
          box-shadow: 0 0 18px 4px #38bdf8cc;
          filter: brightness(1.08) drop-shadow(0 0 8px #38bdf8cc);
        }
        .launch-btn-home {
          background: rgba(31, 41, 55, 0.3);
          color: #9ca3af;
          border: 1px solid rgba(75, 85, 99, 0.4);
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
          background: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
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
          background: rgba(20, 184, 166, 0.15);
          color: #14b8a6;
          border-color: rgba(20, 184, 166, 0.3);
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.2);
          transform: translateY(-1px);
          outline: none;
        }
        .launch-btn-home.active {
          background: rgba(20, 184, 166, 0.12);
          color: #14b8a6;
          border-color: rgba(20, 184, 166, 0.25);
        }
      `}</style>
    </div>
  );
} 