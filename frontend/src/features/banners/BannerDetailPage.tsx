import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { bannersApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import {
  ArrowLeft, Image as ImageIcon, Calendar, ExternalLink, Hash,
  CheckCircle2, XCircle, Link as LinkIcon, MousePointerClick,
  Package, SortAsc, CalendarDays,
} from "lucide-react";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function BannerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: banner, isLoading } = useQuery({
    queryKey: ["banner", id],
    queryFn: () => bannersApi.get(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Banner not found</p>
        <button onClick={() => navigate("/banners")} className="mt-4 text-primary text-sm hover:underline">← Back to Banners</button>
      </div>
    );
  }

  const imageUrl = banner.image_url || (banner.image ? `${STORAGE_URL}/${banner.image}` : null);
  const products = banner.products || [];
  const hasEvent = banner.event_title || banner.event_date;

  // Calculate event days remaining
  const eventDaysRemaining = banner.event_date_end
    ? Math.max(0, Math.ceil((new Date(banner.event_date_end).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/banners")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground">{banner.title}</h2>
            <p className="text-sm text-muted-foreground">Banner #{banner.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5",
            banner.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-400/10 text-red-400"
          )}>
            {banner.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {banner.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Banner Image Preview */}
      {imageUrl && (
        <div className="glass rounded-xl overflow-hidden">
          <img src={imageUrl} alt={banner.title} className="w-full max-h-72 object-cover" />
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">ID</span>
          </div>
          <p className="text-2xl font-bold text-foreground">#{banner.id}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <SortAsc className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Sort Order</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{banner.sort_order ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Linked Products</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{products.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointerClick className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Target</span>
          </div>
          <p className="text-sm font-bold text-foreground">{banner.target === "_blank" ? "New Tab" : "Same Tab"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Banner Configuration */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> Configuration
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Title</span>
                <span className="text-foreground font-medium">{banner.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Status</span>
                <span className={banner.is_active ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
                  {banner.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Sort Order</span>
                <span className="text-foreground">{banner.sort_order ?? 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Target</span>
                <span className="text-foreground">{banner.target || "_self"}</span>
              </div>
              {banner.banner_type && (
                <div className="flex justify-between py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Banner Type</span>
                  <span className="text-foreground capitalize">{banner.banner_type}</span>
                </div>
              )}
            </div>
          </div>

          {/* Link */}
          {banner.link && (
            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary" /> Destination Link
              </h3>
              <a
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline break-all"
              >
                {banner.link}
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </div>
          )}

          {/* Event Info */}
          {hasEvent && (
            <div className="glass rounded-xl p-5 border-l-4 border-l-blue-400">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-400" /> Event Information
              </h3>
              <div className="space-y-2 text-sm">
                {banner.event_title && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event Title</span>
                    <span className="text-foreground font-medium">{banner.event_title}</span>
                  </div>
                )}
                {banner.event_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="text-foreground">{formatDate(banner.event_date)}</span>
                  </div>
                )}
                {banner.event_date_end && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="text-foreground">{formatDate(banner.event_date_end)}</span>
                  </div>
                )}
                {eventDaysRemaining !== null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Remaining</span>
                    <span className={cn("font-medium", eventDaysRemaining <= 3 ? "text-red-400" : "text-foreground")}>
                      {eventDaysRemaining} days
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="glass rounded-xl p-5">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(banner.created_at)}</span>
              </div>
              {banner.updated_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated: {formatDate(banner.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column — Linked Products */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Linked Products ({products.length})
              </h3>
            </div>
            {products.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3 p-4">
                {products.map((p: any) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/products/${p.id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/30 hover:bg-accent/20 cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{p.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0",
                      p.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"
                    )}>
                      {p.status || "active"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No products linked to this banner</p>
                <p className="text-xs text-muted-foreground mt-1">Edit the banner to link products</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
