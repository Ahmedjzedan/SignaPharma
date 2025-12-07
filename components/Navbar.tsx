"use client";

import { useState } from "react";
import Link from "next/link";
import { Pill, Menu, X, LogOut } from "lucide-react";
import clsx from "clsx";

import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <nav className="fixed w-full z-50 glass backdrop-blur-md transition-all duration-300">
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
            <span className="font-bold text-xl tracking-tight text-slate-900">
              SignaPharma
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-slate-600 hover:text-medical-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/cases"
              className="text-sm font-medium text-slate-600 hover:text-medical-600 transition-colors"
            >
              Cases
            </Link>
            <Link
              href="/library"
              className="text-sm font-medium text-slate-600 hover:text-medical-600 transition-colors"
            >
              Library
            </Link>
            <Link
              href="/study"
              className="text-sm font-medium text-slate-600 hover:text-medical-600 transition-colors"
            >
              Study
            </Link>

            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-transparent group-hover:ring-medical-500 transition-all">
                    <img
                      src={
                        session?.user?.image ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=House"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden lg:block group-hover:text-medical-600 transition-colors">
                    {session?.user?.name || "Dr. House"}
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-medical-600 hover:bg-medical-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg shadow-medical-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-600"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-medical-600 focus:outline-none"
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
          "md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/blog"
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-medical-600 hover:bg-medical-50"
          >
            Blog
          </Link>
          <Link
            href="/cases"
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-medical-600 hover:bg-medical-50"
          >
            Cases
          </Link>
          <Link
            href="/library"
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-medical-600 hover:bg-medical-50"
          >
            Library
          </Link>
          <Link
            href="/study"
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-medical-600 hover:bg-medical-50"
          >
            Study
          </Link>
          <div className="pt-4 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-medical-600 bg-medical-50 font-bold"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="block text-center w-full bg-medical-600 text-white px-5 py-3 rounded-lg font-medium shadow-md"
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
