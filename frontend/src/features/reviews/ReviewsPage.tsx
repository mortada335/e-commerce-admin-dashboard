import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { Search, Edit, Trash2, Star, ChevronLeft, ChevronRight, CheckCircle, XCircle, MessageSquare, Clock, TrendingUp } from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function ReviewsPage() {
  const qc = useQueryClient();
  const [isApproved, setIsApproved] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", { isApproved, page }],
    queryFn: () => reviewsApi.list({ is_approved: isApproved ? isApproved === "true" : undefined, page }),
  });

  const { data: stats } = useQuery({
    queryKey: ["reviews-stats"],
    queryFn: () => reviewsApi.stats(),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => reviewsApi.toggleApproval(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => reviewsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });

  const reviews = data?.data ?? [];
  const meta = data?.meta;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn("w-3.5 h-3.5", i < rating ? "fill-current" : "text-muted opacity-30")} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Customer Reviews</h2>
          <p className="text-sm text-muted-foreground">{meta?.total ?? 0} total reviews</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Reviews</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.total ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Pending Approval</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats?.pending ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Average Rating</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-foreground">{stats?.avg_rating ? Number(stats.avg_rating).toFixed(1) : "0.0"}</p>
            {stats?.avg_rating && renderStars(Math.round(Number(stats.avg_rating)))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={isApproved} onChange={(e) => { setIsApproved(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          <option value="">All Status</option>
          <option value="true">Approved</option>
          <option value="false">Pending Validation</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                {["Product", "Customer", "Rating", "Comment", "Status", "Date", "Actions"].map((h) => (
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
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Star className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No reviews found</p>
                  </td>
                </tr>
              ) : (
                reviews.map((r: any) => (
                  <tr key={r.id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {r.product?.name ?? "Unknown Product"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.customer ? `${r.customer.first_name} ${r.customer.last_name}` : "Unknown"}
                    </td>
                    <td className="px-4 py-3">
                      {renderStars(r.rating)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                      {r.comment || <span className="italic opacity-50">No comment</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1",
                        r.is_approved ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {r.is_approved ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {r.is_approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          title={r.is_approved ? "Revoke Approval" : "Approve Review"}
                          onClick={() => { if (confirm("Toggle approval status?")) toggleMutation.mutate(r.id); }}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {r.is_approved ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          title="Delete Review"
                          onClick={() => { if (confirm("Delete this review?")) deleteMutation.mutate(r.id); }}
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
