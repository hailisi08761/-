import React, { useState, useEffect, useMemo } from 'react';
import { MultiSiteResult, SimulationInput } from '../types';
import { SITE_CATEGORIES, SITE_FEE_CONFIGS, PLATFORMS, CATEGORIES_BY_PLATFORM, SITES_BY_PLATFORM } from '../data/feeStructures';
import { calculateMultiSiteSimulation } from '../utils/calculator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import * as XLSX from 'xlsx';
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
  Import,
  Copy,
  CheckCircle2,
  AlertCircle,
  Upload,
  Download,
  Globe,
  Percent,
  CalendarDays,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity
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

  // Auto-set default tax rate based on chosen site
  useEffect(() => {
    const taxMap: Record<string, number> = {
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
    const defaultTax = taxMap[selectedSiteId] ?? 0.0;
    onChangeInput('taxRateLocal', defaultTax);
  }, [selectedSiteId]);

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

  // Compare Net Profit in CNY across all four sites for equal cross-site evaluation
  const netProfitCNYData = results.map(r => ({
    name: `${siteFlagMap[r.siteId] || ''} ${r.siteName}`,
    '预计净利润 (RMB/￥)': parseFloat((r.netProfit * r.exchangeRateToCNY).toFixed(2)),
    currency: r.currency,
    localValue: r.netProfit,
    symbol: r.symbol,
  }));

  const mode = input.pricingMode || 'reverse';

  // ==========================================
  // BATCH MODULE STATE & CALCULATIONS
  // ==========================================
  const [importTab, setImportTab] = useState<'upload' | 'manual'>('upload');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  const [batchRawInput, setBatchRawInput] = useState<string>(
    "新品防紫外线太阳镜\t18.0\t22.0\t0.0\n" +
    "迷你桌面制冷静音风扇\t32.5\t20.5\t6.0\n" +
    "防水大容量健身旅行包\t24.9\t25.0\t10.0\n" +
    "无线智能触控蓝牙耳机\t65.0\t30.0\t12.0"
  );
  const [batchProducts, setBatchProducts] = useState<Array<{ name: string; cogs: number; targetProfitMargin: number; taxRate: number }>>([]);
  const [copiedBatch, setCopiedBatch] = useState<boolean>(false);
  const [selectedBatchSiteId, setSelectedBatchSiteId] = useState<string>('US');

  const downloadExcelTemplate = () => {
    const wsData = [
      ["商品名称", "出厂采购价(￥)", "目标净利润率(%)", "商品税率(%)"],
      ["时尚智能运动手表", 55.0, 25.0, 6.5],
      ["保暖双肩旅行背包", 32.0, 20.0, 0.0],
      ["骨传导蓝牙耳机", 88.0, 30.0, 12.0],
      ["迷你桌面加湿器", 15.5, 18.0, 5.0]
    ];
    
    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "商品批量核算模板");
      
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "TikTok_Shop_商品批量核算模板.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      console.error("生成Excel模板失败", e);
    }
  };

  const downloadTxtTemplate = () => {
    const textData = 
      "商品名称\t出厂采购价(￥)\t目标净利润率(%)\t商品税率(%)\n" +
      "时尚智能运动手表\t55.0\t25.0\t6.5\n" +
      "保暖双肩旅行背包\t32.0\t20.0\t0.0\n" +
      "骨传导蓝牙耳机\t88.0\t30.0\t12.0\n" +
      "迷你桌面加湿器\t15.5\t18.0\t5.0";
    
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "TikTok_Shop_商品批量核算模板.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processFile = (file: File) => {
    setUploadError('');
    const nameLower = file.name.toLowerCase();

    if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) throw new Error("文件为空");
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          if (!jsonData || jsonData.length === 0) {
            setUploadError('Excel文件未检测到任何数据！');
            return;
          }

          const parsedRows: Array<{ name: string; cogs: number; targetProfitMargin: number; taxRate: number }> = [];
          let headerRowIndex = -1;

          // Find headers line
          for (let rowIdx = 0; rowIdx < Math.min(5, jsonData.length); rowIdx++) {
            const row = jsonData[rowIdx];
            if (row && row.length > 0 && typeof row[0] === 'string') {
              const strVal = row[0].trim();
              if (strVal.includes("名称") || strVal.toLowerCase().includes("name") || strVal.includes("品名") || strVal.includes("商品")) {
                headerRowIndex = rowIdx;
                break;
              }
            }
          }

          const startIdx = headerRowIndex !== -1 ? headerRowIndex + 1 : 1; 

          for (let i = startIdx; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0 || row[0] === undefined || row[0] === null || row[0] === '') continue;

            const name = String(row[0]).trim();
            const cogs = parseFloat(String(row[1] || 0)) || 0;
            const targetProfitMargin = row[2] !== undefined ? (parseFloat(String(row[2])) || 20.0) : 20.0;
            const taxRate = row[3] !== undefined ? (parseFloat(String(row[3])) || 0.0) : 0.0;

            parsedRows.push({ name, cogs, targetProfitMargin, taxRate });
          }

          if (parsedRows.length > 0) {
            setBatchRawInput(parsedRows.map(p => `${p.name}\t${p.cogs}\t${p.targetProfitMargin}\t${p.taxRate}`).join('\n'));
            setBatchProducts(parsedRows);
            setUploadSuccess(true);
            setUploadError('');
            setTimeout(() => setUploadSuccess(false), 3000);
          } else {
            setUploadError('未检测到有效商品条目，请确保符合列顺序。');
          }
        } catch (err: any) {
          setUploadError(`Excel解析失败: ${err.message || err}`);
        }
      };
      reader.onerror = () => setUploadError('读取Excel文件失败');
      reader.readAsArrayBuffer(file);
    } else {
      // standard .csv or .txt
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text) {
          setUploadError('文件内容为空');
          return;
        }
        const lines = text.split(/\r\n|\n|\r/);
        const parsedRows: Array<{ name: string; cogs: number; targetProfitMargin: number; taxRate: number }> = [];
        let headerSkipped = false;

        lines.forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed) return;

          let delimiter = ',';
          if (trimmed.includes('\t')) delimiter = '\t';
          else if (trimmed.includes(';')) delimiter = ';';

          const cols = trimmed.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));

          if (cols.length === 0 || cols[0] === '') return;

          if (!headerSkipped && (cols[0].includes("名称") || cols[0].toLowerCase().includes("name") || cols[0].includes("品名") || cols[0].includes("商品"))) {
            headerSkipped = true;
            return;
          }

          const name = cols[0];
          const cogs = parseFloat(cols[1]) || 0;
          const targetProfitMargin = cols[2] !== undefined ? (parseFloat(cols[2]) || 20.0) : 20.0;
          const taxRate = cols[3] !== undefined ? (parseFloat(cols[3]) || 0.0) : 0.0;

          parsedRows.push({ name, cogs, targetProfitMargin, taxRate });
        });

        if (parsedRows.length > 0) {
          setBatchRawInput(parsedRows.map(p => `${p.name}\t${p.cogs}\t${p.targetProfitMargin}\t${p.taxRate}`).join('\n'));
          setBatchProducts(parsedRows);
          setUploadSuccess(true);
          setUploadError('');
          setTimeout(() => setUploadSuccess(false), 3000);
        } else {
          setUploadError('未从文本/CSV中解析出有效行！');
        }
      };
      reader.onerror = () => setUploadError('读取文本文件失败');
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const name = file.name.toLowerCase();
      if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv') || name.endsWith('.txt')) {
        processFile(file);
      } else {
        setUploadError('目前仅支持 Excel (.xlsx, .xls) 和 TXT/CSV 文件，请下载模板确认。');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Parse Raw Clipboard input
  const parseBatchInput = () => {
    if (!batchRawInput.trim()) {
      setBatchProducts([]);
      return;
    }
    const lines = batchRawInput.split('\n');
    const parsed: any[] = [];
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      const parts = trimmed.split(/\t|,/);
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const cogs = parseFloat(parts[1].trim()) || 0;
        const targetProfitMargin = parts[2] !== undefined ? (parseFloat(parts[2].trim()) || 20.0) : 20.0;
        const taxRate = parts[3] !== undefined ? (parseFloat(parts[3].trim()) || 0.0) : 0.0;
        parsed.push({ name, cogs, targetProfitMargin, taxRate });
      } else {
        const name = parts[0].trim();
        if (name) {
          parsed.push({
            name,
            cogs: input.cogs,
            targetProfitMargin: input.targetProfitMarginRate || 20.0,
            taxRate: input.taxRateLocal || 0.0
          });
        }
      }
    });
    setBatchProducts(parsed);
  };

  // Pre-load on mount
  useEffect(() => {
    parseBatchInput();
  }, []);

  // Compute batch outputs mapped sequentially over MultiSite calculations
  const batchCalculationResults = useMemo(() => {
    return batchProducts.map((p) => {
      const pInput: SimulationInput = {
        ...input,
        cogs: p.cogs,
        targetProfitMarginRate: p.targetProfitMargin,
        taxRateLocal: p.taxRate,
      };
      
      const sitesResult = calculateMultiSiteSimulation(pInput, exchangeRateUSDToCNY, exchangeRates);
      
      return {
        productName: p.name,
        cogsRMB: p.cogs,
        targetProfitMargin: p.targetProfitMargin,
        taxRate: p.taxRate,
        results: sitesResult
      };
    });
  }, [batchProducts, input, exchangeRateUSDToCNY, exchangeRates]);

  // Bulk pricing layout text copiar
  const handleCopyBatchToClipboard = () => {
    let text = "商品名称\t出厂价(￥)\t设利润金比(%)\t商品税率(%)\t销售站点\t建议售价(外币)\t推荐售价(CNY折算价)\t交易与扣点手续费(外币)\t跨境头程(外币)\t预计单笔净利(CNY)\n";
    
    batchCalculationResults.forEach((row) => {
      row.results.forEach((site) => {
        const pLocal = site.suggestedPriceLocal;
        const pCNY = pLocal * site.exchangeRateToCNY;
        const feesLocal = site.totalPlatformFees;
        const logisticsLocal = site.forwardLogistics;
        const netCNY = site.netProfit * site.exchangeRateToCNY;
        
        text += `${row.productName}\t${row.cogsRMB.toFixed(2)}\t${row.targetProfitMargin.toFixed(1)}%\t${row.taxRate.toFixed(1)}%\t${site.siteName}\t${site.symbol}${pLocal.toFixed(2)}\t￥${pCNY.toFixed(2)}\t${site.symbol}${feesLocal.toFixed(2)}\t${site.symbol}${logisticsLocal.toFixed(2)}\t￥${netCNY.toFixed(2)}\n`;
      });
    });

    navigator.clipboard.writeText(text);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

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
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
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
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
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
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
                    商业测算方向
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/20">
                    <button
                      onClick={() => onChangeInput('pricingMode', 'reverse')}
                      className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 ${
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
                      className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 ${
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
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest pl-1">
                    目标销售大区 (精选主流站点)
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
                          <span className="text-lg filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{siteFlagMap[site.id] || '🌐'}</span>
                          <div className="leading-none flex-1 min-w-0">
                            <span className="block text-xs font-black text-slate-800 truncate">{site.name}</span>
                            <span className="block text-[9px] text-slate-400 font-mono mt-1">{site.currency}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* E. Fee details review box */}
                <div className="p-4 bg-slate-50/80 border border-slate-150 rounded-2xl text-[12px] text-slate-600 leading-relaxed space-y-2 font-medium">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-500">当前平台佣金率:</span>
                    <span className="font-extrabold text-indigo-600 font-mono text-xs">{(commissionRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-500">支付及收款费率:</span>
                    <span className="font-extrabold text-indigo-600 font-mono text-xs">
                      {platformId === 'amazon' ? '0.0%' : `${(selectedResult.thirdPartyPayoutFeeRate || 0.6).toFixed(1)}%`}
                    </span>
                  </div>
                  {fixedFee > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">单均基础固定费:</span>
                      <span className="font-extrabold text-indigo-600 font-mono text-xs">
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
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-slate-400 uppercase tracking-widest pl-1">SAFE 汇率核验</span>
                  {onFetchRates && (
                    <button
                      onClick={onFetchRates}
                      disabled={ratesLoading}
                      className="py-1.5 px-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition disabled:opacity-50 flex items-center gap-1.5 text-[10px] font-extrabold shadow-sm active:scale-95 duration-200"
                    >
                      <RefreshCw className={`h-2.5 w-2.5 ${ratesLoading ? 'animate-spin' : ''}`} />
                      <span>同步外汇</span>
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-2xl border border-slate-150">
                  <div className="space-y-1">
                    <span className="block text-[9px] text-slate-400 font-bold">1 USD 折合</span>
                    <span className="block font-black text-slate-800 text-sm">￥{exchangeRateUSDToCNY.toFixed(3)}</span>
                  </div>
                  <div className="space-y-1 border-l border-slate-200 pl-3">
                    <span className="block text-[9px] text-slate-400 font-bold">1 {selectedResult.currency} 折合</span>
                    <span className="block font-black text-indigo-600 text-sm">￥{(selectedResult.exchangeRateToCNY).toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: 核心跨境参数与自设成本配置 (md:col-span-4) */}
            <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
              <div className="space-y-4">
                
                {/* A. Factory Cost with Currency Selector Toggle */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-transparent">
                    <label className="block text-[13px] font-extrabold text-slate-700 pl-0.5">
                      产品采购出厂价
                    </label>
                    <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
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
                    <span className="absolute left-3.5 top-3.5 text-xs font-mono font-bold text-slate-400">
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

                {/* B. Domestic Shipping */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-extrabold text-slate-700 pl-0.5">
                    国内打包运输 (￥ CNY) <span className="text-slate-400 text-[10px] font-medium">(可选)</span>
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
                  <label className="block text-[13px] font-extrabold text-slate-700 pl-0.5">
                    跨国干线运输 (￥ CNY) <span className="text-slate-400 text-[10px] font-medium">(可选)</span>
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

                {/* D. Packaging label and loss */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-extrabold text-slate-700 pl-0.5">
                    包装贴标与损耗 (￥ CNY) <span className="text-slate-400 text-[10px] font-medium">(可选)</span>
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
                    <label className="block text-[11px] font-black text-slate-450 leading-none">达人回扣 (%)</label>
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
                    <label className="block text-[11px] font-black text-slate-450 leading-none">退货损扣率 (%)</label>
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
                    <label className="block text-[11px] font-black text-indigo-500 leading-none">自选流量占比 (%)</label>
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
                    <label className="block text-[11px] font-black text-slate-450 leading-none">商品加算税率 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={input.taxRateLocal !== undefined ? input.taxRateLocal : 0}
                      onChange={(e) => onChangeInput('taxRateLocal', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-extrabold text-slate-850 text-xs transition-all"
                    />
                  </div>
                </div>

                {/* F. Pricing Settings */}
                {mode === 'reverse' ? (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <label className="text-[13px] font-extrabold text-slate-705">需求净利润率 (Net Margin)</label>
                      <span className="text-[9px] bg-indigo-100/90 text-indigo-850 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">反推计算</span>
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
                    <div className="flex justify-between items-center text-xs">
                      <label className="text-[13px] font-extrabold text-slate-700">销售牌面价 (Price)</label>
                      <span className="text-[9px] bg-emerald-100 text-emerald-805 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">正算评估</span>
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
                        className={`py-1.5 rounded-xl text-xs font-mono font-black border transition-all active:scale-95 duration-250 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/80 hover:border-slate-300'
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
                <span className="block text-[10px] text-slate-400 font-extrabold mb-0.5 whitespace-nowrap">最优投产推荐站点</span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  {topSiteRecommendation.siteName} 
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-mono">
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
                <span className="block text-[10px] text-slate-400 font-extrabold mb-0.5">全球大盘均值毛利率</span>
                <span className={`text-xs font-bold font-mono ${averageGrossMargin >= 40 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {averageGrossMargin.toFixed(1)}% {averageGrossMargin >= 40 ? ' (空间健康)' : ' (空间偏薄)'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-150 p-3 shadow-2xs flex items-center space-x-3">
              <div className="p-2.5 bg-violet-50 rounded-lg text-violet-600">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-extrabold mb-0.5">标准资金周转到款</span>
                <span className="text-xs font-bold text-slate-850 font-mono">
                  {input.payoutToolId === 'lianlian' ? 'D+ 16 天左右' : 'D+ 11 天放款'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-150 p-3 shadow-2xs flex items-center space-x-3">
              <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-extrabold mb-0.5">投流安全阀限制</span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
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
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-200">3. 实时运营核心收益核算</h2>
            </div>

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
              
              <p className="text-[11px] text-slate-400 font-bold pt-1.5 border-t border-slate-800">
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
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="block text-[11px] text-slate-400 font-bold">预计单笔净利润</span>
                {displayInCNY ? (
                  <>
                    <span className={`block text-2xl font-black font-mono tracking-tight ${selectedResult.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ￥{(selectedResult.netProfit * selectedResult.exchangeRateToCNY).toFixed(2)}
                    </span>
                    <span className="block text-[9px] text-slate-500 font-mono">
                      原币: {selectedResult.symbol}{selectedResult.netProfit.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={`block text-2xl font-black font-mono tracking-tight ${selectedResult.netProfit >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
                      {selectedResult.symbol}{selectedResult.netProfit.toFixed(2)}
                    </span>
                    <span className="block text-[9px] text-slate-500 font-mono">
                      折合: ￥{(selectedResult.netProfit * selectedResult.exchangeRateToCNY).toFixed(2)} CNY
                    </span>
                  </>
                )}
              </div>

              {/* Net margin and gross margin */}
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="block text-[11px] text-slate-400 font-bold">实得净利润比例</span>
                <span className={`block text-2xl font-black font-mono tracking-tight ${selectedResult.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedResult.netMargin.toFixed(1)}%
                </span>
                <span className="block text-[10px] text-slate-400 border-t border-slate-800 mt-1 pt-1 font-semibold text-right">
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
                  <span className="text-[10px] font-mono text-slate-400">{showCostBreakdown ? '折叠' : '点击展开'}</span>
                  {showCostBreakdown ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </div>
              </button>
              
              {showCostBreakdown && (
                <div className="p-3.5 space-y-2 text-[11px] font-mono border-t border-slate-900/60 transition-all">
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

            {/* Threshold Checks Box */}
            <div className={`p-4.5 rounded-xl border flex items-start gap-3 text-sm ${
              selectedResult.grossMargin >= 40.0
                ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-100'
                : 'bg-rose-950/20 border-rose-500/20 text-rose-100'
            }`}>
              {selectedResult.grossMargin >= 40.0 ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold">财务状况良好 (毛利率 &gt; 40%)</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      货源水位适中，达人回扣分成与海外投流空间充裕健康。
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-rose-350">毛利偏低预警 (毛利率 &lt; 40%)</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      低于跨境电商警戒标准 (40%)，建议优化供应链采购价或向上微调售价。
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recharts Pie Chart representation inside column 3 */}
          <div className="space-y-3 px-1 border-t border-slate-800/80 pt-4">
            <span className="block text-xs text-slate-400 tracking-wider font-mono">成本与费用占比构成估算 ({selectedResult.siteId})</span>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 relative flex-shrink-0 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="55%"
                      cy="50%"
                      innerRadius={22}
                      outerRadius={38}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pr-1.5">
                  <span className="block text-[7px] text-slate-400">毛利比</span>
                  <span className="block text-xs font-black font-mono text-indigo-200">{selectedResult.grossMargin.toFixed(0)}%</span>
                </div>
              </div>

              {/* Simplified micro legends */}
              <div className="flex-1 space-y-1 text-xs text-slate-300 font-mono">
                {breakdownData.slice(0, 4).map((entry) => {
                  let val = entry.value;
                  let dispSymbol = selectedResult.symbol;
                  if (displayInCNY) {
                    val = val * selectedResult.exchangeRateToCNY;
                    dispSymbol = '￥';
                  }
                  return (
                    <div key={entry.name} className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="truncate text-slate-400 text-[10px]">{entry.name}</span>
                      </span>
                      <span className="text-slate-100 font-mono text-[10px]">{dispSymbol}{val.toFixed(2)}</span>
                    </div>
                  );
                })}
                {breakdownData.length > 4 && (
                  <p className="text-[9px] text-slate-500 font-bold text-right">+ {breakdownData.length - 4} 项其他费用</p>
                )}
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
                formatMoney(selectedResult.grossProfit, selectedResult.symbol, selectedResult.currency, selectedResult.exchangeRateToCNY)
              )}
            </div>
            <p className="text-xs text-slate-450 leading-relaxed font-semibold">
              等同于：￥{Math.max(0, selectedResult.grossProfit * selectedResult.exchangeRateToCNY).toFixed(1)} CNY。单单成功交付后能用于获客出价的最极限额度。
            </p>
          </div>

          {/* C. Return Loss Sensitivity advice */}
          <div className="p-4.5 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
            <span className="block text-sm font-bold text-rose-650">跨国退货熔断机制</span>
            <div className="text-sm font-bold text-slate-700">
              退货率阀值：{(selectedSiteId === 'US' ? 15 : selectedSiteId === 'UK' ? 12 : 10)}%
            </div>
            <p className="text-xs text-rose-450 leading-relaxed font-semibold">
              各战区若退货率超过此值，会导致店铺平台降权或限制提现。
            </p>
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

      {/* ========================================================================= */}
      {/* NEW BATCH IMPORT CALCULATOR MODULE - 批量导入核算工具                     */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-150 shadow-md p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-rose-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <Import className="h-6 w-6 text-rose-500" />
            <div>
              <h2 className="text-lg font-bold text-slate-800">5. 多站点商品批量导入反推核算工具</h2>
              <p className="text-xs text-slate-500 mt-0.5">支持复制Excel表格多行数据，一秒批量演算生成适合四大站点的销售指导牌面价，并已包含相应的商品税费率核扣。</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setBatchRawInput(
                  "新品防紫外线太阳镜\t18.0\t22.0\t0.0\n" +
                  "迷你桌面制冷静音风扇\t32.5\t20.5\t6.0\n" +
                  "防水大容量健身旅行包\t24.9\t25.0\t10.0\n" +
                  "无线智能触控蓝牙耳机\t65.0\t30.0\t12.0"
                );
              }}
              className="text-xs p-1.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-lg transition"
            >
              载入新范例数据
            </button>
            <button
              onClick={handleCopyBatchToClipboard}
              className="flex items-center gap-1.5 text-xs p-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-sm"
              title="复制为Excel支持的制表符Tab隔开格式"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{copiedBatch ? "已复制成果过到剪贴板！" : "复制生成批量建议价格式"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* File Upload & Text Paste Tab Panel */}
          <div className="xl:col-span-4 space-y-4">
            
            {/* Inner elegant tab selector */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold leading-normal">
              <button
                type="button"
                onClick={() => setImportTab('upload')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  importTab === 'upload'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>文件上传导入</span>
              </button>
              <button
                type="button"
                onClick={() => setImportTab('manual')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  importTab === 'manual'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>直接粘贴核算</span>
              </button>
            </div>

            {importTab === 'upload' ? (
              <div className="space-y-4">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-indigo-600 bg-indigo-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <Upload className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                  <span className="block text-xs font-bold text-slate-700">将您的本地商品模板拖放到这里</span>
                  <span className="block text-[10px] text-slate-400 mt-1">支持 Excel (.xlsx, .xls) 或 TXT/CSV 文件</span>
                  
                  <div className="mt-4">
                    <label className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs text-slate-705 font-bold text-xs py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 select-none">
                      <span>选择本地文件</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.txt,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {uploadSuccess && (
                  <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-1.5 border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>商品批量文件导入成功并完成利润演算！</span>
                  </div>
                )}

                {uploadError && (
                  <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-800 font-bold flex items-center gap-1.5 border border-rose-200">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Templates download section */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5">
                  <span className="block text-xs font-bold text-slate-500 flex items-center gap-1 justify-center">
                    <Download className="h-3.5 w-3.5 text-slate-400" />
                    批量核算模版下载
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={downloadExcelTemplate}
                      className="py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Download className="h-3 w-3 text-emerald-600" />
                      <span>Excel 表格模板</span>
                    </button>
                    <button
                      type="button"
                      onClick={downloadTxtTemplate}
                      className="py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Download className="h-3 w-3 text-indigo-600" />
                      <span>TXT 格式模板</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <textarea
                  value={batchRawInput}
                  onChange={(e) => setBatchRawInput(e.target.value)}
                  placeholder="商品名称&#9;采购出厂价(￥)&#9;约定目标利润率(%)&#9;商品税费率(%)&#10;水杯&#9;25.0&#9;20.0&#9;5.0&#10;包包&#9;45.0&#9;25.0&#9;8.0"
                  className="w-full h-56 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-slate-800 leading-relaxed"
                />
                
                <button
                  type="button"
                  onClick={parseBatchInput}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>解析并计算利润价格 (批量计算)</span>
                </button>
              </div>
            )}
            
            <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-800 leading-normal border border-amber-200/50">
              <span className="font-bold flex items-center gap-1"><AlertCircle className="h-4 w-4 text-amber-600" /> 数据格式说明：</span>
              首行可包含表头。每行包含：<span className="font-mono bg-amber-100 px-1 rounded">产品品名</span>、<span className="font-mono bg-amber-100 px-1 rounded">货源出厂价(元)</span>、<span className="font-mono bg-amber-100 px-1 rounded">目标净利润率%(可省略)</span>、<span className="font-mono bg-amber-100 px-1 rounded">商品税率%(可省略)</span>。用 Tab 键、逗号或分号隔开。直接从 Excel 或 WPS 中复制整列进来直接核算最方便。
            </div>
          </div>

          {/* Site comparison preview grid table */}
          <div className="xl:col-span-8 flex flex-col justify-between space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-sm font-bold text-slate-700">建议售价明细表格 (包含所退返税费计核结果)</span>
              
              {/* Site selector inside table */}
              <div className="flex items-center space-x-1 border border-slate-200 p-0.5 rounded-lg bg-slate-50 text-xs font-bold text-slate-600">
                {SITE_FEE_CONFIGS.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => setSelectedBatchSiteId(site.id)}
                    className={`px-2.5 py-1 rounded transition-all ${
                      selectedBatchSiteId === site.id
                        ? 'bg-white border border-slate-200 text-indigo-700 font-bold shadow-xs'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    {siteFlagMap[site.id]} {site.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-150 rounded-xl bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase">
                    <th className="px-4 py-3">商品品名</th>
                    <th className="px-3 py-3 font-mono">国内货源(￥)</th>
                    <th className="px-3 py-3 font-mono">目标净利%</th>
                    <th className="px-3 py-3 font-mono">商品税率%</th>
                    <th className="px-4 py-3 font-mono text-indigo-700">建议海外售价</th>
                    <th className="px-4 py-3 font-mono text-emerald-700">建议售价 (CNY)</th>
                    <th className="px-3 py-3 text-red-650">平台交易扣点</th>
                    <th className="px-3 py-3">折算净利(CNY)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batchCalculationResults.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-slate-400 font-medium font-mono text-sm">
                        暂无解析产品。请在左侧文本域填入产品，并点击“解析并计算利润价格”
                      </td>
                    </tr>
                  ) : (
                    batchCalculationResults.map((p, i) => {
                      const siteSpec = p.results.find(res => res.siteId === selectedBatchSiteId) || p.results[0];
                      const localPrice = siteSpec.suggestedPriceLocal;
                      const priceCNY = localPrice * siteSpec.exchangeRateToCNY;
                      const fees = siteSpec.totalPlatformFees;
                      const feesCNY = fees * siteSpec.exchangeRateToCNY;
                      const netProfitLocal = siteSpec.netProfit;
                      const netProfitCNY = netProfitLocal * siteSpec.exchangeRateToCNY;

                      return (
                        <tr key={i} className="hover:bg-slate-50/50 transition">
                          <td className="px-4 py-3 font-bold text-slate-800 truncate max-w-[140px]" title={p.productName}>
                            {p.productName}
                          </td>
                          <td className="px-3 py-3 font-mono font-bold text-slate-650">
                            ￥{p.cogsRMB.toFixed(2)}
                          </td>
                          <td className="px-3 py-3 font-mono text-slate-550">
                            {p.targetProfitMargin.toFixed(1)}%
                          </td>
                          <td className="px-3 py-3 font-mono text-slate-550">
                            {p.taxRate.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-indigo-650">
                            {siteSpec.symbol}{localPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-emerald-600">
                            ￥{priceCNY.toFixed(2)}
                          </td>
                          <td className="px-3 py-3 font-mono text-slate-450" title={`外币佣金: ${siteSpec.symbol}${fees.toFixed(2)}`}>
                            ￥{feesCNY.toFixed(2)}
                          </td>
                          <td className={`px-3 py-3 font-mono font-bold ${netProfitCNY >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            ￥{netProfitCNY.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>


          </div>

        </div>

      </div>

    </div>
  );
}
