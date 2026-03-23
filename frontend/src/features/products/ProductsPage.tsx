import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, categoriesApi } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import { Search, Plus, Edit, Trash2, Package, Filter, ChevronLeft, ChevronRight } from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function ProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["products", { search, status, categoryId, page }],
    queryFn: () => productsApi.list({ search, status, category_id: categoryId ? Number(categoryId) : undefined, page }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories-list"],
    queryFn: () => categoriesApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground">{meta?.total ?? 0} total products</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          <option value="">All Categories</option>
          {(categories?.data ?? []).map((c: { id: number; name: string }) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                {["Product", "SKU", "Category", "Price", "Stock", "Status", "Created", "Actions"].map((h) => (
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No products found</p>
                  </td>
                </tr>
              ) : (
                products.map((p: Record<string, unknown>) => (
                  <tr key={p.id as number} className="hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{p.name as string}</p>
                        {Boolean(p.is_featured) && <span className="text-xs text-yellow-400">★ Featured</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku as string}</td>
                    <td className="px-4 py-3 text-muted-foreground">{(p.category as Record<string, string> | null)?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-foreground">{formatCurrency(p.effective_price as number)}</span>
                        {Boolean(p.discount_price) && (
                          <span className="text-xs text-muted-foreground line-through ml-1">{formatCurrency(p.price as number)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("font-medium", (p.is_low_stock as boolean) ? "text-red-400" : "text-foreground")}>
                        {p.stock_quantity as number}
                        {(p.is_low_stock as boolean) && <span className="ml-1 text-xs">⚠</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(p.status as string)}`}>
                        {p.status as string}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(p.created_at as string)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(p.id as number); }}
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
