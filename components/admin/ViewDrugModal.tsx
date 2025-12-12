"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";

interface ViewDrugModalProps {
  drug: any; // Using any for simplicity, but should be Drug type
}

export default function ViewDrugModal({ drug }: ViewDrugModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // if (!drug) return null; // Removed to allow button to render


  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button 
          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="View Drug"
        >
          <Eye className="w-5 h-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl bg-background rounded-2xl shadow-2xl border border-border z-50 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
          {!drug ? (
            <div className="p-6 text-center">
                <Dialog.Title className="text-lg font-bold text-foreground">Details Not Available</Dialog.Title>
                <p className="text-muted-foreground mt-2">This drug request is not linked to a library entry.</p>
                <Dialog.Close asChild>
                    <button className="mt-4 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium">Close</button>
                </Dialog.Close>
            </div>
          ) : (
          <div className="relative">
            {/* Header */}
            <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b p-6 flex items-center justify-between z-10">
              <div>
                <Dialog.Title className="text-2xl font-bold text-foreground">
                  {drug.brandName}
                </Dialog.Title>
                <Dialog.Description className="text-muted-foreground">
                  {drug.genericName}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Class</h4>
                  <p className="font-medium">{drug.class?.name || drug.category || "N/A"}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Manufacturer</h4>
                  <p className="font-medium">{drug.manufacturer?.name || "N/A"}</p>
                </div>
              </div>

              {/* Boxed Warning */}
              {drug.boxedWarning && (
                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 rounded-r-xl">
                  <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2 uppercase tracking-wide">Boxed Warning</h4>
                  <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">{drug.boxedWarning}</p>
                </div>
              )}

              {/* Sections */}
              <div className="space-y-4">
                <Section title="Indications" content={drug.description || drug.indicationsAndUsage} />
                <Section title="Mechanism of Action" content={drug.mechanismOfAction} />
                <Section title="Dosage" content={drug.dosageAndAdministration} />
                <Section title="Side Effects" content={drug.sideEffects} />
              </div>
            </div>
          </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Section({ title, content }: { title: string; content: string | null }) {
  if (!content) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <div className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
        {content}
      </div>
    </div>
  );
}
