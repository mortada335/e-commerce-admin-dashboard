import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import {
  ArrowLeft, Package, Tag, Layers, Star, BarChart3, Box, Calendar,
  Image as ImageIcon, DollarSign, AlertTriangle, CheckCircle2, XCircle,
} from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.get(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-72" />
          <Skeleton className="h-72 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Package className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Product not found</p>
        <button onClick={() => navigate("/products")} className="mt-4 text-primary text-sm hover:underline">← Back to Products</button>
      </div>
    );
  }

  const images = product.images || [];
  const variants = product.variants || [];
  const primaryImage = images.find((img: any) => img.is_primary) || images[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/products")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              {product.name}
              {product.is_featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
            </h2>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
            {product.status}
          </span>
          {product.is_new && (
            <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-400 bg-blue-400/10">New</span>
          )}
          {!product.is_enabled && (
            <span className="px-2 py-1 rounded-full text-xs font-medium text-red-400 bg-red-400/10">Disabled</span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Price</span>
          </div>
          <p className="text-xl font-bold text-foreground">{formatCurrency(product.effective_price)}</p>
          {product.discount_price && (
            <p className="text-xs text-muted-foreground line-through">{formatCurrency(product.price)}</p>
          )}
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Box className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Stock</span>
          </div>
          <p className={cn("text-xl font-bold", product.is_low_stock ? "text-red-400" : "text-foreground")}>
            {product.stock_quantity}
            {product.is_low_stock && <AlertTriangle className="w-4 h-4 inline ml-1" />}
          </p>
          <p className="text-xs text-muted-foreground">Threshold: {product.low_stock_threshold}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Category</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{product.category?.name || "—"}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Weight</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{product.weight ? `${product.weight} kg` : "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Images + Description */}
        <div className="space-y-6">
          {/* Images */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> Images ({images.length})
            </h3>
            {images.length > 0 ? (
              <div className="space-y-3">
                {primaryImage && (
                  <img
                    src={primaryImage.url?.startsWith("http") ? primaryImage.url : `${STORAGE_URL}/${primaryImage.url}`}
                    alt={primaryImage.alt_text || product.name}
                    className="w-full h-48 object-cover rounded-xl bg-muted"
                  />
                )}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(0, 8).map((img: any) => (
                      <img
                        key={img.id}
                        src={img.url?.startsWith("http") ? img.url : `${STORAGE_URL}/${img.url}`}
                        alt={img.alt_text || ""}
                        className={cn("w-full h-16 object-cover rounded-lg bg-muted border-2 transition-colors",
                          img.id === primaryImage?.id ? "border-primary" : "border-transparent"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center bg-muted/30 rounded-xl text-muted-foreground text-sm">
                No images
              </div>
            )}
          </div>

          {/* Pricing Details */}
          {(product.discount_price || product.discount_start_date) && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3">Discount Details</h3>
              <div className="space-y-2 text-sm">
                {product.discount_price && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount Price</span>
                    <span className="text-red-400 font-medium">{formatCurrency(product.discount_price)}</span>
                  </div>
                )}
                {product.discount_start_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="text-foreground text-xs">{formatDate(product.discount_start_date)}</span>
                  </div>
                )}
                {product.discount_expiry_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry Date</span>
                    <span className="text-foreground text-xs">{formatDate(product.discount_expiry_date)}</span>
                  </div>
                )}
                {product.discount_remaining_qty != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining Qty</span>
                    <span className="text-foreground font-medium">{product.discount_remaining_qty}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right — Details + Variants */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3">Description</h3>
            <div className="prose prose-sm text-muted-foreground max-w-none">
              {product.description ? (
                <p className="whitespace-pre-wrap">{product.description}</p>
              ) : (
                <p className="italic">No description provided</p>
              )}
            </div>
            {product.short_description && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Short Description</p>
                <p className="text-sm text-muted-foreground">{product.short_description}</p>
              </div>
            )}
          </div>

          {/* Product Settings */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Product Settings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                {product.is_featured ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
                <span className={product.is_featured ? "text-foreground" : "text-muted-foreground"}>Featured</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {product.is_new ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
                <span className={product.is_new ? "text-foreground" : "text-muted-foreground"}>New</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {product.is_enabled ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
                <span className={product.is_enabled ? "text-foreground" : "text-muted-foreground"}>Enabled</span>
              </div>
              {product.max_cart_quantity && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Max Cart Qty: </span>
                  <span className="text-foreground font-medium">{product.max_cart_quantity}</span>
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="glass rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Variants ({variants.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      {["SKU", "Price", "Stock", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {variants.map((v: any) => (
                      <tr key={v.id} className="hover:bg-accent/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-foreground">{v.sku}</td>
                        <td className="px-4 py-3 text-foreground">{formatCurrency(v.price)}</td>
                        <td className="px-4 py-3 text-foreground">{v.stock_quantity}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.is_active ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
                            {v.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes & Meta */}
          {(product.notes || product.meta) && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3">Additional Info</h3>
              {product.notes && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Notes</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{product.notes}</p>
                </div>
              )}
              {product.meta && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Meta</p>
                  <pre className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 overflow-x-auto">
                    {typeof product.meta === "string" ? product.meta : JSON.stringify(product.meta, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Timestamps */}
          <div className="glass rounded-xl p-5">
            <div className="flex gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(product.created_at)}</span>
              </div>
              {product.updated_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated: {formatDate(product.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
