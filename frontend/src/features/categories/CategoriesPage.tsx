import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { Search, Plus, Edit, Trash2, FolderTree, Image as ImageIcon, X, Download, Eye, Layers, CheckCircle2, Package } from "lucide-react";
import { toast } from "sonner";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function CategoriesPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories", search],
    queryFn: () => categoriesApi.list(search),
  });

  const { data: treeData } = useQuery({
    queryKey: ["categories-tree"],
    queryFn: () => categoriesApi.tree(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["categories-tree"] });
    },
  });

  const categories = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Categories</h2>
          <p className="text-sm text-muted-foreground">{categories.length} total categories</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const blob = await categoriesApi.export();
                const url = URL.createObjectURL(new Blob([blob]));
                const a = document.createElement("a");
                a.href = url; a.download = `categories-${new Date().toISOString().split("T")[0]}.csv`;
                a.click(); URL.revokeObjectURL(url);
              } catch { toast.error("Export failed"); }
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => { setEditingCategory(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FolderTree className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{categories.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Active</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{categories.filter((c: any) => c.is_active).length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Root Level</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{categories.filter((c: any) => !c.parent_id).length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Products</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{categories.reduce((sum: number, c: any) => sum + (c.products_count ?? 0), 0)}</p>
        </div>
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          treeData={treeData}
          onClose={() => { setShowForm(false); setEditingCategory(null); }}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                {["Image", "Name", "Slug", "Parent", "Products", "Status", "Actions"].map((h) => (
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
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <FolderTree className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No categories found</p>
                  </td>
                </tr>
              ) : (
                categories.map((c: any) => (
                  <tr key={c.id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3">
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.name} className="w-10 h-10 rounded object-cover border" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium"><ImageIcon className="w-4 h-4 opacity-50" /></div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      <button onClick={() => navigate(`/categories/${c.id}`)} className="text-foreground hover:text-primary transition-colors hover:underline">{c.name}</button>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.parent?.name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.products_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", c.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground")}>
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/categories/${c.id}`)}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setEditingCategory(c); setShowForm(true); }}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this category?")) deleteMutation.mutate(c.id); }}
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
      </div>
    </div>
  );
}

function CategoryForm({ category, treeData, onClose }: { category?: any; treeData?: any[]; onClose: () => void }) {
  const qc = useQueryClient();
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    parent_id: category?.parent_id || "",
    description: category?.description || "",
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active ?? true,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => category ? categoriesApi.update(category.id, data) : categoriesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["categories-tree"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // Flatten tree for dropdown
  const flattenTree = (nodes: any[], prefix = ""): any[] => {
    return nodes.reduce((acc, node) => {
      // Don't allow selecting self as parent
      if (category && node.id === category.id) return acc;
      acc.push({ id: node.id, name: `${prefix}${node.name}` });
      if (node.children?.length) {
        acc.push(...flattenTree(node.children, prefix + "— "));
      }
      return acc;
    }, [] as any[]);
  };

  const parentOptions = treeData ? flattenTree(treeData) : [];

  return (
    <div className="glass rounded-xl p-6 border border-border/50 relative">
      <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
        <X className="w-4 h-4" />
      </button>
      <h3 className="text-lg font-bold mb-4">{category ? "Edit Category" : "Add Category"}</h3>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Name</label>
          <input
            required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Slug (Optional)</label>
          <input
            value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg"
          />
        </div>
        
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium text-foreground">Description</label>
          <textarea
            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg" rows={2}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Parent Category</label>
          <select
            value={formData.parent_id} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            className="w-full px-3 py-2 bg-card border rounded-lg"
          >
            <option value="">None (Top Level)</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Sort Order</label>
          <input
            type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-card border rounded-lg"
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-4 border-t border-border/50 pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="rounded text-primary focus:ring-primary" />
            <span className="text-sm font-medium text-foreground">Status: Active</span>
          </label>
          <button disabled={mutation.isPending} type="submit" className="ml-auto px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {mutation.isPending ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
