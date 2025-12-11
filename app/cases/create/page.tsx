"use client";

import { useRouter } from "next/navigation";
import { createCase } from "@/app/actions/content";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CaseForm from "@/components/CaseForm";

export default function CreateCasePage() {
  const router = useRouter();

  const handleCreate = async (data: any) => {
    const result = await createCase(data);
    if (result.success) {
      router.push("/cases");
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/cases" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cases
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Case</h1>
          <p className="text-muted-foreground">
            Submit a clinical case for review. Please ensure all medical information is accurate.
          </p>
        </div>

        <CaseForm onSubmit={handleCreate} />
      </div>
    </div>
  );
}
