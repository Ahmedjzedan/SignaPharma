"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import clsx from "clsx";

interface ModuleSidebarProps {
  isOpen: boolean;
}

export default function ModuleSidebar({ isOpen }: ModuleSidebarProps) {
  return (
    <aside
      className={clsx(
        "w-72 bg-white border-r border-slate-200 flex-shrink-0 fixed inset-y-0 left-0 top-16 z-40 transform transition-transform duration-300 h-[calc(100vh-64px)] flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
          Chapters
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scroll p-3 space-y-1">
        {/* Chapter 1 Group */}
        <div className="pb-4">
          <button className="w-full flex items-center justify-between text-left px-3 py-2 text-sm font-bold text-slate-900 rounded-lg hover:bg-slate-50">
            1. Nephron Structure
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <div className="mt-1 space-y-0.5 relative">
            {/* Connecting Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200"></div>

            <Link
              href="#"
              className="block pl-9 pr-3 py-2 text-sm text-slate-400 line-through decoration-slate-300 hover:text-slate-600 transition-colors relative"
            >
              1.1 Anatomy Review
              <Check className="w-3 h-3 text-green-500 absolute left-3 top-2.5 bg-white" />
            </Link>

            {/* Active Item */}
            <Link
              href="#"
              className="block pl-9 pr-3 py-2 text-sm text-medical-700 bg-medical-50 font-bold rounded-r-lg border-l-4 border-medical-600 relative"
            >
              1.2 Glomerular Filtration
            </Link>

            <Link
              href="#"
              className="block pl-9 pr-3 py-2 text-sm text-slate-600 hover:text-medical-600 transition-colors relative hover:bg-slate-50 rounded-r-lg border-l-4 border-transparent"
            >
              1.3 Tubular Reabsorption
            </Link>
          </div>
        </div>

        {/* Chapter 2 Group */}
        <div className="pb-4">
          <button className="w-full flex items-center justify-between text-left px-3 py-2 text-sm font-bold text-slate-900 rounded-lg hover:bg-slate-50">
            2. Fluid & Electrolytes
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Chapter 3 Group */}
        <div className="pb-4">
          <button className="w-full flex items-center justify-between text-left px-3 py-2 text-sm font-bold text-slate-900 rounded-lg hover:bg-slate-50">
            3. Diuretics
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* User Stats Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=House"
              alt="Profile"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Dr. House</p>
            <p className="text-[10px] text-slate-500">Lvl 12 Pharmacist</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
