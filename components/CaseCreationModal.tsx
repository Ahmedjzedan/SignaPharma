"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface CaseCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseCreationModal({ isOpen, onClose }: CaseCreationModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-xl shadow-lg w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Create a Clinical Case</h3>
          <p className="text-muted-foreground">
            Please review the following guidelines before proceeding.
          </p>
        </div>

        <div className="space-y-4 mb-8 text-sm text-left bg-muted/50 p-4 rounded-lg border border-border">
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>All cases must be <span className="font-semibold text-foreground">medically accurate</span> and based on real clinical scenarios or guidelines.</li>
            <li>Do not include any <span className="font-semibold text-foreground">identifiable patient information</span> (HIPAA/GDPR compliance).</li>
            <li>Your case will be reviewed by our team of <span className="font-semibold text-foreground">doctors and pharmacists</span> before being published.</li>
            <li>Inaccurate or inappropriate submissions may result in a ban from creating future cases.</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              router.push("/cases/create");
            }}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center gap-2"
          >
            I Understand, Create Case
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
