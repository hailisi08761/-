import { SimulationInput, SiteFeeConfig, MultiSiteResult, PayoutTool } from '../types';
import { 
  SITE_FEE_CONFIGS, 
  PAYOUT_TOOLS_CONFIG, 
  SITE_CATEGORIES, 
  SiteCategory,
  AMAZON_REFERRAL_FEES,
  AMAZON_MIN_FEE_RULES,
  WALMART_REFERRAL_FEES,
  WALMART_MIN_FEE
} from '../data/feeStructures';

/**
 * Automatically determine the tax rate of a country based on product keywords.
 */
export function getAutomatedTaxRate(productName: string, siteId: string): number {
  const name = productName.toLowerCase();
  
  // Standard VAT/sales tax rates per site
  const siteTaxMap: Record<string, number> = {
    US: 0.0,
    CA: 12.0,
    MX: 16.0,
    UK: 20.0,
    DE: 19.0,
    FR: 20.0,
    IT: 22.0,
    ES: 21.0,
    JP: 10.0,
    AU: 10.0,
    MY: 8.0,
    TH: 7.0,
    PH: 12.0,
    SG: 9.0,
    VN: 10.0
  };
  const baseTax = siteTaxMap[siteId] ?? 0.0;

  // Reduced or exempted tax matches based on product name keywords
  if (
    name.includes("食品") ||
    name.includes("饮") ||
    name.includes("茶") ||
    name.includes("零食") ||
    name.includes("糖") ||
    name.includes("糕点") ||
    name.includes("果") ||
    name.includes("food") ||
    name.includes("tea") ||
    name.includes("drink") ||
    name.includes("snack")
  ) {
    if (siteId === 'UK') return 0.0;     // UK zero-rated food
    if (siteId === 'DE') return 7.0;     // German reduced rate for food
    if (siteId === 'FR') return 5.5;     // French reduced rate for food
    if (siteId === 'IT') return 4.0;     // Italian reduced rate for basic food
    if (siteId === 'ES') return 4.0;     // Spanish reduced rate for basic food
    if (siteId === 'JP') return 8.0;     // Japanese reduced rate for food/drinks
    if (siteId === 'MY') return 0.0;     // Malaysia exempted food
    return Math.max(0.0, baseTax / 2);
  }

  if (
    name.includes("书") ||
    name.includes("图") ||
    name.includes("绘本") ||
    name.includes("阅读") ||
    name.includes("画册") ||
    name.includes("book") ||
    name.includes("read")
  ) {
    if (siteId === 'UK') return 0.0;     // UK books are zero-rated
    if (siteId === 'DE') return 7.0;     // German reduced rate for books
    if (siteId === 'FR') return 5.5;     // French reduced rate for books
    if (siteId === 'IT') return 4.0;
    if (siteId === 'ES') return 4.0;
    if (siteId === 'MY') return 0.0;     // Malaysia exempted books
    return Math.max(0.0, baseTax / 2);
  }

  if (
    name.includes("童装") ||
    name.includes("儿童衣服") ||
    name.includes("婴儿") ||
    name.includes("baby clothing") ||
    name.includes("children")
  ) {
    if (siteId === 'UK') return 0.0;     // UK children clothes are zero-rated
    if (siteId === 'US') return 0.0;
  }

  if (
    name.includes("近视镜") ||
    name.includes("矫正眼镜") ||
    name.includes("美瞳") ||
    name.includes("corrective glass") ||
    name.includes("prescription eye")
  ) {
    if (siteId === 'UK') return 5.0;     // UK reduced rate for health elements
    if (siteId === 'DE') return 7.0;     // German reduced rate for medical appliances
  }

  return baseTax;
}

export interface IntelligentTaxResult {
  rate: number;
  categoryName: string;
  matchedKeywords: string;
  ruleExplanation: string;
  isReduced: boolean;
}

/**
 * Intelligent categorization and VAT lookup engine
 */
export function getIntelligentTaxAnalysis(productName: string, categoryId: string, siteId: string): IntelligentTaxResult {
  const name = (productName || '').toLowerCase();
  
  // Standard VAT/sales tax rates per site
  const siteTaxMap: Record<string, number> = {
    US: 0.0,
    CA: 12.0,
    MX: 16.0,
    UK: 20.0,
    DE: 19.0,
    FR: 20.0,
    IT: 22.0,
    ES: 21.0,
    JP: 10.0,
    AU: 10.0,
    MY: 8.0,
    TH: 7.0,
    PH: 12.0,
    SG: 9.0,
    VN: 10.0
  };
  const baseTax = siteTaxMap[siteId] ?? 0.0;

  // 1. Food Check
  if (
    categoryId === 'grocery' ||
    name.includes("食品") ||
    name.includes("饮") ||
    name.includes("茶") ||
    name.includes("零食") ||
    name.includes("糖") ||
    name.includes("糕点") ||
    name.includes("果") ||
    name.includes("food") ||
    name.includes("tea") ||
    name.includes("drink") ||
    name.includes("snack")
  ) {
    if (siteId === 'UK') return { rate: 0.0, categoryName: "食品饮料", matchedKeywords: "食品/茶水", ruleExplanation: "英国对基本食品、果汁及茶饮等实行 0% 零加值税税率 (Zero-rated)", isReduced: true };
    if (siteId === 'DE') return { rate: 7.0, categoryName: "食品饮料", matchedKeywords: "食品/茶水", ruleExplanation: "德国对普通食品杂货课以 7.0% 文化/生活基本类特惠低增值税", isReduced: true };
    if (siteId === 'FR') return { rate: 5.5, categoryName: "食品饮料", matchedKeywords: "食品/茶水", ruleExplanation: "法国对生活必需食品与包装饮用茶等课以 5.5% 优惠极低税率", isReduced: true };
    if (siteId === 'IT') return { rate: 4.0, categoryName: "食品饮料", matchedKeywords: "食品/茶水", ruleExplanation: "意大利对主食生活物资一律统一配征 4.0% 超折减税折让", isReduced: true };
    if (siteId === 'ES') return { rate: 4.0, categoryName: "食品饮料", matchedKeywords: "食品/茶水", ruleExplanation: "西班牙对面包与日常食物配料实行 4.0% 超优惠课税红利", isReduced: true };
    if (siteId === 'JP') return { rate: 8.0, categoryName: "食品饮料", matchedKeywords: "食品/茶水", ruleExplanation: "日本对日常生鲜即食和非酒类饮料实行 8.0% 优惠轻课税税率", isReduced: true };
    if (siteId === 'MY') return { rate: 0.0, categoryName: "食品饮料", matchedKeywords: "食品/茶水", ruleExplanation: "马来西亚对部分基础日常生活大包食品免征销售税(Exempt SST)", isReduced: true };
    return { rate: Math.max(0.0, baseTax / 2), categoryName: "食品饮料", matchedKeywords: "食品/茶水", ruleExplanation: `该区域对食品杂货实行特别减半核算，按 ${Math.max(0.0, baseTax / 2).toFixed(1)}% 比例核缴`, isReduced: true };
  }

  // 2. Books Check
  if (
    categoryId === 'books' ||
    name.includes("书") ||
    name.includes("图") ||
    name.includes("绘本") ||
    name.includes("阅读") ||
    name.includes("画册") ||
    name.includes("book") ||
    name.includes("read")
  ) {
    if (siteId === 'UK') return { rate: 0.0, categoryName: "印刷出版", matchedKeywords: "出版书籍/画册", ruleExplanation: "英国对各类纸质图书、有声读物与正规教材实行 0% 的零税率征收 (Zero-rated)", isReduced: true };
    if (siteId === 'DE') return { rate: 7.0, categoryName: "印刷出版", matchedKeywords: "出版书籍/画册", ruleExplanation: "德国对文化印刷物资与实体学术书报收取 7.0% 文化特别补贴减免税率", isReduced: true };
    if (siteId === 'FR') return { rate: 5.5, categoryName: "印刷出版", matchedKeywords: "出版书籍/画册", ruleExplanation: "法国对书报杂志、学术或文学图书实行 5.5% 优惠低预扣税政策", isReduced: true };
    if (siteId === 'IT') return { rate: 4.0, categoryName: "印刷出版", matchedKeywords: "出版书籍/画册", ruleExplanation: "意大利对教科书与实体辅读书刊课以 4.0% 特许文化行业超低预征", isReduced: true };
    if (siteId === 'ES') return { rate: 4.0, categoryName: "印刷出版", matchedKeywords: "出版书籍/画册", ruleExplanation: "西班牙规定印刷和有声书籍适用 4.0% 优惠底税红利", isReduced: true };
    if (siteId === 'MY') return { rate: 0.0, categoryName: "印刷出版", matchedKeywords: "出版书籍/画册", ruleExplanation: "马来西亚免征印刷材质书籍、字典及报纸销售税 (Exempt SST)", isReduced: true };
    return { rate: Math.max(0.0, baseTax / 2), categoryName: "印刷出版", matchedKeywords: "出版书籍/画册", ruleExplanation: `大区对印刷出版物品提供特别加值宽限，按 ${Math.max(0.0, baseTax / 2).toFixed(1)}% 比例测税`, isReduced: true };
  }

  // 3. Children's Clothing & Toys Check
  if (
    name.includes("童装") ||
    name.includes("儿童衣服") ||
    name.includes("婴儿") ||
    name.includes("幼儿") ||
    name.includes("baby clothing") ||
    name.includes("children clothes") ||
    name.includes("toddler")
  ) {
    if (siteId === 'UK') return { rate: 0.0, categoryName: "儿童服饰", matchedKeywords: "婴儿服饰/童装", ruleExplanation: "英国法律明文规定：对14岁及以下儿童的衣服与安全鞋靴免缴 20% VAT (0% Zero-rated)", isReduced: true };
    if (siteId === 'US') return { rate: 0.0, categoryName: "儿童服饰", matchedKeywords: "婴儿服饰/童装", ruleExplanation: "美国大部分主流销售州政府对生活刚需类儿童服装免征额外销售税", isReduced: true };
  }

  // 4. Optical accessories matching Medical elements
  if (
    name.includes("近视镜") ||
    name.includes("矫正眼镜") ||
    name.includes("美瞳") ||
    name.includes("corrective glass") ||
    name.includes("prescription eye")
  ) {
    if (siteId === 'UK') return { rate: 5.0, categoryName: "视光医疗", matchedKeywords: "矫正眼镜/辅具", ruleExplanation: "英国对带有视光矫正性质的近视镜框架与辅具实行 5.0% 的民生关怀税率", isReduced: true };
    if (siteId === 'DE') return { rate: 7.0, categoryName: "视光医疗", matchedKeywords: "矫正眼镜/辅具", ruleExplanation: "德国对带矫正标志及治疗用途器具实行 7.0% 的低位优惠课税", isReduced: true };
  }

  // Default standard categorization name mapping
  const categoryFriendlyNames: Record<string, string> = {
    fashion: "服装、鞋包配件",
    cosmetics: "美妆与个护",
    electronics: "手机数码办公",
    electronics_device: "手机数码设备",
    electronics_accessories: "数码电子配件",
    home: "家居厨房生活",
    sports: "运动户外车配",
    toys: "玩具收藏动漫",
    collectibles: "手办文具收藏",
    jewelry: "轻奢高雅珠宝",
    grocery: "食品杂货饮料"
  };
  const categoryName = categoryFriendlyNames[categoryId] || "普通商业大类";

  return {
    rate: baseTax,
    categoryName,
    matchedKeywords: categoryId ? "品类预判" : "标准默认",
    ruleExplanation: siteId === 'US'
      ? "美国不设置联邦增值税，一般州税在销售端由平台向消费者单独合并收取，出厂结算以 0% 税率列账"
      : `该站按 ${categoryName} 品类的该国标准增值税 (VAT/SST/GST) 完税底线设定，税率为 ${baseTax.toFixed(1)}%`,
    isReduced: false
  };
}

const FBA_TIERS: Record<string, { maxWeightLbs: number; fee: number }[]> = {
  smallStandard: [
    { maxWeightLbs: 1/16, fee: 2.45 },
    { maxWeightLbs: 2/16, fee: 2.51 },
    { maxWeightLbs: 4/16, fee: 2.56 },
    { maxWeightLbs: 8/16, fee: 2.70 },
    { maxWeightLbs: 16/16, fee: 3.22 },
    { maxWeightLbs: 32/16, fee: 3.50 },
    { maxWeightLbs: 48/16, fee: 3.73 },
  ],
  largeStandard: [
    { maxWeightLbs: 1.0, fee: 3.50 },
    { maxWeightLbs: 2.0, fee: 4.00 },
    { maxWeightLbs: 3.0, fee: 4.50 },
    { maxWeightLbs: 4.0, fee: 5.00 },
    { maxWeightLbs: 5.0, fee: 5.50 },
    { maxWeightLbs: 6.0, fee: 6.00 },
    { maxWeightLbs: 7.0, fee: 6.50 },
    { maxWeightLbs: 8.0, fee: 7.00 },
    { maxWeightLbs: 9.0, fee: 7.50 },
    { maxWeightLbs: 10.0, fee: 8.00 },
    { maxWeightLbs: 11.0, fee: 8.50 },
    { maxWeightLbs: 12.0, fee: 8.90 },
    { maxWeightLbs: 13.0, fee: 9.40 },
    { maxWeightLbs: 14.0, fee: 9.90 },
    { maxWeightLbs: 15.0, fee: 10.40 },
    { maxWeightLbs: 16.0, fee: 10.90 },
    { maxWeightLbs: 17.0, fee: 11.40 },
    { maxWeightLbs: 18.0, fee: 11.90 },
    { maxWeightLbs: 19.0, fee: 12.40 },
    { maxWeightLbs: 20.0, fee: 12.90 },
  ],
  smallOversize: [
    { maxWeightLbs: 1.0, fee: 8.26 },
    { maxWeightLbs: 2.0, fee: 8.76 },
    { maxWeightLbs: 5.0, fee: 10.26 },
    { maxWeightLbs: 10.0, fee: 12.76 },
    { maxWeightLbs: 20.0, fee: 17.76 },
    { maxWeightLbs: 30.0, fee: 22.26 },
    { maxWeightLbs: 50.0, fee: 31.26 },
    { maxWeightLbs: 70.0, fee: 40.26 },
    { maxWeightLbs: 100.0, fee: 53.76 },
  ],
  mediumOversize: [
    { maxWeightLbs: 30.0, fee: 22.26 },
    { maxWeightLbs: 50.0, fee: 31.26 },
    { maxWeightLbs: 70.0, fee: 40.26 },
    { maxWeightLbs: 100.0, fee: 53.76 },
    { maxWeightLbs: 150.0, fee: 76.26 },
  ],
  largeOversize: [
    { maxWeightLbs: 50.0, fee: 75.76 },
    { maxWeightLbs: 70.0, fee: 82.76 },
    { maxWeightLbs: 100.0, fee: 93.26 },
    { maxWeightLbs: 150.0, fee: 110.76 },
  ],
};

export function getFBAFee(weightLbs: number, dimensions: { length?: number; width?: number; height?: number } | undefined): number {
  const length = dimensions?.length || 0;
  const width = dimensions?.width || 0;
  const height = dimensions?.height || 0;
  const maxDim = Math.max(length, width, height);
  const midDim = [length, width, height].sort((a, b) => b - a)[1] || 0;
  const minDim = Math.min(length, width, height);

  let sizeType: string;
  if (maxDim <= 15 && midDim <= 12 && minDim <= 0.75) {
    sizeType = 'smallStandard';
  } else if (maxDim <= 18 && midDim <= 14 && minDim <= 8) {
    sizeType = 'largeStandard';
  } else if (maxDim <= 60) {
    sizeType = 'smallOversize';
  } else if (maxDim <= 108) {
    sizeType = 'mediumOversize';
  } else {
    sizeType = 'largeOversize';
  }

  const tiers = FBA_TIERS[sizeType];
  for (const tier of tiers) {
    if (weightLbs <= tier.maxWeightLbs) {
      return tier.fee;
    }
  }
  return tiers[tiers.length - 1].fee;
}

export function calculateFBAStorageFee(dimensions: { length?: number; width?: number; height?: number } | undefined, isPeak: boolean = false): number {
  const length = dimensions?.length || 0;
  const width = dimensions?.width || 0;
  const height = dimensions?.height || 0;
  const volumeCubicFeet = (length * width * height) / 1728;

  const maxDim = Math.max(length, width, height);
  const midDim = [length, width, height].sort((a, b) => b - a)[1] || 0;
  const minDim = Math.min(length, width, height);
  const isLarge = maxDim > 18 || midDim > 14 || minDim > 8;

  if (isPeak) {
    return volumeCubicFeet * (isLarge ? 1.40 : 2.40);
  } else {
    return volumeCubicFeet * (isLarge ? 0.56 : 0.78);
  }
}

export function getWFSFee(weightLbs: number): number {
  if (weightLbs <= 0.5) return 3.30;
  if (weightLbs <= 1.0) return 3.90;
  if (weightLbs <= 2.0) return 4.60;
  if (weightLbs <= 5.0) return 5.80;
  if (weightLbs <= 10.0) return 8.20;
  if (weightLbs <= 20.0) return 12.00;
  if (weightLbs <= 30.0) return 16.00;
  const excess = Math.max(0, Math.ceil(weightLbs - 30.0));
  return 16.00 + excess * 0.60;
}

export function estimateFBMShipping(weightLbs: number, fromChina: boolean = false): number {
  if (fromChina) {
    if (weightLbs <= 0.44) return 5.50;
    if (weightLbs <= 1.1) return 7.50;
    if (weightLbs <= 2.2) return 9.50;
    if (weightLbs <= 5.5) return 14.00;
    return 20.00;
  } else {
    if (weightLbs <= 1.0) return 9.00;
    if (weightLbs <= 2.0) return 12.00;
    if (weightLbs <= 5.0) return 18.00;
    if (weightLbs <= 10.0) return 28.00;
    return 40.00;
  }
}

/**
 * Perform multi-site simulation calculations for a given input.
 */
export function calculateMultiSiteSimulation(
  input: SimulationInput,
  exchangeRateUSDToCNY: number,
  customExchangeRates?: Record<string, number>
): MultiSiteResult[] {
  const platformId = input.platformId || 'tiktok';

  return SITE_FEE_CONFIGS.map((site) => {
    // Determine the exchange rate for local currency to 1 USD
    const localToUSDExchangeRate = customExchangeRates && customExchangeRates[site.currency] !== undefined
      ? customExchangeRates[site.currency]
      : site.defaultExchangeRate; // e.g. 156.0 JPY for 1 USD
    
    // Derived rates
    const oneLocalInUSD = 1 / localToUSDExchangeRate;
    // How much 1 local unit equals in CNY
    const localToCNYRate = exchangeRateUSDToCNY / localToUSDExchangeRate;
    // How much 1 CNY equals in local unit
    const cnyToLocalRate = localToUSDExchangeRate / exchangeRateUSDToCNY;

    // Resolve Commission & Payment variables based on Platform and country
    let commissionRate = site.commissionRate;
    let fixedFee = site.fixedFee;
    let transactionRate = site.transactionRate;
    let fixedPaymentFee = 0.0;

    if (platformId === 'tiktok') {
      // Keep original TikTok calculation logic
      const categoriesForSite = SITE_CATEGORIES[site.id] || [];
      const activeCategory = categoriesForSite.find(c => c.id === input.category) || categoriesForSite[0] || null;
      commissionRate = activeCategory ? activeCategory.commissionRate : site.commissionRate;
      fixedFee = activeCategory ? activeCategory.fixedFee : site.fixedFee;
      transactionRate = site.transactionRate || 0.025;
      fixedPaymentFee = (site.id === 'US' || site.id === 'UK') ? 0.30 : 0.0;
    } else if (platformId === 'amazon') {
      const catKey = input.category || '';
      const customRate = AMAZON_REFERRAL_FEES[catKey] !== undefined ? AMAZON_REFERRAL_FEES[catKey] : 0.15;
      commissionRate = customRate;
      
      const minFeeUSD = AMAZON_MIN_FEE_RULES[catKey] !== undefined ? AMAZON_MIN_FEE_RULES[catKey] : 0.30;
      fixedFee = minFeeUSD * localToUSDExchangeRate;

      if (site.id === 'MX') {
        transactionRate = 0.03;
        fixedPaymentFee = 2.0;
      } else if (site.id === 'JP') {
        transactionRate = 0.03;
        fixedPaymentFee = 30.0;
      } else {
        transactionRate = 0.029;
        fixedPaymentFee = 0.30 * localToUSDExchangeRate;
      }
    } else if (platformId === 'etsy') {
      commissionRate = 0.065;

      if (site.id === 'CA') fixedFee = 0.20;
      else if (site.id === 'UK') fixedFee = 0.20;
      else if (['DE', 'FR', 'IT', 'ES'].includes(site.id)) fixedFee = 0.20;
      else if (site.id === 'JP') fixedFee = 30.0;
      else if (site.id === 'AU') fixedFee = 0.20;
      else if (site.id === 'MX') fixedFee = 4.0;
      else fixedFee = 0.20;

      transactionRate = 0.03;
      if (site.id === 'CA') fixedPaymentFee = 0.25;
      else if (site.id === 'UK') fixedPaymentFee = 0.25;
      else if (['DE', 'FR', 'IT', 'ES'].includes(site.id)) fixedPaymentFee = 0.25;
      else if (site.id === 'AU') fixedPaymentFee = 0.25;
      else if (site.id === 'JP') fixedPaymentFee = 30.0;
      else if (site.id === 'MX') fixedPaymentFee = 5.0;
      else fixedPaymentFee = 0.25;
    } else if (platformId === 'walmart') {
      const catKey = input.category || '';
      const customRate = WALMART_REFERRAL_FEES[catKey] !== undefined ? WALMART_REFERRAL_FEES[catKey] : 0.15;
      commissionRate = customRate;

      fixedFee = WALMART_MIN_FEE * localToUSDExchangeRate;

      if (site.id === 'MX') {
        transactionRate = 0.03;
        fixedPaymentFee = 2.0;
      } else {
        transactionRate = 0.029;
        fixedPaymentFee = 0.30 * localToUSDExchangeRate;
      }
    } else if (platformId === 'shopify') {
      commissionRate = 0.0;
      fixedFee = 0.0;
      transactionRate = 0.029;
      fixedPaymentFee = 0.30;
    }

    // Base product cost calculation (with CNY/USD currency toggle support)
    const cogsCurrency = input.cogsCurrency || 'CNY';
    const cogsRMB = cogsCurrency === 'USD' ? (input.cogs * exchangeRateUSDToCNY) : (input.cogs || 0);

    const businessMode = input.businessMode || 'virtual';
    const isVirtual = businessMode === 'virtual';

    const domesticShippingRMB = isVirtual ? (input.domesticShippingRMB !== undefined ? input.domesticShippingRMB : 5) : 0;
    const internationalShippingRMB = isVirtual ? (input.internationalShippingRMB !== undefined ? input.internationalShippingRMB : 15) : 0;
    const packagingLossRMB = input.packagingLossRMB !== undefined ? input.packagingLossRMB : 2;
    const generalExpensesRMB = input.generalExpensesRMB !== undefined ? input.generalExpensesRMB : 2;

    // Total base COGS in RMB (总本币成本)
    const totalRmbCost = cogsRMB + domesticShippingRMB + internationalShippingRMB + packagingLossRMB + generalExpensesRMB;

    // Convert cost items to local currency
    const cogsLocal = cogsRMB * cnyToLocalRate;
    const domesticShippingLocal = domesticShippingRMB * cnyToLocalRate;
    const internationalShippingLocal = internationalShippingRMB * cnyToLocalRate;
    const packagingLossLocal = packagingLossRMB * cnyToLocalRate;
    const generalExpensesLocal = generalExpensesRMB * cnyToLocalRate;
    const totalCostLocal = totalRmbCost * cnyToLocalRate;

    // Auto-calculate fulfillment and storage if Amazon/Walmart
    let resolvedFbtFeeLocal = isVirtual ? 0 : (input.fbtFeeLocal || 0);
    let resolvedStorageFeeLocal = isVirtual ? 0 : (input.storageFeeLocal || 0);

    const weight = input.productWeightLbs !== undefined ? input.productWeightLbs : 0.5;
    const length = input.dimensionLengthInches !== undefined ? input.dimensionLengthInches : 10;
    const width = input.dimensionWidthInches !== undefined ? input.dimensionWidthInches : 8;
    const height = input.dimensionHeightInches !== undefined ? input.dimensionHeightInches : 1;
    const dims = { length, width, height };
    const fromChina = input.fbmShippingFromChina || false;

    if (platformId === 'amazon') {
      const mode = input.amazonBusinessMode || 'FBA';
      if (mode === 'FBA' || mode === 'AWD') {
        const baseFbaUSD = getFBAFee(weight, dims);
        const finalFbaUSD = mode === 'AWD' ? baseFbaUSD + 0.50 : baseFbaUSD;
        resolvedFbtFeeLocal = finalFbaUSD * localToUSDExchangeRate;
        
        const storageUSD = calculateFBAStorageFee(dims, false);
        resolvedStorageFeeLocal = storageUSD * localToUSDExchangeRate;
      } else {
        const shippingUSD = estimateFBMShipping(weight, fromChina);
        resolvedFbtFeeLocal = shippingUSD * localToUSDExchangeRate;
        resolvedStorageFeeLocal = 0.0;
      }
    } else if (platformId === 'walmart') {
      const mode = input.walmartBusinessMode || 'WFS';
      if (mode === 'WFS') {
        const baseWfsUSD = getWFSFee(weight);
        resolvedFbtFeeLocal = baseWfsUSD * localToUSDExchangeRate;

        const volCuFt = (length * width * height) / 1728;
        const storageUSD = volCuFt * 0.75;
        resolvedStorageFeeLocal = storageUSD * localToUSDExchangeRate;
      } else {
        const shippingUSD = estimateFBMShipping(weight, fromChina);
        resolvedFbtFeeLocal = shippingUSD * localToUSDExchangeRate;
        resolvedStorageFeeLocal = 0.0;
      }
    }

    // Marketing and risk rates
    const affiliateRate = (input.affiliateCommissionRate || 0) / 100;
    const returnLossRate = (input.returnRate || 0) / 100;
    const targetMarginRate = (input.targetProfitMarginRate !== undefined ? input.targetProfitMarginRate : 20.0) / 100;
    
    // Auto tax determination if productName is specified
    let selectedTaxPercent = input.taxRateLocal !== undefined ? input.taxRateLocal : 0.0;
    if (input.productName) {
      selectedTaxPercent = getAutomatedTaxRate(input.productName, site.id);
    }
    const taxRate = selectedTaxPercent / 100;
    
    const adSpendRate = (input.adSpendRatioPercent !== undefined ? input.adSpendRatioPercent : 15) / 100;
    const hasAdSpendRatio = input.adSpendRatioPercent !== undefined;

    // Helper: Compute precise financial breakdown for a trial retail price
    const runTrialCalculation = (trialPrice: number) => {
      const taxes = trialPrice * taxRate;
      const actualAdSpend = hasAdSpendRatio ? (trialPrice * adSpendRate) : (input.adSpendLocal || 0);
      const creatorCommission = (platformId === 'tiktok' || platformId === 'shopify') ? (trialPrice * affiliateRate) : 0.0;

      // Product return and damage loss: custom calculation matching guidelines
      // "退货损耗 = 总成本 * 退货率"
      const returnLoss = totalCostLocal * returnLossRate;

      // Platform specific commissions & transaction charges
      let commissionFee = 0;
      let transactionFee = 0;
      let calculatedCustPaid = trialPrice;

      if (platformId === 'tiktok') {
        calculatedCustPaid = trialPrice + input.shippingPaidByBuyer - input.platformSubsidyLocal - input.sellerDiscountLocal + taxes;
        commissionFee = (trialPrice + input.platformSubsidyLocal) * commissionRate;
        transactionFee = calculatedCustPaid * transactionRate;
      } else if (platformId === 'amazon') {
        calculatedCustPaid = trialPrice + taxes;
        commissionFee = Math.max(trialPrice * commissionRate, fixedFee);
        transactionFee = 0.0;
      } else if (platformId === 'etsy') {
        calculatedCustPaid = trialPrice + taxes;
        commissionFee = trialPrice * commissionRate;
        transactionFee = trialPrice * transactionRate + fixedPaymentFee;
      } else if (platformId === 'walmart') {
        calculatedCustPaid = trialPrice + taxes;
        commissionFee = Math.max(trialPrice * commissionRate, fixedFee);
        transactionFee = trialPrice * transactionRate + fixedPaymentFee;
      } else if (platformId === 'shopify') {
        calculatedCustPaid = trialPrice + taxes;
        commissionFee = 0.0;
        transactionFee = trialPrice * transactionRate + fixedPaymentFee;
      }

      // Total platform fees
      let totalPlatformFees = commissionFee + transactionFee;
      if (platformId === 'tiktok') {
        totalPlatformFees += fixedFee; // standard fallback
      } else if (platformId === 'etsy') {
        totalPlatformFees += fixedFee; // Listing fee is part of platform fees
      }

      // Additional storage/fulfillment
      const otherOverhead = resolvedFbtFeeLocal + resolvedStorageFeeLocal;
      
      // Estimated Payout before payout company fees
      let estimatedPayout = 0;
      if (platformId === 'tiktok') {
        estimatedPayout = (trialPrice + input.platformSubsidyLocal) * (1 - commissionRate) - transactionFee - resolvedFbtFeeLocal - creatorCommission;
      } else {
        estimatedPayout = trialPrice - commissionFee - transactionFee - otherOverhead - creatorCommission;
      }

      // Checkout company payouts
      const payoutFeeRate = (input.customPayoutFeeRate || 0) / 100;

      let localPayoutFee = 0;
      if (site.isPercentageWithdrawal) {
        localPayoutFee = estimatedPayout * site.withdrawalFeeLocal;
      } else {
        localPayoutFee = site.withdrawalFeeLocal;
      }

      const payoutAfterLocal = Math.max(0, estimatedPayout - localPayoutFee);
      const exchangeLossRate = 0.015; // 1.5% buffer

      const finalAmountOutput = payoutAfterLocal * (1 - payoutFeeRate) * (1 - exchangeLossRate);
      const withdrawalFeePaid = payoutAfterLocal * payoutFeeRate + localPayoutFee;
      const exchangeLossBufferPaid = payoutAfterLocal * exchangeLossRate;

      // Net profit
      let netProfit = trialPrice - totalCostLocal - commissionFee - transactionFee - otherOverhead - actualAdSpend - returnLoss - taxes - withdrawalFeePaid - exchangeLossBufferPaid - creatorCommission;
      if (platformId === 'tiktok') {
        netProfit -= fixedFee;
      } else if (platformId === 'etsy') {
        netProfit -= fixedFee; // listing fee deducted
      }

      const netMargin = trialPrice > 0 ? (netProfit / trialPrice) * 100 : 0;
      
      return {
        customerPaid: calculatedCustPaid,
        commissionFee,
        transactionFee,
        totalPlatformFees,
        creatorCommission,
        returnLoss,
        actualAdSpend,
        taxes,
        withdrawalFeePaid,
        exchangeLossBufferPaid,
        netProfit,
        netMargin
      };
    };

    // Robust numerical solver to find Trial Price that meets target margin percentage
    let suggestedPriceLocal = 0;
    // Bisection search range
    let low = 0.01;
    let high = Math.max(50000.0, 10000.0 * localToUSDExchangeRate); // Scale limit to support high-nominal currencies like JPY, VND, etc.
    let solved = false;

    for (let iter = 0; iter < 80; iter++) {
      const mid = (low + high) / 2;
      const result = runTrialCalculation(mid);
      
      // Target equation: (netProfit / Price) = targetMarginRate
      // -> netProfit - Price * targetMarginRate = 0
      const diff = result.netProfit - mid * targetMarginRate;

      if (Math.abs(diff) < 0.0001) {
        suggestedPriceLocal = mid;
        solved = true;
        break;
      }

      if (diff > 0) {
        // Profit is too high, price can be lower
        high = mid;
      } else {
        // Profit is too low, price needs to be higher
        low = mid;
      }
    }

    if (!solved) {
      suggestedPriceLocal = (low + high) / 2;
    }

    // Determine the active working price based on user preference
    const price = input.pricingMode === 'reverse' ? suggestedPriceLocal : input.priceLocal;

    // Retrieve detailed metrics at working price
    const finalMetrics = runTrialCalculation(price);

    // Compute gross profit margin details
    const otherOverheadPrice = resolvedFbtFeeLocal + resolvedStorageFeeLocal;
    const grossProfit = price - totalCostLocal - finalMetrics.totalPlatformFees - otherOverheadPrice - finalMetrics.creatorCommission - finalMetrics.returnLoss - finalMetrics.taxes;
    const grossMargin = price > 0 ? (grossProfit / price) * 100 : 0;
    const isGrossMarginSafe = grossMargin >= 40.0;

    // Financial indicators (ROAS, break-even ROAS, CPA)
    const actualROAS = finalMetrics.actualAdSpend > 0 ? price / finalMetrics.actualAdSpend : 0;
    const isROASHealthy = actualROAS >= 2.5;

    // Break even analysis ratio calculation
    const costRatiosSum = (totalCostLocal + finalMetrics.totalPlatformFees + otherOverheadPrice + finalMetrics.creatorCommission + finalMetrics.returnLoss) / (price || 1);
    const breakEvenROAS = costRatiosSum < 1 ? 1 / (1 - costRatiosSum) : -1;

    const successfulOrderRatio = Math.max(0.01, 1 - returnLossRate);
    const eCPA = finalMetrics.actualAdSpend / successfulOrderRatio;

    return {
      siteId: site.id,
      siteName: site.name,
      currency: site.currency,
      symbol: site.symbol,
      exchangeRateToUSD: oneLocalInUSD,
      exchangeRateToCNY: localToCNYRate,
      customerPaid: finalMetrics.customerPaid,
      platformDiscountValue: input.sellerDiscountLocal || 0,
      commissionFee: finalMetrics.commissionFee,
      transactionFee: finalMetrics.transactionFee,
      fixedFee: (platformId === 'tiktok' || platformId === 'etsy') ? fixedFee : 0,
      totalPlatformFees: finalMetrics.totalPlatformFees,
      forwardLogistics: domesticShippingLocal + internationalShippingLocal,
      returnLoss: finalMetrics.returnLoss,
      totalLogisticsCost: domesticShippingLocal + internationalShippingLocal + finalMetrics.returnLoss,
      creatorCommission: finalMetrics.creatorCommission,
      cogsConverted: cogsLocal,
      adSpend: finalMetrics.actualAdSpend,
      generalOperationalExpenses: generalExpensesLocal,
      taxes: finalMetrics.taxes,
      storageFeeLocal: resolvedStorageFeeLocal,
      fbtFeeLocal: resolvedFbtFeeLocal,
      grossProfit,
      grossMargin,
      isGrossMarginSafe,
      withdrawalFee: finalMetrics.withdrawalFeePaid,
      exchangeLossBuffer: finalMetrics.exchangeLossBufferPaid,
      thirdPartyPayoutFeeRate: input.customPayoutFeeRate || 0.6,
      netProfit: finalMetrics.netProfit,
      netMargin: finalMetrics.netMargin,
      isNetMarginProfitable: finalMetrics.netProfit > 0,
      breakEvenROAS,
      actualROAS,
      isROASHealthy,
      eCPA,
      suggestedPriceLocal
    };
  });
}
