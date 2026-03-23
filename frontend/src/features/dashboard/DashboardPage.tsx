import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { formatCurrency, formatDate, formatRelativeDate, getStatusColor } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown, AlertTriangle,
} from "lucide-react";

function StatCard({
  title, value, description, icon: Icon, trend, color = "primary",
}: {
  title: string; value: string; description?: string; icon: React.ElementType;
  trend?: { value: number }; color?: string;
}) {
  const colorMap: Record<string, string> = {
    primary: "text-primary bg-primary/10 border-primary/20",
    success: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    warning: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    danger: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className={`p-2.5 rounded-xl border ${colorMap[color] ?? colorMap.primary}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trend.value >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {trend.value >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {Math.abs(trend.value)}% vs last month
        </div>
      )}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.stats,
    staleTime: 60_000,
  });

  const { data: chart, isLoading: chartLoading } = useQuery({
    queryKey: ["sales-chart", 30],
    queryFn: () => dashboardApi.salesChart(30),
    staleTime: 120_000,
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => dashboardApi.recentOrders(8),
  });

  const { data: topProducts } = useQuery({
    queryKey: ["top-products"],
    queryFn: () => dashboardApi.topProducts(5),
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <StatCard
              title="Total Revenue" icon={DollarSign} color="primary"
              value={formatCurrency(stats?.revenue?.total ?? 0)}
              description={`${formatCurrency(stats?.revenue?.this_month ?? 0)} this month`}
              trend={{ value: stats?.revenue?.growth ?? 0 }}
            />
            <StatCard
              title="Total Orders" icon={ShoppingCart} color="success"
              value={(stats?.orders?.total ?? 0).toLocaleString()}
              description={`${stats?.orders?.pending ?? 0} pending`}
            />
            <StatCard
              title="Customers" icon={Users} color="warning"
              value={(stats?.customers?.total ?? 0).toLocaleString()}
              description={`${stats?.customers?.this_month ?? 0} this month`}
            />
            <StatCard
              title="Low Stock" icon={AlertTriangle}
              color={stats?.inventory?.low_stock_count > 0 ? "danger" : "success"}
              value={(stats?.inventory?.low_stock_count ?? 0).toString()}
              description="products need restocking"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="xl:col-span-2 glass rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Revenue (Last 30 Days)</h2>
          {chartLoading ? (
            <Skeleton className="h-56" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chart ?? []}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(238 84% 70%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(238 84% 70%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontSize: 12 }}
                  formatter={(v: any) => [formatCurrency(v), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(238 84% 70%)" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top products */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Top Products</h2>
          {topProducts ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(v: any) => [v, "Units sold"]}
                />
                <Bar dataKey="total_sold" fill="hsl(238 84% 70%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Skeleton className="h-56" />}
        </div>
      </div>

      {/* Recent orders */}
      <div className="glass rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Order", "Customer", "Status", "Payment", "Total", "Date"].map((h) => (
                  <th key={h} className="pb-2.5 text-left font-medium text-muted-foreground text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentOrders ? recentOrders.map((order: Record<string, unknown>) => (
                <tr key={order.id as number} className="hover:bg-accent/30 transition-colors">
                  <td className="py-3 font-mono text-xs text-primary">{order.order_number as string}</td>
                  <td className="py-3 text-foreground">{(order.customer as Record<string, string> | null)?.full_name ?? "—"}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status as string)}`}>
                      {order.status as string}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.payment_status as string)}`}>
                      {order.payment_status as string}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-foreground">{formatCurrency(order.total as number)}</td>
                  <td className="py-3 text-muted-foreground text-xs">{formatRelativeDate(order.created_at as string)}</td>
                </tr>
              )) : (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-3"><Skeleton className="h-8" /></td></tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
