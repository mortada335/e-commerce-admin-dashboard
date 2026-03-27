import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";
import { formatCurrency, formatDate, formatRelativeDate, getStatusColor } from "@/lib/utils";
import { Search, ShoppingCart, ChevronLeft, ChevronRight, Eye, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "canceled", "refunded"];

export default function OrdersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", { search, status, dateFrom, dateTo, page }],
    queryFn: () => ordersApi.list({ search, status, date_from: dateFrom || undefined, date_to: dateTo || undefined, page }),
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
                      onClick={() => setViewingOrder(o)}
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

      {/* Order Detail Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-border/50 p-6 relative">
            <button onClick={() => setViewingOrder(null)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Order {viewingOrder.order_number}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(viewingOrder.created_at)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-border/50">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Customer Info</p>
                <p className="font-medium">{viewingOrder.customer?.full_name}</p>
                <p className="text-sm text-muted-foreground">{viewingOrder.customer?.email}</p>
                <p className="text-sm text-muted-foreground">{viewingOrder.customer?.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Shipping Address</p>
                <p className="text-sm text-muted-foreground">{viewingOrder.shipping?.address}</p>
                <p className="text-sm text-muted-foreground">{viewingOrder.shipping?.city}, {viewingOrder.shipping?.state} {viewingOrder.shipping?.zip}</p>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Order Items</p>
            <div className="space-y-4 mb-8">
              {viewingOrder.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                      {item.product_name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-border/50 pt-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <p>Subtotal</p>
                <p>{formatCurrency(viewingOrder.subtotal)}</p>
              </div>
              {viewingOrder.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-red-400">
                  <p>Discount</p>
                  <p>- {formatCurrency(viewingOrder.discount_amount)}</p>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <p>Tax</p>
                <p>{formatCurrency(viewingOrder.tax_amount)}</p>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-2">
                <p>Grand Total</p>
                <p>{formatCurrency(viewingOrder.total)}</p>
              </div>
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
