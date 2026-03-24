import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Search, Package, AlertTriangle, CheckCircle2, Save, ArrowRight } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Items</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-foreground">{meta?.total ?? 0}</h4>
            <Package className="w-5 h-5 text-primary opacity-50" />
          </div>
        </div>
        <div className={cn("glass p-4 rounded-xl space-y-1 border-l-4", (alerts?.length || 0) > 0 ? "border-l-destructive" : "border-l-emerald-500")}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Low Stock Alerts</p>
          <div className="flex items-end justify-between">
            <h4 className="text-2xl font-bold text-foreground">{alerts?.length || 0}</h4>
            {(alerts?.length || 0) > 0 ? <AlertTriangle className="w-5 h-5 text-destructive" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Stock Management</h2>
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
