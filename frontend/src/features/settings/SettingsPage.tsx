import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import {
  Save, Store, Globe, Mail, CreditCard, Truck, Shield, Bell, Palette, Search,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const GROUP_CONFIG: Record<string, { icon: React.ElementType; color: string; description: string }> = {
  general:       { icon: Store, color: "text-primary", description: "Basic store configuration and branding" },
  store:         { icon: Store, color: "text-primary", description: "Store name, address, and contact information" },
  localization:  { icon: Globe, color: "text-blue-400", description: "Language, timezone, and currency settings" },
  email:         { icon: Mail, color: "text-emerald-400", description: "Email delivery and notification templates" },
  payment:       { icon: CreditCard, color: "text-purple-400", description: "Payment gateway and processing settings" },
  shipping:      { icon: Truck, color: "text-orange-400", description: "Shipping methods, zones, and rate configuration" },
  security:      { icon: Shield, color: "text-red-400", description: "Authentication, authorization, and security policies" },
  notifications: { icon: Bell, color: "text-yellow-400", description: "Push notifications and alert preferences" },
  appearance:    { icon: Palette, color: "text-pink-400", description: "Theme, layout, and visual customization" },
};

const DEFAULT_GROUP_CONFIG = { icon: Store, color: "text-primary", description: "Configuration settings" };

export default function SettingsPage() {
  const qc = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const { data: settingsGrouped, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get(),
  });

  // Initialize form data when settings load
  useEffect(() => {
    if (settingsGrouped) {
      const initial: Record<string, string> = {};
      Object.values(settingsGrouped).forEach((group: any) => {
        Object.keys(group).forEach((key) => {
          initial[key] = group[key].value;
        });
      });
      setFormData(initial);

      // Set first group as active
      const groups = Object.keys(settingsGrouped);
      if (groups.length > 0 && !activeGroup) {
        setActiveGroup(groups[0]);
      }
    }
  }, [settingsGrouped]);

  const mutation = useMutation({
    mutationFn: (settings: Record<string, string>) => settingsApi.update(settings),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings updated successfully");
    },
    onError: () => toast.error("Failed to update settings"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-muted rounded-lg" />)}
          </div>
          <div className="lg:col-span-3">
            <div className="glass rounded-xl p-6 h-96" />
          </div>
        </div>
      </div>
    );
  }

  const groups = settingsGrouped ? Object.entries(settingsGrouped) : [];

  // Filter settings by search
  const filteredGroups = search
    ? groups.map(([name, keys]: [string, any]) => {
        const filteredKeys = Object.entries(keys).filter(([key, config]: [string, any]) =>
          key.toLowerCase().includes(search.toLowerCase()) ||
          (config.label || "").toLowerCase().includes(search.toLowerCase())
        );
        return filteredKeys.length > 0 ? [name, Object.fromEntries(filteredKeys)] : null;
      }).filter(Boolean) as [string, any][]
    : groups;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Store Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your global store configurations</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {groups.length} groups · {Object.values(settingsGrouped ?? {}).reduce((acc: number, g: any) => acc + Object.keys(g).length, 0)} settings
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search settings..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left — Group Navigation */}
          <div className="space-y-1.5">
            {groups.map(([groupName]) => {
              const config = GROUP_CONFIG[groupName.toLowerCase()] ?? DEFAULT_GROUP_CONFIG;
              const Icon = config.icon;
              const isActive = activeGroup === groupName;
              return (
                <button
                  key={groupName}
                  type="button"
                  onClick={() => setActiveGroup(groupName)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm font-medium",
                    isActive
                      ? "glass border border-primary/30 text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? config.color : "text-muted-foreground")} />
                  <span className="capitalize">{groupName}</span>
                </button>
              );
            })}
          </div>

          {/* Right — Settings Form */}
          <div className="lg:col-span-3 space-y-6">
            {(search ? filteredGroups : groups.filter(([name]) => name === activeGroup)).map(([groupName, keys]: [string, any]) => {
              const config = GROUP_CONFIG[groupName.toLowerCase()] ?? DEFAULT_GROUP_CONFIG;
              const Icon = config.icon;
              return (
                <div key={groupName} className="glass rounded-xl overflow-hidden border border-border/50">
                  <div className="bg-muted/30 px-6 py-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", `bg-${config.color.replace("text-", "")}/10`)}>
                        <Icon className={cn("w-4 h-4", config.color)} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground capitalize">{groupName} Settings</h3>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 grid gap-6 sm:grid-cols-2">
                    {Object.entries(keys).map(([key, config]: [string, any]) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground flex items-center justify-between">
                          {config.label || key}
                          {formData[key] !== config.value && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 font-semibold">Modified</span>
                          )}
                        </label>
                        {config.type === "boolean" ? (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleChange(key, formData[key] === "1" ? "0" : "1")}
                              className={cn(
                                "relative w-11 h-6 rounded-full transition-all duration-200",
                                formData[key] === "1" ? "bg-primary" : "bg-muted"
                              )}
                            >
                              <span className={cn(
                                "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
                                formData[key] === "1" && "translate-x-5"
                              )} />
                            </button>
                            <span className="text-sm text-muted-foreground">{formData[key] === "1" ? "Enabled" : "Disabled"}</span>
                          </div>
                        ) : config.type === "text" || config.type === "textarea" ? (
                          <textarea
                            value={formData[key] || ""}
                            onChange={(e) => handleChange(key, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground resize-none"
                          />
                        ) : (
                          <input
                            type={config.type === "number" ? "number" : "text"}
                            value={formData[key] || ""}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-0 mt-6 py-4 bg-background/80 backdrop-blur-sm border-t border-border/50 -mx-6 px-6 flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
          >
            <Save className="w-4 h-4" />
            {mutation.isPending ? "Saving changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
