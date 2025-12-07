"use client";

import { useState } from "react";
import Link from "next/link";
import { Pill, Menu, X, LogOut } from "lucide-react";
import clsx from "clsx";
import ThemeToggle from "./ThemeToggle";

import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <nav className="fixed w-full z-50 glass backdrop-blur-md transition-all duration-300 bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 bg-medical-600 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <Pill className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              SignaPharma
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/cases"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Cases
            </Link>
            <Link
              href="/library"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Library
            </Link>
            <Link
              href="/study"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Study
            </Link>
            
            <ThemeToggle />

            {/* Auth Section */}

            {isLoggedIn ? (
              <div className="flex items-center gap-4 pl-4 border-l border-border">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all">
                    <img
                      src={
                        session?.user?.image ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=House"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground hidden lg:block group-hover:text-primary transition-colors">
                    {session?.user?.name || "Dr. House"}
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-primary focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={clsx(
          "md:hidden bg-background border-b border-border overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/blog"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
          >
            Blog
          </Link>
          <Link
            href="/cases"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
          >
            Cases
          </Link>
          <Link
            href="/library"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
          >
            Library
          </Link>
          <Link
            href="/study"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
          >
            Study
          </Link>
          <div className="pt-4 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary bg-accent font-bold"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="block text-center w-full bg-primary text-primary-foreground px-5 py-3 rounded-lg font-medium shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
