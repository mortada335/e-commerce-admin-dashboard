import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Store, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const res = await authApi.login(data);
      login(res.user, res.token);
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string }} })?.response?.data?.message;
      setError(msg ?? "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 mb-4">
            <Store className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">EcomAdmin</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your admin dashboard</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@example.com"
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg bg-background border text-sm outline-none transition-colors",
                  "placeholder:text-muted-foreground text-foreground",
                  "focus:ring-2 focus:ring-primary/30 focus:border-primary",
                  errors.email ? "border-destructive" : "border-border"
                )}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-3.5 py-2.5 pr-10 rounded-lg bg-background border text-sm outline-none transition-colors",
                    "placeholder:text-muted-foreground text-foreground",
                    "focus:ring-2 focus:ring-primary/30 focus:border-primary",
                    errors.password ? "border-destructive" : "border-border"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm
                         hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo: <span className="text-foreground">admin@example.com</span> / <span className="text-foreground">password</span>
          </p>
        </div>
      </div>
    </div>
  );
}
