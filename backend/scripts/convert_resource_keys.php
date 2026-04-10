<?php
/**
 * Script to convert array keys in Laravel API Resource files from snake_case to camelCase.
 * It scans all files under app/Http/Resources/*.php and updates the toArray method.
 */

$resourceDir = __DIR__ . '/../app/Http/Resources';
$files = glob($resourceDir . '/*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    // Replace keys like 'snake_case' => $this->snake_case,
    $newContent = preg_replace_callback(
        "/(')([a-z0-9_]+)(')\s*=>/",
        function ($matches) {
            $snake = $matches[2];
            $parts = explode('_', $snake);
            $camel = array_shift($parts);
            foreach ($parts as $part) {
                $camel .= ucfirst($part);
            }
            return "'{$camel}' =>";
        },
        $content
    );
    if ($newContent !== $content) {
        file_put_contents($file, $newContent);
        echo "Updated {$file}\n";
    }
}
?>
