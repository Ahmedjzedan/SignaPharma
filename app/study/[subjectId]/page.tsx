"use client";

import { useState, useEffect } from "react";
import ModuleNavbar from "../../../components/ModuleNavbar";
import ModuleSidebar from "../../../components/ModuleSidebar";
import ModuleQuizModal from "../../../components/ModuleQuizModal";
import {
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  BrainCircuit,
  PlayCircle,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Check,
} from "lucide-react";
import clsx from "clsx";

export default function ModuleStudyPage({
  params,
}: {
  params: { subjectId: string };
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFinish = () => {
    setIsQuizModalOpen(false);
    setIsFinished(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="text-slate-800 antialiased h-screen flex flex-col overflow-hidden bg-white bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <ModuleNavbar
        title="Renal Physiology"
        progress="Module 4 • 12%"
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <ModuleSidebar isOpen={isSidebarOpen} />

        <main
          className={clsx(
            "flex-1 h-full overflow-y-auto bg-white relative scroll-smooth w-full transition-all duration-300",
            isSidebarOpen ? "lg:ml-72" : ""
          )}
        >
          <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-8 uppercase tracking-wider">
              <span className="hover:text-medical-600 cursor-pointer">
                Renal Phys
              </span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-medical-600">1.2 GFR</span>
            </div>

            {/* Title Header */}
            <div className="mb-10 border-b border-slate-100 pb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                Glomerular Filtration: <br />
                <span className="text-medical-600">The VIP Club</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed">
                Welcome to the Glomerulus. It's basically a high-pressure coffee
                filter that decides what stays in your blood and what becomes...
                well, you know.
              </p>
            </div>

            {/* Content Body */}
            <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-10">
              {/* Diagram Card */}
              <div className="not-prose bg-slate-50 border border-slate-200 rounded-2xl p-2 shadow-sm">
                <div className="bg-white rounded-xl overflow-hidden aspect-video relative group cursor-zoom-in border border-slate-100">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 group-hover:bg-slate-50 transition-colors">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm font-bold">
                      [Diagram: Renal Corpuscle Anatomy]
                    </span>
                    <span className="text-xs">
                      Afferent vs Efferent Arterioles
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Figure 1.1
                  </span>
                  <button className="text-medical-600 text-sm font-bold hover:underline flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> Expand
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  The Physics of Pee (Starling Forces)
                </h3>
                <p>
                  Filtration isn't magic; it's a tug-of-war. The kidney filters{" "}
                  <strong>180 Liters</strong> of fluid a day. You only pee about
                  1.5L. The rest is reabsorbed, or you'd dehydrate in 45
                  minutes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-5 rounded-xl border-l-4 border-green-500 bg-green-50/50">
                    <h4 className="font-bold text-green-900 text-sm uppercase mb-1">
                      Pushing Out
                    </h4>
                    <p className="text-slate-700 font-bold">
                      Hydrostatic Pressure
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Blood pressure in the capillaries forcing fluid into the
                      tubule.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl border-l-4 border-red-500 bg-red-50/50">
                    <h4 className="font-bold text-red-900 text-sm uppercase mb-1">
                      Pulling In
                    </h4>
                    <p className="text-slate-700 font-bold">Oncotic Pressure</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Albumin acting like a sponge to keep water in the blood.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Autoregulation: Trust Issues
                </h3>
                <p>
                  Your blood pressure changes constantly. If GFR fluctuated with
                  every BP change, you'd either explode or stop making urine.
                  The kidney prevents this via <strong>Autoregulation</strong>.
                </p>
                <ul className="space-y-4 mt-4 list-none pl-0">
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-bold">
                      1
                    </div>
                    <div>
                      <strong className="text-slate-900 block">
                        Myogenic Mechanism
                      </strong>
                      <span className="text-sm">
                        High BP stretches the afferent arteriole → It
                        reflexively constricts to protect the glomerulus.
                      </span>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-bold">
                      2
                    </div>
                    <div>
                      <strong className="text-slate-900 block">
                        Tubuloglomerular Feedback
                      </strong>
                      <span className="text-sm">
                        The Macula Densa tastes the salt. High salt = GFR is too
                        fast → Signals to constrict afferent arteriole.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* TEST UNDERSTANDING CTA */}
            <div className="mt-20 flex flex-col items-center justify-center p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl text-center relative overflow-hidden group">
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBIMjBMMCAyMHptNDAgMFYyMEwwIDQwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEiLz48L2c+PC9zdmc+')]"></div>

              <div className="relative z-10 max-w-lg">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-white/20">
                  <BrainCircuit className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Think you got it?
                </h2>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Prove you understand GFR mechanics before moving on. The
                  kidney doesn't forgive mistakes, and neither does the NAPLEX.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                  <button
                    onClick={() => setIsQuizModalOpen(true)}
                    className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <PlayCircle className="w-5 h-5 text-medical-600" /> Test
                    Understanding
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={isFinished}
                    className={clsx(
                      "px-8 py-4 border-2 font-bold rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto",
                      isFinished
                        ? "border-green-500 text-green-400 cursor-default"
                        : "bg-transparent border-slate-600 hover:border-white text-slate-300 hover:text-white"
                    )}
                  >
                    {isFinished ? (
                      <>
                        <CheckCircle className="w-5 h-5" /> Completed
                      </>
                    ) : (
                      <>
                        <Flag className="w-5 h-5" /> Flag as Finished
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between mt-12 pt-6 border-t border-slate-100 pb-12">
              <button className="text-slate-400 hover:text-slate-600 text-sm font-bold flex items-center gap-2 group px-4 py-2 rounded-lg hover:bg-slate-50 transition-all">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
                Previous: Anatomy
              </button>
              <button className="text-medical-600 hover:text-medical-800 text-sm font-bold flex items-center gap-2 group px-4 py-2 rounded-lg hover:bg-medical-50 transition-all">
                Next: Tubular Reabsorption{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </main>

        <ModuleQuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          onFinish={handleFinish}
        />

        {/* Toast */}
        <div
          className={clsx(
            "fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl transition-all duration-500 z-50 flex items-center gap-4 border border-slate-700",
            showToast ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"
          )}
        >
          <div className="bg-green-500 rounded-full p-1 shadow-[0_0_10px_rgba(34,197,94,0.5)]">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Module Complete</h4>
            <p className="text-xs text-slate-400">
              Wow, you actually finished. Nerd.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
