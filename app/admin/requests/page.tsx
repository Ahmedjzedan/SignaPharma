import { db } from "@/lib/db";
import { drugRequests, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Check, X, Clock, Eye, Edit, Trash2 } from "lucide-react";
import { approveDrugRequest, rejectDrugRequest } from "@/app/actions/admin";

import AdminDrugSearch from "@/components/admin/AdminDrugSearch";
import ViewDrugModal from "@/components/admin/ViewDrugModal";

export default async function AdminRequestsPage() {
  const requests = await db.query.drugRequests.findMany({
    orderBy: [desc(drugRequests.createdAt)],
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Drug Requests</h1>
        <p className="text-muted-foreground">Manage user-submitted drug requests or add new drugs.</p>
      </div>

      <AdminDrugSearch />

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No requests found</p>
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
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                      request.status === 'approved' ? 'bg-green-600 text-white dark:bg-green-900/50 dark:text-green-300' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
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
                        await approveDrugRequest(request.id, request.drugName);
                      }}>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                        >
                          <Check className="w-4 h-4" /> Approve & AI Fetch
                        </button>
                      </form>
                    </>
                  )}

                  {request.status === 'approved' && (
                    <div className="flex items-center gap-2">
                       {/* View Drug Modal Trigger */}
                       <ViewDrugModal drug={request.createdDrug} />
                       
                       {/* Edit Button (Placeholder for now) */}
                       <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-5 h-5" />
                       </button>

                       {/* Delete Request Button */}
                       <form action={async () => {
                          "use server";
                          // Implement delete request action if needed, or reuse reject
                          await rejectDrugRequest(request.id); // Using reject as "delete" for now or we can make a delete action
                       }}>
                          <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete Request">
                            <Trash2 className="w-5 h-5" />
                          </button>
                       </form>
                    </div>
                  )}
                  
                  {request.status === 'rejected' && (
                     <form action={async () => {
                        "use server";
                         // Allow deleting rejected requests
                        await rejectDrugRequest(request.id); // Or a real delete
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
