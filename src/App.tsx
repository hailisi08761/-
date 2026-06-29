import React, { useState, useMemo, useEffect } from 'react';
import { SimulationInput, ExchangeRateConfig } from './types';
import { calculateMultiSiteSimulation } from './utils/calculator';
import { PAYOUT_TOOLS_CONFIG, SITE_FEE_CONFIGS } from './data/feeStructures';
import SiteSimulator from './components/SiteSimulator';
import PaymentOptimizer from './components/PaymentOptimizer';
import CapitalAlert from './components/CapitalAlert';
import RiskAnalysis from './components/RiskAnalysis';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Coins,
  Percent,
  TrendingUp,
  CreditCard,
  CalendarDays,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  HelpCircle,
  FileCheck2,
  GitCompare,
  TrendingDown,
  Info
} from 'lucide-react';

export default function App() {
  // 1. Core Simulation State (Synced across tabs for continuous calculations)
  const [input, setInput] = useState<SimulationInput>({
    cogs: 35.0, // Default product purchase cost in CNY (￥35 RMB)
    priceLocal: 29.90, // Default retail selling price in site destination本币
    category: 'fashion', // Default Category (Fashion) -> sets standard parameters
    pricingMode: 'reverse', // Default to Reverse Pricing Recommendation
    targetProfitMarginRate: 20.0, // Default target Net Profit Margin is 20%
    domesticShippingRMB: 5.0, // Default domestic logistics to warehouse in RMB
    internationalShippingRMB: 15.0, // Default international trunk shipping in RMB
    generalExpensesRMB: 2.0, // Default miscellaneous overhead in RMB
    shippingPaidByBuyer: 3.5, // Freight paid by consumer
    forwardShippingCostLocal: 0, // Base forward shipping overhead (handled inside direct fulfillment)
    fbtFeeLocal: 2.50, // FBT custom picking / handling
    storageFeeLocal: 0.30, // Storage fee per item
    affiliateCommissionRate: 10.0, // TikTok creator commission percentage (10%)
    returnRate: 11.0, // Default clothing return rate (11%)
    returnShippingFeeLocal: 4.80, // Refund carrier shipping fee
    badReturnInoperableRate: 20.0, // Default 20% of returns are ruined/inoperable
    adSpendLocal: 5.0, // Mean advertising spend per piece
    adSpendRatioPercent: 15.0, // Default custom advertising percentage of price (15%)
    platformSubsidyLocal: 1.20, // Platform discount subsidy
    sellerDiscountLocal: 0.80, // Seller-granted coupons
    taxRateLocal: 0.0, // Standard local sales VAT
    generalExpensesLocal: 0.40, // Overhead general expenses
    payoutToolId: 'lianlian', // Default selected payout brand
    customPayoutFeeRate: 0.6, // Default Lianlian transaction fee percentage is 0.6%
  });

  // Active Tab Tracker
  const [activeTab, setActiveTab] = useState<'site' | 'payout' | 'capital' | 'risk'>('site');

  // Base Exchange Rate USD to CNY
  const [exchangeRateUSDToCNY, setExchangeRateUSDToCNY] = useState<number>(7.25);

  // Sub-currencies configuration (Local currency per 1 USD)
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateConfig>({
    USD: 1.0,
    GBP: 0.78,
    JPY: 156.0,
    MXN: 18.2,
    VND: 25400,
    THB: 36.5,
    MYR: 4.70,
    PHP: 58.5,
    SGD: 1.35,
  });

  // Rates fetch state configuration
  const [ratesLoading, setRatesLoading] = useState<boolean>(false);
  const [ratesFetchedAt, setRatesFetchedAt] = useState<string | null>(null);
  const [ratesSource, setRatesSource] = useState<string | null>(null);

  // Pull rates from the Express backend service
  const fetchLiveRates = async () => {
    setRatesLoading(true);
    try {
      const response = await fetch('/api/rates');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.rates) {
          if (data.rates.CNY) {
            setExchangeRateUSDToCNY(data.rates.CNY);
          }
          setExchangeRates(data.rates);
          setRatesFetchedAt(data.fetchedAt);
          setRatesSource(data.source);
        }
      }
    } catch (err) {
      console.error("Failed to load exchange rates from backend:", err);
    } finally {
      setRatesLoading(false);
    }
  };

  // Auto-init load on mount
  useEffect(() => {
    fetchLiveRates();
  }, []);

  // Track customized third-party payout fees (e.g. customized percentage fee rate for each channel)
  const [customPayoutFees, setCustomPayoutFees] = useState<Record<string, number>>({
    payoneer: 1.0,
    lianlian: 0.6,
    pingpong: 0.8,
    airwallex: 0.5,
  });

  // Handler to safely update core parameter list
  const handleChangeInput = (key: keyof SimulationInput, value: any) => {
    setInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler to customize single exchange rate
  const handleUpdateExchangeRate = (currency: string, value: number) => {
    setExchangeRates((prev) => ({
      ...prev,
      [currency]: value,
    }));
  };

  // Update a single service provider fee rate
  const handleUpdatePayoutFee = (id: string, fee: number) => {
    setCustomPayoutFees((prev) => ({
      ...prev,
      [id]: fee,
    }));
    // If active payout tool, ensure the core input reflects this change immediately
    if (input.payoutToolId === id) {
      setInput((prev) => ({
        ...prev,
        customPayoutFeeRate: fee,
      }));
    }
  };

  // Ensure payout tool change propagates correct customized fee
  const handleChangePayoutId = (id: string) => {
    const matchingFee = customPayoutFees[id] !== undefined ? customPayoutFees[id] : 0.8;
    setInput((prev) => ({
      ...prev,
      payoutToolId: id,
      customPayoutFeeRate: matchingFee,
    }));
  };

  // Execute calculations across ALL sites reactively
  const simulationResults = useMemo(() => {
    return calculateMultiSiteSimulation(input, exchangeRateUSDToCNY, exchangeRates);
  }, [input, exchangeRateUSDToCNY, exchangeRates]);

  // Aggregate Key Insight Stats
  const topSiteRecommendation = useMemo(() => {
    // Rank site according to absolute Net Margin
    const sorted = [...simulationResults].sort((a, b) => b.netMargin - a.netMargin);
    return sorted[0];
  }, [simulationResults]);

  const averageGrossMargin = useMemo(() => {
    const total = simulationResults.reduce((acc, curr) => acc + curr.grossMargin, 0);
    return total / simulationResults.length;
  }, [simulationResults]);

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 flex flex-col antialiased">
      
      {/* Header and Brand */}
      <header className="bg-slate-900 text-white py-5 px-4 sm:px-8 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3">
              <div className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-black text-2xl rounded-xl tracking-wider shadow-lg shadow-indigo-500/10 border border-indigo-500 select-none">
                Price<span className="text-amber-300">Snap</span>
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                TikTok Shop 跨境精算版
              </span>
            </div>
            <p className="text-slate-400 font-medium text-xs mt-2 select-none tracking-wide">
              用计算替代直觉，让利润更清晰
            </p>
          </div>

          {/* Live Rates Ribbon */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800/80 max-w-full md:max-w-2xl">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-bold border-r border-slate-700/60 pr-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>实时参考汇率 :</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-750 flex items-center gap-1.5 shadow-sm">
                <span className="text-xs">🇺🇸</span>
                <span className="text-slate-400 font-mono">USD/CNY</span>
                <span className="text-indigo-400 font-bold font-mono">{exchangeRateUSDToCNY.toFixed(4)}</span>
              </div>
              <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-750 flex items-center gap-1.5 shadow-sm">
                <span className="text-xs">🇬🇧</span>
                <span className="text-slate-400 font-mono">GBP/CNY</span>
                <span className="text-indigo-400 font-bold font-mono">{(exchangeRateUSDToCNY / (exchangeRates.GBP || 0.78)).toFixed(4)}</span>
              </div>
              <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-750 flex items-center gap-1.5 shadow-sm">
                <span className="text-xs">🇲🇾</span>
                <span className="text-slate-400 font-mono">MYR/CNY</span>
                <span className="text-indigo-400 font-bold font-mono">{(exchangeRateUSDToCNY / (exchangeRates.MYR || 4.70)).toFixed(4)}</span>
              </div>
              <div className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-750 flex items-center gap-1.5 shadow-sm">
                <span className="text-xs">🇯🇵</span>
                <span className="text-slate-400 font-mono">100JPY/CNY</span>
                <span className="text-indigo-400 font-bold font-mono">{((exchangeRateUSDToCNY / (exchangeRates.JPY || 156.0)) * 100).toFixed(4)}</span>
              </div>
            </div>
            {ratesFetchedAt && (
              <span className="text-[10px] text-slate-500 font-mono hidden xl:inline">
                更新: {ratesFetchedAt.split(' ')[1] || ratesFetchedAt}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Core View Area */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Tab Selection Row */}
        <div className="border-b border-slate-200 pb-px flex sm:justify-between items-center flex-wrap gap-2">
          <div className="flex space-x-1.5 bg-slate-200/50 p-1.5 rounded-xl border border-slate-200/40">
            <button
              onClick={() => setActiveTab('site')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'site'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/40'
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>多站点费用模拟</span>
            </button>
            <button
              onClick={() => setActiveTab('payout')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'payout'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/40'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>结汇与提现路径</span>
            </button>
            <button
              onClick={() => setActiveTab('capital')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'capital'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/40'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>到账周转预警</span>
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'risk'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/40'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>运营溢价风险分析</span>
            </button>
          </div>
        </div>

        {/* Tab Views content area */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'site' && (
                <SiteSimulator
                  results={simulationResults}
                  input={input}
                  onChangeInput={handleChangeInput}
                  exchangeRateUSDToCNY={exchangeRateUSDToCNY}
                  exchangeRates={exchangeRates}  // Pass exchangeRates configuration
                />
              )}

              {activeTab === 'payout' && (
                <PaymentOptimizer
                  selectedPayoutId={input.payoutToolId}
                  onChangePayoutId={handleChangePayoutId}
                  customPayoutFees={customPayoutFees}
                  onUpdatePayoutFee={handleUpdatePayoutFee}
                  exchangeRates={exchangeRates}
                  onUpdateExchangeRate={handleUpdateExchangeRate}
                  exchangeRateUSDToCNY={exchangeRateUSDToCNY}
                  onChangeUSDToCNY={setExchangeRateUSDToCNY}
                  ratesLoading={ratesLoading}
                  ratesFetchedAt={ratesFetchedAt}
                  ratesSource={ratesSource}
                  onFetchRates={fetchLiveRates}
                />
              )}

              {activeTab === 'capital' && (
                <CapitalAlert
                  priceLocal={input.priceLocal}
                  symbol={topSiteRecommendation.symbol}
                  exchangeRateToCNY={topSiteRecommendation.exchangeRateToCNY}
                />
              )}

              {activeTab === 'risk' && (
                <RiskAnalysis
                  results={simulationResults}
                  input={input}
                  onChangeInput={handleChangeInput}
                  exchangeRateUSDToCNY={exchangeRateUSDToCNY}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>



      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto font-mono">
        <div>TikTok Shop Cross-Border Financial Accounting Simulator Platform © 2026</div>
        <div className="mt-1 text-slate-300">系统计算公式符合 TikTok 服务条款佣金及 1.5% 汇差规则。</div>
      </footer>

    </div>
  );
}
