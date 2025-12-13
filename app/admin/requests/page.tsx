import { db } from "@/lib/db";
import { drugRequests, users } from "@/lib/db/schema";
import { desc, eq, isNull } from "drizzle-orm";
import { Check, X, Clock, Eye, Edit, Trash2, Layers } from "lucide-react";
import { approveDrugRequest, rejectDrugRequest, deleteDrugRequest } from "@/app/actions/admin";
import { addToBatch } from "@/app/actions/admin-batch";

import AdminDrugSearch from "@/components/admin/AdminDrugSearch";
import ViewDrugModal from "@/components/admin/ViewDrugModal";
import Link from "next/link";

export default async function AdminRequestsPage() {
  const requests = await db.query.drugRequests.findMany({
    orderBy: [desc(drugRequests.createdAt)],
    where: isNull(drugRequests.batchId), // Only show unbatched requests
    with: {
      user: true,
      createdDrug: {
        with: {
            manufacturer: true,
            class: true
        }
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Drug Requests</h1>
          <p className="text-muted-foreground">Manage user-submitted drug requests or add new drugs.</p>
        </div>
        <Link 
          href="/admin/batches" 
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: 'hsl(var(--btn-manage-bg))',
            color: 'hsl(var(--btn-manage-text))',
          }}
        >
          <Layers className="w-4 h-4" />
          Manage Batches
        </Link>
      </div>

      <AdminDrugSearch />

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No pending requests found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {requests.map((request) => (
              <div key={request.id} className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-foreground">
                      {request.drugName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase`} style={{
                      backgroundColor: request.status === 'approved' ? 'hsl(var(--status-approved-bg))' :
                                     request.status === 'rejected' ? 'hsl(var(--status-rejected-bg))' :
                                     'hsl(var(--status-pending-bg))',
                      color: request.status === 'approved' ? 'hsl(var(--status-approved-text))' :
                             request.status === 'rejected' ? 'hsl(var(--status-rejected-text))' :
                             'hsl(var(--status-pending-text))'
                    }}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Requested by <span className="font-medium text-foreground">{request.user?.name || "Unknown User"}</span> • {request.createdAt?.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {request.status === 'pending' && (
                    <>
                      <form action={async () => {
                        "use server";
                        await rejectDrugRequest(request.id);
                      }}>
                        <button
                          type="submit"
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </form>
                      
                      <form action={async () => {
                        "use server";
                        await addToBatch(request.id);
                      }}>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                        >
                          <Layers className="w-4 h-4" /> Add to Batch
                        </button>
                      </form>
                    </>
                  )}

                  {request.status === 'approved' && (
                    <div className="flex items-center gap-2">
                       <ViewDrugModal drug={request.createdDrug} />
                       
                       <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-5 h-5" />
                       </button>

                       <form action={async () => {
                          "use server";
                          await deleteDrugRequest(request.id);
                       }}>
                          <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Remove from list">
                            <Trash2 className="w-5 h-5" />
                          </button>
                       </form>
                    </div>
                  )}
                  
                  {request.status === 'rejected' && (
                     <form action={async () => {
                        "use server";
                        await deleteDrugRequest(request.id);
                     }}>
                        <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                     </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
