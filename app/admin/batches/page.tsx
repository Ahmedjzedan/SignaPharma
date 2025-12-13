import { db } from "@/lib/db";
import { drugBatches } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Layers, Play, Trash2, CheckCircle, AlertTriangle, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { processBatch, deleteBatch, removeFromBatch } from "@/app/actions/admin-batch";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminBatchesPage() {
  const batches = await db.query.drugBatches.findMany({
    orderBy: [desc(drugBatches.createdAt)],
    with: {
      requests: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/requests"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Batch Management</h1>
          <p className="text-muted-foreground">Process groups of drug requests efficiently.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {batches.length === 0 ? (
          <div className="p-12 text-center border rounded-xl bg-card text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No batches found. Add requests to a batch from the Requests page.</p>
          </div>
        ) : (
          batches.map((batch) => (
            <div key={batch.id} className="border rounded-xl bg-card overflow-hidden shadow-sm">
              <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg")} style={{
                    backgroundColor: batch.status === 'completed' ? 'hsl(var(--batch-success-icon-bg))' :
                                   batch.status === 'open' ? 'hsl(210 90% 90%)' : // Fallback/Hardcoded for others for now or use vars if preferred
                                   batch.status === 'processing' ? 'hsl(45 90% 90%)' :
                                   'hsl(0 90% 95%)',
                    color: batch.status === 'completed' ? 'hsl(var(--batch-success-icon-text))' :
                           batch.status === 'open' ? 'hsl(210 90% 30%)' :
                           batch.status === 'processing' ? 'hsl(45 90% 30%)' :
                           'hsl(0 90% 30%)'
                  }}>
                    {batch.status === 'open' && <Layers className="w-5 h-5" />}
                    {batch.status === 'processing' && <Loader2 className="w-5 h-5 animate-spin" />}
                    {batch.status === 'completed' && <CheckCircle className="w-5 h-5" />}
                    {batch.status === 'failed' && <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Batch {batch.id.slice(0, 8)}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created {batch.createdAt?.toLocaleDateString()} • {batch.requests.length} requests
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {batch.status === 'open' && batch.requests.length > 0 && (
                    <form action={async () => {
                      "use server";
                      await processBatch(batch.id);
                    }}>
                      <button 
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold transition-colors shadow-sm"
                      >
                        <Play className="w-4 h-4" /> Process Batch
                      </button>
                    </form>
                  )}

                  {batch.status === 'failed' && (
                    <form action={async () => {
                      "use server";
                      await processBatch(batch.id);
                    }}>
                      <button 
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold transition-colors shadow-sm"
                      >
                        <RefreshCw className="w-4 h-4" /> Retry Batch
                      </button>
                    </form>
                  )}
                  
                  <form action={async () => {
                    "use server";
                    await deleteBatch(batch.id);
                  }}>
                    <button 
                      type="submit"
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Delete Batch"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Requests in Batch</h4>
                {batch.requests.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No requests in this batch.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {batch.requests.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border bg-background">
                            <span className="font-medium">{req.drugName}</span>
                            {batch.status === 'open' && (
                                <form action={async () => {
                                    "use server";
                                    await removeFromBatch(req.id);
                                }}>
                                    <button type="submit" className="text-muted-foreground hover:text-destructive transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </form>
                            )}
                        </div>
                    ))}
                    </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
    )
}
