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
  // All state and logic from previous DashboardContent
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
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
    // Handle OAuth success parameters
    if (!mounted) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    
    if (oauthSuccess === 'true') {
      // Get user email from cookie set by callback
      const userEmailCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-email='))
        ?.split('=')[1];
      
      if (userEmailCookie) {
        // Set localStorage for OAuth login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', decodeURIComponent(userEmailCookie));
        
        // Clean up URL parameters
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        toast({
          title: "Welcome!",
          description: "You have successfully logged in with OAuth.",
        });
      }
    }
  }, [mounted]);

  useEffect(() => {
    // Always fetch latest email and username on mount and when route changes
    if (!mounted) return;
    
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
        // Only show welcome toast if it's not an OAuth redirect (to avoid duplicate toasts)
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get('oauth_success')) {
          toast({
            title: "Welcome!",
            description: "You have successfully logged in.",
          });
        }
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [mounted, router]);

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
        <div style={{
  background: "radial-gradient(circle at 60% 40%, #14e0ff33 0%, #10141a 80%)",
  width: "100vw",
  height: "100vh"
}} />
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
                  <a href="/projects" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Projects
                  </a>
                  <a href="/clients" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Clients
                  </a>
                  <a href="/services" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Services
                  </a>
                  <a href="/analytics" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </a>
                  <a href="/team" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Team
                  </a>
                  <a href="/settings" className="flex items-center px-4 py-3 text-[#14e0ff]/70 hover:text-[#14e0ff] hover:bg-[#14e0ff]/5 rounded-lg transition-colors">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
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
              Welcome to your company dashboard! Manage projects, track clients, and grow your business that converts ideas into amazing web and mobile applications.
            </p>
            
            {/* Stats overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl mb-8">
              <div className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#14e0ff] mb-2">12</div>
                <div className="text-[#14e0ff]/70 text-sm">Active Projects</div>
              </div>
              <div className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#14e0ff] mb-2">28</div>
                <div className="text-[#14e0ff]/70 text-sm">Happy Clients</div>
              </div>
              <div className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#14e0ff] mb-2">45</div>
                <div className="text-[#14e0ff]/70 text-sm">Apps Delivered</div>
              </div>
              <div className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#14e0ff] mb-2">98%</div>
                <div className="text-[#14e0ff]/70 text-sm">Client Satisfaction</div>
              </div>
            </div>
            
            {/* Quick action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl">
              <a href="/projects" className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 sm:p-6 hover:bg-[#181f2a]/60 transition-all duration-300 cursor-pointer group block">
                <div className="text-[#14e0ff] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-[#14e0ff] text-base sm:text-lg font-semibold mb-2">Project Management</h3>
                <p className="text-[#14e0ff]/60 text-xs sm:text-sm">Track and manage all your web and mobile app projects</p>
              </a>
              
              <a href="/clients" className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 sm:p-6 hover:bg-[#181f2a]/60 transition-all duration-300 cursor-pointer group block">
                <div className="text-[#14e0ff] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-[#14e0ff] text-base sm:text-lg font-semibold mb-2">Client Relations</h3>
                <p className="text-[#14e0ff]/60 text-xs sm:text-sm">Manage client relationships and communications</p>
              </a>
              
              <a href="/services" className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 sm:p-6 hover:bg-[#181f2a]/60 transition-all duration-300 cursor-pointer group block">
                <div className="text-[#14e0ff] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-[#14e0ff] text-base sm:text-lg font-semibold mb-2">Service Catalog</h3>
                <p className="text-[#14e0ff]/60 text-xs sm:text-sm">Explore our web and mobile development services</p>
              </a>
              
              <a href="/analytics" className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 sm:p-6 hover:bg-[#181f2a]/60 transition-all duration-300 cursor-pointer group block">
                <div className="text-[#14e0ff] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-[#14e0ff] text-base sm:text-lg font-semibold mb-2">Business Analytics</h3>
                <p className="text-[#14e0ff]/60 text-xs sm:text-sm">Track performance metrics and business insights</p>
              </a>
              
              <a href="/team" className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 sm:p-6 hover:bg-[#181f2a]/60 transition-all duration-300 cursor-pointer group block">
                <div className="text-[#14e0ff] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-[#14e0ff] text-base sm:text-lg font-semibold mb-2">Team Management</h3>
                <p className="text-[#14e0ff]/60 text-xs sm:text-sm">Manage your development team and resources</p>
              </a>
              
              <a href="/settings" className="bg-[#181f2a]/40 backdrop-blur-sm border border-[#14e0ff]/20 rounded-xl p-4 sm:p-6 hover:bg-[#181f2a]/60 transition-all duration-300 cursor-pointer group block">
                <div className="text-[#14e0ff] mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-[#14e0ff] text-base sm:text-lg font-semibold mb-2">Company Settings</h3>
                <p className="text-[#14e0ff]/60 text-xs sm:text-sm">Configure company preferences and account settings</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}