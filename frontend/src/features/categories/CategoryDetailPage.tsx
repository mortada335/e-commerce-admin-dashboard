import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import {
  ArrowLeft, FolderTree, Package, Calendar, Layers, CheckCircle2,
  XCircle, ChevronRight, Hash, SortAsc, Image as ImageIcon,
} from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: category, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => categoriesApi.get(Number(id)),
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

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FolderTree className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Category not found</p>
        <button onClick={() => navigate("/categories")} className="mt-4 text-primary text-sm hover:underline">← Back to Categories</button>
      </div>
    );
  }

  const children = category.children || [];
  const products = category.products || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/categories")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            {category.image_url ? (
              <img src={category.image_url} alt={category.name} className="w-12 h-12 rounded-xl object-cover border border-border" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderTree className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {category.parent && (
                  <>
                    <Link to={`/categories/${category.parent.id}`} className="text-primary hover:underline">
                      {category.parent.name}
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                  </>
                )}
                <span className="font-mono text-xs">{category.slug}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold",
            category.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-400/10 text-red-400"
          )}>
            {category.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Products</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{products.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Subcategories</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{children.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <SortAsc className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Sort Order</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{category.sort_order ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">ID</span>
          </div>
          <p className="text-2xl font-bold text-foreground">#{category.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Description */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-3">Description</h3>
            {category.description ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{category.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No description provided</p>
            )}
          </div>

          {/* Subcategories */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Subcategories ({children.length})
            </h3>
            {children.length > 0 ? (
              <div className="space-y-2">
                {children.map((child: any) => (
                  <Link
                    key={child.id}
                    to={`/categories/${child.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 border border-border/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FolderTree className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{child.name}</p>
                        <p className="text-xs text-muted-foreground">{child.products_count ?? 0} products</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-medium",
                        child.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"
                      )}>
                        {child.is_active ? "Active" : "Inactive"}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic text-center py-4">No subcategories</p>
            )}
          </div>

          {/* Timestamps */}
          <div className="glass rounded-xl p-5">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(category.created_at)}</span>
              </div>
              {category.updated_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated: {formatDate(category.updated_at)}</span>
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
                <Package className="w-4 h-4 text-primary" /> Products in this Category ({products.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    {["", "Name", "SKU", "Price", "Stock", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No products in this category</p>
                      </td>
                    </tr>
                  ) : (
                    products.slice(0, 50).map((p: any) => (
                      <tr
                        key={p.id}
                        className="hover:bg-accent/20 transition-colors cursor-pointer"
                        onClick={() => navigate(`/products/${p.id}`)}
                      >
                        <td className="px-4 py-3 w-12">
                          {p.primary_image_url ? (
                            <img src={p.primary_image_url} alt="" className="w-9 h-9 rounded-lg object-cover border" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-muted-foreground opacity-50" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground hover:text-primary transition-colors">{p.name}</td>
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
