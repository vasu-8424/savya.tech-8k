"use client";
import dynamic from "next/dynamic";
import { toast } from "../../hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { X } from "lucide-react";

const MainScene = dynamic(() => import("../../components/main-scene"), { ssr: false });

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Open by default on desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    function updateUserInfo() {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
      if (email) {
        supabase
          .from('users')
          .select('username')
          .eq('email', email)
          .single()
          .then(({ data }) => {
            if (data && data.username) setUsername(data.username);
            else setUsername(null);
          });
      } else {
        setUsername(null);
      }
    };

    updateUserInfo();
    window.addEventListener('focus', updateUserInfo);
    window.addEventListener('storage', updateUserInfo);
    return () => {
      window.removeEventListener('focus', updateUserInfo);
      window.removeEventListener('storage', updateUserInfo);
    };
  }, []);

  useEffect(() => {
    // Always fetch latest email and username on mount and when route changes
    if (typeof window !== 'undefined') {
      const fetchUserInfo = async () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const email = localStorage.getItem('userEmail');
        setUserEmail(email);
        if (email) {
          const { data } = await supabase
            .from('users')
            .select('username')
            .eq('email', email)
            .single();
          if (data && data.username) setUsername(data.username);
          else setUsername(null);
        } else {
          setUsername(null);
        }
        if (!isLoggedIn || isLoggedIn !== 'true') {
          router.push("/login");
        } else {
          toast({
            title: "Welcome!",
            description: "You have successfully logged in.",
          });
          setLoading(false);
        }
      };
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#10141a] text-[#14e0ff]">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#10141a] overflow-hidden">
      {/* Globe animation background */}
      <div className="absolute inset-0 -z-10">
        <MainScene />
      </div>
      
      {/* Main layout container */}
      <div className="flex min-h-screen w-full">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Vertical Sidebar */}
        <div className={`${
          sidebarOpen 
            ? isMobile 
              ? 'fixed left-0 top-0 h-full w-80 z-40' 
              : 'w-80' 
            : 'w-0'
        } transition-all duration-300 ease-in-out`}>
          {sidebarOpen && (
            <div className="h-full bg-[#181f2a]/95 backdrop-blur-md border-r border-[#14e0ff]/20 flex flex-col shadow-xl">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-[#14e0ff] hover:text-white transition-colors p-2 rounded-full hover:bg-[#14e0ff]/10 z-50"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
              
              {/* User profile section */}
              <div className="flex flex-col items-center py-8 px-6 border-b border-[#14e0ff]/10">
                <Avatar className="w-16 h-16 mb-4">
                  <AvatarFallback className="bg-[#14e0ff]/20 text-[#14e0ff] text-lg font-semibold">
                    {username ? username[0].toUpperCase() : (userEmail ? userEmail[0].toUpperCase() : "U")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-[#14e0ff] text-lg font-semibold text-center mb-1">
                  {username || (userEmail ? userEmail.split("@")[0] : "Username")}
                </h3>
              </div>
              
              {/* Navigation items */}
              <div className="flex-1 py-6 px-4">
                <nav className="space-y-2">
                  <a href="/dashboard" className="flex items-center px-4 py-3 text-[#14e0ff] bg-[#14e0ff]/10 rounded-lg font-medium">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6h-8V5z" />
                    </svg>
                    Dashboard
                  </a>
                  <a href="/trading" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Trading
                  </a>
                  <a href="/strategy" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Strategy
                  </a>
                  <a href="/backtest" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Backtest
                  </a>
                  <a href="/community" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Community
                  </a>
                </nav>
              </div>
              
              {/* Logout button */}
              <div className="p-4 border-t border-[#14e0ff]/10">
                <button
                  onClick={() => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    router.push('/login');
                  }}
                  className="w-full flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hamburger menu button (when sidebar is closed) */}
        {!sidebarOpen && (
          <button
            className="fixed top-6 left-6 z-30 text-[#14e0ff] hover:text-white transition-colors bg-[#181f2a]/80 backdrop-blur-sm rounded-lg p-3 border border-[#14e0ff]/20 shadow-lg hover:shadow-xl"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        {/* Main content area */}
        <div className={`flex-1 flex items-center justify-center min-h-screen transition-all duration-300 ${
          sidebarOpen && !isMobile ? 'ml-0' : 'ml-0'
        }`}>
          <div className="flex flex-col items-center justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight text-[#14e0ff] mb-6 sm:mb-8 drop-shadow-2xl tracking-wide">
              Dashboard
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[#14e0ff]/70 mb-8 sm:mb-12 max-w-2xl font-light leading-relaxed">
              Welcome to your trading dashboard! Monitor your portfolio, execute strategies, and explore market opportunities.
            </p>
            
            {/* Quick action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl">
              <div className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 sm:p-6 hover:bg-[#181f2a]/60 transition-all duration-300 cursor-pointer group">
                <div className="text-[#14e0ff] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-[#14e0ff] text-base sm:text-lg font-semibold mb-2">Live Trading</h3>
                <p className="text-[#14e0ff]/60 text-xs sm:text-sm">Execute trades in real-time with advanced analytics</p>
              </div>
              
              <div className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 sm:p-6 hover:bg-[#181f2a]/60 transition-all duration-300 cursor-pointer group">
                <div className="text-[#14e0ff] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-[#14e0ff] text-base sm:text-lg font-semibold mb-2">Strategy Builder</h3>
                <p className="text-[#14e0ff]/60 text-xs sm:text-sm">Create and optimize your trading strategies</p>
              </div>
              
              <div className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 sm:p-6 hover:bg-[#181f2a]/60 transition-all duration-300 cursor-pointer group sm:col-span-2 lg:col-span-1">
                <div className="text-[#14e0ff] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-[#14e0ff] text-base sm:text-lg font-semibold mb-2">Backtesting</h3>
                <p className="text-[#14e0ff]/60 text-xs sm:text-sm">Test your strategies against historical data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}