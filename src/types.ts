export interface SiteFeeConfig {
  id: string;
  name: string;
  localName: string;
  currency: string;
  symbol: string;
  flag: string;
  commissionRate: number; // base percentage e.g. 6% = 0.06
  transactionRate: number; // e.g. 1.02% to 3.78% (default mid rate e.g. 2.5%)
  fixedFee: number; // fixed amount in local currency
  withdrawalFeeLocal: number; // absolute amount or percentage-based
  isPercentageWithdrawal: boolean; // if local withdrawal is a percentage (e.g. SEA sites)
  settlementCurrency: 'USD' | 'GBP' | 'LOCAL'; // VN, TH, MY etc. settle in USD
  defaultExchangeRate: number; // how much local currency equals 1 USD (e.g., 1 USD = 25400 VND)
}

export interface PayoutTool {
  id: string;
  name: string;
  logoColor: string;
  withdrawalFeeMin: number; // e.g. 0.5% = 0.005
  withdrawalFeeMax: number; // e.g. 1.2% = 0.012
  defaultFee: number; // default value selected by user, customizable
  description: string;
}

export interface SimulationInput {
  // Product pricing metrics
  productName?: string; // Product name for automated tax rates
  businessMode?: 'virtual' | 'local' | 'overseas'; // 'virtual' | 'local' | 'overseas'
  cogs: number; // Product cost (RMB or USD) - we can let user toggle input currency (Default CNY/RMB)
  priceLocal: number; // Product retail price in target local currency
  category: string; // Product category (affects refund risk, return rate threshold)
  
  // Platform selection
  platformId?: string; // 'tiktok' | 'amazon' | 'etsy' | 'walmart' | 'shopify'
  cogsCurrency?: 'CNY' | 'USD'; // COGS input currency selection
  packagingLossRMB?: number; // Packaging labeling & loss in RMB
  
  // Amazon / Walmart Business Mode and Dimensions
  amazonBusinessMode?: 'FBA' | 'FBM' | 'SFP' | 'AWD';
  walmartBusinessMode?: 'WFS' | 'MF' | 'DROP_SHIP' | 'RETAIL_LINK';
  productWeightLbs?: number; // Weight in lbs
  dimensionLengthInches?: number; // length in inches
  dimensionWidthInches?: number; // width in inches
  dimensionHeightInches?: number; // height in inches
  fbmShippingFromChina?: boolean; // whether shipping from China or domestic US (for FBM shipping estimation)
  
  // New double-mode pricing configuration
  pricingMode?: 'forward' | 'reverse'; // 'forward' = evaluation, 'reverse' = pricing recommended
  targetProfitMarginRate?: number; // target net profit margin percentage e.g. 20 for 20%
  domesticShippingRMB?: number; // domestic transport in RMB
  internationalShippingRMB?: number; // cross border logistics in RMB
  generalExpensesRMB?: number; // local operational expenses in RMB

  // Logistics cost metrics
  shippingPaidByBuyer: number; // 买家付运费
  forwardShippingCostLocal: number; // 卖家向平台/货代付的跨境运费 (local currency)
  fbtFeeLocal: number; // FBT fulfillment/handling fee (local currency)
  storageFeeLocal: number; // Premium warehouse storage fee (local currency)
  
  // Marketing & Affiliate
  affiliateCommissionRate: number; // Creator commission percentage (达人佣金率, e.g. 10% = 0.1)
  
  // Risk simulation
  returnRate: number; // Expressed as percentage, e.g. 10% = 0.10
  returnShippingFeeLocal: number; // Cost of return shipping paid by seller when returned
  badReturnInoperableRate: number; // Percentage of returns that cannot be resold (direct loss of COGS)
  
  // Marketing campaign
  adSpendLocal: number; // Ad budget for this batch / unit (local currency)
  adSpendRatioPercent?: number; // Custom percentage of price spent on advertising, e.g. 15% = 15.0
  platformSubsidyLocal: number; // Platform subsidy (平台补贴)
  sellerDiscountLocal: number; // Seller discounts/coupons (卖家折扣)
  taxRateLocal: number; // VAT or Local purchase taxes (税费率)
  
  // Operational general expenses
  generalExpensesLocal: number; // Other operational overhead per-item (运营杂费)
  
  // Payout Channel Config
  payoutToolId: string; // chosen third-party payoneer/pingpong etc.
  customPayoutFeeRate: number; // user customized fee rate for checkout
}

export interface OrderFlowSimulation {
  id: string;
  orderNumber: string;
  dateCreated: string; // ISO string
  status: 'pending' | 'shipped' | 'delivered' | 'completed';
  amountLocal: number;
}

export interface ExchangeRateConfig {
  [currencyCode: string]: number; // Amount of currency per 1 USD (e.g., CNY: 7.25, VND: 25440, THB: 36.5)
}

export interface PayoutScheduleResult {
  date: string;
  status: string;
  amountLocal: number;
  amountCNY: number;
  isUnlocked: boolean;
  daysRemaining: number;
  daysCategory: 'immediate' | 'short' | 'medium' | 'long';
}

export interface MultiSiteResult {
  siteId: string;
  siteName: string;
  currency: string;
  symbol: string;
  exchangeRateToUSD: number;
  exchangeRateToCNY: number;
  
  // Sales Metric details
  customerPaid: number;
  platformDiscountValue: number;
  
  // Platform fees
  commissionFee: number;
  transactionFee: number;
  fixedFee: number;
  totalPlatformFees: number;
  
  // Logistics cost
  forwardLogistics: number;
  returnLoss: number;
  totalLogisticsCost: number;
  
  // Total costs
  creatorCommission: number;
  cogsConverted: number;
  adSpend: number;
  generalOperationalExpenses: number;
  taxes: number;
  storageFeeLocal?: number;
  fbtFeeLocal?: number;
  
  // Gross profits (毛利)
  grossProfit: number;
  grossMargin: number;
  isGrossMarginSafe: boolean; 
  
  // Net profits (净利)
  withdrawalFee: number;
  exchangeLossBuffer: number; // 1.5% exchange variance
  thirdPartyPayoutFeeRate: number;
  netProfit: number;
  netMargin: number;
  isNetMarginProfitable: boolean;
  
  // ROAS & Breaks
  breakEvenROAS: number;
  actualROAS: number;
  isROASHealthy: boolean;
  eCPA: number;
  suggestedPriceLocal: number;
}
