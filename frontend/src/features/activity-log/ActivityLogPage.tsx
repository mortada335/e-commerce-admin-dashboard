import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "@/lib/api";
import { formatRelativeDate, cn } from "@/lib/utils";
import {
  Search, Activity, ChevronLeft, ChevronRight, User, Package, ShoppingCart,
  Settings, Star, Tag, Trash2, Edit, Plus, LogIn, LogOut, Shield, Eye,
  ChevronDown, ChevronUp, Calendar,
} from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  product_created:       { icon: Plus, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  product_updated:       { icon: Edit, color: "text-blue-400", bg: "bg-blue-400/10" },
  product_deleted:       { icon: Trash2, color: "text-red-400", bg: "bg-red-400/10" },
  order_created:         { icon: ShoppingCart, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  order_status_changed:  { icon: ShoppingCart, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  customer_created:      { icon: User, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  customer_updated:      { icon: User, color: "text-blue-400", bg: "bg-blue-400/10" },
  customer_deleted:      { icon: User, color: "text-red-400", bg: "bg-red-400/10" },
  stock_updated:         { icon: Package, color: "text-orange-400", bg: "bg-orange-400/10" },
  settings_updated:      { icon: Settings, color: "text-purple-400", bg: "bg-purple-400/10" },
  logged_in:             { icon: LogIn, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  logged_out:            { icon: LogOut, color: "text-muted-foreground", bg: "bg-muted/30" },
  review_created:        { icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  review_updated:        { icon: Star, color: "text-blue-400", bg: "bg-blue-400/10" },
  brand_created:         { icon: Tag, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  brand_updated:         { icon: Tag, color: "text-blue-400", bg: "bg-blue-400/10" },
  permission_changed:    { icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10" },
};

const DEFAULT_CONFIG = { icon: Activity, color: "text-primary", bg: "bg-primary/10" };

const ACTION_FILTER_OPTIONS = [
  { value: "", label: "All Actions" },
  { value: "product", label: "Products" },
  { value: "order", label: "Orders" },
  { value: "customer", label: "Customers" },
  { value: "stock", label: "Stock" },
  { value: "settings", label: "Settings" },
  { value: "logged", label: "Auth" },
  { value: "review", label: "Reviews" },
];

function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function getModelLabel(modelType: string | null): string {
  if (!modelType) return "";
  return modelType.split("\\").pop() ?? "";
}

function getActionBadge(action: string): { label: string; color: string } {
  if (action.includes("created")) return { label: "Created", color: "bg-emerald-500/10 text-emerald-400" };
  if (action.includes("updated") || action.includes("changed")) return { label: "Updated", color: "bg-blue-500/10 text-blue-400" };
  if (action.includes("deleted")) return { label: "Deleted", color: "bg-red-500/10 text-red-400" };
  if (action.includes("logged_in")) return { label: "Login", color: "bg-emerald-500/10 text-emerald-400" };
  if (action.includes("logged_out")) return { label: "Logout", color: "bg-muted text-muted-foreground" };
  return { label: "Action", color: "bg-primary/10 text-primary" };
}

export default function ActivityLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["activity-logs", { search, action: actionFilter, page }],
    queryFn: () => activityLogApi.list({ search, action: actionFilter || undefined, page }),
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Activity Log</h2>
        <p className="text-sm text-muted-foreground">Track all administrative actions across the system</p>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total Events</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{meta?.total ?? 0}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Creates</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {logs.filter((l: any) => l.action?.includes("created")).length}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Edit className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Updates</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {logs.filter((l: any) => l.action?.includes("updated") || l.action?.includes("changed")).length}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Deletes</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {logs.filter((l: any) => l.action?.includes("deleted")).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by action, user, or entity..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
        >
          {ACTION_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Activity Table — Enhanced */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                {["", "Action", "Type", "User", "Entity", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-6" /></td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Activity className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No activity logs found</p>
                  </td>
                </tr>
              ) : (
                logs.map((log: Record<string, any>) => {
                  const config = ACTION_CONFIG[log.action] ?? DEFAULT_CONFIG;
                  const Icon = config.icon;
                  const badge = getActionBadge(log.action);
                  const isExpanded = expandedId === log.id;

                  return (
                    <tr key={log.id} className="hover:bg-accent/20 transition-colors">
                      <td className="px-4 py-3 w-10">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                          <Icon className={cn("w-4 h-4", config.color)} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{formatAction(log.action)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", badge.color)}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                            {(log.user?.name ?? "S")[0].toUpperCase()}
                          </div>
                          <span className="text-muted-foreground">{log.user?.name ?? "System"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {log.model_type ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                            {getModelLabel(log.model_type)} #{log.model_id}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Calendar className="w-3 h-3" />
                          {formatRelativeDate(log.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {log.properties && Object.keys(log.properties).length > 0 && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : log.id)}
                            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                            title="View Details"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Page {meta.current_page} of {meta.last_page} ({meta.total} total)</p>
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
