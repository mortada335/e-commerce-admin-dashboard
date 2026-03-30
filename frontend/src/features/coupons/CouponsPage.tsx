import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "@/lib/api";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Search, Plus, Edit, Trash2, Tag, ChevronLeft, ChevronRight, X, Ticket, CheckCircle2, Clock, DollarSign } from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function CouponsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["coupons", { search, isActive, page }],
    queryFn: () => couponsApi.list({ search, is_active: isActive ? isActive === "true" : undefined, page }),
  });

  const { data: stats } = useQuery({
    queryKey: ["coupons-stats"],
    queryFn: () => couponsApi.stats(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => couponsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });

  const coupons = data?.data ?? [];
  const meta = data?.meta;

  const getDiscountDisplay = (type: string, value: number) => {
    return type === "percentage" ? `${value}%` : formatCurrency(value);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Coupons & Discounts</h2>
          <p className="text-sm text-muted-foreground">{meta?.total ?? 0} total coupons</p>
        </div>
        <button
          onClick={() => { setEditingCoupon(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {showForm && (
        <CouponForm
          coupon={editingCoupon}
          onClose={() => { setShowForm(false); setEditingCoupon(null); }}
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Coupons</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.total ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Active</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.active ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Expired</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.expired ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Discount G.</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(stats?.total_discount_distributed ?? 0)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search coupon codes..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                {["Code", "Discount", "Type", "Usage", "Min Order", "Status", "Expires", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-6" /></td>
                    ))}
                  </tr>
                ))
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Tag className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No coupons found</p>
                  </td>
                </tr>
              ) : (
                coupons.map((c: any) => (
                  <tr key={c.id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground uppercase">{c.code}</td>
                    <td className="px-4 py-3 text-foreground font-semibold">
                      {getDiscountDisplay(c.type, c.value)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                        c.type === "percentage" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                      )}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.used_count} {c.max_uses ? `/ ${c.max_uses}` : "uses"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.min_order_amount ? formatCurrency(parseFloat(c.min_order_amount)) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", c.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground")}>
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{c.expires_at ? formatDate(c.expires_at) : "Never"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditingCoupon(c); setShowForm(true); }}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this coupon?")) deleteMutation.mutate(c.id); }}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Page {meta.current_page} of {meta.last_page}</p>
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

function CouponForm({ coupon, onClose }: { coupon?: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    description: coupon?.description || "",
    type: coupon?.type || "percentage",
    value: coupon?.value || "",
    min_order_amount: coupon?.min_order_amount || "",
    max_discount_amount: coupon?.max_discount_amount || "",
    max_uses: coupon?.max_uses || "",
    max_uses_per_user: coupon?.max_uses_per_user || "",
    starts_at: coupon?.starts_at ? new Date(coupon.starts_at).toISOString().slice(0, 16) : "",
    expires_at: coupon?.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : "",
    is_active: coupon?.is_active ?? true,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => coupon ? couponsApi.update(coupon.id, data) : couponsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["coupons"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="glass rounded-xl p-6 border border-border/50 relative">
      <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
        <X className="w-4 h-4" />
      </button>
      <h3 className="text-lg font-bold mb-4">{coupon ? "Edit Coupon" : "Add Coupon"}</h3>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 max-w-3xl">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Code</label>
          <input
            required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 bg-card border rounded-lg" placeholder="SUMMER2026"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Description</label>
          <input
            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Type</label>
          <select
            value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="space-y-1.5 relative">
          <label className="text-sm font-medium text-foreground">Discount Value</label>
          <input
            required type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="w-full pl-8 pr-3 py-2 bg-card border rounded-lg"
          />
          <span className="absolute left-3 top-8 text-muted-foreground">{formData.type === "percentage" ? "%" : "$"}</span>
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-sm font-medium text-foreground">Min Order Amount</label>
          <input
            type="number" step="0.01" value={formData.min_order_amount} onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
            className="w-full pl-8 pr-3 py-2 bg-card border rounded-lg"
          />
          <span className="absolute left-3 top-8 text-muted-foreground">$</span>
        </div>
        <div className="space-y-1.5 relative">
          <label className="text-sm font-medium text-foreground">Max Discount Amount</label>
          <input
            type="number" step="0.01" value={formData.max_discount_amount} onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
            className="w-full pl-8 pr-3 py-2 bg-card border rounded-lg"
            placeholder="For percentage coupons"
          />
          <span className="absolute left-3 top-8 text-muted-foreground">$</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Max Total Uses</label>
          <input
            type="number" value={formData.max_uses} onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg" placeholder="e.g. 100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Max Uses Per User</label>
          <input
            type="number" value={formData.max_uses_per_user} onChange={(e) => setFormData({ ...formData, max_uses_per_user: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg" placeholder="e.g. 1"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Starts At</label>
          <input
            type="datetime-local" value={formData.starts_at} onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Expires At</label>
          <input
            type="datetime-local" value={formData.expires_at} onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg text-sm"
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-4 border-t border-border/50 pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="rounded text-primary focus:ring-primary" />
            <span className="text-sm font-medium text-foreground">Status: Active</span>
          </label>
          <button disabled={mutation.isPending} type="submit" className="ml-auto px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {mutation.isPending ? "Saving..." : "Save Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
}
