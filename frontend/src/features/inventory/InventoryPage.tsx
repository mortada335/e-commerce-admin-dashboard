import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api";
import { AlertTriangle, Package } from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function InventoryPage() {
  const { data: alerts } = useQuery({ queryKey: ["inventory-alerts"], queryFn: inventoryApi.alerts });
  const { data: inventory, isLoading } = useQuery({ queryKey: ["inventory"], queryFn: () => inventoryApi.list({}) });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Inventory</h2>
        <p className="text-sm text-muted-foreground">Stock level management</p>
      </div>

      {alerts && alerts.count > 0 && (
        <div className="glass rounded-xl p-4 border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">{alerts.count} Low Stock Alerts</span>
          </div>
          <div className="space-y-2">
            {alerts.products.map((p: Record<string, unknown>) => (
              <div key={p.id as number} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{p.name as string} <span className="text-muted-foreground font-mono text-xs">({p.sku as string})</span></span>
                <span className="text-red-400 font-medium">{p.stock_quantity as number} left (threshold: {p.low_stock_threshold as number})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              {["Product", "SKU", "Stock", "Threshold", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-6" /></td>)}</tr>
            )) : (inventory?.data ?? []).map((p: Record<string, unknown>) => {
              const isLow = (p.stock_quantity as number) <= (p.low_stock_threshold as number);
              return (
                <tr key={p.id as number} className="hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{p.name as string}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku as string}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: isLow ? "rgb(248 113 113)" : "inherit" }}>{p.stock_quantity as number}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.low_stock_threshold as number}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isLow ? "text-red-400 bg-red-400/10" : "text-emerald-400 bg-emerald-400/10"}`}>
                      {isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
