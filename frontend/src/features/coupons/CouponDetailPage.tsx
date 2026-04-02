import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { couponsApi } from "@/lib/api";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  ArrowLeft, Ticket, Calendar, DollarSign, Hash, Users, ShoppingCart,
  CheckCircle2, XCircle, Clock, TrendingUp, Percent, Banknote,
  AlertTriangle, Infinity,
} from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function CouponDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: coupon, isLoading } = useQuery({
    queryKey: ["coupon", id],
    queryFn: () => couponsApi.get(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Ticket className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Coupon not found</p>
        <button onClick={() => navigate("/coupons")} className="mt-4 text-primary text-sm hover:underline">← Back to Coupons</button>
      </div>
    );
  }

  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
  const isNotStarted = coupon.starts_at && new Date(coupon.starts_at) > new Date();
  const usagePercent = coupon.max_uses ? Math.min(100, Math.round((coupon.used_count / coupon.max_uses) * 100)) : null;
  const remainingUses = coupon.max_uses ? Math.max(0, coupon.max_uses - coupon.used_count) : null;

  // Compute validity timeline
  const getValidityStatus = () => {
    if (!coupon.is_active) return { label: "Inactive", color: "text-red-400", bg: "bg-red-400/10" };
    if (isExpired) return { label: "Expired", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    if (isNotStarted) return { label: "Scheduled", color: "text-blue-400", bg: "bg-blue-400/10" };
    if (usagePercent !== null && usagePercent >= 100) return { label: "Fully Used", color: "text-orange-400", bg: "bg-orange-400/10" };
    return { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10" };
  };

  const validityStatus = getValidityStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/coupons")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground tracking-wide font-mono">{coupon.code}</h2>
              <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold capitalize", coupon.type === "percentage" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400")}>
                {coupon.type === "percentage" ? <Percent className="w-3 h-3 inline mr-1" /> : <Banknote className="w-3 h-3 inline mr-1" />}
                {coupon.type}
              </span>
            </div>
            {coupon.description && (
              <p className="text-sm text-muted-foreground mt-0.5">{coupon.description}</p>
            )}
          </div>
        </div>
        <span className={cn("px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5", validityStatus.bg, validityStatus.color)}>
          {validityStatus.label === "Active" ? <CheckCircle2 className="w-3.5 h-3.5" /> :
           validityStatus.label === "Expired" ? <Clock className="w-3.5 h-3.5" /> :
           validityStatus.label === "Inactive" ? <XCircle className="w-3.5 h-3.5" /> :
           <AlertTriangle className="w-3.5 h-3.5" />}
          {validityStatus.label}
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Discount Value</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {coupon.type === "percentage" ? `${coupon.value}%` : formatCurrency(coupon.value)}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Orders</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{coupon.orders_count ?? coupon.used_count ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Savings</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(coupon.total_discount_given ?? 0)}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Uses Left</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {remainingUses !== null ? remainingUses : <Infinity className="w-6 h-6 inline" />}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Usage Progress */}
          {usagePercent !== null && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Usage Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used</span>
                  <span className="text-foreground font-medium">{coupon.used_count} / {coupon.max_uses}</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      usagePercent >= 90 ? "bg-red-400" :
                      usagePercent >= 70 ? "bg-yellow-400" :
                      "bg-primary"
                    )}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">{usagePercent}% used</p>
              </div>
            </div>
          )}

          {/* Validity Period */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Validity Period
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Starts At</span>
                <span className="text-foreground">{coupon.starts_at ? formatDate(coupon.starts_at) : "Immediately"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires At</span>
                <span className={cn("font-medium", isExpired ? "text-red-400" : "text-foreground")}>
                  {coupon.expires_at ? formatDate(coupon.expires_at) : "Never"}
                </span>
              </div>
              {coupon.expires_at && !isExpired && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days Left</span>
                  <span className="text-foreground font-medium">
                    {Math.max(0, Math.ceil((new Date(coupon.expires_at).getTime() - Date.now()) / 86400000))} days
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="glass rounded-xl p-5">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(coupon.created_at)}</span>
              </div>
              {coupon.updated_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated: {formatDate(coupon.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column — Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Configuration Card */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary" /> Coupon Configuration
            </h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Coupon Code</p>
                  <p className="text-lg font-bold font-mono text-foreground bg-muted/30 rounded-lg px-4 py-2 inline-block tracking-wider">{coupon.code}</p>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Discount Type</span>
                  <span className="text-sm text-foreground font-medium capitalize">{coupon.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Discount Value</span>
                  <span className="text-sm text-foreground font-bold">
                    {coupon.type === "percentage" ? `${coupon.value}%` : formatCurrency(coupon.value)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={cn("text-sm font-medium", coupon.is_active ? "text-emerald-400" : "text-red-400")}>
                    {coupon.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Min Order Amount</span>
                  <span className="text-sm text-foreground font-medium">
                    {coupon.min_order_amount ? formatCurrency(parseFloat(coupon.min_order_amount)) : "No minimum"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Max Discount</span>
                  <span className="text-sm text-foreground font-medium">
                    {coupon.max_discount_amount ? formatCurrency(parseFloat(coupon.max_discount_amount)) : "Unlimited"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Max Total Uses</span>
                  <span className="text-sm text-foreground font-medium">{coupon.max_uses ?? "Unlimited"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Max Uses Per User</span>
                  <span className="text-sm text-foreground font-medium">{coupon.max_uses_per_user ?? "Unlimited"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Times Used</span>
                  <span className="text-sm text-foreground font-bold">{coupon.used_count ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {coupon.description && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{coupon.description}</p>
            </div>
          )}

          {/* Quick Summary */}
          <div className="glass rounded-xl p-5 border-l-4 border-l-primary">
            <h3 className="font-semibold text-foreground mb-2">Quick Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This coupon provides a <span className="text-foreground font-semibold">{coupon.type === "percentage" ? `${coupon.value}% off` : `${formatCurrency(coupon.value)} off`}</span>
              {coupon.min_order_amount ? <> on orders of <span className="text-foreground font-semibold">{formatCurrency(parseFloat(coupon.min_order_amount))}+</span></> : ""}
              {coupon.max_discount_amount ? <>, capped at <span className="text-foreground font-semibold">{formatCurrency(parseFloat(coupon.max_discount_amount))}</span></> : ""}.
              {" "}It has been used <span className="text-foreground font-semibold">{coupon.used_count ?? 0} times</span>
              {coupon.max_uses ? <> out of a maximum of <span className="text-foreground font-semibold">{coupon.max_uses}</span></> : ""}
              {coupon.total_discount_given ? <>, saving customers a total of <span className="text-emerald-400 font-semibold">{formatCurrency(coupon.total_discount_given)}</span></> : ""}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
