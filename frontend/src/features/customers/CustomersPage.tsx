import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { customersApi } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { Search, Users, ChevronLeft, ChevronRight, Eye, Download, Users as UsersIcon, UserCheck, UserPlus, Crown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function CustomersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { hasPermission } = useAuthStore();
  const canManage = hasPermission("manage customers");

  const { data, isLoading } = useQuery({
    queryKey: ["customers", { search, page }],
    queryFn: () => customersApi.list({ search, page }),
  });

  const { data: stats } = useQuery({
    queryKey: ["customers-stats"],
    queryFn: () => customersApi.stats(),
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
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const blob = await customersApi.export();
                const url = URL.createObjectURL(new Blob([blob]));
                const a = document.createElement("a");
                a.href = url; a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
                a.click(); URL.revokeObjectURL(url);
              } catch { /* noop */ }
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          {canManage && (
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              + Add Customer
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <UsersIcon className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Customers</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.total ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Active Customers</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.active ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">New This Month</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.new_this_month ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Top Spender</span>
          </div>
          <p className="text-sm font-bold text-foreground truncate">{stats?.top_spender ? stats.top_spender.full_name : "—"}</p>
          <p className="text-xs text-muted-foreground">{stats?.top_spender?.total_spent ? formatCurrency(stats.top_spender.total_spent) : ""}</p>
        </div>
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
                      onClick={() => navigate(`/customers/${c.id}`)}
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
    </div>
  );
}
