import { SiteFeeConfig, PayoutTool } from '../types';

export interface SiteCategory {
  id: string;
  name: string;
  commissionRate: number;
  fixedFee: number;
  defaultReturnRate: number;
  maxReturnRate: number;
}

export const SITE_CATEGORIES: Record<string, SiteCategory[]> = {
  US: [
    { id: 'fashion', name: '服饰、鞋包配饰 (Clothing, Shoes, Accessories)', commissionRate: 0.06, fixedFee: 0.30, defaultReturnRate: 11.0, maxReturnRate: 15.0 },
    { id: 'cosmetics', name: '美妆个护、个人护理 (Cosmetics & Personal Care)', commissionRate: 0.06, fixedFee: 0.30, defaultReturnRate: 3.0, maxReturnRate: 6.0 },
    { id: 'electronics', name: '手机数码、电脑办公 (Electronics & digital)', commissionRate: 0.06, fixedFee: 0.30, defaultReturnRate: 4.0, maxReturnRate: 8.0 },
    { id: 'home', name: '家居生活、厨房用品 (Home Living & Kitchen)', commissionRate: 0.06, fixedFee: 0.30, defaultReturnRate: 3.0, maxReturnRate: 6.0 },
    { id: 'sports', name: '运动户外、汽车配件 (Sports & Auto Parts)', commissionRate: 0.06, fixedFee: 0.30, defaultReturnRate: 4.0, maxReturnRate: 8.0 },
    { id: 'collectibles', name: '收藏品、手办、文具 (Collectibles & Stationery)', commissionRate: 0.06, fixedFee: 0.30, defaultReturnRate: 2.0, maxReturnRate: 5.0 }
  ],
  UK: [
    { id: 'fashion', name: '服饰与时尚配饰 (Clothing & Fashion Accessories)', commissionRate: 0.09, fixedFee: 0.20, defaultReturnRate: 11.0, maxReturnRate: 15.0 },
    { id: 'cosmetics', name: '美妆个护 (Beauty & Personal Care)', commissionRate: 0.09, fixedFee: 0.20, defaultReturnRate: 3.0, maxReturnRate: 6.0 },
    { id: 'electronics_device', name: '电子产品 (手机/电脑/相机) (Electronics Devices)', commissionRate: 0.05, fixedFee: 0.20, defaultReturnRate: 4.0, maxReturnRate: 8.0 },
    { id: 'electronics_accessories', name: '电子配件 (耳机/充电宝/外壳) (Electronics Accessories)', commissionRate: 0.09, fixedFee: 0.20, defaultReturnRate: 5.0, maxReturnRate: 9.0 },
    { id: 'home', name: '家居、厨房、宠物用品 (Home, Kitchen, Pets)', commissionRate: 0.09, fixedFee: 0.20, defaultReturnRate: 3.0, maxReturnRate: 6.0 },
    { id: 'toys', name: '玩具与收藏品 (Toys & Collectibles)', commissionRate: 0.075, fixedFee: 0.20, defaultReturnRate: 2.0, maxReturnRate: 5.0 },
    { id: 'books', name: '图书、杂志、音像制品 (Books, Magazines, Media)', commissionRate: 0.075, fixedFee: 0.20, defaultReturnRate: 1.0, maxReturnRate: 4.0 }
  ],
  JP: [
    { id: 'all_categories', name: '全类目基础商品分类 (All Categories Standard)', commissionRate: 0.07, fixedFee: 0.0, defaultReturnRate: 4.0, maxReturnRate: 10.0 }
  ],
  MX: [
    { id: 'all_categories', name: '全类目基础商品分类 (All Categories Standard / RFC Taxable)', commissionRate: 0.075, fixedFee: 0.0, defaultReturnRate: 4.0, maxReturnRate: 10.0 }
  ],
  MY: [
    { id: 'all_categories', name: '全类目基础商品分类 (All Categories Standard)', commissionRate: 0.0702, fixedFee: 0.30, defaultReturnRate: 4.0, maxReturnRate: 10.0 }
  ],
  TH: [
    { id: 'all_categories', name: '全类目基础商品分类 (All Categories Standard)', commissionRate: 0.0578, fixedFee: 0.30, defaultReturnRate: 4.0, maxReturnRate: 10.0 }
  ],
  PH: [
    { id: 'all_categories', name: '全类目基础商品分类 (All Categories Standard)', commissionRate: 0.0680, fixedFee: 0.30, defaultReturnRate: 4.0, maxReturnRate: 10.0 }
  ],
  SG: [
    { id: 'all_categories', name: '全类目基础商品分类 (All Categories Standard)', commissionRate: 0.0600, fixedFee: 0.30, defaultReturnRate: 4.0, maxReturnRate: 10.0 }
  ],
  VN: [
    { id: 'all_categories', name: '全类目基础商品分类 (All Categories Standard)', commissionRate: 0.0800, fixedFee: 0.30, defaultReturnRate: 4.0, maxReturnRate: 10.0 }
  ]
};

export const SITE_FEE_CONFIGS: SiteFeeConfig[] = [
  {
    id: 'US',
    name: '美国站',
    localName: 'United States',
    currency: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    commissionRate: 0.06, // Default fallback
    transactionRate: 0.025, // 2.5% platform transaction standard
    fixedFee: 0.30, // $0.30
    withdrawalFeeLocal: 0.05,
    isPercentageWithdrawal: false,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 1.0
  },
  {
    id: 'UK',
    name: '英国站',
    localName: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    commissionRate: 0.09, // Default fallback
    transactionRate: 0.025, // ~2.5% platform standard
    fixedFee: 0.20, // £0.20 per order
    withdrawalFeeLocal: 0.20,
    isPercentageWithdrawal: false,
    settlementCurrency: 'GBP',
    defaultExchangeRate: 0.78
  },
  {
    id: 'JP',
    name: '日本站',
    localName: 'Japan',
    currency: 'JPY',
    symbol: '¥',
    flag: '🇯🇵',
    commissionRate: 0.07, // Flat 7%
    transactionRate: 0.02, // Platform payment average
    fixedFee: 0.0,
    withdrawalFeeLocal: 0.005, // 0.5%
    isPercentageWithdrawal: true,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 156.0
  },
  {
    id: 'MX',
    name: '墨西哥站',
    localName: 'Mexico',
    currency: 'MXN',
    symbol: 'Mex$',
    flag: '🇲🇽',
    commissionRate: 0.075, // Flat 7.5%
    transactionRate: 0.02, // Platform payment average
    fixedFee: 0.0,
    withdrawalFeeLocal: 0.01, // ~1% from local to transfer
    isPercentageWithdrawal: true,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 18.2
  },
  {
    id: 'MY',
    name: '马来西亚站',
    localName: 'Malaysia',
    currency: 'MYR',
    symbol: 'RM',
    flag: '🇲🇾',
    commissionRate: 0.0702,
    transactionRate: 0.0378,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'USD',
    defaultExchangeRate: 4.70
  },
  {
    id: 'TH',
    name: '泰国站',
    localName: 'Thailand',
    currency: 'THB',
    symbol: '฿',
    flag: '🇹🇭',
    commissionRate: 0.0578,
    transactionRate: 0.0321,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'USD',
    defaultExchangeRate: 36.5
  },
  {
    id: 'PH',
    name: '菲律宾站',
    localName: 'Philippines',
    currency: 'PHP',
    symbol: '₱',
    flag: '🇵🇭',
    commissionRate: 0.0680,
    transactionRate: 0.0224,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'USD',
    defaultExchangeRate: 58.5
  },
  {
    id: 'SG',
    name: '新加坡站',
    localName: 'Singapore',
    currency: 'SGD',
    symbol: 'S$',
    flag: '🇸🇬',
    commissionRate: 0.0600,
    transactionRate: 0.0218,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 1.35
  },
  {
    id: 'VN',
    name: '越南站',
    localName: 'Vietnam',
    currency: 'VND',
    symbol: '₫',
    flag: '🇻🇳',
    commissionRate: 0.0800,
    transactionRate: 0.0400,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'USD',
    defaultExchangeRate: 25400
  },
  {
    id: 'CA',
    name: '加拿大站',
    localName: 'Canada',
    currency: 'CAD',
    symbol: 'C$',
    flag: '🇨🇦',
    commissionRate: 0.15,
    transactionRate: 0.029,
    fixedFee: 0.40,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 1.37
  },
  {
    id: 'AU',
    name: '澳大利亚站',
    localName: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    flag: '🇦🇺',
    commissionRate: 0.15,
    transactionRate: 0.029,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 1.50
  },
  {
    id: 'DE',
    name: '德国站',
    localName: 'Germany',
    currency: 'EUR',
    symbol: '€',
    flag: '🇩🇪',
    commissionRate: 0.15,
    transactionRate: 0.029,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 0.92
  },
  {
    id: 'FR',
    name: '法国站',
    localName: 'France',
    currency: 'EUR',
    symbol: '€',
    flag: '🇫🇷',
    commissionRate: 0.15,
    transactionRate: 0.029,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 0.92
  },
  {
    id: 'IT',
    name: '意大利站',
    localName: 'Italy',
    currency: 'EUR',
    symbol: '€',
    flag: '🇮🇹',
    commissionRate: 0.15,
    transactionRate: 0.029,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 0.92
  },
  {
    id: 'ES',
    name: '西班牙站',
    localName: 'Spain',
    currency: 'EUR',
    symbol: '€',
    flag: '🇪🇸',
    commissionRate: 0.15,
    transactionRate: 0.029,
    fixedFee: 0.30,
    withdrawalFeeLocal: 0.01,
    isPercentageWithdrawal: true,
    settlementCurrency: 'LOCAL',
    defaultExchangeRate: 0.92
  }
];

export const SITES_BY_PLATFORM: Record<string, string[]> = {
  tiktok: ['US', 'UK', 'MX', 'MY', 'TH', 'PH', 'SG', 'VN'],
  amazon: ['US', 'CA', 'MX', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP'],
  etsy: ['US', 'CA', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP', 'AU'],
  walmart: ['US', 'CA', 'MX', 'UK', 'DE', 'ES', 'AU'],
  shopify: ['US', 'CA', 'MX', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP', 'MY', 'TH', 'PH', 'SG', 'VN', 'AU']
};

export const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok Shop' },
  { id: 'amazon', name: 'Amazon' },
  { id: 'etsy', name: 'eBay / Etsy' },
  { id: 'walmart', name: 'Walmart' },
  { id: 'shopify', name: '独立站 (Shopify/Woo)' }
];

export const AMAZON_REFERRAL_FEES: Record<string, number> = {
  "Appliances": 0.17,
  "Baby Products": 0.085,
  "Books": 0.15,
  "Camera & Photo": 0.08,
  "Cell Phones": 0.085,
  "Collectible Coins": 0.15,
  "Consumer Electronics": 0.08,
  "Digital Music": 0.15,
  "Electronics Accessories": 0.08,
  "Entertainment Collectibles": 0.15,
  "Gift Cards": 0.06,
  "Grocery & Gourmet Foods": 0.085,
  "Health & Personal Care": 0.085,
  "Music & DVD": 0.15,
  "Musical Instruments": 0.10,
  "Office Products": 0.085,
  "Outdoors": 0.10,
  "Personal Computers": 0.06,
  "Software & Computer Games": 0.15,
  "Sports Collectibles": 0.15,
  "Tools & Home Improvement": 0.085,
  "Toys & Games": 0.085,
  "Video & DVD": 0.15,
  "Video Games": 0.085,
  "Watches": 0.085,
  "Clothing": 0.17,
  "Shoes, Handbags & Sunglasses": 0.18,
  "Jewelry": 0.20,
  "Fine Jewelry": 0.05,
  "Beauty & Personal Care (Cosmetics)": 0.15,
  "Skin Care": 0.15,
  "Hair Care": 0.15,
  "Personal Care": 0.15,
  "Fragrances": 0.15,
  "Home & Garden": 0.15,
  "Furniture": 0.15,
  "Kitchen": 0.15,
  "Bedding & Bath": 0.15,
  "Home Improvement": 0.085,
  "Pet Products": 0.15,
  "Sports & Outdoors": 0.15,
  "Exercise & Fitness": 0.15,
  "Baby Products (excluding diapers)": 0.085,
  "Diapers": 0.085,
  "Automotive & Powersports": 0.12,
  "Industrial & Scientific": 0.12,
  "Janitorial & Sanitation": 0.12,
  "Mattresses": 0.15,
  "Tires & Wheels": 0.10,
  "Furniture & Decor": 0.15
};

export const AMAZON_MIN_FEE_RULES: Record<string, number> = {
  default: 0.30,
  "Fine Jewelry": 2.00,
  "Jewelry": 0.30,
  "Watches": 0.30
};

export const WALMART_REFERRAL_FEES: Record<string, number> = {
  "Art & Crafts": 0.15,
  "Baby Products": 0.15,
  "Books": 0.15,
  "Carriers & Strollers": 0.15,
  "Electronics Accessories": 0.15,
  "Food & Beverage": 0.15,
  "Home Improvement": 0.15,
  "Home Storage": 0.15,
  "Industrial & Commercial": 0.15,
  "Luggage & Travel Bags": 0.15,
  "Music": 0.15,
  "Office Supplies": 0.15,
  "Party & Occasions": 0.15,
  "Patio & Garden": 0.15,
  "Pet Products": 0.15,
  "Sports & Outdoors": 0.15,
  "Tires & Wheels": 0.15,
  "Toys": 0.15,
  "Video Games & Gaming Accessories": 0.15,
  "Apparel - General": 0.08,
  "Apparel - Shoes": 0.08,
  "Jewelry": 0.08,
  "Shoes - Athletic": 0.08,
  "Shoes - Non-Athletic": 0.08,
  "Sunglasses": 0.08,
  "Watches": 0.08,
  "Handbags & Accessories": 0.08,
  "Consumer Electronics": 0.12,
  "GPS & Navigation": 0.12,
  "Personal Care": 0.12,
  "Beauty & Cosmetology": 0.12,
  "Skin Care": 0.12,
  "Hair Care": 0.12,
  "Oral Care": 0.12,
  "Vitamins & Supplements": 0.12,
  "Medical Supplies & Equipment": 0.12,
  "Baby Gear": 0.12,
  "Mats & Rugs": 0.12,
  "Cell Phones & Mobile Devices": 0.15,
  "Tablets & Laptops": 0.15,
  "Furniture": 0.15,
  "Bedding": 0.15,
  "Bath": 0.15,
  "Kitchen & Dining": 0.15,
  "Small Kitchen Appliances": 0.15,
  "Large Kitchen Appliances": 0.15,
  "Bicycles & E-Bikes": 0.15,
  "Movies & TV": 0.15,
  "Collectibles": 0.15,
  "Gift Cards": 0.15,
  "Motors & Powersports": 0.12,
  "Tire & Wheel Packages": 0.15,
  "Grocery & Household": 0.08
};

export const WALMART_MIN_FEE = 0.30;

export const CATEGORIES_BY_PLATFORM: Record<string, { id: string; name: string; commissionRate: number; fixedFee: number }[]> = {
  tiktok: [
    { id: 'fashion', name: '服饰、鞋包配饰 (Clothing, Shoes & Accessories)', commissionRate: 0.06, fixedFee: 0.30 },
    { id: 'cosmetics', name: '美妆个护、个人护理 (Cosmetics & Personal Care)', commissionRate: 0.06, fixedFee: 0.30 },
    { id: 'electronics', name: '手机数码、电脑办公 (Electronics & Digital)', commissionRate: 0.06, fixedFee: 0.30 },
    { id: 'home', name: '家居生活、厨房用品 (Home Living & Kitchen)', commissionRate: 0.06, fixedFee: 0.30 },
    { id: 'sports', name: '运动户外、汽车配件 (Sports & Auto Parts)', commissionRate: 0.06, fixedFee: 0.30 },
    { id: 'collectibles', name: '收藏品、手办、文具 (Collectibles & Stationery)', commissionRate: 0.06, fixedFee: 0.30 }
  ],
  amazon: [
    { id: 'Clothing', name: '服装 (Clothing - 17%)', commissionRate: 0.17, fixedFee: 0.30 },
    { id: 'Shoes, Handbags & Sunglasses', name: '鞋箱包太阳镜 (Shoes, Handbags - 18%)', commissionRate: 0.18, fixedFee: 0.30 },
    { id: 'Jewelry', name: '普通珠宝 (Jewelry - 20%)', commissionRate: 0.20, fixedFee: 0.30 },
    { id: 'Fine Jewelry', name: '高级珠宝 [单价≥$500] (Fine Jewelry - 5%)', commissionRate: 0.05, fixedFee: 2.00 },
    { id: 'Beauty & Personal Care (Cosmetics)', name: '美容化妆 (Beauty & Cosmetics - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Skin Care', name: '护肤产品 (Skin Care - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Hair Care', name: '护发产品 (Hair Care - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Personal Care', name: '个人护理 (Personal Care - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Fragrances', name: '香水 (Fragrances - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Home & Garden', name: '家居园艺 (Home & Garden - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Furniture', name: '家具产品 (Furniture - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Kitchen', name: '厨房用品 (Kitchen - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Bedding & Bath', name: '床品浴室 (Bedding & Bath - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Home Improvement', name: '家居改善 (Home Improvement - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Pet Products', name: '宠物用品 (Pet Products - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Sports & Outdoors', name: '运动户外 (Sports & Outdoors - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Exercise & Fitness', name: '健身器材 (Exercise & Fitness - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Appliances', name: '家用电器 (Appliances - 17%)', commissionRate: 0.17, fixedFee: 0.30 },
    { id: 'Baby Products', name: '婴儿用品 (Baby Products - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Baby Products (excluding diapers)', name: '婴儿用品 [除纸尿裤] (Baby - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Diapers', name: '纸尿裤 (Diapers - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Books', name: '图书教材 (Books - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Camera & Photo', name: '摄影摄像 (Camera & Photo - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Cell Phones', name: '移动手机 (Cell Phones - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Collectible Coins', name: '收藏硬币 (Collectible Coins - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Consumer Electronics', name: '消费电子 (Consumer Electronics - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Digital Music', name: '数字音乐 (Digital Music - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Electronics Accessories', name: '电子配件 (Electronics Accessories - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Entertainment Collectibles', name: '娱乐收藏 (Entertainment - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Gift Cards', name: '礼品卡券 (Gift Cards - 6%)', commissionRate: 0.06, fixedFee: 0.30 },
    { id: 'Grocery & Gourmet Foods', name: '杂货食品 (Grocery & Foods - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Health & Personal Care', name: '健康个护 [无营养补充剂] (Health - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Music & DVD', name: '音乐DVD (Music & DVD - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Musical Instruments', name: '声学乐器 (Musical Instruments - 10%)', commissionRate: 0.10, fixedFee: 0.30 },
    { id: 'Office Products', name: '办公用品 (Office Products - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Outdoors', name: '户外生活 (Outdoors - 10%)', commissionRate: 0.10, fixedFee: 0.30 },
    { id: 'Personal Computers', name: '个人电脑 (Personal Computers - 6%)', commissionRate: 0.06, fixedFee: 0.30 },
    { id: 'Software & Computer Games', name: '软件游戏 (Software & Games - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Sports Collectibles', name: '运动收藏 (Sports Collectibles - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Tools & Home Improvement', name: '工具五金 (Tools & Improvement - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Toys & Games', name: '玩具游戏 (Toys & Games - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Video & DVD', name: '视频及光盘 (Video & DVD - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Video Games', name: '电子游戏 (Video Games - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Watches', name: '腕表计时 (Watches - 8.5%)', commissionRate: 0.085, fixedFee: 0.30 },
    { id: 'Automotive & Powersports', name: '汽车动力 (Automotive - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Industrial & Scientific', name: '工业科学 (Industrial & Scientific - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Janitorial & Sanitation', name: '清洁卫生 (Janitorial - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Mattresses', name: '床垫寝具 (Mattresses - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Tires & Wheels', name: '轮胎轮毂 (Tires & Wheels - 10%)', commissionRate: 0.10, fixedFee: 0.30 },
    { id: 'Furniture & Decor', name: '家具装饰 [大型] (Furniture & Decor - 15%)', commissionRate: 0.15, fixedFee: 0.30 }
  ],
  etsy: [
    { id: 'handmade', name: '手工制品 (Handmade - 6.5%)', commissionRate: 0.065, fixedFee: 0.20 },
    { id: 'vintage', name: '复古制品 (Vintage - 6.5%)', commissionRate: 0.065, fixedFee: 0.20 },
    { id: 'digital', name: '虚拟数码 (Digital - 6.5%)', commissionRate: 0.065, fixedFee: 0.20 }
  ],
  walmart: [
    { id: 'Art & Crafts', name: '艺术手工 (Art & Crafts - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Baby Products', name: '婴儿用品 (Baby Products - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Books', name: '图书教材 (Books - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Carriers & Strollers', name: '婴儿推车 (Carriers & Strollers - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Electronics Accessories', name: '电子配件 (Electronics Accessories - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Food & Beverage', name: '食品饮料 (Food & Beverage - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Home Improvement', name: '家居改善 (Home Improvement - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Home Storage', name: '收纳整理 (Home Storage - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Industrial & Commercial', name: '工业商业 (Industrial & Commercial - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Luggage & Travel Bags', name: '行李箱包 (Luggage & Bags - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Music', name: '音乐唱片 (Music - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Office Supplies', name: '办公用品 (Office Supplies - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Party & Occasions', name: '派对节日 (Party & Occasions - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Patio & Garden', name: '露台花园 (Patio & Garden - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Pet Products', name: '宠物用品 (Pet Products - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Sports & Outdoors', name: '运动户外 (Sports & Outdoors - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Tires & Wheels', name: '轮胎轮毂 (Tires & Wheels - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Toys', name: '玩具娱乐 (Toys - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Video Games & Gaming Accessories', name: '游戏配件 (Video Games - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Apparel - General', name: '服装通用 (Apparel General - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Apparel - Shoes', name: '服装鞋类 (Apparel Shoes - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Jewelry', name: '珠宝饰品 (Jewelry - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Shoes - Athletic', name: '运动鞋履 (Shoes Athletic - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Shoes - Non-Athletic', name: '非运动鞋 (Shoes Non-Athletic - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Sunglasses', name: '太阳眼镜 (Sunglasses - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Watches', name: '腕表计时 (Watches - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Handbags & Accessories', name: '手袋配饰 (Handbags & Accessories - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'Consumer Electronics', name: '消费电子 (Consumer Electronics - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'GPS & Navigation', name: 'GPS导航 (GPS & Navigation - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Personal Care', name: '个人护理 (Personal Care - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Beauty & Cosmetology', name: '美容化妆 (Beauty & Cosmetology - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Skin Care', name: '美容护肤 (Skin Care - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Hair Care', name: '美发护发 (Hair Care - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Oral Care', name: '口腔护理 (Oral Care - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Vitamins & Supplements', name: '营养膳食 (Vitamins & Supplements - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Medical Supplies & Equipment', name: '医疗设备 (Medical Supplies - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Baby Gear', name: '婴儿装备 [非服装] (Baby Gear - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Mats & Rugs', name: '地垫地毯 (Mats & Rugs - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Cell Phones & Mobile Devices', name: '手机移动 (Cell Phones - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Tablets & Laptops', name: '平板电脑 (Tablets & Laptops - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Furniture', name: '大件家具 (Furniture - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Bedding', name: '床上用品 (Bedding - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Bath', name: '卫浴用品 (Bath - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Kitchen & Dining', name: '厨房餐饮 (Kitchen & Dining - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Small Kitchen Appliances', name: '厨房小电 (Small Appliances - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Large Kitchen Appliances', name: '厨房大电 (Large Appliances - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Bicycles & E-Bikes', name: '两轮骑行 (Bicycles & E-Bikes - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Movies & TV', name: '影视媒体 (Movies & TV - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Collectibles', name: '收藏精品 (Collectibles - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Gift Cards', name: '礼品卡券 (Gift Cards - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Motors & Powersports', name: '机动车品 (Motors & Powersports - 12%)', commissionRate: 0.12, fixedFee: 0.30 },
    { id: 'Tire & Wheel Packages', name: '轮毂套装 (Tire & Wheel - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'Grocery & Household', name: '杂货家居 (Grocery & Household - 8%)', commissionRate: 0.08, fixedFee: 0.30 }
  ],
  shopify: [
    { id: 'universal', name: '独立站全类目 (Universal Category - 0%)', commissionRate: 0.00, fixedFee: 0.00 }
  ]
};

export const PAYOUT_TOOLS_CONFIG: PayoutTool[] = [
  {
    id: 'payoneer',
    name: 'Payoneer (派安盈)',
    logoColor: '#FF5A00',
    withdrawalFeeMin: 0.005,
    withdrawalFeeMax: 0.012,
    defaultFee: 0.010,
    description: '全球合规性强，广泛覆盖各地区，支持多币种，提现至国内卡通常1-2天到账。'
  },
  {
    id: 'lianlian',
    name: 'LianLian (连连支付)',
    logoColor: '#005AAA',
    withdrawalFeeMin: 0.005,
    withdrawalFeeMax: 0.007,
    defaultFee: 0.006,
    description: '国内老牌支付商，结汇路径顺畅，提现费率有明显竞争优势，多平台统一管理。'
  },
  {
    id: 'pingpong',
    name: 'PingPong',
    logoColor: '#2C3E50',
    withdrawalFeeMin: 0.003,
    withdrawalFeeMax: 0.010,
    defaultFee: 0.008,
    description: '收费透明（最高1%封顶），且常有新客特惠活动，出入账结算快速，全中文化客服。'
  },
  {
    id: 'airwallex',
    name: 'Airwallex (空中云汇)',
    logoColor: '#00D2D2',
    withdrawalFeeMin: 0.003,
    withdrawalFeeMax: 0.010,
    defaultFee: 0.005,
    description: '新一代数字支付，费率极具竞争力，支持API对接，多账户结汇损耗低。'
  }
];

export const CATEGORY_THRESHOLDS: Record<string, { name: string; maxReturnRate: number; defaultReturnRate: number }> = {
  fashion: { name: '服饰、鞋包配饰 (Fashion)', maxReturnRate: 0.15, defaultReturnRate: 11.0 },
  cosmetics: { name: '美妆个护、个人护理 (Cosmetics)', maxReturnRate: 0.06, defaultReturnRate: 3.0 },
  electronics: { name: '数码电子 (Electronics)', maxReturnRate: 0.08, defaultReturnRate: 4.0 },
  home: { name: '家居生活 (Home & Living)', maxReturnRate: 0.06, defaultReturnRate: 3.0 },
  toys: { name: '玩具潮玩 (Toys)', maxReturnRate: 0.05, defaultReturnRate: 2.0 },
  other: { name: '其他类目 (Other Items)', maxReturnRate: 0.08, defaultReturnRate: 4.0 }
};
