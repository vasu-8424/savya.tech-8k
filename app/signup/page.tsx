import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Link from "next/link";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="bg-gray-900/80 rounded-3xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-teal-400">Sign Up</h2>
        <form className="w-full flex flex-col gap-4 mb-4">
          <motion.input
            whileFocus={{ scale: 1.04, boxShadow: "0 0 0 2px #14b8a6" }}
            type="text"
            placeholder="Username"
            className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 transition-all"
          />
          <motion.input
            whileFocus={{ scale: 1.04, boxShadow: "0 0 0 2px #14b8a6" }}
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 transition-all"
          />
          <motion.input
            whileFocus={{ scale: 1.04, boxShadow: "0 0 0 2px #14b8a6" }}
            type="password"
            placeholder="Confirm Password"
            className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 4px 24px #14b8a6aa" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="mt-2 bg-teal-500 text-black font-bold py-3 rounded-2xl shadow-md border-b-2 border-teal-700 transition-all text-lg"
          >
            {loading ? "Loading..." : "Sign Up"}
          </motion.button>
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
          >
            <FaGithub size={28} className="text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, rotate: -10 }}
            className="bg-gray-800 p-3 rounded-full shadow hover:bg-gray-700 transition-all border border-gray-700"
            aria-label="Sign up with Google"
          >
            <FaGoogle size={28} className="text-white" />
          </motion.button>
        </motion.div>
        <div className="text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-400 hover:underline font-bold">Login</Link>
        </div>
      </motion.div>
    </div>
  );
} 