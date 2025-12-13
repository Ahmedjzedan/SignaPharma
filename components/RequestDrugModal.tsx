"use client";

import { useState, useEffect } from "react";
import { X, Send, Loader2, CheckCircle } from "lucide-react";
import { requestDrug } from "@/app/actions/requests";

interface RequestDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function RequestDrugModal({
  isOpen,
  onClose,
  initialQuery = "",
}: RequestDrugModalProps) {
  const [drugName, setDrugName] = useState(initialQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDrugName(initialQuery);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName.trim()) return;

    setIsSubmitting(true);
    try {
      await requestDrug(drugName);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setDrugName("");
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-background shadow-2xl transition-all border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-bold text-lg text-foreground">Request Missing Drug</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">Request Sent!</h4>
              <p className="text-muted-foreground text-sm">
                We&apos;ll review your request and add <strong>{drugName}</strong> to the library soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-sm text-muted-foreground mb-4">
                Can&apos;t find what you&apos;re looking for? Let us know and we&apos;ll use our AI agents to fetch and verify the data for you.
              </p>
              
              <div className="mb-6">
                <label htmlFor="drugName" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Drug Name
                </label>
                <input
                  id="drugName"
                  type="text"
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  placeholder="e.g. Kryptonite"
                  className="w-full px-4 py-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-foreground placeholder-muted-foreground"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !drugName.trim()}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Request
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
