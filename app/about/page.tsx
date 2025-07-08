import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">About Us</h1>
      <p className="text-lg text-gray-300 mb-12 max-w-xl text-center">
        Savya Technologies is powered by young minds launching epic digital solutions! (Add your about/company info here.)
      </p>
      <Link href="/" legacyBehavior>
        <a className="pointer-events-auto px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-transform duration-200 transform hover:scale-105 focus:scale-105 bg-teal-500 text-black border-b-4 border-teal-700 hover:shadow-teal-400/40 active:scale-95" style={{ boxShadow: '0 4px 24px 0 #14b8a6aa' }}>
          Back to Home
        </a>
      </Link>
    </div>
  );
} 