"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Flag, AlertTriangle, CheckCircle, X } from "lucide-react";
import { createReport } from "@/app/actions/content";
import clsx from "clsx";

interface ReportButtonProps {
  targetId: string;
  targetType: "blog" | "case" | "user" | "comment";
  variant?: "icon" | "button" | "text";
  className?: string;
}

export default function ReportButton({ targetId, targetType, variant = "button", className }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const result = await createReport(targetId, targetType, reason);
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          setReason("");
        }, 2000);
      } else {
        setError(result.message || "Failed to submit report");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Report submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={clsx("text-muted-foreground hover:text-destructive transition-colors", className)}
          title="Report"
        >
          <Flag className="w-4 h-4" />
        </button>
      ) : variant === "text" ? (
         <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={clsx("text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1", className)}
        >
          <Flag className="w-3 h-3" /> Report
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={clsx("flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors", className)}
        >
          <Flag className="w-4 h-4" />
          Report
        </button>
      )}

      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Report Content
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please describe why you are reporting this {targetType}. Our team will review it shortly.
              </p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-green-600">
                <CheckCircle className="w-12 h-12 mb-2" />
                <p className="font-medium">Report Submitted</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder={targetType === 'case' ? "What's wrong about this case or what's inaccurate?" : "e.g., Inappropriate content, spam, harassment..."}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !reason.trim()}
                    className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
