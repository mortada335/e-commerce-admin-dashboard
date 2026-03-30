import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Search, Package, AlertTriangle, CheckCircle2, Save, Download, History, X } from "lucide-react";
import { toast } from "sonner";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function InventoryPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", { search, page, onlyLowStock }],
    queryFn: () => inventoryApi.list({ search, page }),
  });

  const { data: alerts } = useQuery({
    queryKey: ["inventory-alerts"],
    queryFn: () => inventoryApi.alerts(),
  });

  const { data: stats } = useQuery({
    queryKey: ["inventory-stats"],
    queryFn: () => inventoryApi.stats(),
  });

  const [showHistory, setShowHistory] = useState(false);

  const updateStockMutation = useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: any }) =>
      inventoryApi.updateStock(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory"] });
      qc.invalidateQueries({ queryKey: ["inventory-alerts"] });
      toast.success("Stock updated");
    },
  });

  const inventory = data?.data ?? [];
  const filteredInventory = onlyLowStock ? inventory.filter((i: any) => i.is_low_stock) : inventory;
  const meta = data?.meta;

  const handleExport = async () => {
    try {
      const blob = await inventoryApi.export();
      const url = URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url; a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
      a.click(); URL.revokeObjectURL(url);
    } catch { toast.error("Export failed"); }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Stock Management</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <History className="w-4 h-4" /> Activity Log
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Items</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-foreground">{stats?.total ?? 0}</h4>
            <Package className="w-5 h-5 text-primary opacity-50" />
          </div>
        </div>
        <div className="glass p-4 rounded-xl space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Units</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-foreground">{stats?.total_units?.toLocaleString() ?? 0}</h4>
            <Package className="w-5 h-5 text-blue-400 opacity-50" />
          </div>
        </div>
        <div className="glass p-4 rounded-xl space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Value</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-foreground">{formatCurrency(stats?.total_value ?? 0)}</h4>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-50" />
          </div>
        </div>
        <div className={cn("glass p-4 rounded-xl space-y-1 border-l-4", (stats?.low_stock || 0) > 0 ? "border-l-destructive" : "border-l-emerald-500")}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Low Stock</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-foreground">{stats?.low_stock ?? 0}</h4>
            {(stats?.low_stock || 0) > 0 ? <AlertTriangle className="w-5 h-5 text-destructive" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer bg-card border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
            <input 
              type="checkbox" checked={onlyLowStock} onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="w-4 h-4 rounded border-border bg-transparent text-primary focus:ring-offset-0 focus:ring-primary/30"
            />
            <span className="text-sm font-medium text-foreground">Showing only low stock</span>
          </label>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU or name..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground"
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  {["Product", "SKU", "Category", "Current Stock", "Low Threshold", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-6" /></td>)}</tr>
                  ))
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No inventory records found</p>
                    </td>
                  </tr>
                ) : filteredInventory.map((item: any) => (
                  <InventoryRow key={item.id} item={item} onUpdate={(data) => updateStockMutation.mutate({ productId: item.id, data })} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showHistory && <InventoryHistoryModal onClose={() => setShowHistory(false)} />}
    </div>
  );
}

function InventoryRow({ item, onUpdate }: { item: any; onUpdate: (data: any) => void }) {
  const [stock, setStock] = useState(item.stock_quantity);
  const [threshold, setThreshold] = useState(item.low_stock_threshold);
  const hasChanges = stock !== item.stock_quantity || threshold !== item.low_stock_threshold;

  return (
    <tr className={cn("hover:bg-accent/20 transition-colors", item.is_low_stock && "bg-destructive/5")}>
      <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground uppercase">{item.sku}</td>
      <td className="px-4 py-3 text-muted-foreground">{item.category?.name || "—"}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input 
            type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value) || 0)}
            className={cn(
              "w-20 px-2 py-1 rounded border bg-card text-sm text-center outline-none focus:ring-1 focus:ring-primary/50",
              item.is_low_stock ? "border-destructive/50 text-destructive" : "border-border text-foreground"
            )}
          />
          {item.is_low_stock && <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />}
        </div>
      </td>
      <td className="px-4 py-3">
        <input 
          type="number" value={threshold} onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
          className="w-20 px-2 py-1 rounded border border-border bg-card text-sm text-center outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
        />
      </td>
      <td className="px-4 py-3">
        <button
          disabled={!hasChanges}
          onClick={() => onUpdate({ stock_quantity: stock, low_stock_threshold: threshold })}
          className={cn(
            "p-1.5 rounded-lg transition-all",
            hasChanges ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" : "text-muted-foreground bg-accent/5 opacity-50 grayscale cursor-not-allowed"
          )}
        >
          <Save className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function InventoryHistoryModal({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["inventory-history", page],
    queryFn: () => inventoryApi.history(page),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl glass border border-border/50 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Inventory Activity Log
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Change</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : data?.data?.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No recent activity</td></tr>
                ) : (
                  data?.data?.map((log: any) => (
                    <tr key={log.id} className="hover:bg-accent/20">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(log.created_at)}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{log.product?.name ?? "Unknown"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-muted-foreground">{log.old_quantity}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className={log.new_quantity > log.old_quantity ? "text-emerald-500 font-bold" : log.new_quantity < log.old_quantity ? "text-red-400 font-bold" : "text-foreground"}>
                            {log.new_quantity}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{log.user?.first_name ? `${log.user.first_name} ${log.user.last_name}` : "System"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {data?.meta?.last_page > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded border border-border text-sm hover:bg-accent disabled:opacity-50">Previous</button>
              <span className="text-sm text-muted-foreground">Page {page} of {data.meta.last_page}</span>
              <button disabled={page === data.meta.last_page} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded border border-border text-sm hover:bg-accent disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
