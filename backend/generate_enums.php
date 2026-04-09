<?php

$json = '{
  "enums": {
    "action_flag": ["Addition = 1", "Change = 2", "Deletion = 3"],
    "status": ["Pending = pending", "Confirmed = confirmed", "Rejected = rejected"],
    "language_id": ["ENGLISH = 1", "ARABIC = 2", "KURDISH = 3"],
    "relation_type": ["Same Category = category", "Same Brand = brand"],
    "address_type": ["Home = 0", "Work = 1", "Other = 2"],
    "zone": ["Baghdad = baghdad", "Others = others"],
    "preferred_language": ["ENGLISH = 1", "ARABIC = 2", "KURDISH = 3"],
    "banner_type": ["Category = category", "Brand = brand", "Product = product"],
    "type": ["category = category", "brand = brand", "product = product"],
    "entry_type": ["Products = products", "Ad = ad", "News = news"],
    "cta_type": ["Add to cart = add_to_cart", "Learn more = learn_more"],
    "language": ["ENGLISH = 1", "ARABIC = 2", "KURDISH = 3"],
    "platform": ["Android = 1", "Ios = 2", "Both = 3"],
    "question_type": ["Text = text", "Multi Select = multi_select", "Radio = radio"],
    "action": ["create = 0", "update = 1", "delete = 2", "access = 3"],
    "action_type": ["No Action (Next Question) = none", "Open User Orders List = open_orders", "Open User Cart = open_cart", "Open User Profile = open_profile"],
    "payment_status": ["Pending = pending", "Started = started", "Completed = completed", "Failed = failed"],
    "CouponStatus": ["EXPIRED = 2", "ENABLED = 1", "DISABLED = 0"],
    "CouponTypes": ["FREE_DELIVERY = D", "FREE_DELIVERY_FIRST_ORDER = Z", "PERCENTAGE_FIRST_ORDER = H", "POINTS_COUPON = F", "PERCENTAGE_COUPON = P", "PERCENTAGE_AND_FREE_DELIVERY_COUPON = X", "DISCOUNT_AND_FREE_DELIVERY_COUPON = C", "PRODUCT_PERCENTAGE = A", "PRODUCT_FIXED = B", "PRODUCT_FREE_DELIVERY = Y"],
    "OrderStatus": ["NEW_ORDER = 1", "COMPLETED = 5", "WHATSAPP_COMPLETED = 25", "CANCELLED_ORDER = 7", "REFUNDED = 11", "CASHLESS_PENDING = 20", "CASHLESS_FAILED = 21"],
    "PaymentMethod": ["CASH = cash", "PAY_TABS = paytabs", "ZAIN_CASH = zain_cash", "QI_CARD = qi_card", "SWITCH = switch"],
    "SectionType": ["PRODUCTS_BY_CATEGORY = 1", "PRODUCTS_BY_STATUS = 2", "PRODUCTS_BY_BRANDS = 3", "SUB_CATEGORIES = 4", "SUB_CATEGORY_AND_PRODUCTS = 5", "FLASH_SALE = 6"],
    "ProductStatus": ["NEW = 0", "PROMOTED = 1", "FEATURED = 2", "DISCOUNT = 3", "NORMAL = 4"],
    "brand_type": ["brand = brand", "category = category", "product = product"],
    "AuditAction": ["CREATE = 0", "UPDATE = 1", "DELETE = 2", "ACCESS = 3"]
  }
}';

$data = json_decode($json, true);

function toUpperSnake(string $string): string {
    $string = preg_replace('/[^\w\s-]/', '', $string);
    $string = trim($string);
    $string = preg_replace('/[-\s]+/', '_', $string);
    return strtoupper($string);
}

function toPascalCase(string $string): string {
    $string = str_replace(['_', '-'], ' ', $string);
    $string = ucwords($string);
    return str_replace(' ', '', $string);
}

// Ensure the directory exists
$dir = __DIR__ . '/app/Enums';
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}

foreach ($data['enums'] as $enumName => $values) {
    if ($enumName === 'type') {
        $enumName = 'TypeEnum';
    }
    
    $pascalName = toPascalCase($enumName);
    
    $cases = [];
    $allNumeric = true;
    
    foreach ($values as $valStr) {
        $parts = explode(' = ', $valStr);
        $left = trim($parts[0]);
        $right = trim($parts[1]);
        
        $caseName = toUpperSnake($left);
        $caseName = preg_replace('/_+/', '_', $caseName);
        
        if (!is_numeric($right)) {
            $allNumeric = false;
        }
        
        $cases[] = [
            'name' => $caseName,
            'value' => $right
        ];
    }
    
    $backendType = $allNumeric ? 'int' : 'string';
    
    $fileContent = "<?php\n\nnamespace App\Enums;\n\nenum {$pascalName}: {$backendType}\n{\n";
    
    foreach ($cases as $case) {
        $valueStr = $allNumeric ? $case['value'] : "'{$case['value']}'";
        $fileContent .= "    case {$case['name']} = {$valueStr};\n";
    }
    
    $fileContent .= "}\n";
    
    file_put_contents("{$dir}/{$pascalName}.php", $fileContent);
}

echo "Clean generation successful!\n";
