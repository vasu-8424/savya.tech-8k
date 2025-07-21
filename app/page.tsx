"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link";

const MainScene = dynamic(() => import("@/components/main-scene"), { ssr: false })

// Add RocketIcon SVG
const RocketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
    <path d="M4.5 16.5L9 15l6-6 3-3a2.12 2.12 0 0 0-3-3l-3 3-6 6-1.5 4.5z"/>
    <path d="M15 9l6 6"/>
    <circle cx="9" cy="15" r="1" fill="currentColor"/>
  </svg>
);

export default function Home() {
  const [splashStage, setSplashStage] = useState<'logo' | 'loading' | 'main'>('logo');

  useEffect(() => {
    // Show logo for 0.5s, then loading for 0.5s, then main page
    const logoTimer = setTimeout(() => setSplashStage('loading'), 500);
    const loadingTimer = setTimeout(() => setSplashStage('main'), 1000);
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {splashStage === 'logo' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700">
          <img
            src="/savya-logo.jpg"
            alt="Savya Technologies Logo"
            className="w-48 h-48 mb-6 fade-in-slow"
            style={{ filter: "drop-shadow(0 0 24px #14b8a6)" }}
          />
        </div>
      )}
      {splashStage === 'loading' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700">
          <img
            src="/savya-logo.jpg"
            alt="Savya Technologies Logo"
            className="w-24 h-24 mb-6 fade-in-slow"
            style={{ filter: "drop-shadow(0 0 16px #14b8a6)" }}
          />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h1 className="text-4xl font-extrabold text-teal-400 animate-fade-in">Savya</h1>
          </div>
        </div>
      )}
      {splashStage === 'main' && (
        <main className="relative w-full h-screen overflow-hidden bg-black">
          <div className="absolute inset-0 z-10">
            <MainScene />
          </div>
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pointer-events-none">
            <div className="max-w-3xl text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                <span className="text-teal-500">Savya</span> Technologies
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Young Minds Launching Epic Digital Solutions!
              </p>
            </div>
          </div>
          {/* Bottom buttons */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 z-30">
            <Link href="/get-started" legacyBehavior>
              <a className="launch-btn-home pointer-events-auto font-bold text-lg" style={{ minWidth: 180, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', padding: '0.7rem 2.2rem', borderRadius: 14 }}>
                <RocketIcon /> GET STARTED
              </a>
            </Link>
            <Link href="/about" legacyBehavior>
              <a className="launch-btn-home pointer-events-auto font-bold text-lg" style={{ minWidth: 180, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', padding: '0.7rem 2.2rem', borderRadius: 14 }}>
                <RocketIcon /> ABOUT US
              </a>
            </Link>
          </div>
        </main>
      )}
      <style jsx global>{`
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
`}</style>
    </ThemeProvider>
  );
}
