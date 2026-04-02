import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import {
  CreditCard, DollarSign, Search, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, XCircle, TrendingUp, Eye, Banknote,
} from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

const PAYMENT_STATUSES = ["paid", "pending", "failed", "refunded", ""];
const PAYMENT_METHODS = ["stripe", "cash", "bank_transfer", "paypal", ""];

export function PaymentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);

  // Leverage orders API with payment focus
  const { data, isLoading } = useQuery({
    queryKey: ["orders-payments", { search, payment_status: paymentStatus || undefined, page }],
    queryFn: () => ordersApi.list({ search, status: undefined, payment_status: paymentStatus || undefined, page }),
  });

  const { data: stats } = useQuery({
    queryKey: ["orders-stats"],
    queryFn: () => ordersApi.stats(),
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  // Compute payment-focused stats from order stats
  const totalRevenue = stats?.total_revenue ?? 0;
  const totalOrders = stats?.total ?? 0;
  const avgOrderValue = stats?.avg_order_value ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Payments</h2>
          <p className="text-sm text-muted-foreground">Transaction tracking and payment management</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Transactions</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Avg Transaction</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(avgOrderValue)}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Banknote className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Pending</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.pending_payments ?? 0}</p>
        </div>
      </div>

      {/* Payment Method Distribution */}
      {stats?.payment_method_summary && (
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Payment Method Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(stats.payment_method_summary).map(([method, count]: [string, any]) => (
              <div key={method} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
                <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground capitalize">{method || "Other"}</p>
                  <p className="text-sm font-bold text-foreground">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order # or customer..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                {["Order #", "Customer", "Payment Status", "Method", "Amount", "Order Status", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-6" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <CreditCard className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No transactions found</p>
                  </td>
                </tr>
              ) : (
                orders.map((o: any) => {
                  const PaymentIcon = 
                    o.payment_status === "paid" ? CheckCircle2 :
                    o.payment_status === "failed" ? XCircle :
                    o.payment_status === "refunded" ? XCircle : Clock;
                  return (
                    <tr key={o.id} className="hover:bg-accent/20 transition-colors">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/orders/${o.id}`)}
                          className="font-mono text-xs text-primary hover:underline"
                        >
                          {o.order_number}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {o.customer?.full_name ?? "Guest"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                          getStatusColor(o.payment_status)
                        )}>
                          <PaymentIcon className="w-3 h-3" />
                          {o.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">
                        <span className="inline-flex items-center gap-1.5">
                          <CreditCard className="w-3 h-3" />
                          {o.payment_method || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(o.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(o.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/orders/${o.id}`)}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                          title="View Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Page {meta.current_page} of {meta.last_page} ({meta.total} transactions)</p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.current_page === 1}
                className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={meta.current_page === meta.last_page}
                className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
