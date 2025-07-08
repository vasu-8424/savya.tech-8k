"use client";
import dynamic from "next/dynamic";
import { toast } from "../../hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { SidebarProvider, Sidebar } from "../../components/ui/sidebar";

const MainScene = dynamic(() => import("../../components/main-scene"), { ssr: false });

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for authentication state from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const email = localStorage.getItem('userEmail');
      
      // Debug logging
      console.log('Dashboard auth check:', {
        isLoggedIn,
        email,
        condition: !isLoggedIn || isLoggedIn !== 'true'
      });
      
      if (!isLoggedIn || isLoggedIn !== 'true') {
        console.log('Not authenticated, redirecting to login');
        router.push("/login");
      } else {
        console.log('Authenticated, staying on dashboard');
        setUserEmail(email);
        toast({
          title: "Welcome!",
          description: "You have successfully logged in.",
        });
        setLoading(false);
      }
    } else {
      // If we're on server-side, just set loading to false
      console.log('Server-side rendering, setting loading to false');
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
    <div className="relative min-h-screen flex overflow-hidden bg-[#10141a]">
      <div className="absolute inset-0 -z-10">
        <MainScene />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <SidebarProvider>
        <Sidebar className="z-10 bg-[#181f2a]/80 border-r border-[#14e0ff]/20 flex flex-col items-center py-8 min-w-[220px]">
          <div className="flex flex-col items-center mb-8">
            <Avatar>
              <AvatarFallback>{userEmail ? userEmail[0].toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
            <span className="mt-3 text-[#14e0ff] text-sm font-semibold text-center break-all max-w-[180px]">{userEmail}</span>
          </div>
          {/* Add sidebar nav items here */}
        </Sidebar>
      </SidebarProvider>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-extralight text-[#14e0ff] mb-6 drop-shadow-lg tracking-wide">Dashboard</h1>
        <p className="text-base text-[#14e0ff]/70 mb-8 max-w-xl text-center font-light">
          Welcome to your dashboard! More features coming soon.
        </p>
      </div>
    </div>
  );
} 