import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "@/lib/api";
import { formatCurrency, formatDate, formatRelativeDate, getStatusColor } from "@/lib/utils";
import { Search, ShoppingCart, ChevronLeft, ChevronRight, Eye, Download, Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "canceled", "refunded"];

export default function OrdersPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", { search, status, dateFrom, dateTo, page }],
    queryFn: () => ordersApi.list({ search, status, date_from: dateFrom || undefined, date_to: dateTo || undefined, page }),
  });

  const { data: stats } = useQuery({
    queryKey: ["orders-stats"],
    queryFn: () => ordersApi.stats(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
    onError: (err: any) => toast.error(err?.response?.data?.message || "Status update failed."),
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      ordersApi.bulkUpdateStatus(ids, status),
    onSuccess: (data) => {
      toast.success(data.message);
      if (data.skipped?.length > 0) {
        toast.warning(`${data.skipped.length} order(s) skipped due to invalid transitions.`);
      }
      setSelectedIds([]);
      setBulkStatus("");
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => toast.error("Bulk status update failed."),
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  const allSelected = orders.length > 0 && orders.every((o: any) => selectedIds.includes(o.id));
  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(orders.map((o: any) => o.id));
  };
  const toggleOne = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleExport = async () => {
    try {
      const blob = await ordersApi.export({ search, status, date_from: dateFrom || undefined, date_to: dateTo || undefined });
      const url = URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Orders</h2>
          <p className="text-sm text-muted-foreground">{meta?.total ?? 0} total orders</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.total ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats?.total_revenue ?? 0)}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Avg Order Value</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats?.avg_order_value ?? 0)}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Gift Orders</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.gift_orders ?? 0}</p>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary/5 border border-primary/20">
          <span className="text-sm font-medium text-foreground">{selectedIds.length} selected</span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="px-2 py-1 rounded-lg bg-card border border-border text-xs outline-none text-foreground"
          >
            <option value="">Change Status To...</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          {bulkStatus && (
            <button
              onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: bulkStatus })}
              disabled={bulkStatusMutation.isPending}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Apply
            </button>
          )}
          <button onClick={() => { setSelectedIds([]); setBulkStatus(""); }}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order # or customer..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          <option value="">All Status</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <input
            type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="px-2 py-2 rounded-lg bg-card border border-border text-sm outline-none text-foreground"
          />
          <span className="text-muted-foreground text-xs">to</span>
          <input
            type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="px-2 py-2 rounded-lg bg-card border border-border text-sm outline-none text-foreground"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll}
                    className="rounded border-border accent-primary" />
                </th>
                {["Order #", "Customer", "Items", "Status", "Payment", "Total", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 9 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-6" /></td>)}</tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <ShoppingCart className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No orders found</p>
                  </td>
                </tr>
              ) : orders.map((o: Record<string, unknown>) => (
                <tr key={o.id as number} className="hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(o.id as number)}
                      onChange={() => toggleOne(o.id as number)}
                      className="rounded border-border accent-primary" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-primary">{o.order_number as string}</td>
                  <td className="px-4 py-3 text-foreground">{(o.customer as Record<string, string> | null)?.full_name ?? "Guest"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{(o.items as unknown[])?.length ?? 0} items</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status as string}
                      onChange={(e) => statusMutation.mutate({ id: o.id as number, status: e.target.value })}
                      className={`text-xs rounded-full px-2 py-0.5 border-0 outline-none font-medium cursor-pointer ${getStatusColor(o.status as string)}`}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(o.payment_status as string)}`}>
                      {o.payment_status as string}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(o.total as number)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatRelativeDate(o.created_at as string)}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => navigate(`/orders/${o.id}`)}
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
