export const ActionFlag = {
  ADDITION: 1,
  CHANGE: 2,
  DELETION: 3,
};

export const Status = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
};

export const LanguageId = {
  ENGLISH: 1,
  ARABIC: 2,
  KURDISH: 3,
};

export const RelationType = {
  SAME_CATEGORY: 'category',
  SAME_BRAND: 'brand',
};

export const AddressType = {
  HOME: 0,
  WORK: 1,
  OTHER: 2,
};

export const Zone = {
  BAGHDAD: 'baghdad',
  OTHERS: 'others',
};

export const PreferredLanguage = {
  ENGLISH: 1,
  ARABIC: 2,
  KURDISH: 3,
};

export const BannerType = {
  CATEGORY: 'category',
  BRAND: 'brand',
  PRODUCT: 'product',
};

export const TypeEnum = {
  CATEGORY: 'category',
  BRAND: 'brand',
  PRODUCT: 'product',
};

export const EntryType = {
  PRODUCTS: 'products',
  AD: 'ad',
  NEWS: 'news',
};

export const CtaType = {
  ADD_TO_CART: 'add_to_cart',
  LEARN_MORE: 'learn_more',
};

export const Language = {
  ENGLISH: 1,
  ARABIC: 2,
  KURDISH: 3,
};

export const Platform = {
  ANDROID: 1,
  IOS: 2,
  BOTH: 3,
};

export const QuestionType = {
  TEXT: 'text',
  MULTI_SELECT: 'multi_select',
  RADIO: 'radio',
};

export const Action = {
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
  ACCESS: 3,
};

export const ActionType = {
  NO_ACTION: 'none',
  OPEN_ORDERS: 'open_orders',
  OPEN_CART: 'open_cart',
  OPEN_PROFILE: 'open_profile',
};

export const PaymentStatus = {
  PENDING: 'pending',
  STARTED: 'started',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const CouponStatus = {
  EXPIRED: 2,
  ENABLED: 1,
  DISABLED: 0,
};

export const CouponTypes = {
  FREE_DELIVERY: 'D',
  FREE_DELIVERY_FIRST_ORDER: 'Z',
  PERCENTAGE_FIRST_ORDER: 'H',
  POINTS_COUPON: 'F',
  PERCENTAGE_COUPON: 'P',
  PERCENTAGE_AND_FREE_DELIVERY_COUPON: 'X',
  DISCOUNT_AND_FREE_DELIVERY_COUPON: 'C',
  PRODUCT_PERCENTAGE: 'A',
  PRODUCT_FIXED: 'B',
  PRODUCT_FREE_DELIVERY: 'Y',
};

export const OrderStatus = {
  NEW_ORDER: 1,
  COMPLETED: 5,
  WHATSAPP_COMPLETED: 25,
  CANCELLED_ORDER: 7,
  REFUNDED: 11,
  CASHLESS_PENDING: 20,
  CASHLESS_FAILED: 21,
};

export const PaymentMethod = {
  CASH: 'cash',
  PAY_TABS: 'paytabs',
  ZAIN_CASH: 'zain_cash',
  QI_CARD: 'qi_card',
  SWITCH: 'switch',
};

export const SectionType = {
  PRODUCTS_BY_CATEGORY: 1,
  PRODUCTS_BY_STATUS: 2,
  PRODUCTS_BY_BRANDS: 3,
  SUB_CATEGORIES: 4,
  SUB_CATEGORY_AND_PRODUCTS: 5,
  FLASH_SALE: 6,
};

export const ProductStatus = {
  NEW: 0,
  PROMOTED: 1,
  FEATURED: 2,
  DISCOUNT: 3,
  NORMAL: 4,
};

export const BrandType = {
  BRAND: 'brand',
  CATEGORY: 'category',
  PRODUCT: 'product',
};

export const AuditAction = {
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
  ACCESS: 3,
};
