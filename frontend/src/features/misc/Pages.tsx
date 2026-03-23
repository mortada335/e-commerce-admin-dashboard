// Simple stub pages for Payments
// Full CRUD forms would follow the same pattern as ProductsPage

export function PaymentsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Payments</h2>
      <div className="glass rounded-xl p-6 text-muted-foreground text-sm">
        Payment transaction listing with Stripe/cash status tracking.
      </div>
    </div>
  );
}
