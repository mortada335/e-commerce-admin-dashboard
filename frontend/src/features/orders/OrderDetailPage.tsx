import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import {
  ArrowLeft, ShoppingCart, User, MapPin, CreditCard, Clock, Package,
  Truck, CheckCircle2, XCircle, RotateCcw, Gift, Monitor,
} from "lucide-react";
import { toast } from "sonner";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "canceled", "refunded"];

const STATUS_ICONS: Record<string, typeof Clock> = {
  pending: Clock, processing: Package, shipped: Truck,
  delivered: CheckCircle2, canceled: XCircle, refunded: RotateCcw,
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.get(Number(id)),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, comment }: { status: string; comment?: string }) =>
      ordersApi.updateStatus(Number(id), status, comment),
    onSuccess: () => {
      toast.success("Order status updated.");
      qc.invalidateQueries({ queryKey: ["order", id] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Status update failed."),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingCart className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Order not found</p>
        <button onClick={() => navigate("/orders")} className="mt-4 text-primary text-sm hover:underline">← Back to Orders</button>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[order.status] || Clock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Order {order.order_number}</h2>
            <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
            <StatusIcon className="w-3.5 h-3.5 inline mr-1" />
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <select
            value={order.status}
            onChange={(e) => statusMutation.mutate({ status: e.target.value })}
            disabled={statusMutation.isPending}
            className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs outline-none text-foreground"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Progress */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between">
          {["pending", "processing", "shipped", "delivered"].map((s, i) => {
            const idx = ["pending", "processing", "shipped", "delivered"].indexOf(order.status);
            const isActive = i <= idx;
            const isCanceled = order.status === "canceled" || order.status === "refunded";
            const Icon = STATUS_ICONS[s] || Clock;
            return (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex flex-col items-center ${i > 0 ? "flex-1" : ""}`}>
                  {i > 0 && (
                    <div className={`h-0.5 w-full mb-2 ${isActive && !isCanceled ? "bg-primary" : "bg-border"}`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive && !isCanceled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className={`text-[10px] mt-1 ${isActive && !isCanceled ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Items + Financial */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Order Items ({order.items?.length || 0})
              </h3>
            </div>
            <div className="divide-y divide-border/30">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {item.product_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {item.product_sku || "—"} · Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Financial Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-red-400">
                  <span>Discount</span><span>- {formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              {order.coupon_discount_value > 0 && (
                <div className="flex justify-between text-orange-400">
                  <span>Coupon Discount</span><span>- {formatCurrency(order.coupon_discount_value)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span><span>{formatCurrency(order.tax_amount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span><span>{formatCurrency(order.shipping_amount)}</span>
              </div>
              {order.delivery_costs > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Costs</span><span>{formatCurrency(order.delivery_costs)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-foreground pt-3 border-t border-border/50">
                <span>Grand Total</span><span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          {order.status_history && order.status_history.length > 0 && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Status History
              </h3>
              <div className="space-y-3">
                {order.status_history.map((h: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getStatusColor(h.status).includes("emerald") ? "bg-emerald-400" : getStatusColor(h.status).includes("blue") ? "bg-blue-400" : "bg-muted-foreground"}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                        {h.created_by && <span className="text-muted-foreground font-normal"> by {h.created_by}</span>}
                      </p>
                      {h.comment && <p className="text-xs text-muted-foreground mt-0.5">{h.comment}</p>}
                      <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(h.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Customer, Shipping, Payment, Meta */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Customer
            </h3>
            {order.customer ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-foreground">{order.customer.full_name}</p>
                <p className="text-muted-foreground">{order.customer.email}</p>
                {order.customer.phone && <p className="text-muted-foreground">{order.customer.phone}</p>}
                <button
                  onClick={() => navigate(`/customers/${order.customer.id}`)}
                  className="text-primary text-xs hover:underline mt-2"
                >
                  View Customer Profile →
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Guest checkout</p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Shipping Address
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              {order.shipping?.name && <p className="font-medium text-foreground">{order.shipping.name}</p>}
              <p>{order.shipping?.address}</p>
              {order.shipping?.address_2 && <p>{order.shipping.address_2}</p>}
              <p>{order.shipping?.city}, {order.shipping?.state} {order.shipping?.zip}</p>
              <p>{order.shipping?.country}</p>
              {order.shipping?.phone && <p>{order.shipping.phone}</p>}
            </div>
          </div>

          {/* Payment */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Payment
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.payment_status)}`}>
                  {order.payment_status}
                </span>
              </div>
              {order.payment_method && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="text-foreground capitalize">{order.payment_method}</span>
                </div>
              )}
              {order.payment?.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction</span>
                  <span className="text-foreground font-mono text-xs">{order.payment.transaction_id}</span>
                </div>
              )}
              {order.payment?.paid_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid At</span>
                  <span className="text-foreground text-xs">{formatDate(order.payment.paid_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" /> Details
            </h3>
            <div className="space-y-2 text-sm">
              {order.device_type && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device</span>
                  <span className="text-foreground capitalize">{order.device_type}</span>
                </div>
              )}
              {order.is_gift && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gift Order</span>
                  <span className="text-foreground flex items-center gap-1"><Gift className="w-3.5 h-3.5 text-pink-400" /> Yes</span>
                </div>
              )}
              {order.gift_comment && (
                <div>
                  <span className="text-muted-foreground text-xs">Gift Message</span>
                  <p className="text-foreground mt-0.5 text-xs bg-muted/30 rounded-lg p-2 italic">{order.gift_comment}</p>
                </div>
              )}
              {order.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking</span>
                  <span className="text-foreground font-mono text-xs">{order.tracking_number}</span>
                </div>
              )}
              {order.notes && (
                <div>
                  <span className="text-muted-foreground text-xs">Notes</span>
                  <p className="text-foreground mt-0.5 text-xs">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
