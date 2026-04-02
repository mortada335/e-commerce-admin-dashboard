<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProductService
{
    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = Product::with(['category', 'images']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'ilike', "%{$filters['search']}%")
                  ->orWhere('sku', 'ilike', "%{$filters['search']}%");
            });
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['low_stock']) && $filters['low_stock']) {
            $query->whereColumn('stock_quantity', '<=', 'low_stock_threshold');
        }

        $sort = $filters['sort_by'] ?? 'created_at';
        $dir  = $filters['sort_dir'] ?? 'desc';
        $query->orderBy($sort, $dir);

        return $query->paginate(min((int) ($filters['per_page'] ?? 15), 100));
    }

    public function create(array $data, array $imageFiles = []): Product
    {
        return DB::transaction(function () use ($data, $imageFiles) {
            try {
                $product = Product::create($data);
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                throw ValidationException::withMessages([
                    'sku' => ['A product with this SKU already exists.'],
                ]);
            }

            foreach ($imageFiles as $index => $file) {
                $this->storeImage($product, $file, $index);
            }

            ActivityLog::record('product_created', $product, [], $data);

            return $product->load(['category', 'images', 'variants']);
        });
    }

    public function update(Product $product, array $data, array $imageFiles = []): Product
    {
        return DB::transaction(function () use ($product, $data, $imageFiles) {
            $old = $product->toArray();

            try {
                $product->update($data);
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                throw ValidationException::withMessages([
                    'sku' => ['A product with this SKU already exists.'],
                ]);
            }

            foreach ($imageFiles as $index => $file) {
                $this->storeImage($product, $file, $product->images()->count() + $index);
            }

            ActivityLog::record('product_updated', $product, $old, $data);

            return $product->fresh(['category', 'images', 'variants']);
        });
    }

    public function delete(Product $product): void
    {
        // Check if product has been used in any orders
        if ($product->orderItems()->exists()) {
            // Soft-delete only — keep images for order history reference
            ActivityLog::record('product_deleted', $product);
            $product->delete();
            return;
        }

        // No orders reference this product — clean up images from disk
        foreach ($product->images as $image) {
            Storage::disk(config('filesystems.default'))->delete($image->path);
        }

        ActivityLog::record('product_deleted', $product);
        $product->delete();
    }

    public function deleteImage(Product $product, int $imageId): void
    {
        $image = $product->images()->findOrFail($imageId);
        Storage::disk(config('filesystems.default'))->delete($image->path);
        $image->delete();
    }

    private function storeImage(Product $product, UploadedFile $file, int $order = 0): ProductImage
    {
        $path = $file->store("products/{$product->id}", config('filesystems.default'));

        return ProductImage::create([
            'product_id' => $product->id,
            'path'       => $path,
            'sort_order' => $order,
            'is_primary' => $order === 0 && $product->images()->count() === 0,
        ]);
    }
}
