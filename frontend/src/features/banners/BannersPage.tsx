import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bannersApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { Search, Plus, Edit, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function BannersPage() {
  const qc = useQueryClient();
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["banners", { isActive, page }],
    queryFn: () => bannersApi.list({ is_active: isActive ? isActive === "true" : undefined, page }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => bannersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });

  const banners = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Banners</h2>
          <p className="text-sm text-muted-foreground">{meta?.total ?? 0} active banners</p>
        </div>
        <button
          onClick={() => { setEditingBanner(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {showForm && (
        <BannerForm
          banner={editingBanner}
          onClose={() => { setShowForm(false); setEditingBanner(null); }}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
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
                {["Image", "Title", "Link", "Sort Order", "Status", "Created", "Actions"].map((h) => (
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
              ) : banners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No banners found</p>
                  </td>
                </tr>
              ) : (
                banners.map((b: any) => (
                  <tr key={b.id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3">
                      {b.image_url ? (
                        <img src={b.image_url} alt={b.title} className="w-24 h-12 rounded object-cover border" />
                      ) : (
                        <div className="w-24 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">B</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{b.title}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.link || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.sort_order}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", b.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground")}>
                        {b.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(b.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditingBanner(b); setShowForm(true); }}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this banner?")) deleteMutation.mutate(b.id); }}
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

function BannerForm({ banner, onClose }: { banner?: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(banner?.title || "");
  const [link, setLink] = useState(banner?.link || "");
  const [target, setTarget] = useState(banner?.target || "_self");
  const [sortOrder, setSortOrder] = useState<number>(banner?.sort_order || 0);
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);
  const [image, setImage] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: (data: FormData) => banner ? bannersApi.update(banner.id, data) : bannersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banners"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner && !image) return alert("Please select an image.");

    const fd = new FormData();
    fd.append("title", title);
    if (link) fd.append("link", link);
    fd.append("target", target);
    fd.append("sort_order", sortOrder.toString());
    fd.append("is_active", isActive ? "1" : "0");
    if (image) fd.append("image", image);

    mutation.mutate(fd);
  };

  return (
    <div className="glass rounded-xl p-6 border border-border/50 relative">
      <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
        <X className="w-4 h-4" />
      </button>
      <h3 className="text-lg font-bold mb-4">{banner ? "Edit Banner" : "Add Banner"}</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Title</label>
            <input
              required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Link (Optional)</label>
            <input
              value={link} onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Target</label>
            <select
              value={target} onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="_self">Same Tab (_self)</option>
              <option value="_blank">New Tab (_blank)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Sort Order</label>
            <input
              type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Banner Image</label>
          <div className="flex items-center gap-3">
            {banner?.image_url && !image && <img src={banner.image_url} alt="Current banner" className="w-24 h-12 rounded object-cover border" />}
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-sm" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm font-medium text-foreground">Active</span>
        </label>
        <button disabled={mutation.isPending} type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
          {mutation.isPending ? "Saving..." : "Save Banner"}
        </button>
      </form>
    </div>
  );
}
