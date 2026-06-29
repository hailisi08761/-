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
  shopify: ['US', 'CA', 'MX', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP', 'MY', 'TH', 'PH', 'SG', 'VN', 'AU']
};

export const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok Shop' },
  { id: 'shopify', name: '独立站 (Shopify/Woo)' }
];

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
    { id: 'electronics', name: '电子数码 (Electronics - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'cosmetics', name: '美妆个护 (Beauty & Personal Care - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'home', name: '家居厨房 (Home & Kitchen - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'fashion', name: '服装配饰 (Apparel - 17%)', commissionRate: 0.17, fixedFee: 0.30 },
    { id: 'toys', name: '玩具游戏 (Toys & Games - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'jewelry', name: '珠宝首饰 (Jewelry - 20%)', commissionRate: 0.20, fixedFee: 0.30 },
    { id: 'books', name: '图书教材 (Books - 15%)', commissionRate: 0.15, fixedFee: 0.30 }
  ],
  etsy: [
    { id: 'handmade', name: '手工制品 (Handmade - 6.5%)', commissionRate: 0.065, fixedFee: 0.20 },
    { id: 'vintage', name: '复古制品 (Vintage - 6.5%)', commissionRate: 0.065, fixedFee: 0.20 },
    { id: 'digital', name: '虚拟数码 (Digital - 6.5%)', commissionRate: 0.065, fixedFee: 0.20 }
  ],
  walmart: [
    { id: 'electronics', name: '电子产品 (Electronics - 8%)', commissionRate: 0.08, fixedFee: 0.30 },
    { id: 'home', name: '家居用品 (Home - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'fashion', name: '服装服饰 (Clothing - 15%)', commissionRate: 0.15, fixedFee: 0.30 },
    { id: 'jewelry', name: '珠宝饰品 (Jewelry - 20%)', commissionRate: 0.20, fixedFee: 0.30 },
    { id: 'grocery', name: '生鲜食品 (Grocery - 18%)', commissionRate: 0.18, fixedFee: 0.30 }
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
