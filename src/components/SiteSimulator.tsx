import React, { useState, useEffect, useMemo } from 'react';
import { MultiSiteResult, SimulationInput, MonthlyOrder } from '../types';
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
  ClipboardCheck,
  SlidersHorizontal,
  BarChart3
} from 'lucide-react';

export function VectorFlag({ id, className = "h-4 w-6 object-cover rounded-xs" }: { id: string; className?: string }) {
  const normId = id.toUpperCase();
  switch (normId) {
    case 'US':
      return (
        <svg viewBox="0 0 7410 3900" className={className}>
          <rect width="7410" height="3900" fill="#b22234" />
          <path d="M0,300h7410M0,900h7410M0,1500h7410M0,2100h7410M0,2700h7410M0,3300h7410" stroke="#fff" strokeWidth="300" />
          <rect width="2964" height="2100" fill="#3c3b6e" />
          <g fill="#fff">
            <circle cx="296" cy="150" r="45" /><circle cx="888" cy="150" r="45" /><circle cx="1480" cy="150" r="45" /><circle cx="2072" cy="150" r="45" /><circle cx="2664" cy="150" r="45" />
            <circle cx="592" cy="300" r="45" /><circle cx="1184" cy="300" r="45" /><circle cx="1776" cy="300" r="45" /><circle cx="2368" cy="300" r="45" />
            <circle cx="296" cy="450" r="45" /><circle cx="888" cy="450" r="45" /><circle cx="1480" cy="450" r="45" /><circle cx="2072" cy="450" r="45" /><circle cx="2664" cy="450" r="45" />
            <circle cx="592" cy="600" r="45" /><circle cx="1184" cy="600" r="45" /><circle cx="1776" cy="600" r="45" /><circle cx="2368" cy="600" r="45" />
            <circle cx="296" cy="750" r="45" /><circle cx="888" cy="750" r="45" /><circle cx="1480" cy="750" r="45" /><circle cx="2072" cy="750" r="45" /><circle cx="2664" cy="750" r="45" />
            <circle cx="592" cy="900" r="45" /><circle cx="1184" cy="900" r="45" /><circle cx="1776" cy="900" r="45" /><circle cx="2368" cy="900" r="45" />
            <circle cx="296" cy="1050" r="45" /><circle cx="888" cy="1050" r="45" /><circle cx="1480" cy="1050" r="45" /><circle cx="2072" cy="1050" r="45" /><circle cx="2664" cy="1050" r="45" />
            <circle cx="592" cy="1200" r="45" /><circle cx="1184" cy="1200" r="45" /><circle cx="1776" cy="1200" r="45" /><circle cx="2368" cy="1200" r="45" />
            <circle cx="296" cy="1350" r="45" /><circle cx="888" cy="1350" r="45" /><circle cx="1480" cy="1350" r="45" /><circle cx="2072" cy="1350" r="45" /><circle cx="2664" cy="1350" r="45" />
            <circle cx="592" cy="1500" r="45" /><circle cx="1184" cy="1500" r="45" /><circle cx="1776" cy="1500" r="45" /><circle cx="2368" cy="1500" r="45" />
            <circle cx="296" cy="1650" r="45" /><circle cx="888" cy="1650" r="45" /><circle cx="1480" cy="1650" r="45" /><circle cx="2072" cy="1650" r="45" /><circle cx="2664" cy="1650" r="45" />
            <circle cx="592" cy="1800" r="45" /><circle cx="1184" cy="1800" r="45" /><circle cx="1776" cy="1800" r="45" /><circle cx="2368" cy="1800" r="45" />
            <circle cx="296" cy="1950" r="45" /><circle cx="888" cy="1950" r="45" /><circle cx="1480" cy="1950" r="45" /><circle cx="2072" cy="1950" r="45" /><circle cx="2664" cy="1950" r="45" />
          </g>
        </svg>
      );
    case 'UK':
    case 'GB':
      return (
        <svg viewBox="0 0 60 30" className={className}>
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" strokeWidth="4" />
          <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 V30 M0,15 H60" stroke="#c8102e" strokeWidth="6" />
        </svg>
      );
    case 'JP':
      return (
        <svg viewBox="0 0 30 20" className={className}>
          <rect width="30" height="20" fill="#fff" stroke="#f1f5f9" strokeWidth="0.5" />
          <circle cx="15" cy="10" r="6" fill="#bc002d" />
        </svg>
      );
    case 'MX':
      return (
        <svg viewBox="0 0 30 20" className={className}>
          <rect width="10" height="20" fill="#006847" />
          <rect x="10" width="10" height="20" fill="#fff" stroke="#f1f5f9" strokeWidth="0.5" />
          <rect x="20" width="10" height="20" fill="#c8102e" />
          <circle cx="15" cy="10" r="1.5" fill="#8b5a2b" />
        </svg>
      );
    case 'MY':
      return (
        <svg viewBox="0 0 28 14" className={className}>
          <rect width="28" height="14" fill="#fff" />
          <path d="M0,1 H28 M0,3 H28 M0,5 H28 M0,7 H28 M0,9 H28 M0,11 H28 M0,13 H28" stroke="#cc0000" strokeWidth="1" />
          <rect width="14" height="8" fill="#000066" />
          <circle cx="6" cy="4" r="2.5" fill="#ffcc00" />
          <circle cx="7" cy="4" r="2.5" fill="#000066" />
        </svg>
      );
    case 'TH':
      return (
        <svg viewBox="0 0 30 20" className={className}>
          <rect width="30" height="20" fill="#a51931" />
          <rect y="3.33" width="30" height="13.34" fill="#f4f5f8" />
          <rect y="6.67" width="30" height="6.67" fill="#2d2a4a" />
        </svg>
      );
    case 'PH':
      return (
        <svg viewBox="0 0 30 15" className={className}>
          <rect width="30" height="7.5" fill="#0038a8" />
          <rect y="7.5" width="30" height="7.5" fill="#ce1126" />
          <polygon points="0,0 13,7.5 0,15" fill="#fff" />
          <circle cx="4.3" cy="7.5" r="1.5" fill="#fcd116" />
        </svg>
      );
    case 'SG':
      return (
        <svg viewBox="0 0 30 20" className={className}>
          <rect width="30" height="10" fill="#ee2536" />
          <rect y="10" width="30" height="10" fill="#fff" stroke="#f1f5f9" strokeWidth="0.5" />
          <path d="M 4 5 A 3 3 0 1 0 8 5 A 2.5 2.5 0 1 1 4 5" fill="#fff" />
        </svg>
      );
    case 'VN':
      return (
        <svg viewBox="0 0 30 20" className={className}>
          <rect width="30" height="20" fill="#da251d" />
          <polygon points="15,4 17.35,11.25 23.5,11.25 18.5,14.9 20.4,21.75 15,17.5 9.6,21.75 11.5,14.9 6.5,11.25 12.65,11.25" fill="#ffff00" transform="scale(0.8) translate(3.75, 2)" />
        </svg>
      );
    case 'CA':
      return (
        <svg viewBox="0 0 30 15" className={className}>
          <rect width="7.5" height="15" fill="#ff0000" />
          <rect x="7.5" width="15" height="15" fill="#fff" />
          <rect x="22.5" width="7.5" height="15" fill="#ff0000" />
          <path d="M 15 3 L 16 6 L 19 5 L 18 8 L 21 9 L 18 10 L 19 12 L 15 11 L 11 12 L 12 10 L 9 9 L 12 8 L 11 5 L 14 6 Z" fill="#ff0000" />
        </svg>
      );
    case 'AU':
      return (
        <svg viewBox="0 0 30 15" className={className}>
          <rect width="30" height="15" fill="#000033" />
          <path d="M0,0 L15,7.5 M15,0 L0,7.5" stroke="#fff" strokeWidth="1" />
          <path d="M7.5,0 V7.5 M0,3.75 H15" stroke="#fff" strokeWidth="2" />
          <path d="M7.5,0 V7.5 M0,3.75 H15" stroke="#cc0000" strokeWidth="1" />
          <circle cx="22.5" cy="11.25" r="0.6" fill="#fff" />
          <circle cx="25.5" cy="6" r="0.6" fill="#fff" />
          <circle cx="25.5" cy="4.5" r="0.6" fill="#fff" />
          <circle cx="27.5" cy="8.5" r="0.6" fill="#fff" />
        </svg>
      );
    case 'DE':
      return (
        <svg viewBox="0 0 30 18" className={className}>
          <rect width="30" height="6" fill="#000" />
          <rect y="6" width="30" height="6" fill="#dd0000" />
          <rect y="12" width="30" height="6" fill="#ffce00" />
        </svg>
      );
    case 'FR':
      return (
        <svg viewBox="0 0 30 20" className={className}>
          <rect width="10" height="20" fill="#00209f" />
          <rect x="10" width="10" height="20" fill="#fff" stroke="#f1f5f9" strokeWidth="0.5" />
          <rect x="20" width="10" height="20" fill="#f31830" />
        </svg>
      );
    case 'IT':
      return (
        <svg viewBox="0 0 30 20" className={className}>
          <rect width="10" height="20" fill="#009246" />
          <rect x="10" width="10" height="20" fill="#fff" stroke="#f1f5f9" strokeWidth="0.5" />
          <rect x="20" width="10" height="20" fill="#ce2b37" />
        </svg>
      );
    case 'ES':
      return (
        <svg viewBox="0 0 30 20" className={className}>
          <rect width="30" height="5" fill="#c60b1e" />
          <rect y="5" width="30" height="10" fill="#ffc400" />
          <rect y="15" width="30" height="5" fill="#c60b1e" />
          <circle cx="7.5" cy="10" r="1.5" fill="#c60b1e" />
        </svg>
      );
    default:
      return <span className="text-sm font-bold text-slate-400">{id}</span>;
  }
}

interface SiteSimulatorProps {
  results: MultiSiteResult[];
  input: SimulationInput;
  onChangeInput: (key: keyof SimulationInput, value: any) => void;
  exchangeRateUSDToCNY: number;
  exchangeRates: Record<string, number>;
  ratesLoading?: boolean;
  ratesFetchedAt?: string | null;
  ratesVerification?: {
    verified: boolean;
    lastCheckedAt: string;
    status: string;
    errors: string[];
  } | null;
  onFetchRates?: () => Promise<void>;
  
  // Lifted States
  monthlyOrders: MonthlyOrder[];
  setMonthlyOrders: (orders: MonthlyOrder[]) => void;
  productCostDict: Record<string, { cogs: number; domesticShipping: number; internationalShipping: number }>;
  setProductCostDict: (dict: Record<string, { cogs: number; domesticShipping: number; internationalShipping: number }>) => void;
  ordersFeedbackMsg: { text: string; isError: boolean } | null;
  setOrdersFeedbackMsg: (msg: { text: string; isError: boolean } | null) => void;
}

export default function SiteSimulator({ 
  results, 
  input, 
  onChangeInput, 
  exchangeRateUSDToCNY,
  exchangeRates,
  ratesLoading = false,
  ratesFetchedAt = null,
  ratesVerification = null,
  onFetchRates,
  
  // Lifted Props
  monthlyOrders,
  setMonthlyOrders,
  productCostDict,
  setProductCostDict,
  ordersFeedbackMsg,
  setOrdersFeedbackMsg
}: SiteSimulatorProps) {
  const selectedSiteId = input.siteId || 'US';
  const [displayInCNY, setDisplayInCNY] = useState<boolean>(false);
  const [showCostBreakdown, setShowCostBreakdown] = useState<boolean>(false);
  const [returnRateThreshold, setReturnRateThreshold] = useState<number>(10);

  // Mobile-only responsive view subtabs
  const [mobileSubTab, setMobileSubTab] = useState<'inputs' | 'results'>('inputs');
  const [batchMobileSubTab, setBatchMobileSubTab] = useState<'inputs' | 'results'>('inputs');
  const [enterpriseMobileSubTab, setEnterpriseMobileSubTab] = useState<'inputs' | 'results'>('inputs');

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
  const [evalSKUName, setEvalSKUName] = useState<string>('');
  const [customSKUCogsRMB, setCustomSKUCogsRMB] = useState<string>('');
  const [customSKULogisticsRMB, setCustomSKULogisticsRMB] = useState<string>('');

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
    const headers = headerLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));

    // Check if this is the high-fidelity TikTok Shop Completed Orders template
    const isTikTokTemplate = headers.includes('order status') || headers.includes('seller sku') || headers.includes('sku subtotal after discount');

    let idIdx = -1, nameIdx = -1, qtyIdx = -1, siteIdx = -1, revIdx = -1;
    let statusIdx = -1, sellerSkuIdx = -1, subtotalBeforeDiscountIdx = -1;
    let platformDiscountIdx = -1, sellerDiscountIdx = -1, subtotalAfterDiscountIdx = -1;
    let shippingFeeIdx = -1, taxesIdx = -1, orderAmountIdx = -1, refundAmountIdx = -1;
    let categoryIdx = -1, weightIdx = -1;

    headers.forEach((h, idx) => {
      // Standard Fallback matching
      if (h.includes('order id') || h.includes('订单id') || h === 'id') idIdx = idx;
      if (h.includes('product name') || h.includes('商品名称') || h.includes('标题')) nameIdx = idx;
      if (h === 'quantity' || h === '数量' || h === 'qty') qtyIdx = idx;
      if (h.includes('country') || h.includes('国家') || h.includes('国家/地区') || h.includes('站点') || h.includes('site')) siteIdx = idx;
      if (h.includes('order amount') || h.includes('订单金额') || h === 'revenue') revIdx = idx;

      // TikTok specific matching
      if (h === 'order status' || h === '订单状态') statusIdx = idx;
      if (h === 'seller sku' || h === '商家sku') sellerSkuIdx = idx;
      if (h === 'sku subtotal before discount' || h === '折前sku小计') subtotalBeforeDiscountIdx = idx;
      if (h === 'sku platform discount' || h === '平台折扣' || h === 'sku平台折扣') platformDiscountIdx = idx;
      if (h === 'sku seller discount' || h === '商家折扣' || h === 'sku商家折扣') sellerDiscountIdx = idx;
      if (h === 'sku subtotal after discount' || h === '折后sku小计') subtotalAfterDiscountIdx = idx;
      if (h === 'shipping fee after discount' || h === '折后运费') shippingFeeIdx = idx;
      if (h === 'taxes' || h === '税' || h === '税费') taxesIdx = idx;
      if (h === 'order refund amount' || h === '订单退款金额') refundAmountIdx = idx;
      if (h === 'product category' || h === '产品品类') categoryIdx = idx;
      if (h === 'weight(kg)' || h === '重量(kg)' || h.includes('weight')) weightIdx = idx;
    });

    // Standard fallbacks if indices not matched
    if (idIdx === -1) idIdx = 0;
    if (nameIdx === -1) nameIdx = headers.findIndex(h => h.includes('name')) !== -1 ? headers.findIndex(h => h.includes('name')) : 7;
    if (qtyIdx === -1) qtyIdx = headers.findIndex(h => h.includes('qty') || h.includes('quantity')) !== -1 ? headers.findIndex(h => h.includes('qty') || h.includes('quantity')) : 9;
    if (siteIdx === -1) siteIdx = headers.findIndex(h => h.includes('country') || h.includes('state')) !== -1 ? headers.findIndex(h => h.includes('country') || h.includes('state')) : 44;
    if (revIdx === -1) revIdx = headers.findIndex(h => h.includes('amount') || h.includes('total')) !== -1 ? headers.findIndex(h => h.includes('amount') || h.includes('total')) : 24;

    const parsed: MonthlyOrder[] = [];
    const uniqueNames = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Smart CSV parsing handling quotes correctly
      const parts: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current.trim().replace(/^"|"$/g, ''));

      if (parts.length < 2) continue;

      const orderId = parts[idIdx] || `ORD-M-${i}`;
      const productName = parts[nameIdx] || '未知商品';
      const quantity = Math.max(1, parseInt(parts[qtyIdx]) || 1);
      
      const rawCountry = parts[siteIdx] || 'US';
      let siteId = 'US';
      const countryText = rawCountry.toLowerCase();
      if (countryText.includes('美') || countryText.includes('us')) siteId = 'US';
      else if (countryText.includes('英') || countryText.includes('uk') || countryText.includes('gb')) siteId = 'UK';
      else if (countryText.includes('马') || countryText.includes('my')) siteId = 'MY';
      else if (countryText.includes('越') || countryText.includes('vn')) siteId = 'VN';
      else if (countryText.includes('泰') || countryText.includes('th')) siteId = 'TH';
      else if (countryText.includes('新') || countryText.includes('sg')) siteId = 'SG';
      else if (countryText.includes('菲') || countryText.includes('ph')) siteId = 'PH';
      else if (countryText.includes('日') || countryText.includes('jp')) siteId = 'JP';
      else if (countryText.includes('墨') || countryText.includes('mx')) siteId = 'MX';

      let salesRevenueLocal = parseFloat(parts[revIdx]?.replace(/[^0-9.-]/g, '')) || 29.99;

      if (isTikTokTemplate) {
        const status = parts[statusIdx] || '已完成';
        const sellerSku = parts[sellerSkuIdx] || '';
        const subtotalBeforeDiscount = parseFloat(parts[subtotalBeforeDiscountIdx]?.replace(/[^0-9.-]/g, '')) || 0;
        const platformDiscount = parseFloat(parts[platformDiscountIdx]?.replace(/[^0-9.-]/g, '')) || 0;
        const sellerDiscount = parseFloat(parts[sellerDiscountIdx]?.replace(/[^0-9.-]/g, '')) || 0;
        const subtotalAfterDiscount = parseFloat(parts[subtotalAfterDiscountIdx]?.replace(/[^0-9.-]/g, '')) || salesRevenueLocal;
        const shippingFeeLocal = parseFloat(parts[shippingFeeIdx]?.replace(/[^0-9.-]/g, '')) || 0;
        const taxesLocal = parseFloat(parts[taxesIdx]?.replace(/[^0-9.-]/g, '')) || 0;
        const orderAmount = parseFloat(parts[revIdx]?.replace(/[^0-9.-]/g, '')) || 0;
        const refundAmount = parseFloat(parts[refundAmountIdx]?.replace(/[^0-9.-]/g, '')) || 0;
        const category = parts[categoryIdx] || '';
        const weightKg = parseFloat(parts[weightIdx]?.replace(/[^0-9.-]/g, '')) || 0;

        // For TikTok shop payout, the merchant revenue per item after merchant coupons is the SKU Subtotal After Discount.
        salesRevenueLocal = subtotalAfterDiscount;

        parsed.push({
          id: orderId,
          productName,
          quantity,
          siteId,
          salesRevenueLocal,
          status,
          sellerSku,
          subtotalBeforeDiscount,
          platformDiscount,
          sellerDiscount,
          subtotalAfterDiscount,
          shippingFeeLocal,
          taxesLocal,
          orderAmount,
          refundAmount,
          category,
          weightKg,
          isTikTokSettlement: true
        });
      } else {
        parsed.push({
          id: orderId,
          productName,
          quantity,
          siteId,
          salesRevenueLocal
        });
      }

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

      if (isTikTokTemplate) {
        setOrdersFeedbackMsg({
          text: `🎉 成功智能识别并对齐 TikTok Shop 完结订单账单！已自动为您去重识别出 ${uniqueNames.size} 款独立商品。平台扣点、代征税费、订单退款等明细已为您100%精准解析归并！`,
          isError: false
        });
      } else {
        setOrdersFeedbackMsg({
          text: `🎉 成功导入月度订单后台报表！已自动为您去重识别出 ${uniqueNames.size} 款独立商品。相同商品的采购成本与头程运费已自动智能对齐归并！`,
          isError: false
        });
      }
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

  const handleExportVisualReport = () => {
    if (monthlyOrders.length === 0) return;

    // Aggregate product-level data for charts
    const productAggregates: Record<string, { name: string; qty: number; revenue: number; cogs: number; shipping: number; profit: number }> = {};
    
    monthlyOrders.forEach(order => {
      const costs = productCostDict[order.productName] || { cogs: 0, domesticShipping: 0, internationalShipping: 0 };
      const qty = order.quantity;
      const r = results.find(x => x.siteId === order.siteId) || results[0];
      const rateToCNY = r ? r.exchangeRateToCNY : 1.0;
      
      const revCNY = (order.isTikTokSettlement ? (order.subtotalAfterDiscount || 0) : order.salesRevenueLocal) * rateToCNY;
      const cogsCNY = costs.cogs * qty;
      const shippingCNY = (costs.domesticShipping + costs.internationalShipping) * qty;
      
      let platformFeeCNY = 0;
      if (order.isTikTokSettlement) {
        const siteConfig = SITE_FEE_CONFIGS.find(x => x.id === order.siteId) || SITE_FEE_CONFIGS[0];
        const siteCommissionRate = siteConfig ? siteConfig.commissionRate : 0.08;
        platformFeeCNY = revCNY * siteCommissionRate + (revCNY * 0.02 + qty * 0.30 * rateToCNY);
      } else {
        platformFeeCNY = revCNY * 0.08;
      }
      
      const netProfit = revCNY - cogsCNY - shippingCNY - platformFeeCNY;

      if (!productAggregates[order.productName]) {
        productAggregates[order.productName] = {
          name: order.productName,
          qty: 0,
          revenue: 0,
          cogs: 0,
          shipping: 0,
          profit: 0
        };
      }

      productAggregates[order.productName].qty += qty;
      productAggregates[order.productName].revenue += revCNY;
      productAggregates[order.productName].cogs += cogsCNY;
      productAggregates[order.productName].shipping += shippingCNY;
      productAggregates[order.productName].profit += netProfit;
    });

    const aggArray = Object.values(productAggregates);
    const labelsJson = JSON.stringify(aggArray.map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name));
    const revenueDataJson = JSON.stringify(aggArray.map(p => parseFloat(p.revenue.toFixed(2))));
    const costDataJson = JSON.stringify(aggArray.map(p => parseFloat((p.cogs + p.shipping).toFixed(2))));
    const profitDataJson = JSON.stringify(aggArray.map(p => parseFloat(p.profit.toFixed(2))));

    // Total metrics
    const totalRev = aggArray.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalCogs = aggArray.reduce((acc, curr) => acc + curr.cogs, 0);
    const totalShipping = aggArray.reduce((acc, curr) => acc + curr.shipping, 0);
    const totalPlatform = monthlyReconciliationData ? monthlyReconciliationData.totalPlatformFeesCNY : 0;
    const totalAds = monthlyReconciliationData ? monthlyReconciliationData.totalAdSpendCNY : 0;
    const totalTaxesLosses = monthlyReconciliationData ? (monthlyReconciliationData.totalReturnLossCNY + monthlyReconciliationData.totalTaxesCNY + monthlyReconciliationData.totalWithdrawalFeesCNY) : 0;
    const totalProfit = totalRev - totalCogs - totalShipping - totalPlatform - totalAds - totalTaxesLosses;

    const htmlContent = `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PriceSnap 智能月度对账财务可视化报表</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background-color: #f8fafc;
        }
    </style>
</head>
<body class="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
            <span class="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">智能月度对账系统</span>
            <h1 class="text-3xl font-extrabold tracking-tight">PriceSnap <span class="text-indigo-400">数据可视化精算报告</span></h1>
            <p class="text-slate-400 text-sm">由跨境全链路精算引擎自动生成 • 实时多币种账单对齐归并</p>
        </div>
        <div class="flex flex-col items-end gap-1 font-mono text-sm text-slate-400">
            <div>报告生成时间: ${new Date().toLocaleString()}</div>
            <div>订单处理总数: <span class="text-indigo-400 font-bold">${monthlyOrders.length}</span> 笔</div>
        </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div class="text-xs text-slate-500 font-bold uppercase tracking-wider">期内总营业额 (CNY)</div>
            <div class="text-2xl font-black text-slate-900 font-mono">￥${totalRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div class="text-xs text-indigo-600 font-semibold">100% 汇率换算后合算</div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div class="text-xs text-slate-500 font-bold uppercase tracking-wider">核心货值/物流成本 (CNY)</div>
            <div class="text-2xl font-black text-rose-600 font-mono">￥${(totalCogs + totalShipping).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div class="text-xs text-slate-450 font-medium">采购: ￥${totalCogs.toFixed(2)} | 物流: ￥${totalShipping.toFixed(2)}</div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div class="text-xs text-slate-500 font-bold uppercase tracking-wider">平台佣金及税费公摊 (CNY)</div>
            <div class="text-2xl font-black text-orange-600 font-mono">￥${(totalPlatform + totalTaxesLosses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div class="text-xs text-slate-450 font-medium">包含佣金、VAT税、退货损耗</div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-indigo-200 shadow-md shadow-indigo-100/50 bg-gradient-to-b from-indigo-50/20 to-white p-6 space-y-2">
            <div class="text-xs text-indigo-700 font-bold uppercase tracking-wider">期内实收净利润 (CNY)</div>
            <div class="text-2xl font-black ${totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-mono">￥${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div class="text-xs text-indigo-700 font-bold">综合实收利润率: <span class="font-mono">${totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : '0.0'}%</span></div>
        </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1: Line Chart (Comparison) -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div class="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wider">📈 各商品核心财务曲线对比</h3>
                <span class="text-xs text-slate-400 font-semibold">营业额 vs 总成本 vs 净利润</span>
            </div>
            <div class="relative h-80">
                <canvas id="profitLineChart"></canvas>
            </div>
        </div>

        <!-- Chart 2: Bar Chart (Breakdown) -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div class="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wider">📊 经营成本与利润组成柱状图</h3>
                <span class="text-xs text-slate-400 font-semibold">全链路财务结构归总</span>
            </div>
            <div class="relative h-80">
                <canvas id="financialBarChart"></canvas>
            </div>
        </div>
    </div>

    <!-- Details Table -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50">
            <div>
                <h2 class="font-extrabold text-slate-900 text-lg">📁 详细交易账单对账明细</h2>
                <p class="text-slate-500 text-xs mt-0.5 font-medium">按单精确换算人民币后的全要素明细列表</p>
            </div>
            <span class="bg-slate-200 text-slate-800 text-xs px-3 py-1 rounded-full font-bold">共 ${monthlyOrders.length} 行数据</span>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                        <th class="p-4">订单号</th>
                        <th class="p-4">商品名称</th>
                        <th class="p-4">站点</th>
                        <th class="p-4">成交数量</th>
                        <th class="p-4">本地销售额</th>
                        <th class="p-4">代征税费</th>
                        <th class="p-4">折后实收金额</th>
                        <th class="p-4">状态</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700 font-semibold">
                    ${monthlyOrders.map(o => `
                        <tr class="hover:bg-slate-50/50 transition">
                            <td class="p-4 font-mono font-bold text-slate-900">${o.id}</td>
                            <td class="p-4 truncate max-w-xs" title="${o.productName}">${o.productName}</td>
                            <td class="p-4 font-mono font-bold text-indigo-600">${o.siteId}</td>
                            <td class="p-4 font-mono font-bold">${o.quantity}</td>
                            <td class="p-4 font-mono">￥${(o.salesRevenueLocal * (results.find(x => x.siteId === o.siteId)?.exchangeRateToCNY || 1)).toFixed(2)}</td>
                            <td class="p-4 font-mono text-slate-500">￥${((o.taxesLocal || 0) * (results.find(x => x.siteId === o.siteId)?.exchangeRateToCNY || 1)).toFixed(2)}</td>
                            <td class="p-4 font-mono font-extrabold text-slate-900">￥${((o.subtotalAfterDiscount || o.salesRevenueLocal) * (results.find(x => x.siteId === o.siteId)?.exchangeRateToCNY || 1)).toFixed(2)}</td>
                            <td class="p-4">
                                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    o.status === '已取消' || o.status === 'Cancelled'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }">${o.status || '已完成'}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Chart Configuration Script -->
    <script>
        // Line Chart (Product Comparison)
        const lineCtx = document.getElementById('profitLineChart').getContext('2d');
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ${labelsJson},
                datasets: [
                    {
                        label: '营业额 (RMB)',
                        data: ${revenueDataJson},
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        borderWidth: 2.5,
                        tension: 0.35,
                        fill: true
                    },
                    {
                        label: '商品总成本 (RMB)',
                        data: ${costDataJson},
                        borderColor: '#e11d48',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.35
                    },
                    {
                        label: '实收净利润 (RMB)',
                        data: ${profitDataJson},
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        borderWidth: 2.5,
                        tension: 0.35,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { weight: 'bold', size: 11 } }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(0, 0, 0, 0.03)' },
                        ticks: { font: { weight: 'bold', size: 10 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { weight: 'bold', size: 10 } }
                    }
                }
            }
        });

        // Bar Chart (Financial Structure Breakdown)
        const barCtx = document.getElementById('financialBarChart').getContext('2d');
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['总营业额', '采购成本', '头程物流', '平台扣点', '广告推广', '税费退损', '净利润'],
                datasets: [{
                    label: '资金结构占比 (RMB)',
                    data: [
                        ${totalRev.toFixed(2)},
                        ${totalCogs.toFixed(2)},
                        ${totalShipping.toFixed(2)},
                        ${totalPlatform.toFixed(2)},
                        ${totalAds.toFixed(2)},
                        ${totalTaxesLosses.toFixed(2)},
                        ${totalProfit.toFixed(2)}
                    ],
                    backgroundColor: [
                        '#4f46e5',
                        '#e11d48',
                        '#f43f5e',
                        '#ea580c',
                        '#eab308',
                        '#94a3b8',
                        '#10b981'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(0, 0, 0, 0.03)' },
                        ticks: { font: { weight: 'bold', size: 10 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { weight: 'bold', size: 10 } }
                    }
                }
            }
        });
    </script>
</body>
</html>
    `;

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `PriceSnap_可视化柱状曲线对账报告_${monthlyOrders.length}单.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const platformId = input.platformId || 'tiktok';
  const siteTheme = useMemo(() => {
    switch (platformId) {
      case 'amazon':
        return {
          cardBg: 'bg-[#FDFBF7] border-[#E8DFD0] text-stone-900',
          inputBg: 'bg-[#FAF6EE] border-[#DCD3C0] text-stone-900 focus:ring-[#C77C40]',
          accentText: 'text-[#C77C40]',
          accentBg: 'bg-[#C77C40]',
          hoverBg: 'hover:bg-[#F4EBE0]',
          textMuted: 'text-stone-500',
        };
      case 'walmart':
        return {
          cardBg: 'bg-[#001D40]/90 border-blue-900/50 text-slate-100 shadow-xl',
          inputBg: 'bg-[#00142D] border-blue-800/60 text-slate-100 focus:ring-blue-500',
          accentText: 'text-[#0071CE]',
          accentBg: 'bg-[#0071CE]',
          hoverBg: 'hover:bg-[#002B5C]',
          textMuted: 'text-slate-400',
        };
      case 'tiktok':
        return {
          cardBg: 'bg-[#121212]/95 border-zinc-800/80 text-zinc-100 shadow-2xl',
          inputBg: 'bg-[#1A1A1A] border-zinc-800 text-zinc-100 focus:ring-zinc-600',
          accentText: 'text-[#FE2C55]',
          accentBg: 'bg-[#FE2C55]',
          hoverBg: 'hover:bg-[#2A2A2A]',
          textMuted: 'text-zinc-400',
        };
      case 'etsy': // eBay / Etsy
        return {
          cardBg: 'bg-white border-slate-200 text-slate-800 shadow-sm',
          inputBg: 'bg-slate-50 border-slate-250 text-slate-900 focus:ring-indigo-500',
          accentText: 'text-[#E05A47]',
          accentBg: 'bg-[#E05A47]',
          hoverBg: 'hover:bg-slate-50',
          textMuted: 'text-slate-500',
        };
      case 'shopify': // Shopify / Independent
        return {
          cardBg: 'bg-white border-stone-200/80 text-stone-800 shadow-sm',
          inputBg: 'bg-stone-50/80 border-stone-200 text-stone-900 focus:ring-emerald-500',
          accentText: 'text-[#96BF48]',
          accentBg: 'bg-[#96BF48]',
          hoverBg: 'hover:bg-stone-50',
          textMuted: 'text-stone-500',
        };
      default:
        return {
          cardBg: 'bg-white border-slate-200 text-slate-800 shadow-sm',
          inputBg: 'bg-slate-50 border-slate-250 text-slate-950 focus:ring-indigo-500',
          accentText: 'text-indigo-600',
          accentBg: 'bg-indigo-600',
          hoverBg: 'hover:bg-slate-50',
          textMuted: 'text-slate-500',
        };
    }
  }, [platformId]);

  const resultsTheme = useMemo(() => {
    switch (platformId) {
      case 'amazon':
        return {
          containerBg: 'bg-[#FCF9F2] border-[#E8DFD0] text-stone-900 shadow-xl',
          boxBg: 'bg-[#F4EDE0] border-[#E0D5C1] text-stone-900',
          boxInnerBg: 'bg-[#FAF6EE] border-[#E4DBCB]',
          textPrimary: 'text-stone-900',
          textMuted: 'text-stone-500',
          border: 'border-[#E4DBCB]',
          divider: 'border-stone-300/40',
          accentText: 'text-[#C77C40]',
          accentBtn: 'bg-[#C77C40] text-white hover:bg-[#B56A30]',
          collapsibleBtn: 'bg-[#EADFCB] hover:bg-[#DFD3BE] text-stone-850',
          priceColor: 'text-stone-950 font-black',
          priceBg: 'bg-[#FAF6EE] border-[#EADFCB]',
          isLight: true,
        };
      case 'walmart':
        return {
          containerBg: 'bg-[#002F6C] border-[#001D40] text-slate-100 shadow-xl',
          boxBg: 'bg-[#001E44] border-[#00244F] text-slate-100',
          boxInnerBg: 'bg-[#00142D] border-blue-900/40',
          textPrimary: 'text-white',
          textMuted: 'text-blue-200/70',
          border: 'border-blue-900/40',
          divider: 'border-blue-800/30',
          accentText: 'text-[#FFC220]',
          accentBtn: 'bg-[#FFC220] text-stone-900 hover:bg-[#E0A800] font-bold',
          collapsibleBtn: 'bg-[#00244F] hover:bg-[#001E44] text-white',
          priceColor: 'text-white font-extrabold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text',
          priceBg: 'bg-[#001E44] border-blue-900',
          isLight: false,
        };
      case 'tiktok':
        return {
          containerBg: 'bg-[#0A0A0A] border-zinc-800 text-zinc-100 shadow-2xl',
          boxBg: 'bg-[#141416] border-zinc-800 text-zinc-100',
          boxInnerBg: 'bg-black border-zinc-800',
          textPrimary: 'text-white',
          textMuted: 'text-zinc-400',
          border: 'border-zinc-800',
          divider: 'border-zinc-800/40',
          accentText: 'text-[#FE2C55]',
          accentBtn: 'bg-[#FE2C55] text-white hover:bg-[#E02247]',
          collapsibleBtn: 'bg-[#18181C] hover:bg-[#202025] text-zinc-100',
          priceColor: 'text-white font-extrabold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text',
          priceBg: 'bg-[#141416] border-zinc-800',
          isLight: false,
        };
      case 'etsy': // eBay / Etsy
        return {
          containerBg: 'bg-white border-slate-200 text-slate-800 shadow-xl',
          boxBg: 'bg-slate-50 border-slate-200 text-slate-800',
          boxInnerBg: 'bg-white border-slate-150',
          textPrimary: 'text-slate-900',
          textMuted: 'text-slate-500',
          border: 'border-slate-200',
          divider: 'border-slate-200/50',
          accentText: 'text-indigo-600',
          accentBtn: 'bg-indigo-600 text-white hover:bg-indigo-700',
          collapsibleBtn: 'bg-slate-100 hover:bg-slate-200/75 text-slate-800',
          priceColor: 'text-slate-950 font-black',
          priceBg: 'bg-white border-slate-200',
          isLight: true,
        };
      case 'shopify': // Shopify / Independent
        return {
          containerBg: 'bg-[#008060] border-[#005E46] text-white shadow-xl',
          boxBg: 'bg-[#006048] border-[#00503B] text-white',
          boxInnerBg: 'bg-[#004D3C] border-[#003D2E]',
          textPrimary: 'text-white',
          textMuted: 'text-emerald-100/70',
          border: 'border-[#00503B]',
          divider: 'border-[#005E46]/30',
          accentText: 'text-[#96BF48]',
          accentBtn: 'bg-[#96BF48] text-stone-900 hover:bg-[#83A93D] font-bold',
          collapsibleBtn: 'bg-[#004D3C] hover:bg-[#004031] text-white',
          priceColor: 'text-white font-extrabold bg-gradient-to-r from-white via-emerald-100 to-emerald-250 bg-clip-text',
          priceBg: 'bg-[#006048] border-[#00503B]',
          isLight: false,
        };
      default:
        return {
          containerBg: 'bg-slate-900 border-slate-800 text-white shadow-xl',
          boxBg: 'bg-slate-850 border-slate-800 text-white',
          boxInnerBg: 'bg-slate-900 border-slate-800/60',
          textPrimary: 'text-white',
          textMuted: 'text-slate-400',
          border: 'border-slate-800',
          divider: 'border-slate-800/40',
          accentText: 'text-indigo-400',
          accentBtn: 'bg-indigo-600 text-white hover:bg-indigo-700',
          collapsibleBtn: 'bg-slate-850 hover:bg-slate-800 text-slate-200',
          priceColor: 'text-white font-extrabold bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text',
          priceBg: 'bg-slate-850 border-slate-800',
          isLight: false,
        };
    }
  }, [platformId]);

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
      onChangeInput('siteId', supportedSites[0]);
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
      const rateToCNY = r ? r.exchangeRateToCNY : 1.0;

      if (order.isTikTokSettlement) {
        // High fidelity TikTok Shop settlement calculation
        const itemRevenueCNY = (order.subtotalAfterDiscount || 0) * rateToCNY;
        const platformSubsidyCNY = (order.platformDiscount || 0) * rateToCNY; // TK subsidizes this
        
        // TikTok Shop standard commission (e.g. 6% or 8% depending on category, or use the simulated site commission rate)
        const siteConfig = SITE_FEE_CONFIGS.find(x => x.id === order.siteId) || SITE_FEE_CONFIGS[0];
        const siteCommissionRate = siteConfig ? siteConfig.commissionRate : 0.08;
        const commissionCNY = itemRevenueCNY * siteCommissionRate;
        const transactionCNY = itemRevenueCNY * 0.02 + qty * 0.30 * rateToCNY; // 2% + $0.30 standard transaction fee
        const taxesCNY = (order.taxesLocal || 0) * rateToCNY;
        
        totalRevenueCNY += itemRevenueCNY + platformSubsidyCNY; // Subsidies are extra income!
        totalCogsCNY += costs.cogs * qty;
        totalShippingCNY += (costs.domesticShipping + costs.internationalShipping) * qty;
        totalPlatformFeesCNY += (commissionCNY + transactionCNY);
        
        // Ad spend (TK ad attribution average or direct simulation rate)
        const adSpendCNY = itemRevenueCNY * (r ? (r.adSpend / (r.suggestedPriceLocal || 1)) : 0.12);
        totalAdSpendCNY += adSpendCNY;

        // Refund/Return losses if the order was refunded
        if (order.refundAmount && order.refundAmount > 0) {
          totalReturnLossCNY += order.refundAmount * rateToCNY;
        } else {
          // Standard return rate公摊
          totalReturnLossCNY += (r ? r.returnLoss : 0) * rateToCNY * qty;
        }

        totalTaxesCNY += taxesCNY;
        const withdrawalCNY = r 
          ? (r.withdrawalFee + r.exchangeLossBuffer) * rateToCNY * qty 
          : 0.01 * itemRevenueCNY;
        totalWithdrawalFeesCNY += withdrawalCNY;
      } else {
        // Local revenue to CNY
        const revCNY = order.salesRevenueLocal * rateToCNY;
        totalRevenueCNY += revCNY;

        // Purchase & shipping costs
        totalCogsCNY += costs.cogs * qty;
        totalShippingCNY += (costs.domesticShipping + costs.internationalShipping) * qty;

        // Platform fees (derived using our high fidelity pricing model coefficients)
        const commissionCNY = revCNY * (r ? (r.commissionFee / (r.suggestedPriceLocal || 1)) : 0.06);
        const transactionCNY = revCNY * (r ? (r.transactionFee / (r.suggestedPriceLocal || 1)) : 0.03);
        totalPlatformFeesCNY += (commissionCNY + transactionCNY);

        // Ad spend (assumed 15% rate of gross revenue if adSpend rate is set, or actual)
        const adSpendCNY = revCNY * (r ? (r.adSpend / (r.suggestedPriceLocal || 1)) : 0.15);
        totalAdSpendCNY += adSpendCNY;

        // Return Loss
        const returnLossCNY = (r ? r.returnLoss : 0) * rateToCNY * qty;
        totalReturnLossCNY += returnLossCNY;

        // Taxes
        const taxCNY = (r ? r.taxes : 0) * rateToCNY * qty;
        totalTaxesCNY += taxCNY;

        // Withdrawal fee
        const withdrawalCNY = r 
          ? (r.withdrawalFee + r.exchangeLossBuffer) * rateToCNY * qty 
          : 0.015 * revCNY;
        totalWithdrawalFeesCNY += withdrawalCNY;
      }
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

  const tikTokReportSummary = useMemo(() => {
    const tkOrders = monthlyOrders.filter(o => o.isTikTokSettlement);
    if (tkOrders.length === 0) return null;

    let totalOriginalSkuSales = 0;
    let totalPlatformDiscounts = 0;
    let totalSellerDiscounts = 0;
    let totalAfterDiscountSales = 0;
    let totalTaxesLocal = 0;
    let totalShippingFeeLocal = 0;
    let totalRefundsLocal = 0;
    let completedCount = 0;
    let cancelledCount = 0;

    tkOrders.forEach(o => {
      const isCancelled = o.status === '已取消' || o.status === 'Cancelled' || (o.refundAmount && o.refundAmount > 0 && o.refundAmount >= (o.orderAmount || 1));
      if (isCancelled) {
        cancelledCount++;
      } else {
        completedCount++;
      }

      totalOriginalSkuSales += (o.subtotalBeforeDiscount || 0);
      totalPlatformDiscounts += (o.platformDiscount || 0);
      totalSellerDiscounts += (o.sellerDiscount || 0);
      totalAfterDiscountSales += (o.subtotalAfterDiscount || 0);
      totalTaxesLocal += (o.taxesLocal || 0);
      totalShippingFeeLocal += (o.shippingFeeLocal || 0);
      totalRefundsLocal += (o.refundAmount || 0);
    });

    return {
      totalOrders: tkOrders.length,
      completedCount,
      cancelledCount,
      totalOriginalSkuSales,
      totalPlatformDiscounts,
      totalSellerDiscounts,
      totalAfterDiscountSales,
      totalTaxesLocal,
      totalShippingFeeLocal,
      totalRefundsLocal,
      estimatedCommissions: totalAfterDiscountSales * 0.08,
      estimatedPaymentFees: totalAfterDiscountSales * 0.02 + completedCount * 0.30,
    };
  }, [monthlyOrders]);

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
  const inboundFeeRMB = input.inboundFeeRMB !== undefined ? input.inboundFeeRMB : 1.5;
  const totalCostRMB = cogsRMB + domesticShipping + internationalShipping + packagingLossRMB + generalExpensesRmb + inboundFeeRMB;

  const defaultUnitLogisticsCNY = selectedResult
    ? (selectedResult.forwardLogistics || 0) * selectedResult.exchangeRateToCNY +
      (selectedResult.fbtFeeLocal || 0) * selectedResult.exchangeRateToCNY +
      (selectedResult.storageFeeLocal || 0) * selectedResult.exchangeRateToCNY +
      (selectedResult.inboundFeeLocal || 0) * selectedResult.exchangeRateToCNY +
      (selectedResult.returnLoss || 0) * selectedResult.exchangeRateToCNY
    : 0;

  const activeSKUCogsRMB = customSKUCogsRMB !== '' ? (parseFloat(customSKUCogsRMB) || 0) : cogsRMB;
  const activeSKULogisticsRMB = customSKULogisticsRMB !== '' ? (parseFloat(customSKULogisticsRMB) || 0) : defaultUnitLogisticsCNY;

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

  const downloadEnterprisePricingReport = () => {
    const ordersNum = parseFloat(historicalMonthlyOrders) || 0;
    const staffVal = parseFloat(staffCostRMB) || 0;
    const rentVal = parseFloat(rentCostRMB) || 0;
    const erpVal = parseFloat(erpCostRMB) || 0;
    const otherVal = parseFloat(otherFixedCostRMB) || 0;
    const totalMonthlyFixedCostRMB = staffVal + rentVal + erpVal + otherVal;
    const fixedCostPerOrderRMB = ordersNum > 0 ? totalMonthlyFixedCostRMB / ordersNum : 0;

    const friendlyCategoryNames: Record<string, string> = {
      fashion: "服装、鞋包及配饰",
      cosmetics: "美妆个护与美发",
      electronics: "手机数码办公",
      electronics_device: "智能数码设备",
      electronics_accessories: "数码电子配件",
      home: "家居厨房生活",
      sports: "运动户外车配",
      toys: "玩具收藏动漫",
      collectibles: "手办文具收藏",
      jewelry: "轻奢高雅珠宝",
      books: "学术印刷书籍",
      grocery: "食品杂货饮料",
    };

    const reportSitesData = results.map(r => {
      const rExchangeRate = r.exchangeRateToCNY;
      
      // original costs for r
      const rOriginalCogsLocal = cogsRMB / rExchangeRate;
      const rUnitForwardLogisticsCNY = (r.forwardLogistics || 0) * rExchangeRate;
      const rUnitFbtFeeCNY = (r.fbtFeeLocal || 0) * rExchangeRate;
      const rUnitStorageFeeCNY = (r.storageFeeLocal || 0) * rExchangeRate;
      const rUnitReturnLossCNY = (r.returnLoss || 0) * rExchangeRate;
      const rOriginalUnitTotalLogisticsCNY = rUnitForwardLogisticsCNY + rUnitFbtFeeCNY + rUnitStorageFeeCNY + rUnitReturnLossCNY;
      const rOriginalLogisticsLocal = rOriginalUnitTotalLogisticsCNY / rExchangeRate;

      // overridden active costs for r
      const rActiveCogsLocal = activeSKUCogsRMB / rExchangeRate;
      const rActiveLogisticsLocal = activeSKULogisticsRMB / rExchangeRate;

      // fixed cost per order in local currency for r
      const rFixedCostPerOrderLocal = fixedCostPerOrderRMB / rExchangeRate;

      // adjusted net profit for r
      const rAdjustedItemNetProfitLocal = r.netProfit + (rOriginalCogsLocal - rActiveCogsLocal) + (rOriginalLogisticsLocal - rActiveLogisticsLocal);
      const rEnterpriseNetProfitLocal = rAdjustedItemNetProfitLocal - rFixedCostPerOrderLocal;
      const rEnterpriseNetMargin = r.suggestedPriceLocal > 0 ? (rEnterpriseNetProfitLocal / r.suggestedPriceLocal) * 100 : 0;

      // convert everything to CNY for standard bar chart comparison
      const rPriceCNY = r.suggestedPriceLocal * rExchangeRate;
      const rPayoutReceivedCNY = (r.suggestedPriceLocal - ((r.commissionFee || 0) + (r.transactionFee || 0) + (r.creatorCommission || 0) + (r.taxes || 0) + (r.fbtFeeLocal || 0) + (r.storageFeeLocal || 0) + (r.withdrawalFee || 0) + (r.exchangeLossBuffer || 0))) * rExchangeRate;
      const rTotalCostCNY = activeSKUCogsRMB + activeSKULogisticsRMB + fixedCostPerOrderRMB;
      const rNetProfitCNY = rEnterpriseNetProfitLocal * rExchangeRate;

      return {
        siteId: r.siteId,
        siteName: r.siteName,
        currency: r.currency,
        symbol: r.symbol,
        exchangeRateToCNY: rExchangeRate,
        suggestedPriceLocal: r.suggestedPriceLocal,
        enterpriseNetProfitLocal: rEnterpriseNetProfitLocal,
        enterpriseNetMargin: rEnterpriseNetMargin,
        originalNetMargin: r.netMargin,
        priceCNY: rPriceCNY,
        payoutReceivedCNY: rPayoutReceivedCNY,
        totalCostCNY: rTotalCostCNY,
        netProfitCNY: rNetProfitCNY,
        fixedCostPerOrderLocal: rFixedCostPerOrderLocal,
        activeCogsLocal: rActiveCogsLocal,
        activeLogisticsLocal: rActiveLogisticsLocal
      };
    });

    const skuLabel = evalSKUName || "当前评估单品";
    const reportDate = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    // Pre-build the HTML table rows and chart data strings to prevent nested template literal parsing bugs
    const tableRowsHtml = reportSitesData.map(r => {
      const is达标 = r.enterpriseNetMargin >= (input.targetProfitMarginRate || 20);
      const flagStr = siteFlagMap[r.siteId] || '🌐';
      const targetMarginRate = input.targetProfitMarginRate || 20;
      const statusBadge = is达标 
        ? `<span class="badge badge-success">✓ 达标 (${targetMarginRate}%)</span>` 
        : `<span class="badge badge-danger">⚠️ 不达标</span>`;
      
      return `<tr>
        <td><strong>${flagStr} ${r.siteName} (${r.siteId})</strong></td>
        <td><span style="font-family: monospace; font-weight: bold;">${r.currency}</span></td>
        <td><span style="font-family: monospace; font-weight: bold;">${r.symbol}${r.suggestedPriceLocal.toFixed(2)}</span></td>
        <td><span style="font-family: monospace; font-weight: bold;">￥${r.priceCNY.toFixed(2)}</span></td>
        <td><span style="font-family: monospace;">￥${activeSKULogisticsRMB.toFixed(2)}</span></td>
        <td><span style="font-family: monospace;">￥${fixedCostPerOrderRMB.toFixed(2)}</span></td>
        <td><span style="font-family: monospace; font-weight: bold; color: #059669;">￥${r.payoutReceivedCNY.toFixed(2)}</span></td>
        <td><span style="font-family: monospace; font-weight: bold;">${r.originalNetMargin.toFixed(1)}%</span></td>
        <td><span style="font-family: monospace; font-weight: 900; color: ${r.enterpriseNetMargin >= 0 ? '#2563eb' : '#dc2626'}">${r.enterpriseNetMargin.toFixed(1)}%</span></td>
        <td>${statusBadge}</td>
      </tr>`;
    }).join('\n');

    const chartLabels = reportSitesData.map(r => `"${r.siteName}"`).join(',');
    const chartPriceCNY = reportSitesData.map(r => r.priceCNY.toFixed(2)).join(',');
    const chartPayoutReceivedCNY = reportSitesData.map(r => r.payoutReceivedCNY.toFixed(2)).join(',');
    const chartTotalCostCNY = reportSitesData.map(r => r.totalCostCNY.toFixed(2)).join(',');
    const chartOriginalNetMargin = reportSitesData.map(r => r.originalNetMargin.toFixed(1)).join(',');
    const chartEnterpriseNetMargin = reportSitesData.map(r => r.enterpriseNetMargin.toFixed(1)).join(',');

    // HTML Content with Chart.js embedded to show bar and line charts
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>PriceSnap 企业全链路多站点利润对比与定价精算报告</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: white;
      padding: 35px 40px;
      border-radius: 24px;
      margin-bottom: 30px;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15);
      position: relative;
    }
    .brand {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.5px;
    }
    .brand span.snap {
      color: #fbbf24;
    }
    .slogan {
      font-size: 15px;
      color: #cbd5e1;
      margin-top: 6px;
      font-weight: 650;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 25px;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 20px;
      font-size: 13px;
      color: #cbd5e1;
    }
    .meta-item strong {
      color: white;
      display: block;
      font-size: 15px;
      margin-top: 2px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .card-title {
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .card-value {
      font-size: 26px;
      font-weight: 900;
      color: #0f172a;
      font-family: Menlo, Monaco, Consolas, monospace;
    }
    .card-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
      font-weight: 500;
    }
    .section-title {
      font-size: 18px;
      font-weight: 800;
      color: #1e293b;
      margin: 35px 0 15px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 18px;
      background-color: #4f46e5;
      border-radius: 2px;
    }
    .chart-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      margin-bottom: 30px;
    }
    @media (max-width: 900px) {
      .chart-grid {
        grid-template-columns: 1fr;
      }
    }
    .chart-box {
      background: white;
      border-radius: 20px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .chart-box-title {
      font-size: 14px;
      font-weight: 800;
      color: #334155;
      margin-bottom: 15px;
      border-b: 1px solid #f1f5f9;
      padding-bottom: 10px;
    }
    .table-container {
      background: white;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      overflow-x: auto;
      margin-bottom: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    th {
      background-color: #f8fafc;
      color: #475569;
      font-weight: 800;
      padding: 15px 20px;
      border-bottom: 2px solid #e2e8f0;
    }
    td {
      padding: 15px 20px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-success {
      background-color: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }
    .badge-danger {
      background-color: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }
    .footer {
      text-align: center;
      margin-top: 60px;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 25px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">Price<span class="snap">Snap</span></div>
      <div class="slogan">算的是利润，赢的是未来。所有成本皆是铺垫，一身孤勇祝我们逆风翻盘。</div>
      <div class="meta-grid">
        <div class="meta-item">评估商品 / SKU:<strong>${skuLabel}</strong></div>
        <div class="meta-item">月总规划订单量:<strong>${ordersNum.toLocaleString()} 单/月</strong></div>
        <div class="meta-item">品类归属:<strong>${friendlyCategoryNames[input.category] || "普通大类"}</strong></div>
        <div class="meta-item">报告导出时间 (北京时间):<strong>${reportDate}</strong></div>
      </div>
    </div>

    <div class="section-title">企业级运营财务大盘 (CNY)</div>
    <div class="grid">
      <div class="card">
        <div class="card-title">月度企业固定支出 (总和)</div>
        <div class="card-value">￥${totalMonthlyFixedCostRMB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="card-sub">包含员工薪资、场地租金、系统工具等固定开销</div>
      </div>
      <div class="card">
        <div class="card-title">单均固定摊销成本 (每单)</div>
        <div class="card-value" style="color: #4f46e5;">￥${fixedCostPerOrderRMB.toFixed(2)}</div>
        <div class="card-sub">基于规划出单量均摊到每件商品上的固定运营成本</div>
      </div>
      <div class="card">
        <div class="card-title">评估 SKU 单件采购成本</div>
        <div class="card-value" style="color: #d97706;">￥${activeSKUCogsRMB.toFixed(2)}</div>
        <div class="card-sub">核算商品的出厂纯采购价 (CNY)</div>
      </div>
      <div class="card">
        <div class="card-title">评估 SKU 综合物流成本 (CNY)</div>
        <div class="card-value" style="color: #0891b2;">￥${activeSKULogisticsRMB.toFixed(2)}</div>
        <div class="card-sub">含国内打包、干线和目的国 FBA/FBM 配送费公摊</div>
      </div>
    </div>

    <div class="section-title">4大核心站点对比数据可视化</div>
    <div class="chart-grid">
      <div class="chart-box">
        <div class="chart-box-title">各站点核心财务金额指标对比 (折合人民币 CNY / 单件)</div>
        <div style="position: relative; height:320px; width:100%">
          <canvas id="barChart"></canvas>
        </div>
      </div>
      <div class="chart-box">
        <div class="chart-box-title">各站点企业最终实际纯利率 vs 公摊前单品净利率 (%)</div>
        <div style="position: relative; height:320px; width:100%">
          <canvas id="lineChart"></canvas>
        </div>
      </div>
    </div>

    <div class="section-title">4大站点精算指标明细对比表</div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>目标站点</th>
            <th>结算币种</th>
            <th>零售定价 (外币)</th>
            <th>折合零售价 (CNY)</th>
            <th>干线+派送物流费</th>
            <th>单单摊销固收 (CNY)</th>
            <th>结汇到账净额 (CNY)</th>
            <th>公摊前净利率</th>
            <th>企业最终实际纯利率</th>
            <th>利润达标状态</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>© PriceSnap 跨境多站点精算对账工具 | 算的是利润，赢的是未来</p>
    </div>
  </div>

  <script>
    // 1. Data Preparation
    const labels = [${chartLabels}];
    const priceCNY = [${chartPriceCNY}];
    const payoutReceivedCNY = [${chartPayoutReceivedCNY}];
    const totalCostCNY = [${chartTotalCostCNY}];
    
    const originalNetMargin = [${chartOriginalNetMargin}];
    const enterpriseNetMargin = [${chartEnterpriseNetMargin}];

    // 2. Render Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '商品定价 (RMB)',
            data: priceCNY,
            backgroundColor: '#818cf8',
            borderColor: '#4f46e5',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: '银行到账金额 (RMB)',
            data: payoutReceivedCNY,
            backgroundColor: '#34d399',
            borderColor: '#059669',
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: '单均总成本 (RMB)',
            data: totalCostCNY,
            backgroundColor: '#fca5a5',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { font: { weight: 'bold', size: 11 } } }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' }, title: { display: true, text: '折合人民币 (元)', font: { weight: 'bold' } } },
          x: { grid: { display: false } }
        }
      }
    });

    // 3. Render Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '企业真实纯利率 (%)',
            data: enterpriseNetMargin,
            borderColor: '#2563eb',
            backgroundColor: '#eff6ff',
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: '#2563eb',
            tension: 0.2,
            fill: false
          },
          {
            label: '公摊前单品利润率 (%)',
            data: originalNetMargin,
            borderColor: '#94a3b8',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 4,
            pointBackgroundColor: '#94a3b8',
            tension: 0.2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { font: { weight: 'bold', size: 11 } } }
        },
        scales: {
          y: { grid: { color: '#f1f5f9' }, title: { display: true, text: '利润率 (%)', font: { weight: 'bold' } } },
          x: { grid: { display: false } }
        }
      }
    });
  </script>
</body>
</html>`;

    // Trigger download
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `PriceSnap_企业全链路多站点定价精算对比报告_${skuLabel}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      
      {/* Mobile-only Segmented Control for Single Product精算 to toggle between parameters and results */}
      <div className="lg:hidden flex bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/40 shadow-inner">
        <button
          onClick={() => setMobileSubTab('inputs')}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            mobileSubTab === 'inputs'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>调整配置参数</span>
        </button>
        <button
          onClick={() => setMobileSubTab('results')}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            mobileSubTab === 'results'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>查看实时看盘</span>
        </button>
      </div>
      
      {/* Three Column Grid Layout - Organized with operations left-side vertical stack & results right-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Parameters Operations & Insights vertical stack (col-span-7) */}
        <div className={`lg:col-span-7 flex flex-col space-y-8 ${mobileSubTab === 'inputs' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* COLUMN 1: 平台与销售大区选择 */}
            <div className="bg-white border-slate-200/80 text-slate-800 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 space-y-6 flex flex-col justify-start border">
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
                          onClick={() => onChangeInput('siteId', site.id)}
                          className={`flex items-center space-x-2.5 p-2 rounded-xl border text-left transition-all duration-300 group ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/20 shadow-sm scale-[1.02]'
                              : 'border-slate-150 bg-slate-50/50 hover:bg-white hover:border-slate-350 hover:shadow-xs'
                          }`}
                        >
                          <VectorFlag id={site.id} className="h-4.5 w-7 shrink-0 rounded-xs border border-slate-200 shadow-2xs group-hover:scale-110 transition-transform duration-300" />
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
                      {`${(selectedResult.thirdPartyPayoutFeeRate || 0.6).toFixed(1)}%`}
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
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-600 uppercase tracking-wider pl-1">实时汇率同步</span>
                    <span className="text-[10px] text-slate-400 font-bold pl-1 font-sans">
                      数据每日自动获取与更新
                    </span>
                  </div>
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

            {/* COLUMN 2: 核心跨境参数与自设成本配置 */}
            <div className="bg-white border-slate-200/80 text-slate-800 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 space-y-4 border flex flex-col justify-start">
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
                {platformId === 'amazon' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-750 pl-0.5">
                      亚马逊运营模式 (Business Mode)
                    </label>
                    <select
                      value={input.amazonBusinessMode || 'FBA'}
                      onChange={(e) => onChangeInput('amazonBusinessMode', e.target.value)}
                      className="w-full px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer transition-all"
                    >
                      <option value="FBA">FBA (亚马逊配送 - 智能计费)</option>
                      <option value="FBM">FBM (卖家自配送 - 卖家履约)</option>
                      <option value="SFP">SFP (卖家自配送创始会员制)</option>
                      <option value="AWD">AWD (入仓分销服务 - 拼箱/仓储)</option>
                    </select>
                  </div>
                )}

                {platformId === 'walmart' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-750 pl-0.5">
                      沃尔玛运营模式 (Business Mode)
                    </label>
                    <select
                      value={input.walmartBusinessMode || 'WFS'}
                      onChange={(e) => onChangeInput('walmartBusinessMode', e.target.value)}
                      className="w-full px-4 py-3 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer transition-all"
                    >
                      <option value="WFS">WFS (沃尔玛配送服务 - 智能计费)</option>
                      <option value="MF">MF (卖家自配送履约)</option>
                      <option value="DROP_SHIP">DROP_SHIP (直邮精细托管)</option>
                      <option value="RETAIL_LINK">RETAIL_LINK (零售商直配合作)</option>
                    </select>
                  </div>
                )}

                {platformId !== 'amazon' && platformId !== 'walmart' && (
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
                )}

                {/* Weight and Dimensions for Amazon/Walmart */}
                {(platformId === 'amazon' || platformId === 'walmart') && (
                  <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">📦 产品重量与包装尺寸</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-650">重量 (Lbs 磅)</label>
                        <input
                          type="number"
                          min="0.01"
                          step="0.05"
                          value={input.productWeightLbs !== undefined ? input.productWeightLbs : 0.5}
                          onChange={(e) => onChangeInput('productWeightLbs', Math.max(0.01, parseFloat(e.target.value) || 0.5))}
                          className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-extrabold text-slate-850 text-xs transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-650">长度 (Inches 英寸)</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={input.dimensionLengthInches !== undefined ? input.dimensionLengthInches : 10}
                          onChange={(e) => onChangeInput('dimensionLengthInches', Math.max(0.1, parseFloat(e.target.value) || 10))}
                          className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-extrabold text-slate-850 text-xs transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-650">宽度 (Inches 英寸)</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={input.dimensionWidthInches !== undefined ? input.dimensionWidthInches : 8}
                          onChange={(e) => onChangeInput('dimensionWidthInches', Math.max(0.1, parseFloat(e.target.value) || 8))}
                          className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-extrabold text-slate-850 text-xs transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-650">高度 (Inches 英寸)</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={input.dimensionHeightInches !== undefined ? input.dimensionHeightInches : 1}
                          onChange={(e) => onChangeInput('dimensionHeightInches', Math.max(0.1, parseFloat(e.target.value) || 1))}
                          className="w-full px-3 py-2 bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-extrabold text-slate-850 text-xs transition-all"
                        />
                      </div>
                    </div>

                    {/* FBM/MF Shipping from China Checkbox */}
                    {((platformId === 'amazon' && ['FBM', 'SFP'].includes(input.amazonBusinessMode || 'FBA')) ||
                      (platformId === 'walmart' && ['MF', 'DROP_SHIP'].includes(input.walmartBusinessMode || 'WFS'))) && (
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="checkbox"
                          id="fbmShippingFromChina"
                          checked={input.fbmShippingFromChina || false}
                          onChange={(e) => onChangeInput('fbmShippingFromChina', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="fbmShippingFromChina" className="text-xs font-bold text-slate-700 cursor-pointer">
                          中国直发物流 (中国自发货到目的国尾程)
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* A. Factory Cost with Currency Selector Toggle */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-transparent">
                    <label className="block text-sm font-bold text-slate-700 pl-0.5">
                      产品采购出厂价
                    </label>
                    <div translate="no" className="notranslate flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => onChangeInput('cogsCurrency', 'CNY')}
                        className={`px-2 py-1 rounded-md transition-all ${cogsCurrency === 'CNY' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-750'}`}
                      >
                        CNY
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeInput('cogsCurrency', 'USD')}
                        className={`px-2 py-1 rounded-md transition-all ${cogsCurrency === 'USD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-750'}`}
                      >
                        USD
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <span translate="no" className="notranslate absolute left-3.5 top-3.5 text-sm font-mono font-bold text-slate-400 select-none">
                      {cogsCurrency === 'CNY' ? '￥' : '$'}
                    </span>
                    <input
                      translate="no"
                      type="number"
                      min="0"
                      step="0.1"
                      value={input.cogs}
                      onChange={(e) => onChangeInput('cogs', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="notranslate w-full pl-8 pr-4 py-3 text-sm bg-slate-50 border border-slate-250 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                    />
                  </div>
                </div>

                {/* A. Domestic & International First-Leg Shipping is always shown to let users customize the First-Leg Logistics costs! */}
                <div className="space-y-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">首公里与头程物流运费 (First-Leg & Inbound)</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* B. Domestic Shipping */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 pl-0.5">
                        国内打包/首公里运输 (￥ CNY)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={domesticShipping}
                        onChange={(e) => onChangeInput('domesticShippingRMB', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                      />
                    </div>

                    {/* C. International Shipping */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 pl-0.5">
                        跨境专线/头程干线运费 (￥ CNY)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={internationalShipping}
                        onChange={(e) => onChangeInput('internationalShippingRMB', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                      />
                    </div>
                  </div>

                  {/* D. Warehousing Inbound Fee */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 pl-0.5 flex justify-between">
                      <span>FBA/WFS/FBT入仓预处理费 (￥ CNY)</span>
                      <span className="text-slate-400 font-normal">默认 ￥1.50 CNY</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={inboundFeeRMB}
                      onChange={(e) => onChangeInput('inboundFeeRMB', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-4 py-2.5 text-xs bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                    />
                  </div>

                  {/* E. Conditional Platform Specific Automated Fees */}
                  {(platformId === 'amazon' || platformId === 'walmart') ? (
                    <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
                      <span className="text-[11px] font-black text-indigo-700 flex items-center gap-1">
                        FBA/WFS 智能配送与仓储费已匹配
                      </span>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 font-bold">自动快递配送费 (Delivery):</span>
                        <strong className="text-indigo-600 font-mono font-extrabold">
                          {selectedResult.fbtFeeLocal !== undefined 
                            ? `${selectedResult.symbol}${selectedResult.fbtFeeLocal.toFixed(2)} ${selectedResult.currency}` 
                            : '计算中...'}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 font-bold">智能月度仓储费 (Storage):</span>
                        <strong className="text-indigo-600 font-mono font-extrabold">
                          {selectedResult.storageFeeLocal !== undefined 
                            ? `${selectedResult.symbol}${selectedResult.storageFeeLocal.toFixed(2)} ${selectedResult.currency}` 
                            : '计算中...'}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    (!input.businessMode || input.businessMode === 'virtual') ? null : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {/* 本土尾程派送费 */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 pl-0.5">
                            本土尾程派送费 ({selectedResult.symbol} {selectedResult.currency})
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={input.fbtFeeLocal !== undefined ? input.fbtFeeLocal : 2.50}
                            onChange={(e) => onChangeInput('fbtFeeLocal', Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full px-4 py-2.5 text-xs bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                          />
                        </div>

                        {/* 仓储费 */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 pl-0.5">
                            月度仓储费 ({selectedResult.symbol} {selectedResult.currency})
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.05"
                            value={input.storageFeeLocal !== undefined ? input.storageFeeLocal : 0.30}
                            onChange={(e) => onChangeInput('storageFeeLocal', Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full px-4 py-2.5 text-xs bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-mono font-extrabold transition-all"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

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
                  {(mode === 'reverse' || (input.platformId === 'tiktok' || input.platformId === 'shopify')) ? (
                    <>
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
                    </>
                  ) : (
                    <div className="col-span-2 space-y-1.5">
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
                  )}
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

        </div>

        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* COLUMN 3: 实时结果看板 (col-span-5) */}
        {/* ======================================================== */}
        <div className={`lg:col-span-5 h-fit rounded-2xl p-7 shadow-xl flex flex-col justify-start space-y-5 border transition-all duration-350 ${resultsTheme.containerBg} ${mobileSubTab === 'results' ? 'flex' : 'hidden lg:flex'}`}>
          
          <div className="space-y-4">
            {/* Big Headline Price block */}
            <div className={`p-6 rounded-xl space-y-2.5 relative overflow-hidden border ${resultsTheme.boxBg}`}>
              <div className="flex justify-between items-center">
                <span className={`block text-xs font-bold uppercase tracking-wider ${resultsTheme.textMuted}`}>
                  {mode === 'reverse' ? '逆向推演: 建议合理售价' : '设定牌面零售价'}
                </span>
                <span className="font-mono text-emerald-400 text-xs bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  {selectedResult.siteName} (国别: {selectedResult.siteId})
                </span>
              </div>
              
              <div className="flex items-baseline space-x-1.5 flex-wrap">
                {displayInCNY ? (
                  <>
                    <span className={`text-2xl font-bold font-mono ${resultsTheme.accentText}`}>￥</span>
                    <span className={`text-5xl md:text-6xl font-black font-mono tracking-tight ${resultsTheme.priceColor}`}>
                      {selectedResult.cogsConverted === 0 ? '0.00' : ((mode === 'reverse' ? selectedResult.suggestedPriceLocal : input.priceLocal) * selectedResult.exchangeRateToCNY).toFixed(2)}
                    </span>
                    <span className={`text-sm font-bold font-mono ml-2 ${resultsTheme.textMuted}`}>CNY</span>
                  </>
                ) : (
                  <>
                    <span className={`text-2xl font-bold font-mono ${resultsTheme.accentText}`}>{selectedResult.symbol}</span>
                    <span className={`text-5xl md:text-6xl font-black font-mono tracking-tight ${resultsTheme.priceColor}`}>
                      {selectedResult.cogsConverted === 0 ? '0.00' : (mode === 'reverse' ? selectedResult.suggestedPriceLocal : input.priceLocal).toFixed(2)}
                    </span>
                    <span className={`text-sm font-bold font-mono ml-2 ${resultsTheme.textMuted}`}>{selectedResult.currency}</span>
                  </>
                )}
              </div>
              
              <p className={`text-xs font-bold pt-1.5 border-t ${resultsTheme.divider}`}>
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
              <div className={`p-4 rounded-xl border space-y-1.5 ${resultsTheme.boxBg}`}>
                <span className={`block text-xs font-bold ${resultsTheme.textMuted}`}>预计单笔净利润</span>
                {displayInCNY ? (
                  <>
                    <span className={`block text-2xl font-black font-mono tracking-tight ${selectedResult.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      ￥{(selectedResult.netProfit * selectedResult.exchangeRateToCNY).toFixed(2)}
                    </span>
                    <span className={`block text-xs font-mono ${resultsTheme.textMuted}`}>
                      原币: {selectedResult.symbol}{selectedResult.netProfit.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={`block text-2xl font-black font-mono tracking-tight ${selectedResult.netProfit >= 0 ? (resultsTheme.isLight ? 'text-indigo-650 font-black' : 'text-indigo-400') : 'text-rose-500'}`}>
                      {selectedResult.symbol}{selectedResult.netProfit.toFixed(2)}
                    </span>
                    <span className={`block text-xs font-mono ${resultsTheme.textMuted}`}>
                      折合: ￥{(selectedResult.netProfit * selectedResult.exchangeRateToCNY).toFixed(2)} CNY
                    </span>
                  </>
                )}
              </div>

              {/* Net margin and gross margin */}
              <div className={`p-4 rounded-xl border space-y-1.5 ${resultsTheme.boxBg}`}>
                <span className={`block text-xs font-bold ${resultsTheme.textMuted}`}>实得净利润比例</span>
                <span className={`block text-2xl font-black font-mono tracking-tight ${selectedResult.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {selectedResult.netMargin.toFixed(1)}%
                </span>
                <span className={`block text-xs border-t mt-1 pt-1 font-semibold text-right ${resultsTheme.textMuted} ${resultsTheme.divider}`}>
                  毛利率: <span className={`font-bold font-mono ${resultsTheme.accentText}`}>{selectedResult.grossMargin.toFixed(1)}%</span>
                </span>
              </div>

            </div>

            {/* Collapsible cost details list ("成本明细展开" collapsible list button) */}
            <div className={`rounded-xl border overflow-hidden ${resultsTheme.boxBg}`}>
              <button
                type="button"
                onClick={() => setShowCostBreakdown(!showCostBreakdown)}
                className={`w-full px-4 py-2.5 border-b transition flex items-center justify-between text-xs font-bold ${resultsTheme.collapsibleBtn} ${resultsTheme.border}`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${resultsTheme.isLight ? 'bg-emerald-500' : 'bg-indigo-400'} animate-pulse`} />
                  <span>分项核算财务成本明细清单</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`text-xs font-mono ${resultsTheme.textMuted}`}>{showCostBreakdown ? '折叠' : '点击展开'}</span>
                  {showCostBreakdown ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </div>
              </button>
              
              {showCostBreakdown && (
                <div className={`p-3.5 space-y-2 text-xs font-mono border-t transition-all ${resultsTheme.divider}`}>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>1. 货源出厂首采购价</span>
                    <span className={resultsTheme.textPrimary}>
                      ￥{cogsRMB.toFixed(2)} CNY / {selectedResult.symbol}{selectedResult.cogsConverted.toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>2. 国内打包加箱物流</span>
                    <span className={resultsTheme.textPrimary}>
                      ￥{domesticShipping.toFixed(2)} CNY / {selectedResult.symbol}{(domesticShipping * (selectedResult.cogsConverted / (cogsRMB || 1))).toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>3. 跨国专线干线物流</span>
                    <span className={resultsTheme.textPrimary}>
                      ￥{internationalShipping.toFixed(2)} CNY / {selectedResult.symbol}{(internationalShipping * (selectedResult.cogsConverted / (cogsRMB || 1))).toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>4. 包装贴标与库损费用</span>
                    <span className={resultsTheme.textPrimary}>
                      ￥{packagingLossRMB.toFixed(2)} CNY / {selectedResult.symbol}{(packagingLossRMB * (selectedResult.cogsConverted / (cogsRMB || 1))).toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>5. 平台佣金扣点占比</span>
                    <span className={resultsTheme.textPrimary}>
                      {selectedResult.symbol}{selectedResult.commissionFee.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>6. 支付流结算与手续费</span>
                    <span className={resultsTheme.textPrimary}>
                      {selectedResult.symbol}{selectedResult.transactionFee.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>7. 自选营销流量投放费用</span>
                    <span className={resultsTheme.textPrimary}>
                      {selectedResult.symbol}{selectedResult.adSpend.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>8. 逆反退货折旧及损耗</span>
                    <span className={`${resultsTheme.textPrimary} font-bold transition-all`}>
                      {selectedResult.symbol}{selectedResult.returnLoss.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>9. 本地销售增值消费税款</span>
                    <span className={resultsTheme.textPrimary}>
                      {selectedResult.symbol}{selectedResult.taxes.toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>10. 境外提现手续费及汇损</span>
                    <span className={resultsTheme.textPrimary}>
                      {selectedResult.symbol}{(selectedResult.withdrawalFee + selectedResult.exchangeLossBuffer).toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>11. FBA/WFS/FBT入仓预处理</span>
                    <span className={resultsTheme.textPrimary}>
                      ￥{inboundFeeRMB.toFixed(2)} CNY / {selectedResult.symbol}{(selectedResult.inboundFeeLocal || 0).toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className={`flex justify-between border-b pb-1 ${resultsTheme.divider}`}>
                    <span className={`${resultsTheme.textMuted} font-sans`}>12. FBA/WFS/FBT快递配送费</span>
                    <span className={`font-bold ${resultsTheme.accentText}`}>
                      {selectedResult.symbol}{(selectedResult.fbtFeeLocal || 0).toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${resultsTheme.textMuted} font-sans`}>13. FBA/WFS/FBT月度仓储费</span>
                    <span className={resultsTheme.textPrimary}>
                      {selectedResult.symbol}{(selectedResult.storageFeeLocal || 0).toFixed(2)} {selectedResult.currency}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 📈 日/周/月单量与利润精算 */}
            <div className={`rounded-3xl p-5 space-y-4 border shadow-lg ${resultsTheme.boxBg}`}>
              <div className={`flex items-center justify-between border-b pb-3 ${resultsTheme.divider}`}>
                <span className={`font-bold text-xs tracking-wider flex items-center gap-1.5 uppercase font-mono ${resultsTheme.accentText}`}>
                  订单与利润周期评估 ({selectedResult.siteId})
                </span>
                <div className={`flex p-0.5 rounded-lg text-xs ${resultsTheme.boxInnerBg}`}>
                  {(['day', 'week', 'month'] as const).map((frame) => (
                    <button
                      key={frame}
                      onClick={() => {
                        setTimeFrame(frame);
                        setSalesOrders(frame === 'day' ? 10 : frame === 'week' ? 70 : 300);
                      }}
                      className={`px-2 py-0.5 rounded transition-all font-bold text-xs ${
                        timeFrame === frame ? resultsTheme.accentBtn : `${resultsTheme.textMuted} hover:${resultsTheme.textPrimary}`
                      }`}
                    >
                      {frame === 'day' ? '日' : frame === 'week' ? '周' : '月'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <label className={`block font-bold text-xs ${resultsTheme.textMuted}`}>周期内单量</label>
                  <input
                    type="number"
                    min="1"
                    value={salesOrders}
                    onChange={(e) => setSalesOrders(Math.max(1, parseInt(e.target.value) || 0))}
                    className={`w-full border rounded-xl px-3 py-1.5 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#FE2C55]/20 text-sm ${resultsTheme.boxInnerBg}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`block font-bold text-xs ${resultsTheme.textMuted}`}>退货数量 <span className="font-normal">(自定义)</span></label>
                  <input
                    type="number"
                    min="0"
                    placeholder={Math.round(salesOrders * (input.returnRate / 100)).toString()}
                    value={userCustomReturnCount}
                    onChange={(e) => setUserCustomReturnCount(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-1.5 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#FE2C55]/20 text-sm ${resultsTheme.boxInnerBg}`}
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
                  <div className={`p-4 rounded-2xl space-y-3 shadow-inner border ${resultsTheme.boxInnerBg}`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className={`block text-xs font-bold uppercase tracking-wider ${resultsTheme.textMuted}`}>预估总营收</span>
                        <div className={`text-sm font-extrabold font-mono ${resultsTheme.textPrimary}`}>
                          {selectedResult.symbol}{totalRevenueLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <span className={`text-xs font-mono ${resultsTheme.textMuted}`}>
                          ≈ ￥{(totalRevenueLocal * selectedResult.exchangeRateToCNY).toLocaleString(undefined, { maximumFractionDigits: 0 })} CNY
                        </span>
                      </div>

                      <div>
                        <span className={`block text-xs font-bold uppercase tracking-wider ${resultsTheme.accentText}`}>预估期内净利润</span>
                        <div className={`text-sm font-black font-mono ${adjustedNetProfitLocal >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {adjustedNetProfitLocal >= 0 ? '+' : ''}{selectedResult.symbol}{adjustedNetProfitLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <span className={`text-xs font-mono ${resultsTheme.textMuted}`}>
                          ≈ ￥{(adjustedNetProfitLocal * selectedResult.exchangeRateToCNY).toLocaleString(undefined, { maximumFractionDigits: 0 })} CNY
                        </span>
                      </div>
                    </div>

                    <div className={`h-px ${resultsTheme.divider}`} />

                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-medium ${resultsTheme.textMuted}`}>期内综合净利率：</span>
                      <span className={`font-mono font-black ${adjustedNetMargin >= 20 ? 'text-emerald-500' : adjustedNetMargin >= 10 ? 'text-yellow-500' : 'text-rose-500'}`}>
                        {adjustedNetMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Recharts Pie Chart representation inside column 3 */}
          <div className={`space-y-4 px-1 border-t pt-5 ${resultsTheme.divider}`}>
            <span className={`block text-xs font-black tracking-widest uppercase font-mono ${resultsTheme.textMuted}`}>成本与费用占比构成估算 ({selectedResult.siteId})</span>
            <div className={`flex flex-col md:flex-row items-center gap-8 justify-center p-6 rounded-2xl border shadow-inner ${resultsTheme.boxBg}`}>
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
                      isAnimationActive={false}
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <span className={`block text-[10px] font-bold uppercase tracking-wider ${resultsTheme.textMuted}`}>加权毛利率</span>
                  <span className={`block text-2xl font-black font-mono ${resultsTheme.isLight ? 'text-stone-900' : 'text-indigo-300'}`}>{selectedResult.grossMargin.toFixed(1)}%</span>
                </div>
              </div>

              {/* Enhanced detailed legends */}
              <div className={`flex-1 space-y-2 text-xs font-mono w-full ${resultsTheme.isLight ? 'text-stone-700' : 'text-slate-300'}`}>
                {breakdownData.map((entry) => {
                  let val = entry.value;
                  let dispSymbol = selectedResult.symbol;
                  if (displayInCNY) {
                    val = val * selectedResult.exchangeRateToCNY;
                    dispSymbol = '￥';
                  }
                  return (
                    <div key={entry.name} className={`flex items-center justify-between font-bold border-b pb-1.5 last:border-0 last:pb-0 ${resultsTheme.divider}`}>
                      <span className="flex items-center gap-2 truncate">
                        <span className="w-2 rounded-full h-2 flex-shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className={`truncate font-sans text-xs ${resultsTheme.textMuted}`}>{entry.name}</span>
                      </span>
                      <span className={`font-mono text-xs font-bold text-right ${resultsTheme.textPrimary}`}>{dispSymbol}{val.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Quick Strategic Insights Bar (Full Width standalone row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-100/40 border border-slate-200/50 p-4 rounded-2xl shadow-2xs my-6">
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

            {/* Mobile-only Segmented Control for Batch evaluation to toggle between upload and report */}
            <div className="lg:hidden flex bg-slate-200/80 p-1 rounded-xl border border-slate-300/40 shadow-inner mb-4">
              <button
                onClick={() => setBatchMobileSubTab('inputs')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  batchMobileSubTab === 'inputs'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span>导入与数据编辑</span>
              </button>
              <button
                onClick={() => setBatchMobileSubTab('results')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  batchMobileSubTab === 'results'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <BarChart3 className="h-3 w-3" />
                <span>查看批量核算表</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Batch Entry & Drag Upload Box */}
              <div className={`lg:col-span-5 space-y-4 ${batchMobileSubTab === 'inputs' ? 'block' : 'hidden lg:block'}`}>
                
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
              <div className={`lg:col-span-7 space-y-3 ${batchMobileSubTab === 'results' ? 'block' : 'hidden lg:block'}`}>
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
                    
                    const revenueCNY = order.salesRevenueLocal * (r ? r.exchangeRateToCNY : 1.0);
                    
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
                <div className="space-y-4">
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-4 border border-slate-800 shadow-lg">
                  <div className="border-b border-slate-800 pb-2.5 flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                    <span className="text-sm font-black text-indigo-400 uppercase tracking-widest font-mono">月度经营财务账单 (RMB/￥对账)</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleExportVisualReport}
                        className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-[11px] font-black transition duration-150 flex items-center gap-1 shadow-sm"
                      >
                        📊 导出曲线对比图表 (HTML)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const headers = "项目,金额(CNY),备注\n";
                          const rows = [
                            ["总处理成交单量", `${monthlyReconciliationData.totalOrdersCount} 笔`, ""],
                            ["平台后台总成交额", `￥${monthlyReconciliationData.totalRevenueCNY.toFixed(2)}`, ""],
                            ["1. 商品总采购花费", `￥${monthlyReconciliationData.totalCogsCNY.toFixed(2)}`, "含各款已归并出厂成本"],
                            ["2. 头程国内外打包物流", `￥${monthlyReconciliationData.totalShippingCNY.toFixed(2)}`, "含国内派送与国际干线费用"],
                            ["3. 平台佣金与交易费", `￥${monthlyReconciliationData.totalPlatformFeesCNY.toFixed(2)}`, "平台扣点与手续费"],
                            ["4. 流量广告及营销花费", `￥${monthlyReconciliationData.totalAdSpendCNY.toFixed(2)}`, "月度推广投流费用"],
                            ["5. 境外退货/税款/提现公摊", `￥${(monthlyReconciliationData.totalReturnLossCNY + monthlyReconciliationData.totalTaxesCNY + monthlyReconciliationData.totalWithdrawalFeesCNY).toFixed(2)}`, "含损耗、VAT税与收款手续费"],
                            ["期内实收净利润", `￥${monthlyReconciliationData.netProfitCNY.toFixed(2)}`, `综合实收净利率: ${monthlyReconciliationData.netMarginPercentage.toFixed(1)}%`]
                          ].map(r => r.join(",")).join("\n");

                          const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + rows], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.setAttribute("href", url);
                          link.setAttribute("download", `PriceSnap_月度对账财务汇总账单_${monthlyReconciliationData.totalOrdersCount}单.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition duration-150 flex items-center gap-1 shadow-sm"
                      >
                        <Download className="h-3 w-3" /> 导出汇总对账 (CSV)
                      </button>
                    </div>
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

                {tikTokReportSummary && (
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-indigo-950 shadow-lg space-y-4">
                    <div className="border-b border-indigo-900/60 pb-2.5 flex items-center justify-between">
                      <span className="text-sm font-black text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        🎵 TikTok Shop 完结账单专项扣减分析
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                        智能归并已完成
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">完结已扣款</div>
                        <div className="text-sm font-black text-slate-100 font-mono mt-0.5">{tikTokReportSummary.completedCount} 笔订单</div>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">退货/已取消</div>
                        <div className="text-sm font-black text-rose-400 font-mono mt-0.5">{tikTokReportSummary.cancelledCount} 笔订单</div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between border-b border-slate-800/45 pb-1">
                        <span className="text-slate-400">1. 原始折前 SKU 总额</span>
                        <span className="font-mono font-bold text-slate-300">
                          ￥{tikTokReportSummary.totalOriginalSkuSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/45 pb-1">
                        <span className="text-slate-400">2. 减：商家自付优惠补贴</span>
                        <span className="font-mono font-bold text-rose-500">
                          - ￥{tikTokReportSummary.totalSellerDiscounts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/45 pb-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <span>3. 加：平台买单折扣补贴</span>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1 py-0.2 rounded font-bold">TK官方包办</span>
                        </span>
                        <span className="font-mono font-bold text-emerald-400">
                          + ￥{tikTokReportSummary.totalPlatformDiscounts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/45 pb-1">
                        <span className="text-slate-300 font-bold">折后平台应结金额 (以CNY折算)</span>
                        <span className="font-mono font-extrabold text-indigo-400">
                          ￥{tikTokReportSummary.totalAfterDiscountSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/45 pb-1">
                        <span className="text-slate-400">4. 减：代扣代缴税费 (Taxes)</span>
                        <span className="font-mono font-bold text-rose-500">
                          - ￥{tikTokReportSummary.totalTaxesLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/45 pb-1">
                        <span className="text-slate-400">5. 减：折后代扣物流运费 (Shipping)</span>
                        <span className="font-mono font-bold text-rose-500">
                          - ￥{tikTokReportSummary.totalShippingFeeLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/45 pb-1">
                        <span className="text-slate-400">6. 减：预估平台基础佣金 (Commission)</span>
                        <span className="font-mono font-bold text-rose-500">
                          - ￥{tikTokReportSummary.estimatedCommissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-slate-800/45 pb-1">
                        <span className="text-slate-400">7. 减：代扣交易手续费 (Processing)</span>
                        <span className="font-mono font-bold text-rose-500">
                          - ￥{tikTokReportSummary.estimatedPaymentFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/60 space-y-1 mt-2.5 shadow-inner">
                        <div className="flex justify-between items-baseline">
                          <span className="text-emerald-400 font-extrabold text-xs uppercase">预估最终应结应收款额 (到账款)</span>
                          <div className="text-base font-black font-mono text-emerald-400">
                            ￥{(
                              tikTokReportSummary.totalAfterDiscountSales -
                              tikTokReportSummary.totalTaxesLocal -
                              tikTokReportSummary.totalShippingFeeLocal -
                              tikTokReportSummary.estimatedCommissions -
                              tikTokReportSummary.estimatedPaymentFees
                            ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                          * 说明：上述扣费明细从完结订单模版中智能解析代扣税费与买单折扣，数据已与多站点汇率进行同步换算。
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        </div>

      </div>

      {/* Global 4-Country Profit Comparison Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Card A: 4国 TikTok Shop 大盘利润树占比与利润率对比 (%) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5.5 w-5.5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">多站点利润占比与利润率对比 (%)</h2>
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
                <Bar name="毛利率 %" dataKey="毛利率 (%)" fill="#4F46E5" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {marginChartData.map((entry, index) => (
                    <Cell key={`cell-gross-${index}`} fill={entry['毛利率 (%)'] >= 45 ? '#4F46E5' : '#818CF8'} />
                  ))}
                </Bar>
                <Bar name="净利率 %" dataKey="净利率 (%)" fill="#10B981" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {marginChartData.map((entry, index) => (
                    <Cell key={`cell-net-${index}`} fill={entry['净利率 (%)'] > 0 ? '#10B981' : '#F43F5E'} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card B: 多站点单笔预计净利润绝对值对比 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2.5">
              <Coins className="h-5.5 w-5.5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">多站点预计净利润绝对值对比 ({displayInCNY ? 'RMB/￥' : '美元/USD'})</h2>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
              同台币种汇率换算比对
            </span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={results.map(r => {
                  const netProfitUnified = displayInCNY ? r.netProfit * r.exchangeRateToCNY : r.netProfit * r.exchangeRateToUSD;
                  return {
                    name: `${siteFlagMap[r.siteId] || ''} ${r.siteName}`,
                    '预计净利润': parseFloat(netProfitUnified.toFixed(2)),
                    symbol: displayInCNY ? '￥' : '$',
                    currency: displayInCNY ? 'CNY' : 'USD',
                  };
                })}
                margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#4A5568' }} />
                <YAxis tickFormatter={(val) => `${displayInCNY ? '￥' : '$'}${val}`} tick={{ fontSize: 11, fill: '#4A5568' }} />
                <Tooltip 
                  formatter={(value: any) => [
                    <span className="font-mono font-bold text-emerald-600">{displayInCNY ? '￥' : '$'}{parseFloat(value).toFixed(2)} {displayInCNY ? 'CNY' : 'USD'}</span>,
                    `预计净利润`
                  ]}
                  contentStyle={{ fontSize: '12px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend iconSize={12} wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                <Bar name="单笔净利润" dataKey="预计净利润" fill="#059669" radius={[4, 4, 0, 0]} isAnimationActive={false}>
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
              根据您的以往月度订单总数，自动识别国家、品类等各项费用扣点与物流，算出扣减后的银行到账金额。结合日常薪资水电ERP等固支，给出终极利润净值与科学建议零售定价。
            </p>
          </div>
          <span className="self-start md:self-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase font-mono tracking-wider">
            企业运营级精算
          </span>
        </div>

        {/* Mobile-only Segmented Control for Enterprise Amortization */}
        <div className="lg:hidden flex bg-slate-200/80 p-1 rounded-xl border border-slate-300/40 shadow-inner mb-4">
          <button
            onClick={() => setEnterpriseMobileSubTab('inputs')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              enterpriseMobileSubTab === 'inputs'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>配置企业开支</span>
          </button>
          <button
            onClick={() => setEnterpriseMobileSubTab('results')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              enterpriseMobileSubTab === 'results'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="h-3 w-3" />
            <span>查看分摊报告</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Panel (Left) */}
          <div className={`lg:col-span-5 bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-2xs ${enterpriseMobileSubTab === 'inputs' ? 'block' : 'hidden lg:block'}`}>
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

              {/* SKU-specific filtering and overrides */}
              <div className="bg-slate-50/55 p-3 rounded-xl border border-slate-200/80 space-y-3.5">
                <div className="flex items-center space-x-1.5 border-b border-indigo-100 pb-1.5">
                  <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider">识别特定出单商品 / SKU 属性 (可选)</span>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 flex items-center justify-between">
                    <span>商品名称 / SKU 标记</span>
                    <span className="text-[9px] text-slate-400 font-normal font-sans">默认为当前估算单品</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例: 爆款防寒童装、SKU-A"
                    value={evalSKUName}
                    onChange={(e) => setEvalSKUName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600">
                      该 SKU 采购单价 (￥)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={`继承 (￥${cogsRMB.toFixed(2)})`}
                      value={customSKUCogsRMB}
                      onChange={(e) => setCustomSKUCogsRMB(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono font-bold transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600">
                      该 SKU 物流单价 (￥)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={`继承 (￥${defaultUnitLogisticsCNY.toFixed(2)})`}
                      value={customSKULogisticsRMB}
                      onChange={(e) => setCustomSKULogisticsRMB(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-mono font-bold transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Monthly Goods & Logistics Cost indicators under Orders Count */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                <div className="space-y-0.5">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">该 SKU 月度货款总额</span>
                  <div className="text-xs font-extrabold text-slate-800 font-mono">
                    ￥{((parseFloat(historicalMonthlyOrders) || 0) * activeSKUCogsRMB).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-slate-400 font-normal">CNY</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    (单件货款: ￥{activeSKUCogsRMB.toFixed(2)})
                  </span>
                </div>
                <div className="space-y-0.5 border-l border-slate-200 pl-3">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">该 SKU 月度物流总额</span>
                  <div className="text-xs font-extrabold text-indigo-600 font-mono">
                    ￥{((parseFloat(historicalMonthlyOrders) || 0) * activeSKULogisticsRMB).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] text-slate-400 font-normal">CNY</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    (单件物流: ￥{activeSKULogisticsRMB.toFixed(2)})
                  </span>
                </div>
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
          <div className={`lg:col-span-7 flex flex-col justify-between ${enterpriseMobileSubTab === 'results' ? 'flex' : 'hidden lg:flex'}`}>
            {(() => {
              const ordersNum = parseFloat(historicalMonthlyOrders) || 0;
              const staffVal = parseFloat(staffCostRMB) || 0;
              const rentVal = parseFloat(rentCostRMB) || 0;
              const erpVal = parseFloat(erpCostRMB) || 0;
              const otherVal = parseFloat(otherFixedCostRMB) || 0;

              const hasInput = ordersNum > 0;

              if (!hasInput) {
                return (
                  <div className="h-full min-h-[350px] bg-slate-100/60 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="text-4xl">🏢</div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm">企业经营评估功能未激活</p>
                      <p className="text-xs text-slate-455 max-w-sm mt-1 leading-relaxed">
                        在左侧面板中输入您的<strong>以往月度订单总数</strong>，系统即可解锁全链路扣点识别与固定成本分摊，分析出满足您企业净利润目标的最精确零售价！
                      </p>
                    </div>
                  </div>
                );
              }

              // Calculating totals
              const totalMonthlyFixedCostRMB = staffVal + rentVal + erpVal + otherVal;
              const fixedCostPerOrderRMB = totalMonthlyFixedCostRMB / ordersNum;
              const fixedCostPerOrderLocal = fixedCostPerOrderRMB / selectedResult.exchangeRateToCNY;

              const unitForwardLogisticsCNY = (selectedResult.forwardLogistics || 0) * selectedResult.exchangeRateToCNY;
              const unitFbtFeeCNY = (selectedResult.fbtFeeLocal || 0) * selectedResult.exchangeRateToCNY;
              const unitStorageFeeCNY = (selectedResult.storageFeeLocal || 0) * selectedResult.exchangeRateToCNY;
              const unitReturnLossCNY = (selectedResult.returnLoss || 0) * selectedResult.exchangeRateToCNY;
              const originalUnitTotalLogisticsCNY = unitForwardLogisticsCNY + unitFbtFeeCNY + unitStorageFeeCNY + unitReturnLossCNY;

              // Convert active costs for this SKU to local currency
              const activeCogsLocal = activeSKUCogsRMB / selectedResult.exchangeRateToCNY;
              const activeLogisticsLocal = activeSKULogisticsRMB / selectedResult.exchangeRateToCNY;
              const originalCogsLocal = cogsRMB / selectedResult.exchangeRateToCNY;
              const originalLogisticsLocal = originalUnitTotalLogisticsCNY / selectedResult.exchangeRateToCNY;

              // Core operational diagnostics with customized SKU costs
              const currentPrice = selectedResult.suggestedPriceLocal;
              
              // Adjusted unit net profit local
              const adjustedItemNetProfitLocal = selectedResult.netProfit + (originalCogsLocal - activeCogsLocal) + (originalLogisticsLocal - activeLogisticsLocal);
              const enterpriseNetProfitLocal = adjustedItemNetProfitLocal - fixedCostPerOrderLocal;
              const enterpriseNetMargin = currentPrice > 0 ? (enterpriseNetProfitLocal / currentPrice) * 100 : 0;

              // 1. Goods and Logistics costs in CNY
              const monthlyGoodsTotalRMB = ordersNum * activeSKUCogsRMB;
              const monthlyLogisticsTotalRMB = ordersNum * activeSKULogisticsRMB;

              // 2. Platform automatic deductions
              const platformDeductionsLocal = 
                (selectedResult.commissionFee || 0) + 
                (selectedResult.transactionFee || 0) + 
                (selectedResult.creatorCommission || 0) + 
                (selectedResult.taxes || 0);

              const payoutDeductionsLocal = 
                (selectedResult.withdrawalFee || 0) + 
                (selectedResult.exchangeLossBuffer || 0);

              const platformLogisticsLocal = 
                (selectedResult.fbtFeeLocal || 0) + 
                (selectedResult.storageFeeLocal || 0);

              // 3. Clean received payout (去除这些费用后的应收到账金额)
              // This is the amount actually paid out by the platform and credited to the merchant bank account, per unit
              const unitReceivedLocal = selectedResult.suggestedPriceLocal - platformDeductionsLocal - platformLogisticsLocal - payoutDeductionsLocal;
              const unitReceivedRMB = unitReceivedLocal * selectedResult.exchangeRateToCNY;
              const monthlyReceivedTotalRMB = ordersNum * unitReceivedRMB;

              // 4. Solve for Precision Pricing
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
                  
                  // Compute r's original costs
                  const rCogsLocal = cogsRMB / r.exchangeRateToCNY;
                  const rForwardLogisticsCNY = (r.forwardLogistics || 0) * r.exchangeRateToCNY;
                  const rFbtFeeCNY = (r.fbtFeeLocal || 0) * r.exchangeRateToCNY;
                  const rStorageFeeCNY = (r.storageFeeLocal || 0) * r.exchangeRateToCNY;
                  const rReturnLossCNY = (r.returnLoss || 0) * r.exchangeRateToCNY;
                  const rTotalLogisticsCNY = rForwardLogisticsCNY + rFbtFeeCNY + rStorageFeeCNY + rReturnLossCNY;
                  const rLogisticsLocal = rTotalLogisticsCNY / r.exchangeRateToCNY;

                  // Compute overridden costs for r
                  const activeRCogsLocal = activeSKUCogsRMB / r.exchangeRateToCNY;
                  const activeRLogisticsLocal = activeSKULogisticsRMB / r.exchangeRateToCNY;

                  // Compute adjusted net profit for r
                  const adjustedRNetProfitLocal = r.netProfit + (rCogsLocal - activeRCogsLocal) + (rLogisticsLocal - activeRLogisticsLocal);

                  const trialMargin = mid > 0 ? (adjustedRNetProfitLocal - fixedCostPerOrderLocal) / mid : -1;
                  
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

              // Let's identify the Category and Country Names
              const friendlyCategoryNames: Record<string, string> = {
                fashion: "服装、鞋包及配饰",
                cosmetics: "美妆个护与美发",
                electronics: "手机数码办公",
                electronics_device: "智能数码设备",
                electronics_accessories: "数码电子配件",
                home: "家居厨房生活",
                sports: "运动户外车配",
                toys: "玩具收藏动漫",
                collectibles: "手办文具收藏",
                jewelry: "轻奢高雅珠宝",
                books: "学术印刷书籍",
                grocery: "食品杂货饮料",
              };
              const activeCategoryName = friendlyCategoryNames[input.category] || "普通商品大类";

              // 5. Enterprise final profit (公司最终实际纯利润)
              const monthlyAdSpendTotalRMB = ordersNum * (selectedResult.adSpend || 0) * selectedResult.exchangeRateToCNY;
              const monthlyReturnLossTotalRMB = ordersNum * (selectedResult.returnLoss || 0) * selectedResult.exchangeRateToCNY;
              const monthlyOverheadTotalRMB = ordersNum * (packagingLossRMB + generalExpensesRmb);
              const finalCompanyProfitRMB = monthlyReceivedTotalRMB - monthlyGoodsTotalRMB - monthlyLogisticsTotalRMB - monthlyAdSpendTotalRMB - monthlyReturnLossTotalRMB - monthlyOverheadTotalRMB - totalMonthlyFixedCostRMB;

              return (
                <div className="space-y-6 flex flex-col h-full">
                  {/* Card 1: 企业全链路利润精算报告 */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 flex-1 flex flex-col justify-between shadow-sm">
                    <div className="space-y-5">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">📊</span>
                          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">企业全链路利润精算报告</span>
                        </div>
                        <div className="flex items-center space-x-2 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={downloadEnterprisePricingReport}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition duration-150 flex items-center gap-1 shadow-sm active:scale-95"
                          >
                            <Download className="h-3 w-3" /> 下载对比报告 (含图表)
                          </button>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${isProfitSatisfied ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'}`}>
                            {isProfitSatisfied ? '✓ 达标' : '⚠️ 固收不足'}
                          </span>
                        </div>
                      </div>

                      {/* Meta section */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase">评估单品 / SKU</span>
                          <span className="font-extrabold text-slate-800 mt-0.5 block truncate" title={evalSKUName || "当前核算单品"}>
                            {evalSKUName || "当前核算单品"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase">识别站点国家</span>
                          <span className="font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
                            <VectorFlag id={selectedResult.siteId} className="h-3 w-4.5 rounded-xs border border-slate-200" />
                            <span>{selectedResult.siteName} ({selectedResult.siteId})</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase">品类归属</span>
                          <span className="font-extrabold text-indigo-700 mt-0.5 block truncate">
                            {activeCategoryName}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase">当前核算汇率</span>
                          <span className="font-extrabold text-slate-800 font-mono mt-0.5 block">
                            1 {selectedResult.currency} = {selectedResult.exchangeRateToCNY.toFixed(4)} CNY
                          </span>
                        </div>
                      </div>

                      {/* Deductions Breakdown */}
                      <div className="space-y-2">
                        <span className="block text-[10px] text-slate-455 font-black uppercase tracking-wider">系统自动识别各项费用扣点与损耗明细 (每单)</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-medium text-slate-650">
                          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                            <span>平台扣点佣金:</span>
                            <strong className="font-mono text-slate-800">
                              {((selectedResult.commissionFee / (selectedResult.suggestedPriceLocal || 1)) * 100).toFixed(1)}%
                            </strong>
                          </div>
                          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                            <span>支付交易手续费:</span>
                            <strong className="font-mono text-slate-800">
                              {((selectedResult.transactionFee / (selectedResult.suggestedPriceLocal || 1)) * 100).toFixed(1)}%
                            </strong>
                          </div>
                          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                            <span>达人抽成比例:</span>
                            <strong className="font-mono text-slate-800">
                              {(input.affiliateCommissionRate || 0).toFixed(1)}%
                            </strong>
                          </div>
                          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                            <span>官方配送费:</span>
                            <strong className="font-mono text-slate-800">
                              {selectedResult.symbol}{(selectedResult.fbtFeeLocal || 0).toFixed(2)}
                            </strong>
                          </div>
                          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                            <span>仓储及代收税额:</span>
                            <strong className="font-mono text-slate-800">
                              {selectedResult.symbol}{((selectedResult.storageFeeLocal || 0) + (selectedResult.taxes || 0)).toFixed(2)}
                            </strong>
                          </div>
                          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                            <span>提现与汇率差:</span>
                            <strong className="font-mono text-slate-800">
                              {(payoutDeductionsLocal / (selectedResult.suggestedPriceLocal || 1) * 100).toFixed(2)}%
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Net Received Payout (应收到账金额) */}
                      <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider block">去除扣点扣费后的银行【结汇应收到账金额】</span>
                          <p className="text-slate-500 text-[11px] font-semibold mt-0.5">
                            （平台扣减抽成与尾程，并经结汇提现后，实际汇入国内银行卡金额）
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="block text-xl font-black font-mono text-emerald-600">
                            ￥{monthlyReceivedTotalRMB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CNY <span className="text-xs font-normal text-slate-400">/月</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            单件到账: ￥{unitReceivedRMB.toFixed(2)} CNY (≈ {selectedResult.symbol}{unitReceivedLocal.toFixed(2)} {selectedResult.currency})
                          </span>
                        </div>
                      </div>

                      {/* Enterprise Balance Sheet Ledger */}
                      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
                        <span className="block text-[10px] text-slate-450 font-black uppercase tracking-wider">月度企业最终实际纯利润精算</span>
                        
                        <div className="flex justify-between border-b border-slate-200/60 pb-1">
                          <span className="text-slate-500 font-medium">1. 预计月度结汇应收到账 (RMB)</span>
                          <span className="font-mono font-bold text-slate-800">
                            ￥{monthlyReceivedTotalRMB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-200/60 pb-1">
                          <span className="text-slate-500 font-medium">2. 减：商品采购成本 (RMB)</span>
                          <span className="font-mono font-bold text-rose-600">
                            - ￥{monthlyGoodsTotalRMB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-200/60 pb-1">
                          <span className="text-slate-500 font-medium">3. 减：干线与尾程物流总成本 (RMB)</span>
                          <span className="font-mono font-bold text-rose-600">
                            - ￥{monthlyLogisticsTotalRMB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-200/60 pb-1">
                          <span className="text-slate-500 font-medium">4. 减：流量推广与广告投放费用 (RMB)</span>
                          <span className="font-mono font-bold text-rose-600">
                            - ￥{monthlyAdSpendTotalRMB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-200/60 pb-1">
                          <span className="text-slate-500 font-medium">5. 减：日常包材杂费与退货损耗公摊 (RMB)</span>
                          <span className="font-mono font-bold text-rose-600">
                            - ￥{monthlyOverheadTotalRMB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-slate-200/60 pb-1">
                          <span className="text-slate-500 font-medium">6. 减：月度企业运营固收 (薪资/租金/ERP等)</span>
                          <span className="font-mono font-bold text-rose-600">
                            - ￥{totalMonthlyFixedCostRMB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-150 space-y-1 mt-2 shadow-inner">
                          <div className="flex justify-between items-baseline">
                            <span className="text-indigo-600 font-black text-xs uppercase">月度企业最终实际纯利润</span>
                            <div className={`text-base font-black font-mono ${finalCompanyProfitRMB >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              ￥{finalCompanyProfitRMB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-100 pt-1 text-[10px]">
                            <span className="text-slate-400 font-bold">综合企业净利率：</span>
                            <span className={`font-mono font-extrabold text-xs ${enterpriseNetMargin >= (input.targetProfitMarginRate || 20) ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {enterpriseNetMargin.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: 企业级财务成本均摊诊断评估 */}
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
                          <span>满足期望净利润率 ({(input.targetProfitMarginRate || 20)}%) 的精准建议定价:</span>
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
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
