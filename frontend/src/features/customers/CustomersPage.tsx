import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { customersApi } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { Search, Users, ChevronLeft, ChevronRight, Eye } from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["customers", { search, page }],
    queryFn: () => customersApi.list({ search, page }),
  });

  const customers = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Customers</h2>
          <p className="text-sm text-muted-foreground">{meta?.total ?? 0} total customers</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          + Add Customer
        </button>
      </div>

      <div className="flex-1 min-w-48 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search customers..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                {["Customer", "Email", "Phone", "Orders", "Location", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-6" /></td>)}</tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No customers found</p>
                  </td>
                </tr>
              ) : customers.map((c: Record<string, unknown>) => (
                <tr key={c.id as number} className="hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {(c.first_name as string)?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">{c.full_name as string}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email as string}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone as string ?? "—"}</td>
                  <td className="px-4 py-3 text-foreground">{c.orders_count as number ?? 0}</td>
                  <td className="px-4 py-3 text-muted-foreground">{(c.address as { city?: string; country?: string })?.city ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${(c.is_active as boolean) ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
                      {(c.is_active as boolean) ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(c.created_at as string)}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setViewingCustomer(c)}
                      className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Page {meta.current_page} of {meta.last_page}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.current_page === 1}
                className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={meta.current_page === meta.last_page}
                className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Customer Detail Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-border/50 p-6 relative">
            <button onClick={() => setViewingCustomer(null)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                {viewingCustomer.first_name?.[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{viewingCustomer.full_name}</h3>
                <p className="text-sm text-muted-foreground">Member since {formatDate(viewingCustomer.created_at)}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Email ADDRESS</p>
                  <p className="font-medium">{viewingCustomer.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Phone Number</p>
                  <p className="font-medium">{viewingCustomer.phone || "—"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Default shipping address</p>
                <div className="p-3 rounded-lg bg-muted/30 text-sm border border-border/50">
                  {viewingCustomer.address ? (
                    <>
                      <p>{viewingCustomer.address.address}</p>
                      <p>{viewingCustomer.address.city}, {viewingCustomer.address.state} {viewingCustomer.address.zip_code}</p>
                      <p>{viewingCustomer.address.country}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">No address on file</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{viewingCustomer.orders_count || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(viewingCustomer.total_spent || 0)}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
               <button 
                 onClick={() => setViewingCustomer(null)}
                 className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
               >
                 Close Profile
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
