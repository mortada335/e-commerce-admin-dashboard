import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { X, Upload, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface ProductFormProps {
  product?: any;
  categories: any[];
  onClose: () => void;
}

export default function ProductForm({ product, categories, onClose }: ProductFormProps) {
  const qc = useQueryClient();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category_id: product?.category_id || "",
    price: product?.price || "",
    discount_price: product?.discount_price || "",
    stock_quantity: product?.stock_quantity || 0,
    low_stock_threshold: product?.low_stock_threshold || 10,
    status: product?.status || "active",
    is_featured: product?.is_featured || false,
    short_description: product?.short_description || "",
    description: product?.description || "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>(product?.images || []);

  const mutation = useMutation({
    mutationFn: (data: FormData) => product 
      ? productsApi.update(product.id, data) 
      : productsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(product ? "Product updated" : "Product created");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number) => productsApi.deleteImage(product.id, imageId),
    onSuccess: (_, imageId) => {
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success("Image deleted");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        fd.append(key, typeof value === "boolean" ? (value ? "1" : "0") : value.toString());
      }
    });

    images.forEach((file) => fd.append("images[]", file));

    mutation.mutate(fd);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="glass rounded-xl p-6 border border-border/50 relative max-h-[90vh] overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
        <X className="w-4 h-4" />
      </button>

      <h3 className="text-lg font-bold mb-6">{product ? "Edit Product" : "Add New Product"}</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Product Name</label>
              <input
                required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="iPhone 15 Pro Max"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">SKU</label>
                <input
                  required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="IPH-15-PRO-MAX"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Category</label>
                <select
                  value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">No Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Price</label>
                <input
                  required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="999.99"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Discount Price</label>
                <input
                   type="number" step="0.01" value={formData.discount_price} onChange={(e) => setFormData({...formData, discount_price: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="899.99"
                />
              </div>
            </div>
          </div>

          {/* Stock & Status */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Stock Quantity</label>
                <input
                  required type="number" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Low Stock Alert</label>
                <input
                  type="number" value={formData.low_stock_threshold} onChange={(e) => setFormData({...formData, low_stock_threshold: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  className="w-4 h-4 rounded border-border bg-card text-primary focus:ring-offset-0 focus:ring-primary/30"
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Featured Product</span>
              </label>
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Short Description</label>
            <input
              value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Brief summary..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Full Description</label>
            <textarea
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Tell more about the product..."
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Product Images</label>
          <div className="flex flex-wrap gap-4">
            {/* Existing Images */}
            {existingImages.map((img) => (
              <div key={img.id} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-border/50">
                <img src={img.url} className="w-full h-full object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => deleteImageMutation.mutate(img.id)}
                  className="absolute inset-0 bg-destructive/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}

            {/* New Images Previews */}
            {images.map((file, i) => (
              <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-primary/30 bg-primary/5">
                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 p-1 bg-background/80 rounded-full text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            <label className="w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
              <Upload className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Upload</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          <p className="text-[11px] text-muted-foreground italic">First image will be the primary one.</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/30">
          <button
            type="button" onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? "Saving..." : (product ? "Update Product" : "Create Product")}
          </button>
        </div>
      </form>
    </div>
  );
}
