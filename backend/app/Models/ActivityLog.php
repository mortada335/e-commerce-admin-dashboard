<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'action', 'model_type', 'model_id',
        'old_values', 'new_values', 'ip_address', 'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public $timestamps = true;
    const UPDATED_AT = null; // Only created_at needed

    /**
     * Sensitive fields that must NEVER be recorded in audit logs.
     */
    private static array $sensitiveFields = [
        'password', 'password_confirmation', 'remember_token',
        'current_password', 'new_password',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Record an activity log entry, automatically stripping sensitive fields.
     */
    public static function record(
        string $action,
        ?Model $model = null,
        array $oldValues = [],
        array $newValues = []
    ): static {
        return static::create([
            'user_id'    => auth()->id(),
            'action'     => $action,
            'model_type' => $model ? get_class($model) : null,
            'model_id'   => $model?->getKey(),
            'old_values' => self::stripSensitive($oldValues),
            'new_values' => self::stripSensitive($newValues),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Remove sensitive fields from values before recording.
     */
    private static function stripSensitive(array $values): array
    {
        return array_diff_key($values, array_flip(self::$sensitiveFields));
    }

    /**
     * Audit logs are append-only — prevent deletion.
     */
    public function delete(): bool
    {
        throw new \RuntimeException('Activity logs are immutable and cannot be deleted.');
    }
}
