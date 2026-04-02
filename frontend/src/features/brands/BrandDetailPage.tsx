import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { brandsApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import {
  ArrowLeft, Tag, Package, Calendar, CheckCircle2, XCircle,
  Hash, Image as ImageIcon, ExternalLink,
} from "lucide-react";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function BrandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: brand, isLoading } = useQuery({
    queryKey: ["brand", id],
    queryFn: () => brandsApi.get(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Tag className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Brand not found</p>
        <button onClick={() => navigate("/brands")} className="mt-4 text-primary text-sm hover:underline">← Back to Brands</button>
      </div>
    );
  }

  const products = brand.products || [];
  const logoUrl = brand.logo_url || (brand.logo ? `${STORAGE_URL}/${brand.logo}` : null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/brands")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img src={logoUrl} alt={brand.name} className="w-14 h-14 rounded-xl object-cover border border-border shadow-sm" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-border/50">
                <Tag className="w-7 h-7 text-primary" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-foreground">{brand.name}</h2>
              <p className="text-sm text-muted-foreground font-mono">{brand.slug}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5",
            brand.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-400/10 text-red-400"
          )}>
            {brand.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {brand.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Products</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{brand.products_count ?? products.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Active Products</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {products.filter((p: any) => p.status === "active" || p.is_enabled).length}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Brand ID</span>
          </div>
          <p className="text-2xl font-bold text-foreground">#{brand.id}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Created</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{formatDate(brand.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Brand Info */}
        <div className="space-y-6">
          {/* Logo Preview */}
          {logoUrl && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" /> Brand Logo
              </h3>
              <div className="aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden bg-muted/30 border border-border/50">
                <img src={logoUrl} alt={brand.name} className="w-full h-full object-contain p-4" />
              </div>
            </div>
          )}

          {/* Brand Details */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Brand Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug</span>
                <span className="text-foreground font-mono text-xs">{brand.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={brand.is_active ? "text-emerald-400" : "text-red-400"}>{brand.is_active ? "Active" : "Inactive"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sort Order</span>
                <span className="text-foreground">{brand.sort_order ?? 0}</span>
              </div>
              {brand.noindex !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SEO Indexed</span>
                  <span className="text-foreground">{brand.noindex ? "No" : "Yes"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="glass rounded-xl p-5">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(brand.created_at)}</span>
              </div>
              {brand.updated_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated: {formatDate(brand.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column — Products */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Products by {brand.name} ({brand.products_count ?? products.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    {["Name", "SKU", "Price", "Stock", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No products for this brand</p>
                      </td>
                    </tr>
                  ) : (
                    products.slice(0, 50).map((p: any) => (
                      <tr
                        key={p.id}
                        className="hover:bg-accent/20 transition-colors cursor-pointer"
                        onClick={() => navigate(`/products/${p.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground hover:text-primary transition-colors">{p.name}</span>
                            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground uppercase">{p.sku}</td>
                        <td className="px-4 py-3 text-foreground">${parseFloat(p.price).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={cn("font-medium", p.stock_quantity <= (p.low_stock_threshold || 5) ? "text-red-400" : "text-foreground")}>
                            {p.stock_quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            p.status === "active" ? "bg-emerald-500/10 text-emerald-400" :
                            p.status === "draft" ? "bg-yellow-500/10 text-yellow-500" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {products.length > 50 && (
              <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground text-center">
                Showing 50 of {products.length} products
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
