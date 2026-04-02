import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandsApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { Search, Plus, Edit, Trash2, Tag, ChevronLeft, ChevronRight, X, Upload, Download, Eye, CheckCircle2, XCircle, Package } from "lucide-react";
import { toast } from "sonner";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function BrandsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["brands", { search, isActive, page }],
    queryFn: () => brandsApi.list({ search, is_active: isActive ? isActive === "true" : undefined, page }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => brandsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });

  const brands = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Brands</h2>
          <p className="text-sm text-muted-foreground">{meta?.total ?? 0} total brands</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const blob = await brandsApi.export();
                const url = URL.createObjectURL(new Blob([blob]));
                const a = document.createElement("a");
                a.href = url; a.download = `brands-${new Date().toISOString().split("T")[0]}.csv`;
                a.click(); URL.revokeObjectURL(url);
              } catch { toast.error("Export failed"); }
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => { setEditingBrand(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Brand
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Brands</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{meta?.total ?? brands.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Active</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{brands.filter((b: any) => b.is_active).length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Inactive</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{brands.filter((b: any) => !b.is_active).length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Products</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{brands.reduce((sum: number, b: any) => sum + (b.products_count ?? 0), 0)}</p>
        </div>
      </div>

      {showForm && (
        <BrandForm
          brand={editingBrand}
          onClose={() => { setShowForm(false); setEditingBrand(null); }}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search brands..."
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
                {["Logo", "Name", "Slug", "Products", "Status", "Created", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-6" /></td>
                    ))}
                  </tr>
                ))
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Tag className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No brands found</p>
                  </td>
                </tr>
              ) : (
                brands.map((b: any) => (
                  <tr key={b.id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3">
                      {b.logo_url ? (
                        <img src={b.logo_url} alt={b.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">B</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      <button onClick={() => navigate(`/brands/${b.id}`)} className="text-foreground hover:text-primary transition-colors hover:underline">{b.name}</button>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.products_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", b.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground")}>
                        {b.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(b.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/brands/${b.id}`)}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setEditingBrand(b); setShowForm(true); }}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this brand?")) deleteMutation.mutate(b.id); }}
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

function BrandForm({ brand, onClose }: { brand?: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [isActive, setIsActive] = useState(brand?.is_active ?? true);
  const [logo, setLogo] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: (data: FormData) => brand ? brandsApi.update(brand.id, data) : brandsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    if (slug) fd.append("slug", slug);
    fd.append("is_active", isActive ? "1" : "0");
    if (logo) fd.append("logo", logo);
    mutation.mutate(fd);
  };

  return (
    <div className="glass rounded-xl p-6 border border-border/50 relative">
      <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
        <X className="w-4 h-4" />
      </button>
      <h3 className="text-lg font-bold mb-4">{brand ? "Edit Brand" : "Add Brand"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Slug (Optional)</label>
            <input
              value={slug} onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Logo Image</label>
          <div className="flex items-center gap-3">
            {brand?.logo_url && !logo && <img src={brand.logo_url} alt="Current logo" className="w-12 h-12 rounded object-cover border" />}
            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="text-sm" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm font-medium text-foreground">Active</span>
        </label>
        <button disabled={mutation.isPending} type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {mutation.isPending ? "Saving..." : "Save Brand"}
        </button>
      </form>
    </div>
  );
}
