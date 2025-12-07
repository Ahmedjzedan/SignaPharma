import Link from "next/link";
import { Pill, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-medical-600 rounded flex items-center justify-center text-white">
                <Pill className="w-3 h-3" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                SignaPharma
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Making pharmacology bearable since 2024. Less cringe, more
              clinical impact.
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">The Hub</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  href="/blog"
                  className="hover:text-medical-600 transition-colors"
                >
                  Community Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/cases"
                  className="hover:text-medical-600 transition-colors"
                >
                  Clinical Cases
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="hover:text-medical-600 transition-colors"
                >
                  Drug Library
                </Link>
              </li>
              <li>
                <Link
                  href="/study"
                  className="hover:text-medical-600 transition-colors"
                >
                  Study Modules
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  href="/about"
                  className="hover:text-medical-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-medical-600 transition-colors"
                >
                  Careers (Run Away)
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-medical-600 transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-medical-600 transition-colors"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal & Stuff</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-medical-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-medical-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-medical-600 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
            <div className="mt-6 flex space-x-4">
              <Link
                href="#"
                className="text-slate-400 hover:text-medical-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com"
                className="text-slate-400 hover:text-medical-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-slate-400 hover:text-medical-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2025 SignaPharma. Built with ☕ and Code by Ahmed.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <span className="text-xs font-mono">Build v2.0.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
