import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const qc = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});

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
        <div className="glass rounded-xl p-6 h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">Store Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your global store configurations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {settingsGrouped && Object.entries(settingsGrouped).map(([groupName, keys]: [string, any]) => (
          <div key={groupName} className="glass rounded-xl overflow-hidden border border-border/50">
            <div className="bg-muted/30 px-6 py-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground capitalize">{groupName} Settings</h3>
            </div>
            <div className="p-6 grid gap-6 sm:grid-cols-2">
              {Object.entries(keys).map(([key, config]: [string, any]) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{config.label || key}</label>
                  {config.type === "boolean" ? (
                    <select
                      value={formData[key] || "0"}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="1">Enabled</option>
                      <option value="0">Disabled</option>
                    </select>
                  ) : config.type === "text" || config.type === "textarea" ? (
                    <textarea
                      value={formData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ) : (
                    <input
                      type={config.type === "number" ? "number" : "text"}
                      value={formData[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {mutation.isPending ? "Saving changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
