"use client";

import Link from "next/link";
import { PanelLeft, Activity } from "lucide-react";

interface ModuleNavbarProps {
  title: string;
  progress: string;
  onToggleSidebar: () => void;
}

export default function ModuleNavbar({
  title,
  progress,
  onToggleSidebar,
}: ModuleNavbarProps) {
  return (
    <nav className="w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex-shrink-0 sticky top-0">
      <div className="w-full px-4 h-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-500 hover:text-medical-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Toggle Menu"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          <Link
            href="/study"
            className="flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors"
          >
            <span className="text-sm font-bold">Back to Lobby</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <h1 className="text-sm font-bold text-slate-900 leading-none">
              {title}
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">
              {progress}
            </p>
          </div>
          <div className="w-8 h-8 bg-medical-50 text-medical-600 rounded-lg flex items-center justify-center border border-medical-100">
            <Activity className="w-4 h-4" />
          </div>
        </div>
      </div>
    </nav>
  );
}
