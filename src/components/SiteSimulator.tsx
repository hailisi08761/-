import React, { useState, useEffect, useMemo } from 'react';
import { MultiSiteResult, SimulationInput } from '../types';
import { SITE_CATEGORIES, SITE_FEE_CONFIGS, PLATFORMS, CATEGORIES_BY_PLATFORM, SITES_BY_PLATFORM } from '../data/feeStructures';
import { calculateMultiSiteSimulation, getAutomatedTaxRate, getIntelligentTaxAnalysis } from '../utils/calculator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Coins, 
  TrendingUp, 
  Info, 
  Settings, 
  Calculator, 
  Target, 
  Sparkles, 
  RefreshCw,
  FileText,
  Copy,
  CheckCircle2,
  AlertCircle,
  Globe,
  Percent,
  CalendarDays,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  Upload,
  Download,
  ClipboardCheck
} from 'lucide-react';

interface SiteSimulatorProps {
  results: MultiSiteResult[];
  input: SimulationInput;
  onChangeInput: (key: keyof SimulationInput, value: any) => void;
  exchangeRateUSDToCNY: number;
  exchangeRates: Record<string, number>;
  ratesLoading?: boolean;
  ratesFetchedAt?: string | null;
  onFetchRates?: () => Promise<void>;
}

export default function SiteSimulator({ 
  results, 
  input, 
  onChangeInput, 
  exchangeRateUSDToCNY,
  exchangeRates,
  ratesLoading = false,
  ratesFetchedAt = null,
  onFetchRates
}: SiteSimulatorProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('US');
  const [displayInCNY, setDisplayInCNY] = useState<boolean>(false);
  const [showCostBreakdown, setShowCostBreakdown] = useState<boolean>(false);
  const [returnRateThreshold, setReturnRateThreshold] = useState<number>(10);

  // 日/周/月单量与利润精算 States
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('month');
  const [salesOrders, setSalesOrders] = useState<number>(300);
  const [userCustomPrice, setUserCustomPrice] = useState<string>('');
  const [userCustomReturnCount, setUserCustomReturnCount] = useState<string>('');

  // 企业经营固定成本与精准定价 States
  const [historicalMonthlyOrders, setHistoricalMonthlyOrders] = useState<string>('');
  const [staffCostRMB, setStaffCostRMB] = useState<string>('');
  const [rentCostRMB, setRentCostRMB] = useState<string>('');
  const [erpCostRMB, setErpCostRMB] = useState<string>('');
  const [otherFixedCostRMB, setOtherFixedCostRMB] = useState<string>('');

  // 平台后台月度订单精算与成本识别 States
  const [monthlyOrders, setMonthlyOrders] = useState<Array<{ id: string; productName: string; quantity: number; siteId: string; salesRevenueLocal: number }>>([]);
  const [productCostDict, setProductCostDict] = useState<Record<string, { cogs: number; domesticShipping: number; internationalShipping: number }>>({});
  const [ordersFeedbackMsg, setOrdersFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Batch product evaluation states (Restored & Enhanced with Intelligent Tax Support)
  const [batchRawInput, setBatchRawInput] = useState<string>('');
  const [batchProducts, setBatchProducts] = useState<Array<{ id: string; name: string; cogs: number; domesticShipping: number; internationalShipping: number; targetMargin: number; category: string }>>([
    { id: '1', name: '防寒防雨儿童保暖夹克 (童装免税特许)', cogs: 35.0, domesticShipping: 5.0, internationalShipping: 10.0, targetMargin: 20.0, category: 'fashion' },
    { id: '2', name: '全彩页幼儿启蒙科普绘本 (图书特惠折扣)', cogs: 12.0, domesticShipping: 3.5, internationalShipping: 6.0, targetMargin: 22.0, category: 'books' },
    { id: '3', name: '无额外添加即食高纤即食速溶麦片 (食品民生低税)', cogs: 25.0, domesticShipping: 4.0, internationalShipping: 8.0, targetMargin: 18.0, category: 'grocery' },
    { id: '4', name: '5000mAh 极速磁吸自带线无线充电宝 (标准数码大类)', cogs: 45.0, domesticShipping: 6.0, internationalShipping: 12.0, targetMargin: 22.0, category: 'electronics' }
  ]);
  const [batchInfoMsg, setBatchInfoMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const parseMonthlyOrdersCsv = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length <= 1) return;

    const headerLine = lines[0].toLowerCase();
    const headers = headerLine.split(',');

    let idIdx = 0, nameIdx = 1, qtyIdx = 2, siteIdx = 3, revIdx = 4;
    headers.forEach((h, idx) => {
      if (h.includes('id') || h.includes('号') || h.includes('订单')) idIdx = idx;
      if (h.includes('name') || h.includes('商品') || h.includes('产品') || h.includes('标题')) nameIdx = idx;
      if (h.includes('qty') || h.includes('数量') || h.includes('count')) qtyIdx = idx;
      if (h.includes('site') || h.includes('国家') || h.includes('站点') || h.includes('country')) siteIdx = idx;
      if (h.includes('revenue') || h.includes('金额') || h.includes('price') || h.includes('销售') || h.includes('额')) revIdx = idx;
    });

    const parsed: Array<{ id: string; productName: string; quantity: number; siteId: string; salesRevenueLocal: number }> = [];
    const uniqueNames = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current.trim());

      if (parts.length < 2) continue;

      const orderId = parts[idIdx] || `ORD-M-${i}`;
      const productName = parts[nameIdx] || '未知商品';
      const quantity = Math.max(1, parseInt(parts[qtyIdx]) || 1);
      const siteId = (parts[siteIdx] || 'US').toUpperCase();
      const salesRevenueLocal = parseFloat(parts[revIdx]?.replace(/[^0-9.]/g, '')) || 29.99;

      parsed.push({
        id: orderId,
        productName,
        quantity,
        siteId,
        salesRevenueLocal
      });

      uniqueNames.add(productName);
    }

    if (parsed.length > 0) {
      const newDict: Record<string, { cogs: number; domesticShipping: number; internationalShipping: number }> = { ...productCostDict };
      uniqueNames.forEach((name) => {
        const matchedBatch = batchProducts.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (matchedBatch) {
          newDict[name] = {
            cogs: matchedBatch.cogs,
            domesticShipping: matchedBatch.domesticShipping,
            internationalShipping: matchedBatch.internationalShipping
          };
        } else if (!newDict[name]) {
          newDict[name] = { cogs: 0, domesticShipping: 0, internationalShipping: 0 };
        }
      });

      setMonthlyOrders(parsed);
      setProductCostDict(newDict);
      setOrdersFeedbackMsg({
        text: `🎉 成功导入月度订单后台报表！已自动为您去重识别出 ${uniqueNames.size} 款独立商品。相同商品的采购成本与头程运费已自动智能对齐归并！`,
        isError: false
      });
    } else {
      setOrdersFeedbackMsg({
        text: `🚫 月度账单解析失败！请确保 CSV 表头包含订单号、商品名称、销售额、站点等标识。`,
        isError: true
      });
    }
  };

  const handleMonthlyOrdersDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseMonthlyOrdersCsv(text);
      };
      reader.readAsText(file);
    }
  };

  const handleMonthlyOrdersFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseMonthlyOrdersCsv(text);
      };
      reader.readAsText(file);
    }
  };

  const platformId = input.platformId || 'tiktok';
  const categoriesForSelectedPlatform = CATEGORIES_BY_PLATFORM[platformId] || CATEGORIES_BY_PLATFORM.tiktok;

  // Trigger auto-select of the category and target site if the selected platform changes to prevent mismatches
  useEffect(() => {
    const activeCategoryExists = categoriesForSelectedPlatform.some(c => c.id === input.category);
    if (!activeCategoryExists && categoriesForSelectedPlatform.length > 0) {
      const defaultCat = categoriesForSelectedPlatform[0];
      onChangeInput('category', defaultCat.id);
    }

    // Auto transition target site if current site isn't supported by the chosen platform
    const supportedSites = SITES_BY_PLATFORM[platformId] || [];
    if (supportedSites.length > 0 && !supportedSites.includes(selectedSiteId)) {
      setSelectedSiteId(supportedSites[0]);
    }
  }, [platformId]);

  // Auto-set default tax rate based on site, category, and product name keywords (Smart Global Tax Pre-matching)
  useEffect(() => {
    const calculatedTax = getAutomatedTaxRate(input.productName || '', selectedSiteId);
    onChangeInput('taxRateLocal', calculatedTax);
  }, [selectedSiteId, input.productName, input.category]);

  const selectedResult = results.find(r => r.siteId === selectedSiteId) || results[0];

  // Dynamic Strategic Insights computed directly in the simulator
  const topSiteRecommendation = useMemo(() => {
    const sorted = [...results].sort((a, b) => b.netMargin - a.netMargin);
    return sorted[0] || results[0];
  }, [results]);

  const averageGrossMargin = useMemo(() => {
    if (results.length === 0) return 0;
    const total = results.reduce((acc, curr) => acc + curr.grossMargin, 0);
    return total / results.length;
  }, [results]);

  const monthlyReconciliationData = useMemo(() => {
    const totalOrdersCount = monthlyOrders.length;
    if (totalOrdersCount === 0) {
      return null;
    }

    let totalRevenueCNY = 0;
    let totalCogsCNY = 0;
    let totalShippingCNY = 0;
    let totalPlatformFeesCNY = 0;
    let totalAdSpendCNY = 0;
    let totalReturnLossCNY = 0;
    let totalTaxesCNY = 0;
    let totalWithdrawalFeesCNY = 0;

    monthlyOrders.forEach((order) => {
      const costs = productCostDict[order.productName] || { cogs: 0, domesticShipping: 0, internationalShipping: 0 };
      const qty = order.quantity;
      const r = results.find(x => x.siteId === order.siteId) || results[0];

      // Local revenue to CNY
      const revCNY = order.salesRevenueLocal * (r ? r.exchangeRateToCNY : 1.0) * qty;
      totalRevenueCNY += revCNY;

      // Purchase & shipping costs
      totalCogsCNY += costs.cogs * qty;
      totalShippingCNY += (costs.domesticShipping + costs.internationalShipping) * qty;

      // Platform fees (derived using our high fidelity pricing model coefficients)
      const commissionCNY = revCNY * 0.05; // 5% TikTok/Platform standard fee
      const transactionCNY = revCNY * 0.03; // 3% payment processing
      totalPlatformFeesCNY += (commissionCNY + transactionCNY);

      // Ad spend (assumed 15% rate of gross revenue if adSpend rate is set, or actual)
      const adSpendCNY = revCNY * 0.15; // default 15% budget
      totalAdSpendCNY += adSpendCNY;

      // Return Loss
      const returnLossCNY = (r ? r.returnLoss : 0) * (r ? r.exchangeRateToCNY : 1.0) * qty;
      totalReturnLossCNY += returnLossCNY;

      // Taxes
      const taxCNY = (r ? r.taxes : 0) * (r ? r.exchangeRateToCNY : 1.0) * qty;
      totalTaxesCNY += taxCNY;

      // Withdrawal fee
      const withdrawalCNY = (r ? (r.withdrawalFee + r.exchangeLossBuffer) : 0) * (r ? r.exchangeRateToCNY : 1.0) * qty;
      totalWithdrawalFeesCNY += withdrawalCNY;
    });

    const grandTotalExpensesCNY = totalCogsCNY + totalShippingCNY + totalPlatformFeesCNY + totalAdSpendCNY + totalReturnLossCNY + totalTaxesCNY + totalWithdrawalFeesCNY;
    const netProfitCNY = totalRevenueCNY - grandTotalExpensesCNY;
    const netMarginPercentage = totalRevenueCNY > 0 ? (netProfitCNY / totalRevenueCNY) * 100 : 0;

    return {
      totalOrdersCount,
      totalRevenueCNY,
      totalCogsCNY,
      totalShippingCNY,
      totalPlatformFeesCNY,
      totalAdSpendCNY,
      totalReturnLossCNY,
      totalTaxesCNY,
      totalWithdrawalFeesCNY,
      grandTotalExpensesCNY,
      netProfitCNY,
      netMarginPercentage
    };
  }, [monthlyOrders, productCostDict, results]);

  // Selected site specific category meta-data
  const activeCategory = categoriesForSelectedPlatform.find(c => c.id === input.category) || categoriesForSelectedPlatform[0] || null;

  const commissionRate = activeCategory ? activeCategory.commissionRate : 0.06;
  const fixedFee = activeCategory ? activeCategory.fixedFee : 0.30;

  // Compute Total Cost of goods in RMB
  const cogsCurrency = input.cogsCurrency || 'CNY';
  const cogsRMB = cogsCurrency === 'USD' ? (input.cogs * exchangeRateUSDToCNY) : (input.cogs || 0);
  const domesticShipping = input.domesticShippingRMB !== undefined ? input.domesticShippingRMB : 5.0;
  const internationalShipping = input.internationalShippingRMB !== undefined ? input.internationalShippingRMB : 15.0;
  const packagingLossRMB = input.packagingLossRMB !== undefined ? input.packagingLossRMB : 2.0;
  const generalExpensesRmb = input.generalExpensesRMB !== undefined ? input.generalExpensesRMB : 2.0;
  const totalCostRMB = cogsRMB + domesticShipping + internationalShipping + packagingLossRMB + generalExpensesRmb;

  // Helper to calculate pricing based on target profit margin to yield EXACTLY that target margin
  const calculatePriceForTargetMargin = (targetMarginPercent: number) => {
    // Solves for reverse price numerically by calling the robust calculator engine
    const targetInput = { ...input, pricingMode: 'reverse' as const, targetProfitMarginRate: targetMarginPercent };
    const simulated = calculateMultiSiteSimulation(targetInput, exchangeRateUSDToCNY, exchangeRates);
    const siteResult = simulated.find(r => r.siteId === selectedSiteId);
    return siteResult ? siteResult.suggestedPriceLocal : 0;
  };

  const handleApplyPresetMargin = (percent: number) => {
    if (mode === 'reverse') {
      onChangeInput('targetProfitMarginRate', percent);
    } else {
      const price = calculatePriceForTargetMargin(percent);
      onChangeInput('priceLocal', parseFloat(price.toFixed(2)));
    }
  };

  // Prepare Pie Chart data for target site's pricing structure
  const breakdownData = [
    { name: '采购货款 (COGS)', value: parseFloat(selectedResult.cogsConverted.toFixed(2)), color: '#3B82F6' },
    { name: '平台基础扣点', value: parseFloat(selectedResult.commissionFee.toFixed(2)), color: '#EF4444' },
    { name: '交易流支付费', value: parseFloat((selectedResult.transactionFee + selectedResult.fixedFee).toFixed(2)), color: '#F43F5E' },
    { name: '干线跨境物流', value: parseFloat(selectedResult.forwardLogistics.toFixed(2)), color: '#10B981' },
    { name: '联盟达人抽佣', value: parseFloat(selectedResult.creatorCommission.toFixed(2)), color: '#F59E0B' },
    { name: '退货损耗与退返', value: parseFloat(selectedResult.returnLoss.toFixed(2)), color: '#D97706' },
    { name: '海外投流成本', value: parseFloat(selectedResult.adSpend.toFixed(2)), color: '#8B5CF6' },
    { name: '商品税费款项', value: parseFloat(selectedResult.taxes.toFixed(2)), color: '#EAB308' },
    { name: '日常杂费与结汇', value: parseFloat((selectedResult.generalOperationalExpenses + selectedResult.withdrawalFee + selectedResult.exchangeLossBuffer).toFixed(2)), color: '#6B7280' },
  ].filter(item => item.value > 0);

  // Standard static currencies information
  const siteFlagMap: Record<string, string> = {
    US: '🇺🇸',
    UK: '🇬🇧',
    JP: '🇯🇵',
    MX: '🇲🇽',
    MY: '🇲🇾',
    TH: '🇹🇭',
    PH: '🇵🇭',
    SG: '🇸🇬',
    VN: '🇻🇳',
    CA: '🇨🇦',
    AU: '🇦🇺',
    DE: '🇩🇪',
    FR: '🇫🇷',
    IT: '🇮🇹',
    ES: '🇪🇸'
  };

  // Switcher dynamic formatting utility
  const formatMoney = (localValue: number, symbol: string, currency: string, rateToCNY: number) => {
    if (displayInCNY) {
      return `￥${(localValue * rateToCNY).toFixed(2)} CNY`;
    }
    return `${symbol}${localValue.toFixed(2)} ${currency}`;
  };

  // Compare Gross & Net Profit Margin Chart for all 4 sites
  const marginChartData = results.map(r => ({
    name: `${siteFlagMap[r.siteId] || ''} ${r.siteName}`,
    '毛利率 (%)': parseFloat(r.grossMargin.toFixed(1)),
    '净利率 (%)': parseFloat(r.netMargin.toFixed(1)),
  }));

  const mode = input.pricingMode || 'reverse';

  return (
    <div className="space-y-8" id="site-simulator-module">
      
      {/* Global currency switcher format toggler - Moved to Left with Premium styling */}
      <div className="flex justify-start pl-1">
        <div className="flex items-center space-x-2 bg-slate-100/90 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-250/60 shadow-xs hover:border-slate-300 transition-all duration-300">
          <button
            onClick={() => setDisplayInCNY(false)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
              !displayInCNY
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            显示海外本地原外币
          </button>
          <button
            onClick={() => setDisplayInCNY(true)}
            className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
              displayInCNY
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            显示折算人民币 (￥ CNY)
          </button>
        </div>
      </div>
      
      {/* Three Column Grid Layout - Organized with operations left-side vertical stack & results right-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Parameters Operations & Insights vertical stack (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            
            {/* COLUMN 1: 平台与销售大区选择 (md:col-span-3) */}
            <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md hover:shadow-lg transition-all duration-300 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                {/* A. Platform Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider pl-1">
                    电商销售平台
                  </label>
                  <select
                    value={platformId}
                    onChange={(e) => {
                      const pId = e.target.value;
                      onChangeInput('platformId', pId);
                      const platformCats = CATEGORIES_BY_PLATFORM[pId] || [];
                      if (platformCats.length > 0) {
                        onChangeInput('category', platformCats[0].id);
                      }
                    }}
                    className="w-full px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer transition-all"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* B. Dynamic Category Linkage Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider pl-1">
                    品类扣点佣金
                  </label>
                  <select
                    value={input.category}
                    onChange={(e) => {
                      onChangeInput('category', e.target.value);
                    }}
                    className="w-full px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer transition-all"
                  >
                    {categoriesForSelectedPlatform.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* C. Pricing Mode Switch */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider pl-1">
                    商业测算方向
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/20">
                    <button
                      onClick={() => onChangeInput('pricingMode', 'reverse')}
                      className={`py-2.5 px-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                        mode === 'reverse'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
                      }`}
                    >
                      <Target className="h-4 w-4" />
                      <span>售价反推</span>
                    </button>
                    <button
                      onClick={() => onChangeInput('pricingMode', 'forward')}
                      className={`py-2.5 px-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                        mode === 'forward'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
                      }`}
                    >
                      <Calculator className="h-4 w-4" />
                      <span>正向核算</span>
                    </button>
                  </div>
                </div>

                {/* D. Target Site Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider pl-1">
                    销售区域
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                    {SITE_FEE_CONFIGS.filter(site => {
                      const supportedSites = SITES_BY_PLATFORM[platformId] || [];
                      return supportedSites.includes(site.id);
                    }).map((site) => {
                      const isSelected = site.id === selectedSiteId;
                      return (
                        <button
                          key={site.id}
                          onClick={() => setSelectedSiteId(site.id)}
                          className={`flex items-center space-x-2.5 p-2 rounded-xl border text-left transition-all duration-300 group ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/20 shadow-sm scale-[1.02]'
                              : 'border-slate-150 bg-slate-50/50 hover:bg-white hover:border-slate-350 hover:shadow-xs'
                          }`}
                        >
                          <span className="text-xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{siteFlagMap[site.id] || '🌐'}</span>
                          <div className="leading-tight flex-1 min-w-0">
                            <span className="block text-sm font-bold text-slate-800 truncate">{site.name}</span>
                            <span className="block text-xs text-slate-500 font-mono mt-1">{site.currency}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* E. Fee details review box */}
                <div className="p-5 bg-slate-50/80 border border-slate-150 rounded-2xl text-sm text-slate-700 leading-relaxed space-y-2.5 font-medium">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-600">当前平台佣金率:</span>
                    <span className="font-extrabold text-indigo-600 font-mono text-sm">{(commissionRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-600">支付及收款费率:</span>
                    <span className="font-extrabold text-indigo-600 font-mono text-sm">
                      {platformId === 'amazon' ? '0.0%' : `${(selectedResult.thirdPartyPayoutFeeRate || 0.6).toFixed(1)}%`}
                    </span>
                  </div>
                  {fixedFee > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-600">单均基础固定费:</span>
                      <span className="font-extrabold text-indigo-600 font-mono text-sm">
                        {displayInCNY 
                          ? `￥${(fixedFee * selectedResult.exchangeRateToCNY).toFixed(2)}` 
                          : `${selectedResult.symbol}${fixedFee.toFixed(2)}`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* F. Exchange Rates (Keep cleanly at the bottom) */}
              <div className="pt-4 border-t border-slate-150 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-600 uppercase tracking-wider pl-1">SAFE 汇率核验</span>
                  {onFetchRates && (
                    <button
                      onClick={onFetchRates}
                      disabled={ratesLoading}
                      className="py-2 px-3.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition disabled:opacity-50 flex items-center gap-1.5 text-xs font-extrabold shadow-sm active:scale-95 duration-200"
                    >
                      <RefreshCw className={`h-3 w-3 ${ratesLoading ? 'animate-spin' : ''}`} />
                      <span>同步外汇</span>
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm font-mono bg-gradient-to-br from-slate-50 to-slate-100 p-3.5 rounded-2xl border border-slate-150">
                  <div className="space-y-1">
                    <span className="block text-xs text-slate-500 font-bold">1 USD 折合</span>
                    <span className="block font-black text-slate-800 text-base">￥{exchangeRateUSDToCNY.toFixed(3)}</span>
                  </div>
                  <div className="space-y-1 border-l border-slate-200 pl-3">
                    <span className="block text-xs text-slate-500 font-bold">1 {selectedResult.currency} 折合</span>
                    <span className="block font-black text-indigo-600 text-base">￥{(selectedResult.exchangeRateToCNY).toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: 核心跨境参数与自设成本配置 (md:col-span-4) */}
            <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="space-y-4">
                
                {/* 0. Product Name with Auto-Tax Recognition */}
                <div className="space-y-2 pb-2 border-b border-slate-100">
                  <div className="flex justify-between items-center bg-transparent">
                    <label className="block text-sm font-bold text-slate-750 pl-0.5 flex items-center gap-1.5">
                      <span className="p-1 bg-indigo-50 text-indigo-600 rounded-md">📦</span>
                      <span>关键词检索</span>
                    </label>
                    <span className="text-xs text-emerald-600 font-extrabold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Sparkles className="h-2.5 w-2.5 animate-pulse" /> 智能测税已激活
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="例: 防寒保暖少儿童装夹克、中幼绘本..."
                    value={input.productName || ''}
                    onChange={(e) => onChangeInput('productName', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-bold transition-all shadow-2xs placeholder:text-slate-400 placeholder:font-normal"
                  />
                  {input.productName && (
                    <div className="flex items-center gap-1 text-xs text-slate-550 mt-1 font-medium pl-1">
                      <span>已抓取税品标签：</span>
                      <strong className="text-indigo-600">
                        {getIntelligentTaxAnalysis(input.productName, input.category || '', selectedSiteId).categoryName} ({getIntelligentTaxAnalysis(input.productName, input.category || '', selectedSiteId).matchedKeywords})
                      </strong>
                    </div>
                  )}
                </div>

                {/* 业务模式 选择 */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-750 pl-0.5">
                    业务模式
                  </label>
                  <select
                    value={input.businessMode || 'virtual'}
                    onChange={(e) => {
                      onChangeInput('businessMode', e.target.value);
                    }}
                    className="w-full px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer transition-all"
                  >
                    <option value="virtual">虚拟仓模式 (Drop-shipping / 跨境直邮)</option>
                    <option value="local">官方本土仓模式 (Official Warehouse / FBT托管)</option>
                    <option value="overseas">海外仓第三方模式 (Overseas Warehouse / 3PL自发货)</option>
                  </select>
                </div>

                {/* A. Factory Cost with Currency Selector Toggle */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-transparent">
                    <label className="block text-sm font-bold text-slate-700 pl-0.5">
                      产品采购出厂价
                    </label>
                    <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => onChangeInput('cogsCurrency', 'CNY')}
                        className={`px-2 py-1 rounded-md transition-all ${cogsCurrency === 'CNY' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-750'}`}
                      >
                        ￥ CNY
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeInput('cogsCurrency', 'USD')}
                        className={`px-2 py-1 rounded-md transition-all ${cogsCurrency === 'USD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-750'}`}
                      >
                        $ USD
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-sm font-mono font-bold text-slate-400">
                      {cogsCurrency === 'CNY' ? '￥' : '$'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={input.cogs}
                      onChange={(e) => onChangeInput('cogs', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full pl-8 pr-4 py-3 text-sm bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                    />
                  </div>
                </div>

                {/* Conditional Shipping & Warehousing parameters */}
                {(!input.businessMode || input.businessMode === 'virtual') ? (
                  <>
                    {/* B. Domestic Shipping */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 pl-0.5">
                        国内打包运输 (￥ CNY) <span className="text-slate-400 text-xs font-medium">(可选)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={domesticShipping}
                        onChange={(e) => onChangeInput('domesticShippingRMB', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                      />
                    </div>

                    {/* C. International Shipping */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 pl-0.5">
                        跨国干线运输 (￥ CNY) <span className="text-slate-400 text-xs font-medium">(可选)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={internationalShipping}
                        onChange={(e) => onChangeInput('internationalShippingRMB', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* B. 本土尾程派送费 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 pl-0.5">
                        本土尾程派送费 ({selectedResult.symbol} {selectedResult.currency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={input.fbtFeeLocal !== undefined ? input.fbtFeeLocal : 2.50}
                        onChange={(e) => onChangeInput('fbtFeeLocal', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                      />
                    </div>

                    {/* C. 仓储费 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 pl-0.5">
                        仓储费 ({selectedResult.symbol} {selectedResult.currency}) <span className="text-slate-400 text-xs font-medium">(件/月)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.05"
                        value={input.storageFeeLocal !== undefined ? input.storageFeeLocal : 0.30}
                        onChange={(e) => onChangeInput('storageFeeLocal', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                      />
                    </div>
                  </>
                )}

                {/* D. Packaging label and loss */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 pl-0.5">
                    包装贴标与损耗 (￥ CNY) <span className="text-slate-400 text-xs font-medium">(可选)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={packagingLossRMB}
                    onChange={(e) => onChangeInput('packagingLossRMB', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                  />
                </div>

                {/* E1. Affiliate Commission Rate & Return Loss Rate */}
                <div className="grid grid-cols-2 gap-3 pb-1">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 leading-none">达人佣金比例 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={input.affiliateCommissionRate}
                      onChange={(e) => onChangeInput('affiliateCommissionRate', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-extrabold text-slate-850 text-xs transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 leading-none">退货退款率 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={input.returnRate}
                      onChange={(e) => onChangeInput('returnRate', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-extrabold text-slate-850 text-xs transition-all"
                    />
                  </div>
                </div>

                {/* E2. Ad Spend & Tax */}
                <div className="grid grid-cols-2 gap-3 pb-1">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-indigo-500 leading-none">广告流量占比 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={input.adSpendRatioPercent !== undefined ? input.adSpendRatioPercent : 15.0}
                      onChange={(e) => onChangeInput('adSpendRatioPercent', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 bg-indigo-50/20 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-extrabold text-slate-900 text-xs transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 leading-none">商品加算税率 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={input.taxRateLocal !== undefined ? input.taxRateLocal : 0}
                      onChange={(e) => onChangeInput('taxRateLocal', Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-extrabold text-xs transition-all ${
                        getIntelligentTaxAnalysis(input.productName || '', input.category || '', selectedSiteId).isReduced
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300'
                          : 'bg-slate-50 text-slate-850 border-slate-250'
                      }`}
                    />
                  </div>
                </div>

                {/* Smart Tax Rules Highlighting Card */}
                {(() => {
                  const analysis = getIntelligentTaxAnalysis(input.productName || '', input.category || '', selectedSiteId);
                  if (!analysis.isReduced) return null; // Completely deletes the requested standard tax rate block
                  return (
                    <div className="p-3.5 rounded-2xl text-xs border leading-relaxed transition-all duration-300 bg-emerald-50 text-emerald-850 border-emerald-250/80 shadow-md shadow-emerald-500/5">
                      <div className="flex items-center justify-between font-bold mb-1.5">
                        <span className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded font-black text-xs bg-emerald-600 text-white animate-pulse">
                            ✨ 智能匹配免减税
                          </span>
                          <span className="text-slate-850 tracking-tight">测税类目: {analysis.categoryName}</span>
                        </span>
                        <span className="font-mono font-black text-emerald-700">
                          {analysis.rate.toFixed(1)}%
                        </span>
                      </div>
                      <p className="font-medium text-slate-650 text-xs">{analysis.ruleExplanation}</p>
                    </div>
                  );
                })()}

                {/* F. Pricing Settings */}
                {mode === 'reverse' ? (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">需求净利润率 (Net Margin)</label>
                      <span className="text-xs bg-indigo-100/90 text-indigo-850 px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider">反推计算</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="-50"
                        max="90"
                        step="0.5"
                        value={input.targetProfitMarginRate !== undefined ? input.targetProfitMarginRate : 20.0}
                        onChange={(e) => onChangeInput('targetProfitMarginRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-indigo-950 font-mono font-black text-sm transition-all"
                      />
                      <span className="absolute right-4.5 top-3.5 text-sm font-bold font-mono text-indigo-500">%</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-slate-205">
                    <div className="flex justify-between items-center text-sm">
                      <label className="text-sm font-bold text-slate-700">销售牌面价 (Price)</label>
                      <span className="text-xs bg-emerald-100 text-emerald-805 px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider">正算评估</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={input.priceLocal}
                        onChange={(e) => onChangeInput('priceLocal', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-4 py-3 bg-emerald-50/20 border border-emerald-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-emerald-950 font-mono font-black text-sm transition-all"
                      />
                      <span className="absolute right-4.5 top-3.5 text-sm font-bold font-mono text-emerald-600">
                        {selectedResult.symbol} ({selectedResult.currency})
                      </span>
                    </div>
                  </div>
                )}

                {/* Margin quick selector */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[10, 15, 20, 25, 30].map((p) => {
                    const isSelected = Math.abs((input.targetProfitMarginRate ?? 20) - p) < 0.1;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleApplyPresetMargin(p)}
                        className={`py-2 rounded-xl text-sm font-mono font-bold border transition-all active:scale-95 duration-250 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                        }`}
                      >
                        {p}%
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Quick Strategic Insights Bar below Operations area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-100/40 border border-slate-200/50 p-4 rounded-2xl shadow-2xs">
            
            <div className="bg-white rounded-xl border border-slate-150 p-3 shadow-2xs flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs text-slate-500 font-extrabold mb-0.5 whitespace-nowrap">最优投产推荐站点</span>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  {topSiteRecommendation.siteName} 
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-mono">
                    净利: {topSiteRecommendation.netMargin.toFixed(0)}%
                  </span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-150 p-3 shadow-2xs flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-extrabold mb-0.5">全球大盘均值毛利率</span>
                <span className={`text-sm font-bold font-mono ${averageGrossMargin >= 40 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {averageGrossMargin.toFixed(1)}% {averageGrossMargin >= 40 ? ' (空间健康)' : ' (空间偏薄)'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-150 p-3 shadow-2xs flex items-center space-x-3">
              <div className="p-2.5 bg-violet-50 rounded-lg text-violet-600">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-extrabold mb-0.5">标准资金周转到款</span>
                <span className="text-sm font-bold text-slate-850 font-mono">
                  {input.payoutToolId === 'lianlian' ? 'D+ 16 天左右' : 'D+ 11 天放款'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-150 p-3 shadow-2xs flex items-center space-x-3">
              <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-extrabold mb-0.5">投流安全阀限制</span>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  {input.category === 'fashion' ? '退货上限 15%' : '退货上限 5%'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 3: 实时结果看板 (col-span-5) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-7 text-white shadow-xl flex flex-col justify-between space-y-5 border border-slate-800">
          
          <div className="space-y-4">
            {/* Big Headline Price block */}
            <div className="bg-slate-850 p-6 rounded-xl border border-slate-800 space-y-2.5 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {mode === 'reverse' ? '逆向推演: 建议合理售价' : '设定牌面零售价'}
                </span>
                <span className="font-mono text-emerald-400 text-xs bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  {selectedResult.siteName} (国别: {selectedResult.siteId})
                </span>
              </div>
              
              <div className="flex items-baseline space-x-1.5 flex-wrap">
                {displayInCNY ? (
                  <>
                    <span className="text-2xl font-bold text-emerald-400 font-mono">￥</span>
                    <span className="text-5xl md:text-6xl font-black font-mono tracking-tight text-white bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text">
                      {selectedResult.cogsConverted === 0 ? '0.00' : ((mode === 'reverse' ? selectedResult.suggestedPriceLocal : input.priceLocal) * selectedResult.exchangeRateToCNY).toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-slate-400 font-mono ml-2">CNY</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-indigo-400 font-mono">{selectedResult.symbol}</span>
                    <span className="text-5xl md:text-6xl font-black font-mono tracking-tight text-white bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text">
                      {selectedResult.cogsConverted === 0 ? '0.00' : (mode === 'reverse' ? selectedResult.suggestedPriceLocal : input.priceLocal).toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-slate-400 font-mono ml-2">{selectedResult.currency}</span>
                  </>
                )}
              </div>
              
              <p className="text-xs text-slate-400 font-bold pt-1.5 border-t border-slate-800">
                {displayInCNY ? (
                  `海外原始售价: ${selectedResult.symbol}${(mode === 'reverse' ? selectedResult.suggestedPriceLocal : input.priceLocal).toFixed(2)} ${selectedResult.currency}`
                ) : (
                  `人民币折合价: ￥${((mode === 'reverse' ? selectedResult.suggestedPriceLocal : input.priceLocal) * selectedResult.exchangeRateToCNY).toFixed(2)} CNY`
                )}
              </p>
            </div>

            {/* Profit summary panel */}
            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Expected single net profit */}
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="block text-xs text-slate-400 font-bold">预计单笔净利润</span>
                {displayInCNY ? (
                  <>
                    <span className={`block text-2xl font-black font-mono tracking-tight ${selectedResult.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ￥{(selectedResult.netProfit * selectedResult.exchangeRateToCNY).toFixed(2)}
                    </span>
                    <span className="block text-xs text-slate-550 font-mono">
                      原币: {selectedResult.symbol}{selectedResult.netProfit.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={`block text-2xl font-black font-mono tracking-tight ${selectedResult.netProfit >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
                      {selectedResult.symbol}{selectedResult.netProfit.toFixed(2)}
                    </span>
                    <span className="block text-xs text-slate-550 font-mono">
                      折合: ￥{(selectedResult.netProfit * selectedResult.exchangeRateToCNY).toFixed(2)} CNY
                    </span>
                  </>
                )}
              </div>

              {/* Net margin and gross margin */}
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="block text-xs text-slate-400 font-bold">实得净利润比例</span>
                <span className={`block text-2xl font-black font-mono tracking-tight ${selectedResult.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedResult.netMargin.toFixed(1)}%
                </span>
                <span className="block text-xs text-slate-400 border-t border-slate-800 mt-1 pt-1 font-semibold text-right">
                  毛利率: <span className="font-bold text-indigo-300 font-mono">{selectedResult.grossMargin.toFixed(1)}%</span>
                </span>
              </div>

            </div>

            {/* Collapsible cost details list ("成本明细展开" collapsible list button) */}
            <div className="bg-slate-850/50 rounded-xl border border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCostBreakdown(!showCostBreakdown)}
                className="w-full px-4 py-2.5 bg-slate-850 hover:bg-slate-800 border-b border-slate-800/80 transition flex items-center justify-between text-xs font-bold text-slate-200"
              >
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span>分项核算财务成本明细清单</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-mono text-slate-400">{showCostBreakdown ? '折叠' : '点击展开'}</span>
                  {showCostBreakdown ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </div>
              </button>
              
              {showCostBreakdown && (
                <div className="p-3.5 space-y-2 text-xs font-mono border-t border-slate-900/60 transition-all">
                  <div className="flex justify-between border-b border-slate-800/40 pb-1">
                    <span className="text-slate-400 font-sans">1. 货源出厂首采购价</span>
                    <span className="text-slate-200">
                      ￥{cogsRMB.toFixed(2)} CNY / {selectedResult.symbol}{selectedResult.cogsConverted.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1">
                    <span className="text-slate-400 font-sans">2. 国内打包加箱物流</span>
                    <span className="text-slate-200">
                      ￥{domesticShipping.toFixed(2)} CNY / {selectedResult.symbol}{(domesticShipping * (selectedResult.cogsConverted / (cogsRMB || 1))).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1">
                    <span className="text-slate-400 font-sans">3. 跨国专线干线物流</span>
                    <span className="text-slate-200">
                      ￥{internationalShipping.toFixed(2)} CNY / {selectedResult.symbol}{(internationalShipping * (selectedResult.cogsConverted / (cogsRMB || 1))).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1">
                    <span className="text-slate-400 font-sans">4. 包装贴标与库损费用</span>
                    <span className="text-slate-200">
                      ￥{packagingLossRMB.toFixed(2)} CNY / {selectedResult.symbol}{(packagingLossRMB * (selectedResult.cogsConverted / (cogsRMB || 1))).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1">
                    <span className="text-slate-400 font-sans">5. 平台佣金扣点占比</span>
                    <span className="text-slate-200">
                      {selectedResult.symbol}{selectedResult.commissionFee.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1">
                    <span className="text-slate-400 font-sans">6. 支付流结算与手续费</span>
                    <span className="text-slate-200">
                      {selectedResult.symbol}{selectedResult.transactionFee.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1">
                    <span className="text-slate-400 font-sans">7. 自选营销流量投放费用</span>
                    <span className="text-slate-200">
                      {selectedResult.symbol}{selectedResult.adSpend.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1">
                    <span className="text-slate-400 font-sans">8. 逆反退货折旧及损耗</span>
                    <span className="text-slate-300 font-bold transition-all">
                      {selectedResult.symbol}{selectedResult.returnLoss.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/40 pb-1">
                    <span className="text-slate-400 font-sans">9. 本地销售增值消费税款</span>
                    <span className="text-slate-200">
                      {selectedResult.symbol}{selectedResult.taxes.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">10. 境外提现手续费及汇损</span>
                    <span className="text-slate-200">
                      {selectedResult.symbol}{(selectedResult.withdrawalFee + selectedResult.exchangeLossBuffer).toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 📈 日/周/月单量与利润精算 */}
            <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 space-y-4 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="font-bold text-xs tracking-wider text-indigo-400 flex items-center gap-1.5 uppercase font-mono">
                  📊 订单与利润周期评估 ({selectedResult.siteId})
                </span>
                <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
                  {(['day', 'week', 'month'] as const).map((frame) => (
                    <button
                      key={frame}
                      onClick={() => {
                        setTimeFrame(frame);
                        setSalesOrders(frame === 'day' ? 10 : frame === 'week' ? 70 : 300);
                      }}
                      className={`px-2 py-0.5 rounded transition-all font-bold text-xs ${
                        timeFrame === frame ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {frame === 'day' ? '日' : frame === 'week' ? '周' : '月'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <label className="block text-slate-450 font-bold text-xs">周期内单量</label>
                  <input
                    type="number"
                    min="1"
                    value={salesOrders}
                    onChange={(e) => setSalesOrders(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-450 font-bold text-xs">退货数量 <span className="text-slate-500 font-normal">(自定义)</span></label>
                  <input
                    type="number"
                    min="0"
                    placeholder={Math.round(salesOrders * (input.returnRate / 100)).toString()}
                    value={userCustomReturnCount}
                    onChange={(e) => setUserCustomReturnCount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              {(() => {
                const refundRateVal = input.returnRate / 100;
                const refundsCount = userCustomReturnCount !== '' ? parseInt(userCustomReturnCount) || 0 : Math.round(salesOrders * refundRateVal);

                // Estimated Revenue = orders * suggestedPriceLocal
                const totalRevenueLocal = salesOrders * selectedResult.suggestedPriceLocal;
                // Net Profit per order = selectedResult.netProfit
                const baseNetProfitLocal = selectedResult.netProfit * salesOrders;
                const defaultRefundsCount = Math.round(salesOrders * refundRateVal);
                const refundsDifference = refundsCount - defaultRefundsCount;
                
                // Back-calculate return loss per unit: returnLoss = totalCostLocal * returnRate.
                // Thus loss per returned unit is selectedResult.returnLoss / (refundRateVal || 0.01)
                const returnLossPerUnit = refundRateVal > 0 ? (selectedResult.returnLoss / refundRateVal) : selectedResult.cogsConverted;
                const profitAdjustment = refundsDifference * returnLossPerUnit;
                const adjustedNetProfitLocal = Math.max(-totalRevenueLocal, baseNetProfitLocal - (isNaN(profitAdjustment) ? 0 : profitAdjustment));
                const adjustedNetMargin = totalRevenueLocal > 0 ? (adjustedNetProfitLocal / totalRevenueLocal) * 100 : 0;

                return (
                  <div className="bg-slate-950 p-4 rounded-2xl space-y-3 border border-slate-800/60 shadow-inner">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs text-slate-500 font-bold uppercase tracking-wider">预估总营收</span>
                        <div className="text-sm font-extrabold text-slate-100 font-mono">
                          {selectedResult.symbol}{totalRevenueLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          ≈ ￥{(totalRevenueLocal * selectedResult.exchangeRateToCNY).toLocaleString(undefined, { maximumFractionDigits: 0 })} CNY
                        </span>
                      </div>

                      <div>
                        <span className="block text-xs text-indigo-400 font-bold uppercase tracking-wider">预估期内净利润</span>
                        <div className={`text-sm font-black font-mono ${adjustedNetProfitLocal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {adjustedNetProfitLocal >= 0 ? '+' : ''}{selectedResult.symbol}{adjustedNetProfitLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          ≈ ￥{(adjustedNetProfitLocal * selectedResult.exchangeRateToCNY).toLocaleString(undefined, { maximumFractionDigits: 0 })} CNY
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-slate-800/60" />

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">期内综合净利率：</span>
                      <span className={`font-mono font-black ${adjustedNetMargin >= 20 ? 'text-emerald-400' : adjustedNetMargin >= 10 ? 'text-yellow-400' : 'text-rose-400'}`}>
                        {adjustedNetMargin.toFixed(1)}%
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 leading-relaxed">
                      * 测算公式: 单量 × 零售价 ({selectedResult.symbol}{selectedResult.suggestedPriceLocal.toFixed(2)})，已自动扣减该站点的各级税费、物流、达人带货、退款损耗与结汇损失。
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Threshold Checks Box */}
            <div className={`p-4.5 rounded-xl border flex items-start gap-3 text-sm ${
              selectedResult.grossMargin >= 40.0
                ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-100'
                : selectedResult.grossMargin <= 0
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                  : 'bg-yellow-950/20 border-yellow-500/20 text-yellow-100'
            }`}>
              {selectedResult.grossMargin >= 40.0 ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold">财务状况良好 ({selectedResult.grossMargin.toFixed(1)}%)</span>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed mt-0.5">
                      当前毛利率为 {selectedResult.grossMargin.toFixed(1)}%，处于安全盈利水位。具备充足的广告投放预算与达人分佣带货空间，可稳定抵抗退货风险。
                    </p>
                  </div>
                </>
              ) : selectedResult.grossMargin <= 0 ? (
                <>
                  <ShieldAlert className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-rose-400 font-black">毛利亏损预警 ({selectedResult.grossMargin.toFixed(1)}%)</span>
                    <p className="text-xs text-rose-200 font-semibold leading-relaxed mt-0.5">
                      当前定价下毛利率为 {selectedResult.grossMargin.toFixed(1)}%，已跌破保本红线！请立即优化出厂采购采购价或向上调高零售售价。
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-yellow-350 font-black">毛利偏低预警 ({selectedResult.grossMargin.toFixed(1)}%)</span>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed mt-0.5">
                      当前测算毛利率为 {selectedResult.grossMargin.toFixed(1)}%，低于大盘 40% 的理想水位。建议通过整合物流渠道或微调零售售价来提升盈利弹性。
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recharts Pie Chart representation inside column 3 */}
          <div className="space-y-4 px-1 border-t border-slate-800/80 pt-5">
            <span className="block text-xs text-slate-400 font-black tracking-widest uppercase font-mono">成本与费用占比构成估算 ({selectedResult.siteId})</span>
            <div className="flex flex-col md:flex-row items-center gap-8 justify-center bg-slate-850 p-6 rounded-2xl border border-slate-800/60 shadow-inner">
              <div className="h-48 w-48 relative flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">加权毛利率</span>
                  <span className="block text-2xl font-black font-mono text-indigo-300">{selectedResult.grossMargin.toFixed(1)}%</span>
                </div>
              </div>

              {/* Enhanced detailed legends */}
              <div className="flex-1 space-y-2 text-xs text-slate-300 font-mono w-full">
                {breakdownData.map((entry) => {
                  let val = entry.value;
                  let dispSymbol = selectedResult.symbol;
                  if (displayInCNY) {
                    val = val * selectedResult.exchangeRateToCNY;
                    dispSymbol = '￥';
                  }
                  return (
                    <div key={entry.name} className="flex items-center justify-between font-bold border-b border-slate-800/50 pb-1.5 last:border-0 last:pb-0">
                      <span className="flex items-center gap-2 truncate">
                        <span className="w-2 rounded-full h-2 flex-shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="truncate text-slate-400 font-sans text-xs">{entry.name}</span>
                      </span>
                      <span className="text-slate-100 font-mono text-xs font-bold text-right">{dispSymbol}{val.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ROAS & Conversion analysis sub-grid */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <TrendingUp className="h-5.5 w-5.5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-800">4. 盈亏双向测算与抗风险敏感度</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* A. Break-Even ROAS container */}
          <div className="p-4.5 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
            <span className="block text-sm font-bold text-slate-700">保本投流比系数 (Break-even ROAS)</span>
            <div className="text-2xl font-black text-slate-800 font-mono">
              {selectedResult.breakEvenROAS < 0 ? (
                <span className="text-rose-600 text-sm font-semibold">毛利为负，无法保本</span>
              ) : (
                `${selectedResult.breakEvenROAS.toFixed(2)} x`
              )}
            </div>
            <p className="text-xs text-slate-450 leading-relaxed font-semibold">
              TikTok 投流保本临界最低 ROAS 底线。
            </p>
          </div>

          {/* B. Break-Even CPA limit */}
          <div className="p-4.5 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
            <span className="block text-sm font-bold text-slate-700">保本获客成本上限 (eCPA Limit)</span>
            <div className="text-2xl font-black text-indigo-700 font-mono">
              {selectedResult.grossProfit <= 0 ? (
                <span className="text-rose-500 text-sm font-semibold">毛利为负无空间</span>
              ) : (
                displayInCNY 
                  ? `￥${(selectedResult.grossProfit * selectedResult.exchangeRateToCNY).toFixed(2)}` 
                  : `${selectedResult.symbol}${selectedResult.grossProfit.toFixed(2)}`
              )}
            </div>
            <p className="text-xs text-slate-450 leading-relaxed font-semibold">
              等同于：￥{Math.max(0, selectedResult.grossProfit * selectedResult.exchangeRateToCNY).toFixed(1)} CNY。单单成功交付后能用于获客出价的最极限额度。
            </p>
          </div>

          {/* C. Return Loss Sensitivity advice */}
          <div className="p-4.5 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <span className="block text-sm font-bold text-rose-650">跨国退货熔断机制</span>
            <div className="flex items-center justify-between text-sm font-bold text-slate-700 gap-2">
              <span>退货率阀值：</span>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={returnRateThreshold}
                onChange={(e) => setReturnRateThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 px-2.5 py-1 text-center bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-rose-450 leading-relaxed font-semibold">
              各战区若实际退货率（{input.returnRate || 0}%）超过此阀值（{returnRateThreshold}%），会导致店铺平台降权或限制提现。
            </p>
          </div>

        </div>
      </div>

      {/* 多站点商品批量定价测算 (配合智能测税) */}
      {(() => {
        // Simple client-side robust CSV/Table parser
        const parseCsvContent = (text: string) => {
          const lines = text.split(/\r?\n/);
          if (lines.length === 0) return [];

          const splitLine = (lineStr: string) => {
            const parts: string[] = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < lineStr.length; i++) {
              const char = lineStr[i];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if ((char === ',' || char === '\t' || char === ';' || char === '，') && !inQuotes) {
                parts.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            parts.push(current.trim());
            return parts;
          };

          const firstLine = lines[0]?.trim() || '';
          const rawHeaders = splitLine(firstLine);

          let nameIndex = 0;
          let cogsIndex = 1;
          let domesticShippingIndex = 2;
          let internationalShippingIndex = 3;
          let marginIndex = 4;
          let categoryIndex = 5;

          let hasHeaders = false;
          const isHeader = (h: string) => {
            const l = h.toLowerCase();
            return l.includes('名') || l.includes('cogs') || l.includes('cost') || l.includes('成本') || l.includes('费用') || l.includes('类目') || l.includes('category') || l.includes('利润') || l.includes('margin') || l.includes('运费') || l.includes('物流');
          };

          if (rawHeaders.some(isHeader)) {
            hasHeaders = true;
            rawHeaders.forEach((header, index) => {
              const h = header.toLowerCase();
              if (h.includes('名') || h.includes('product') || h.includes('name')) {
                nameIndex = index;
              } else if (h.includes('采购') || h.includes('出厂') || h.includes('cogs') || h.includes('成本') || (h.includes('cost') && !h.includes('物流') && !h.includes('运费') && !h.includes('shipping'))) {
                cogsIndex = index;
              } else if (h.includes('国内物流') || h.includes('国内运费') || h.includes('头程') || h.includes('domestic') || h.includes('domestic_shipping') || h.includes('domesticshipping')) {
                domesticShippingIndex = index;
              } else if (h.includes('跨境物流') || h.includes('跨境运费') || h.includes('国际') || h.includes('干线') || h.includes('international') || h.includes('cross') || h.includes('shipping_cost') || h.includes('internationalshipping') || h.includes('international_shipping')) {
                internationalShippingIndex = index;
              } else if (h.includes('期望') || h.includes('利益') || h.includes('利润') || h.includes('margin') || h.includes('profit')) {
                marginIndex = index;
              } else if (h.includes('类目') || h.includes('标签') || h.includes('category') || h.includes('type')) {
                categoryIndex = index;
              }
            });
          }

          const resultProducts: Array<{ id: string; name: string; cogs: number; domesticShipping: number; internationalShipping: number; targetMargin: number; category: string }> = [];
          const dataLines = hasHeaders ? lines.slice(1) : lines;

          dataLines.forEach((line, rowIdx) => {
            const cleanLine = line.trim();
            if (!cleanLine) return;

            const parts = splitLine(cleanLine);
            if (parts.length === 0 || parts.every(p => !p)) return;

            const name = parts[nameIndex] || `批量商品 #${resultProducts.length + 1}`;
            const cogs = parseFloat(parts[cogsIndex]) || 20.0;
            const domesticShipping = parseFloat(parts[domesticShippingIndex]) || 5.0;
            const internationalShipping = parseFloat(parts[internationalShippingIndex]) || 10.0;
            const targetMargin = parseFloat(parts[marginIndex]) || 20.0;
            
            let category = parts[categoryIndex] ? parts[categoryIndex].toLowerCase() : '';
            if (!category) {
              const lowercaseName = name.toLowerCase();
              if (lowercaseName.includes('食品') || lowercaseName.includes('茶') || lowercaseName.includes('饮') || lowercaseName.includes('零食') || lowercaseName.includes('food') || lowercaseName.includes('snack')) {
                category = 'grocery';
              } else if (lowercaseName.includes('书') || lowercaseName.includes('阅') || lowercaseName.includes('绘本') || lowercaseName.includes('book') || lowercaseName.includes('read')) {
                category = 'books';
              } else if (lowercaseName.includes('化妆') || lowercaseName.includes('美') || lowercaseName.includes('个护') || lowercaseName.includes('美容') || lowercaseName.includes('cosmetics') || lowercaseName.includes('beauty')) {
                category = 'cosmetics';
              } else if (lowercaseName.includes('智能') || lowercaseName.includes('充电') || lowercaseName.includes('耳机') || lowercaseName.includes('设备') || lowercaseName.includes('electronics') || lowercaseName.includes('phone') || lowercaseName.includes('数码')) {
                category = 'electronics';
              } else {
                category = 'fashion';
              }
            } else {
              if (category.includes('cloth') || category.includes('fashion') || category.includes('衣') || category.includes('鞋')) {
                category = 'fashion';
              } else if (category.includes('book') || category.includes('书') || category.includes('阅')) {
                category = 'books';
              } else if (category.includes('food') || category.includes('grocery') || category.includes('食') || category.includes('饮') || category.includes('麦片')) {
                category = 'grocery';
              } else if (category.includes('cosmetic') || category.includes('beauty') || category.includes('妆') || category.includes('护')) {
                category = 'cosmetics';
              } else if (category.includes('elect') || category.includes('数码') || category.includes('电') || category.includes('充电')) {
                category = 'electronics';
              } else {
                category = 'fashion';
              }
            }

            resultProducts.push({
              id: `batch-${Date.now()}-${rowIdx}`,
              name,
              cogs,
              domesticShipping,
              internationalShipping,
              targetMargin,
              category
            });
          });

          return resultProducts;
        };

        const handleParseBatchInput = () => {
          if (!batchRawInput.trim()) {
            setBatchInfoMsg({ text: '请先在下方输入或粘贴数据，或通过上方文件上传区域导入！', isError: true });
            return;
          }

          const parsed = parseCsvContent(batchRawInput);
          if (parsed.length > 0) {
            setBatchProducts(parsed);
            setBatchInfoMsg({ text: `🚀 成功解析处理 ${parsed.length} 个商品！采购成本和国内外头程物流等参数已自动映射，定价已同步刷新。`, isError: false });
          } else {
            setBatchInfoMsg({ text: '解析失败，请检查数据分隔格式是否正确（支持逗号、分号、Tab或顿号）', isError: true });
          }
        };

        const handleLoadDefaultBatch = () => {
          setBatchProducts([
            { id: '1', name: '儿童防雨滑雪棉服 (英国站 0% VAT 童装免税预判)', cogs: 35.0, domesticShipping: 5.0, internationalShipping: 10.0, targetMargin: 20.0, category: 'fashion' },
            { id: '2', name: '纸质经典少儿趣味科普绘本 (英/德图书多站点特惠少税)', cogs: 12.0, domesticShipping: 3.5, internationalShipping: 6.0, targetMargin: 22.0, category: 'books' },
            { id: '3', name: '高膳食无糖有机代餐燕麦片 (日本 8% / 英国 0% 基础食品低税)', cogs: 25.0, domesticShipping: 4.0, internationalShipping: 8.0, targetMargin: 18.0, category: 'grocery' },
            { id: '4', name: '5000mAh 磁吸极速无线固态充电宝 (欧美日标课增值税大类)', cogs: 45.0, domesticShipping: 6.0, internationalShipping: 12.0, targetMargin: 22.0, category: 'electronics' }
          ]);
          setBatchInfoMsg({ text: '已还原智能税务测试示范产品队列。可观察不同特征单品的免减税起算价差异！', isError: false });
        };

        const handleDownloadTemplate = () => {
          // Add UTF-8 BOM byte order mark to ensure Excel reads Chinese perfectly
          const headers = "商品名称,出厂采购成本(CNY),国内物流与头程费用(CNY),跨境干线物流费用(CNY),期望利润率(%),类目标签(fashion/books/grocery/electronics/cosmetics)\n";
          const rows = [
            "儿童防雨滑雪外套,42.5,5.5,12.0,20,fashion",
            "少儿趣味科普经典绘本,15.0,4.0,8.0,22,books",
            "即食低脂有机坚果代餐麦片,28.0,5.0,10.0,18,grocery",
            "5000mAh极速自带线充电宝,45.0,6.0,14.5,22,electronics",
            "玻尿酸深层舒缓锁水面膜,22.0,3.5,6.0,25,cosmetics"
          ].join("\n");
          
          const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + rows], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", "多站点定价批量导入参数模板.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        const handleDrag = (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
          } else if (e.type === "dragleave") {
            setIsDragActive(false);
          }
        };

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);

          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            processUploadedFile(file);
          }
        };

        const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            processUploadedFile(file);
          }
        };

        const processUploadedFile = (file: File) => {
          if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
            setBatchInfoMsg({ text: '🚫 仅支持导入 CSV 格式或 TXT 文本格式的导出表格！', isError: true });
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) {
              setBatchInfoMsg({ text: '🚫 读取文件出错，该文件可能是空文件。', isError: true });
              return;
            }
            setBatchRawInput(text);
            const parsed = parseCsvContent(text);
            if (parsed.length > 0) {
              setBatchProducts(parsed);
              setBatchInfoMsg({ 
                text: `🎉 文件 "${file.name}" 解析成功！已成功导入 ${parsed.length} 个产品成本及物流规则。多国定价推荐方案已完成测算并更新到下方矩阵中！`, 
                isError: false 
              });
            } else {
              setBatchInfoMsg({ text: '🚫 文件内容无法解析，请确保带有表头，且用逗号（,）或制表符分隔列。', isError: true });
            }
          };
          reader.readAsText(file);
        };

        const solvePriceForBatch = (item: { name: string; cogs: number; domesticShipping: number; internationalShipping: number; targetMargin: number; category: string }, siteId: string) => {
          const batchInput: SimulationInput = {
            ...input,
            productName: item.name,
            cogs: item.cogs,
            domesticShippingRMB: item.domesticShipping,
            internationalShippingRMB: item.internationalShipping,
            category: item.category,
            targetProfitMarginRate: item.targetMargin,
            pricingMode: 'reverse',
            cogsCurrency: 'CNY'
          };
          const calculated = calculateMultiSiteSimulation(batchInput, exchangeRateUSDToCNY, exchangeRates);
          const found = calculated.find(r => r.siteId === siteId);
          return found ? found.suggestedPriceLocal : 0;
        };

        return (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                    <span>多站点商品批量定价测算</span>
                    <span className="text-xs bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded-sm">批量诊断</span>
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">支持 CSV/Excel 表格拖入或文本格式批量输入，快速完成多产品定价分析</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTemplate}
                  className="px-3.5 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-xl transition duration-200 active:scale-95 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" /> 下载模板 (CSV)
                </button>
                <button
                  onClick={handleLoadDefaultBatch}
                  className="px-3.5 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-150 rounded-xl transition duration-200 active:scale-95"
                >
                  ⚙️ 还原示例数据
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Batch Entry & Drag Upload Box */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Drag-and-drop zone */}
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer relative ${
                    isDragActive 
                      ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
                      : 'border-slate-250 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                  onClick={() => document.getElementById('batch-file-uploader-input')?.click()}
                >
                  <input 
                    type="file" 
                    id="batch-file-uploader-input" 
                    className="hidden" 
                    accept=".csv,.txt"
                    onChange={handleFileSelect}
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-white shadow-sm rounded-full text-indigo-600 border border-slate-100">
                      <Upload className="h-5 w-5 animate-bounce" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">拖拽 CSV 成本表格到此处，或 <span className="text-indigo-600 underline">点击浏览文件</span></p>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">支持自动检索：商品名、生产成本、国内外头程物流费、目标利润%及分类</p>
                    </div>
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-150"></div>
                  <span className="flex-shrink mx-4 text-xs text-slate-400 font-extrabold uppercase font-mono tracking-wider">或在下方手动贴入CSV文本</span>
                  <div className="flex-grow border-t border-slate-150"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">数据手动修改或贴入编辑框</span>
                    <span className="text-xs text-slate-500 font-mono font-bold">分隔符支持 " , " </span>
                  </div>
                  
                  <textarea
                    rows={4}
                    value={batchRawInput}
                    onChange={(e) => setBatchRawInput(e.target.value)}
                    placeholder="格式：品名,出厂采购(CNY),国内物流(CNY),跨境干线(CNY),期望利润(%),类目"
                    className="w-full text-sm font-semibold p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder:text-slate-440 transition font-mono whitespace-pre"
                  />

                  <div className="flex justify-between items-center gap-3">
                    <button
                      onClick={handleParseBatchInput}
                      className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition shadow-md hover:shadow-indigo-500/10 active:scale-97 text-sm flex items-center justify-center gap-1.5"
                    >
                      <span>⚡ 启动批量定价推荐方案</span>
                    </button>
                  </div>

                  {batchInfoMsg && (
                    <div className={`p-3 rounded-xl text-sm font-semibold leading-relaxed border ${
                      batchInfoMsg.isError 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-250/80 shadow-xs'
                    }`}>
                      {batchInfoMsg.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Matrix Table */}
              <div className="lg:col-span-7 space-y-3">
                <span className="block text-xs font-black text-slate-500 uppercase tracking-wider">批量定价推荐方案与多国税务结构对比</span>
                
                <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-550/5 border-b border-slate-150 text-xs text-slate-500 font-black uppercase tracking-wider font-mono">
                          <th className="py-2.5 px-3">商品品名 & 标签</th>
                          <th className="py-2.5 px-2 text-right">出厂单价</th>
                          <th className="py-2.5 px-2 text-right">国内/跨境运杂</th>
                          <th className="py-2.5 px-2 text-right">🇺🇸 建议(USD)</th>
                          <th className="py-2.5 px-2 text-right">🇬🇧 建议(GBP)</th>
                          <th className="py-2.5 px-2 text-right">🇯🇵 建议(JPY)</th>
                          <th className="py-2.5 px-2 text-right">🇲🇾 建议(MYR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-semibold">
                        {batchProducts.map((item) => {
                          const usPrice = solvePriceForBatch(item, 'US');
                          const ukPrice = solvePriceForBatch(item, 'UK');
                          const jpPrice = solvePriceForBatch(item, 'JP');
                          const myPrice = solvePriceForBatch(item, 'MY');

                          // Tax status for UK just to highlight
                          const ukTaxInfo = getIntelligentTaxAnalysis(item.name, item.category, 'UK');
                          const jpTaxInfo = getIntelligentTaxAnalysis(item.name, item.category, 'JP');

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/70 transition duration-150">
                              <td className="py-3 px-3">
                                <p className="font-bold text-slate-800 max-w-44 truncate leading-tight text-xs">{item.name}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                                    {item.category === 'books' ? '📚 图书' : item.category === 'grocery' ? '🍏 食品' : item.category === 'cosmetics' ? '💄 美妆' : item.category === 'electronics' ? '⚡ 数码' : '👕 服装'}
                                  </span>
                                  <span className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-black">
                                    利: {item.targetMargin.toFixed(0)}%
                                  </span>
                                  {ukTaxInfo.isReduced && (
                                    <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded font-black animate-pulse">
                                      🇬🇧 {ukTaxInfo.rate}% 免减
                                    </span>
                                  )}
                                  {jpTaxInfo.rate < 10.0 && (
                                    <span className="text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">
                                      🇯🇵 {jpTaxInfo.rate}% 减税
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-2 text-right font-mono text-slate-600 text-xs font-bold">
                                ￥{item.cogs.toFixed(1)}
                              </td>

                              <td className="py-3 px-2 text-right font-mono text-slate-500 text-xs">
                                ￥{item.domesticShipping.toFixed(1)} / ￥{item.internationalShipping.toFixed(1)}
                              </td>

                              {/* Countries Price with Smart Highlights */}
                              <td className="py-3 px-2 text-right font-mono text-slate-800 font-extrabold text-sm">
                                ${usPrice.toFixed(2)}
                              </td>

                              <td className="py-3 px-2 text-right font-mono">
                                <span className={ukTaxInfo.isReduced ? "text-emerald-600 font-black text-sm" : "text-slate-850 font-bold text-sm"}>
                                  £{ukPrice.toFixed(2)}
                                </span>
                              </td>

                              <td className="py-3 px-2 text-right font-mono text-slate-800 font-extrabold text-sm">
                                ¥{jpPrice.toFixed(0)}
                              </td>

                              <td className="py-3 px-2 text-right font-mono text-slate-800 font-extrabold text-sm">
                                RM{myPrice.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* 📦 跨境电商月度订单财务对账与成本中心 */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ClipboardCheck className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <span>月度订单后台账单核算 & 成本智能归并</span>
                <span className="text-xs bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded-sm">财务对账</span>
              </h2>
              <p className="text-sm text-slate-500 font-medium">支持从平台后台导出的月度订单 CSV 拖入。系统自动识别、去重并归并同款商品成本，核算月度真实总采购、物流和广告花费。</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Generate 500 demo orders across 5 products
                const demoProducts = [
                  { name: "防寒防雨儿童保暖夹克 (童装免税特许)", cogs: 35.0, domesticShipping: 5.0, internationalShipping: 10.0, siteId: 'US', price: 49.99 },
                  { name: "全彩页幼儿启蒙科普绘本 (图书特惠折扣)", cogs: 12.0, domesticShipping: 3.5, internationalShipping: 6.0, siteId: 'UK', price: 19.99 },
                  { name: "无额外添加即食高纤即食速溶麦片 (食品民生低税)", cogs: 25.0, domesticShipping: 4.0, internationalShipping: 8.0, siteId: 'JP', price: 3499.0 },
                  { name: "5000mAh 极速磁吸自带线无线充电宝 (标准数码大类)", cogs: 45.0, domesticShipping: 6.0, internationalShipping: 12.0, siteId: 'MY', price: 99.0 },
                  { name: "玻尿酸深层舒缓锁水面膜 (美妆个护新品)", cogs: 22.0, domesticShipping: 3.0, internationalShipping: 7.0, siteId: 'MX', price: 399.0 }
                ];

                const generatedOrders: Array<{ id: string; productName: string; quantity: number; siteId: string; salesRevenueLocal: number }> = [];
                const counts = [120, 80, 150, 90, 60]; // sums to 500
                
                const dict: Record<string, { cogs: number; domesticShipping: number; internationalShipping: number }> = {};
                
                demoProducts.forEach((p, idx) => {
                  dict[p.name] = {
                    cogs: p.cogs,
                    domesticShipping: p.domesticShipping,
                    internationalShipping: p.internationalShipping
                  };
                  
                  const count = counts[idx];
                  for (let i = 1; i <= count; i++) {
                    generatedOrders.push({
                      id: `ORD-2026-${1000 + idx * 500 + i}`,
                      productName: p.name,
                      quantity: 1,
                      siteId: p.siteId,
                      salesRevenueLocal: p.price
                    });
                  }
                });

                setMonthlyOrders(generatedOrders);
                setProductCostDict(dict);
                setOrdersFeedbackMsg({
                  text: `🎉 已成功加载 500 笔演示月度订单！其中包含 5 款核心畅销单品，已自动识别并填充它们在平台后端记录中的历史采购及国内外头程公摊成本。`,
                  isError: false
                });
              }}
              className="px-3.5 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition duration-200 active:scale-95"
            >
              ⚡ 模拟导入 500笔月度订单
            </button>
            {monthlyOrders.length > 0 && (
              <button
                onClick={() => {
                  if (monthlyOrders.length === 0) return;

                  const headers = "订单号,商品名称,销售数量,销售大区/站点,销售本币金额,结算币种,采购出厂成本(CNY),国内打包物流(CNY),跨国专线物流(CNY),汇率(RMB对本币),折算总成本(CNY),预计单笔平台费用及投流(CNY),预计净利润(CNY),账单对账状态\n";
                  
                  const rows = monthlyOrders.map((order) => {
                    const costs = productCostDict[order.productName] || { cogs: 0, domesticShipping: 0, internationalShipping: 0 };
                    
                    const r = results.find(x => x.siteId === order.siteId) || results[0];
                    
                    const cogsRMB = costs.cogs * order.quantity;
                    const shipRMB = (costs.domesticShipping + costs.internationalShipping) * order.quantity;
                    const totalCostCNY = cogsRMB + shipRMB;
                    
                    const revenueCNY = order.salesRevenueLocal * (r ? r.exchangeRateToCNY : 1.0) * order.quantity;
                    
                    const commissionCNY = revenueCNY * 0.05;
                    const txFeeCNY = revenueCNY * 0.03;
                    const adSpendCNY = revenueCNY * 0.15;
                    const taxCNY = (r ? r.taxes : 0) * (r ? r.exchangeRateToCNY : 1.0) * order.quantity;
                    const returnLossCNY = (r ? r.returnLoss : 0) * (r ? r.exchangeRateToCNY : 1.0) * order.quantity;
                    const withdrawalCNY = (r ? (r.withdrawalFee + r.exchangeLossBuffer) : 0) * (r ? r.exchangeRateToCNY : 1.0) * order.quantity;

                    const totalFeesCNY = commissionCNY + txFeeCNY + adSpendCNY + taxCNY + returnLossCNY + withdrawalCNY;
                    const profitCNY = revenueCNY - totalCostCNY - totalFeesCNY;

                    return [
                      order.id,
                      `"${order.productName.replace(/"/g, '""')}"`,
                      order.quantity,
                      order.siteId,
                      order.salesRevenueLocal,
                      r ? r.currency : 'USD',
                      costs.cogs,
                      costs.domesticShipping,
                      costs.internationalShipping,
                      r ? r.exchangeRateToCNY.toFixed(4) : '1.0000',
                      totalCostCNY.toFixed(2),
                      totalFeesCNY.toFixed(2),
                      profitCNY.toFixed(2),
                      totalCostCNY > 0 ? "对账已确认" : "采购成本待补"
                    ].join(",");
                  }).join("\n");

                  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + rows], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `跨境月度订单对账及利润核算报表_${monthlyOrders.length}单.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-3.5 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-xl transition duration-200 active:scale-95 flex items-center gap-1.5 shadow-sm"
              >
                <Download className="h-3.5 w-3.5" /> 导出月度精算报表 (CSV)
              </button>
            )}
          </div>
        </div>

        {ordersFeedbackMsg && (
          <div className={`p-4 rounded-xl text-sm flex items-center justify-between ${ordersFeedbackMsg.isError ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>
            <span>{ordersFeedbackMsg.text}</span>
            <button onClick={() => setOrdersFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600 font-bold ml-2">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* File drop zone & unique product dictionary (Left Column) */}
          <div className="xl:col-span-7 space-y-5">
            {monthlyOrders.length === 0 ? (
              /* Drag and Drop Zone */
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleMonthlyOrdersDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  isDragActive ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 bg-slate-50 hover:bg-slate-50/80'
                }`}
              >
                <input
                  type="file"
                  id="monthly-orders-file-input"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleMonthlyOrdersFileSelect}
                />
                <label htmlFor="monthly-orders-file-input" className="cursor-pointer space-y-3 block">
                  <div className="text-4xl mx-auto">📁</div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">拖拽月度订单 CSV 报表到此处，或 <span className="text-indigo-600 underline">点击浏览文件</span></p>
                    <p className="text-xs text-slate-500">仅支持 .csv 和 .txt 表格文件。导入后，多单同款商品成本将一键自动识别归并。</p>
                  </div>
                </label>
              </div>
            ) : (
              /* Unique Product Dictionary Cost Input */
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <span>📋 已识别的核心商品成本字典</span>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded font-bold font-mono">
                      {Object.keys(productCostDict).length} 款独立商品
                    </span>
                  </h3>
                  <button
                    onClick={() => {
                      setMonthlyOrders([]);
                      setProductCostDict({});
                      setOrdersFeedbackMsg(null);
                    }}
                    className="text-sm text-rose-600 hover:text-rose-700 font-bold transition duration-150"
                  >
                    🗑️ 清空重置
                  </button>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed font-semibold">
                  * 系统检测出该批次订单共由以下款式构成。请补全或调整同款商品的<b>出厂采购与运费单价</b>，下方月度总成本账单将自动联算。
                </div>

                <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                  {Object.keys(productCostDict).map((productName) => {
                    const costs = productCostDict[productName] || { cogs: 0, domesticShipping: 0, internationalShipping: 0 };
                    return (
                      <div key={productName} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs space-y-2.5">
                        <div className="font-bold text-slate-800 text-xs truncate" title={productName}>
                          📦 {productName}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="space-y-1">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">采购出厂 (元)</label>
                            <input
                              type="number"
                              min="0"
                              value={costs.cogs || ''}
                              placeholder="0.0"
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setProductCostDict({
                                  ...productCostDict,
                                  [productName]: { ...costs, cogs: val }
                                });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">国内打包 (元)</label>
                            <input
                              type="number"
                              min="0"
                              value={costs.domesticShipping || ''}
                              placeholder="0.0"
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setProductCostDict({
                                  ...productCostDict,
                                  [productName]: { ...costs, domesticShipping: val }
                                });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">跨国专线 (元)</label>
                            <input
                              type="number"
                              min="0"
                              value={costs.internationalShipping || ''}
                              placeholder="0.0"
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setProductCostDict({
                                  ...productCostDict,
                                  [productName]: { ...costs, internationalShipping: val }
                                });
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Monthly Cost Reconciliation Statement (Right Column) */}
          <div className="xl:col-span-5">
            {(() => {
              if (!monthlyReconciliationData) {
                return (
                  <div className="h-full min-h-[220px] bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="text-4xl">📊</div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm">月度对账账单未生成</p>
                      <p className="text-xs text-slate-450 max-w-xs mt-1 leading-relaxed font-semibold">
                        导入平台月度后台订单后，系统将自动汇率换算并综合各站点 platform/支付及代征税费，输出本月的采购、头程和盈利大底对账。
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-4 border border-slate-800 shadow-lg">
                  <div className="border-b border-slate-800 pb-2.5">
                    <span className="text-sm font-black text-indigo-400 uppercase tracking-widest font-mono">月度经营财务账单 (RMB/￥对账)</span>
                  </div>

                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400 font-bold">总处理成交单量</span>
                      <span className="font-mono font-bold text-slate-100">{monthlyReconciliationData.totalOrdersCount} 笔订单</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400 font-bold">平台后台总成交额 (CNY)</span>
                      <span className="font-mono font-bold text-slate-100">￥{monthlyReconciliationData.totalRevenueCNY.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400 font-bold">1. 商品总采购花费 (CNY)</span>
                      <span className="font-mono font-bold text-slate-200">￥{monthlyReconciliationData.totalCogsCNY.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400 font-bold">2. 头程国内外打包物流 (CNY)</span>
                      <span className="font-mono font-bold text-slate-200">￥{monthlyReconciliationData.totalShippingCNY.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400 font-bold">3. 平台佣金与交易费 (CNY)</span>
                      <span className="font-mono font-bold text-slate-200">￥{monthlyReconciliationData.totalPlatformFeesCNY.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400 font-bold">4. 流量广告及营销花费 (CNY)</span>
                      <span className="font-mono font-bold text-slate-200">￥{monthlyReconciliationData.totalAdSpendCNY.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400 font-bold">5. 境外退货/税款/提现公摊 (CNY)</span>
                      <span className="font-mono font-bold text-slate-200">
                        ￥{(monthlyReconciliationData.totalReturnLossCNY + monthlyReconciliationData.totalTaxesCNY + monthlyReconciliationData.totalWithdrawalFeesCNY).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5 mt-2 shadow-inner">
                      <div className="flex justify-between items-baseline">
                        <span className="text-indigo-400 font-black text-xs uppercase">期内实收净利润</span>
                        <div className={`text-xl font-black font-mono ${monthlyReconciliationData.netProfitCNY >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ￥{monthlyReconciliationData.netProfitCNY.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-800/60 pt-1.5 text-xs">
                        <span className="text-slate-400 font-bold">综合实收净利率：</span>
                        <span className={`font-mono font-extrabold text-sm ${monthlyReconciliationData.netMarginPercentage >= 20 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {monthlyReconciliationData.netMarginPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
            </div>
          </div>

        </div>

      {/* Global 4-Country Profit Comparison Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Card A: 4国 TikTok Shop 大盘利润率对比 (%) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5.5 w-5.5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">4国 TikTok Shop 利润树占比与利润率对比 (%)</h2>
            </div>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold font-mono">
              毛利率 vs 净利率
            </span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marginChartData}
                margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#4A5568' }} />
                <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 11, fill: '#4A5568' }} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`]} 
                  contentStyle={{ fontSize: '12px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend iconSize={12} wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                <Bar name="毛利率 %" dataKey="毛利率 (%)" fill="#4F46E5" radius={[4, 4, 0, 0]}>
                  {marginChartData.map((entry, index) => (
                    <Cell key={`cell-gross-${index}`} fill={entry['毛利率 (%)'] >= 45 ? '#4F46E5' : '#818CF8'} />
                  ))}
                </Bar>
                <Bar name="净利率 %" dataKey="净利率 (%)" fill="#10B981" radius={[4, 4, 0, 0]}>
                  {marginChartData.map((entry, index) => (
                    <Cell key={`cell-net-${index}`} fill={entry['净利率 (%)'] > 0 ? '#10B981' : '#F43F5E'} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card B: 4国单笔预计净利润绝对值对比 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2.5">
              <Coins className="h-5.5 w-5.5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">4国预计净利润绝对值对比 ({displayInCNY ? 'RMB/￥' : '结算币种'})</h2>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
              同台币种汇率换算比对
            </span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={results.map(r => ({
                  name: `${siteFlagMap[r.siteId] || ''} ${r.siteName}`,
                  '预计净利润': parseFloat((displayInCNY ? r.netProfit * r.exchangeRateToCNY : r.netProfit).toFixed(2)),
                  symbol: displayInCNY ? '￥' : r.symbol,
                  currency: displayInCNY ? 'CNY' : r.currency,
                }))}
                margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#4A5568' }} />
                <YAxis tickFormatter={(val) => `${displayInCNY ? '￥' : ''}${val}`} tick={{ fontSize: 11, fill: '#4A5568' }} />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => {
                    const payload = props.payload;
                    return [
                      <span className="font-mono font-bold text-emerald-600">{payload.symbol}{parseFloat(value).toFixed(2)} {payload.currency}</span>,
                      `预计净利润`
                    ];
                  }}
                  contentStyle={{ fontSize: '12px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend iconSize={12} wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                <Bar name="单笔净利润" dataKey="预计净利润" fill="#059669" radius={[4, 4, 0, 0]}>
                  {results.map((entry, index) => {
                    const hasProfit = entry.netProfit > 0;
                    return (
                      <Cell 
                        key={`cell-net-absolute-${index}`} 
                        fill={!hasProfit ? '#EF4444' : '#059669'} 
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 🏢 企业运营全链路固定成本均摊与定价器 */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-6 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">🏢</span>
              <span>全链路企业运营利润精算与精准定价器</span>
            </h2>
            <p className="text-xs text-slate-500">
              输入员工、场地房租、ERP及系统网络等固定成本，系统将按月单量自动公摊，诊断您的商品零售价是否能满足企业的真实净利率需求。
            </p>
          </div>
          <span className="self-start md:self-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase font-mono tracking-wider">
            企业运营级精算
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Panel (Left) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-2xs">
            <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-2">企业月度固收与单量配置</h3>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">以往月度订单总数 (单/月) <span className="text-red-500 font-normal">*</span></label>
                <input
                  type="number"
                  min="0"
                  placeholder="例: 1000 (不输入则不进行摊销计算)"
                  value={historicalMonthlyOrders}
                  onChange={(e) => setHistoricalMonthlyOrders(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-bold transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">月度员工总薪资 (￥/月)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="例: 8000"
                    value={staffCostRMB}
                    onChange={(e) => setStaffCostRMB(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-bold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">月度场地租金/水电 (￥/月)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="例: 3000"
                    value={rentCostRMB}
                    onChange={(e) => setRentCostRMB(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-bold transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">ERP及系统网络费 (￥/月)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="例: 500"
                    value={erpCostRMB}
                    onChange={(e) => setErpCostRMB(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-bold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700">其他月度固定杂费 (￥/月)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="例: 300"
                    value={otherFixedCostRMB}
                    onChange={(e) => setOtherFixedCostRMB(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-bold transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Report Panel (Right) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {(() => {
              const ordersNum = parseFloat(historicalMonthlyOrders) || 0;
              const staffVal = parseFloat(staffCostRMB) || 0;
              const rentVal = parseFloat(rentCostRMB) || 0;
              const erpVal = parseFloat(erpCostRMB) || 0;
              const otherVal = parseFloat(otherFixedCostRMB) || 0;

              const hasInput = ordersNum > 0;

              if (!hasInput) {
                return (
                  <div className="h-full min-h-[220px] bg-slate-100/60 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="text-4xl">🏢</div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm">企业经营评估功能未激活</p>
                      <p className="text-xs text-slate-450 max-w-sm mt-1 leading-relaxed">
                        在左侧面板中输入您的<strong>月度总订单数</strong>，系统即可解锁全链路固定成本分摊，分析出满足您企业净利润目标的最精确零售价！
                      </p>
                    </div>
                  </div>
                );
              }

              // Calculating totals
              const totalMonthlyFixedCostRMB = staffVal + rentVal + erpVal + otherVal;
              const fixedCostPerOrderRMB = totalMonthlyFixedCostRMB / ordersNum;
              const fixedCostPerOrderLocal = fixedCostPerOrderRMB / selectedResult.exchangeRateToCNY;

              // Core operational diagnostics
              const currentPrice = selectedResult.suggestedPriceLocal;
              const itemNetProfitLocal = selectedResult.netProfit;
              const enterpriseNetProfitLocal = itemNetProfitLocal - fixedCostPerOrderLocal;
              const enterpriseNetMargin = currentPrice > 0 ? (enterpriseNetProfitLocal / currentPrice) * 100 : 0;

              // Solve for Precision Pricing
              const precisionTargetPrice = (() => {
                let low = selectedResult.suggestedPriceLocal;
                let high = selectedResult.suggestedPriceLocal * 3 + fixedCostPerOrderLocal * 4 + 100;
                let solved = low;
                const targetMarginRate = (input.targetProfitMarginRate || 20) / 100;
                
                for (let i = 0; i < 40; i++) {
                  const mid = (low + high) / 2;
                  const baseInput = { ...input, priceLocal: mid };
                  const simulated = calculateMultiSiteSimulation(baseInput, exchangeRateUSDToCNY, exchangeRates);
                  const r = simulated.find(x => x.siteId === selectedSiteId) || selectedResult;
                  const trialMargin = mid > 0 ? (r.netProfit - fixedCostPerOrderLocal) / mid : -1;
                  
                  if (trialMargin < targetMarginRate) {
                    low = mid;
                  } else {
                    high = mid;
                    solved = mid;
                  }
                }
                return solved;
              })();

              // Is current pricing satisfying the target profit margin under fixed cost?
              const isProfitSatisfied = enterpriseNetMargin >= (input.targetProfitMarginRate || 20);

              return (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5 flex-1 flex flex-col justify-between shadow-xs">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">企业级财务成本均摊诊断评估</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${isProfitSatisfied ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'}`}>
                        {isProfitSatisfied ? '✓ 满足利润目标' : '⚠️ 定价偏低无法覆盖固收'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">月总固定成本</span>
                        <div className="text-sm font-black text-slate-800 font-mono mt-0.5">
                          ￥{totalMonthlyFixedCostRMB.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-xs text-slate-400 font-normal">CNY</span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">每单公摊固定成本</span>
                        <div className="text-base font-black text-indigo-600 font-mono mt-0.5">
                          ￥{fixedCostPerOrderRMB.toFixed(2)} <span className="text-xs text-slate-400 font-normal">CNY</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          ≈ {selectedResult.symbol}{fixedCostPerOrderLocal.toFixed(2)} {selectedResult.currency}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">公摊后企业真实净利率</span>
                        <div className={`text-base font-black font-mono mt-0.5 ${enterpriseNetMargin >= 15 ? 'text-emerald-600' : enterpriseNetMargin >= 0 ? 'text-yellow-600' : 'text-rose-600'}`}>
                          {enterpriseNetMargin.toFixed(1)}%
                        </div>
                        <span className="text-[10px] text-slate-450 font-medium block leading-tight mt-0.5">
                          (公摊前为: {selectedResult.netMargin.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                        <span>🎯 满足期望净利润率 ({(input.targetProfitMarginRate || 20)}%) 的精准建议定价:</span>
                      </h4>
                      <div className="flex flex-col md:flex-row items-baseline gap-4">
                        <div className="text-2xl font-black text-indigo-700 font-mono">
                          {selectedResult.symbol}{precisionTargetPrice.toFixed(2)} <span className="text-xs text-slate-400 font-sans font-normal">({selectedResult.currency})</span>
                        </div>
                        <div className="text-xs text-slate-500 font-semibold leading-normal">
                          等同于：<span className="text-slate-800 font-bold">￥{(precisionTargetPrice * selectedResult.exchangeRateToCNY).toFixed(1)} CNY</span>。此价格已将每单分摊的员工/房租/ERP成本 ({selectedResult.symbol}{fixedCostPerOrderLocal.toFixed(2)}) 完全吸纳。
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-600 font-medium">
                    {isProfitSatisfied ? (
                      <p>
                        ✨ <strong>评估结论:</strong> 您当前的商品零售定价（{selectedResult.symbol}{currentPrice.toFixed(2)}）在扣减所有平台扣点、运费及<strong>每单固支均摊（￥{fixedCostPerOrderRMB.toFixed(2)}）</strong>后，仍能为您保留 <strong>{enterpriseNetMargin.toFixed(1)}%</strong> 的企业级纯利润，完全达到了您设定的 <strong>{input.targetProfitMarginRate || 20}%</strong> 目标！财务状况极佳！
                      </p>
                    ) : (
                      <p>
                        ⚠️ <strong>经营性财务预警:</strong> 尽管该商品单笔测算利润率不错，但在加入月度企业固定支出（薪资、房租、ERP系统费等）均摊后，每单被抽走 <strong>￥{fixedCostPerOrderRMB.toFixed(2)}</strong>。导致真实净利率骤降至 <strong>{enterpriseNetMargin.toFixed(1)}%</strong>，无法实现 <strong>{input.targetProfitMarginRate || 20}%</strong> 的预期。<strong>建议您将该站点开卖价格微调至 {selectedResult.symbol}{precisionTargetPrice.toFixed(2)} 以上！</strong>
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

    </div>
  );
}
