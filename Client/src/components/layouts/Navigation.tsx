"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, logOut, onAuthChange, User } from "@/lib/firebase";
import Button from "@/components/common/Button";
import toast from "react-hot-toast";

const Navigation: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      router.push("/auth");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
      <div className="container-main flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 flex-center">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gradient hidden sm:inline">
            AstroView
          </span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex gap-8">
          <Link
            href="/dashboard"
            className="text-text-secondary hover:text-accent-cyan transition"
          >
            Dashboard
          </Link>
          <Link
            href="/solar-view"
            className="text-text-secondary hover:text-accent-cyan transition"
          >
            Solar View
          </Link>
          <Link
            href="/chat"
            className="text-text-secondary hover:text-accent-cyan transition flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            AI Chat
          </Link>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-violet-500/50"
                />
              )}
              <div className="hidden sm:flex flex-col text-right">
                <p className="text-sm text-text-primary font-medium">
                  {user.displayName || user.email}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
