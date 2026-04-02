import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import {
  ArrowLeft, Star, User, Package, Calendar, CheckCircle2,
  XCircle, MessageSquare, ThumbsUp, Trash2,
} from "lucide-react";
import { toast } from "sonner";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: review, isLoading } = useQuery({
    queryKey: ["review", id],
    queryFn: () => reviewsApi.get(Number(id)),
    enabled: !!id,
  });

  const toggleMutation = useMutation({
    mutationFn: () => reviewsApi.toggleApproval(Number(id)),
    onSuccess: () => {
      toast.success("Review status updated");
      qc.invalidateQueries({ queryKey: ["review", id] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => reviewsApi.delete(Number(id)),
    onSuccess: () => {
      toast.success("Review deleted");
      navigate("/reviews");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Star className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Review not found</p>
        <button onClick={() => navigate("/reviews")} className="mt-4 text-primary text-sm hover:underline">← Back to Reviews</button>
      </div>
    );
  }

  const renderStars = (rating: number, size = "w-5 h-5") => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn(size, i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted opacity-30")} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/reviews")}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
              Review #{review.id}
              {renderStars(review.rating)}
            </h2>
            <p className="text-sm text-muted-foreground">
              For {review.product?.name ?? "Unknown Product"} · {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5",
            review.is_approved ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-500"
          )}>
            {review.is_approved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {review.is_approved ? "Approved" : "Pending"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Rating Card */}
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-400/10 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-yellow-400">{review.rating}</span>
            </div>
            {renderStars(review.rating, "w-6 h-6")}
            <p className="text-sm text-muted-foreground mt-2">
              {review.rating === 5 ? "Excellent" :
               review.rating === 4 ? "Very Good" :
               review.rating === 3 ? "Average" :
               review.rating === 2 ? "Poor" : "Very Poor"}
            </p>
          </div>

          {/* Customer Card */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Reviewer
            </h3>
            {review.customer ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {review.customer.first_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {review.customer.first_name} {review.customer.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{review.customer.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/customers/${review.customer.id}`)}
                  className="w-full text-center text-primary text-xs py-2 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  View Customer Profile →
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Customer information unavailable</p>
            )}
          </div>

          {/* Product Card */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> Product
            </h3>
            {review.product ? (
              <div className="space-y-3">
                <p className="font-medium text-foreground">{review.product.name}</p>
                {review.product.sku && (
                  <p className="text-xs text-muted-foreground font-mono">SKU: {review.product.sku}</p>
                )}
                <button
                  onClick={() => navigate(`/products/${review.product.id}`)}
                  className="w-full text-center text-primary text-xs py-2 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  View Product Details →
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Product information unavailable</p>
            )}
          </div>

          {/* Timestamps */}
          <div className="glass rounded-xl p-5">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {formatDate(review.created_at)}</span>
              </div>
              {review.updated_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated: {formatDate(review.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column — Review Content & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Content */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Review Content
            </h3>
            <div className="flex items-center gap-3 mb-4">
              {renderStars(review.rating, "w-5 h-5")}
              <span className="text-sm text-muted-foreground">({review.rating} out of 5)</span>
            </div>
            {review.comment ? (
              <div className="bg-muted/20 rounded-xl p-5 border border-border/30">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{review.comment}</p>
              </div>
            ) : (
              <div className="bg-muted/20 rounded-xl p-5 border border-border/30 text-center">
                <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground mb-2 opacity-50" />
                <p className="text-muted-foreground italic">No written comment provided</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { if (confirm("Toggle approval status for this review?")) toggleMutation.mutate(); }}
                disabled={toggleMutation.isPending}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50",
                  review.is_approved
                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                )}
              >
                {review.is_approved ? (
                  <><XCircle className="w-4 h-4" /> Revoke Approval</>
                ) : (
                  <><ThumbsUp className="w-4 h-4" /> Approve Review</>
                )}
              </button>
              <button
                onClick={() => { if (confirm("Are you sure you want to delete this review? This action cannot be undone.")) deleteMutation.mutate(); }}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> Delete Review
              </button>
            </div>
          </div>

          {/* Review Summary */}
          <div className="glass rounded-xl p-5 border-l-4 border-l-yellow-400">
            <h3 className="font-semibold text-foreground mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">
                {review.customer ? `${review.customer.first_name} ${review.customer.last_name}` : "A customer"}
              </span>
              {" "}rated{" "}
              <span className="text-foreground font-medium">{review.product?.name ?? "a product"}</span>
              {" "}with{" "}
              <span className="text-yellow-400 font-bold">{review.rating}/5 stars</span>
              {" "}on {formatDate(review.created_at)}.
              {" "}This review is currently{" "}
              <span className={cn("font-semibold", review.is_approved ? "text-emerald-400" : "text-yellow-500")}>
                {review.is_approved ? "approved" : "pending approval"}
              </span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
