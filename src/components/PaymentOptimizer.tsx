import React from 'react';
import { PayoutTool, ExchangeRateConfig } from '../types';
import { PAYOUT_TOOLS_CONFIG } from '../data/feeStructures';
import { Landmark, ArrowLeftRight, HelpCircle, Sparkles, Sliders, CheckCircle2, RefreshCw, Info, ExternalLink } from 'lucide-react';

interface PaymentOptimizerProps {
  selectedPayoutId: string;
  onChangePayoutId: (id: string) => void;
  customPayoutFees: Record<string, number>;
  onUpdatePayoutFee: (id: string, fee: number) => void;
  exchangeRates: ExchangeRateConfig;
  onUpdateExchangeRate: (currency: string, value: number) => void;
  exchangeRateUSDToCNY: number;
  onChangeUSDToCNY: (value: number) => void;
  ratesLoading?: boolean;
  ratesFetchedAt?: string | null;
  ratesSource?: string | null;
  onFetchRates?: () => Promise<void>;
}

export default function PaymentOptimizer({
  selectedPayoutId,
  onChangePayoutId,
  customPayoutFees,
  onUpdatePayoutFee,
  exchangeRates,
  onUpdateExchangeRate,
  exchangeRateUSDToCNY,
  onChangeUSDToCNY,
  ratesLoading = false,
  ratesFetchedAt = null,
  ratesSource = null,
  onFetchRates
}: PaymentOptimizerProps) {
  // Find which payout tool is selected
  const activeTool = PAYOUT_TOOLS_CONFIG.find((t) => t.id === selectedPayoutId) || PAYOUT_TOOLS_CONFIG[0];

  // Dynamically evaluate the cheapest tool
  const cheapestTool = PAYOUT_TOOLS_CONFIG.reduce((prev, curr) => {
    const prevFee = customPayoutFees[prev.id] !== undefined ? customPayoutFees[prev.id] : prev.defaultFee * 100;
    const currFee = customPayoutFees[curr.id] !== undefined ? customPayoutFees[curr.id] : curr.defaultFee * 100;
    return currFee < prevFee ? curr : prev;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="payment-optimizer-module">
      
      {/* Exchange Rate Matrix Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">实时结汇汇率矩阵</h2>
          </div>
          {onFetchRates && (
            <button
              onClick={() => { if (!ratesLoading) onFetchRates(); }}
              disabled={ratesLoading}
              title="获取最新国家外汇管理局/最新实时结算波幅行情"
              className="p-1 px-2 text-[11px] rounded bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100/70 transition flex items-center gap-1 font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${ratesLoading ? 'animate-spin' : ''}`} />
              {ratesLoading ? '同步中..' : '获取最新'}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Main USD to CNY */}
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <label className="block text-xs font-semibold text-indigo-900 mb-1">
              美金至人民币基准汇率 (USD ➔ CNY)
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                step="0.001"
                min="1"
                value={exchangeRateUSDToCNY}
                onChange={(e) => onChangeUSDToCNY(Math.max(1, parseFloat(e.target.value) || 7.25))}
                className="w-full px-3 py-1.5 text-sm bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono font-semibold"
              />
              <span className="absolute right-3 top-1.5 text-xs text-indigo-600 font-bold">1 USD = ￥CNY</span>
            </div>
            <p className="text-[10px] text-indigo-500/80 mt-1">
              目前是跨境卖家核心采购记账基础，通常预留 1.5% 汇损
            </p>
          </div>

          {/* Sub-currencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">小币种对美金汇率 (1 USD =)</h3>
            {Object.keys(exchangeRates).map((curr) => {
              if (curr === 'USD') return null;
              return (
                <div key={curr} className="flex items-center justify-between space-x-2 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 font-mono">{curr} (1美金兑)</span>
                  <div className="relative w-1/2">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={exchangeRates[curr]}
                      onChange={(e) => onUpdateExchangeRate(curr, Math.max(0.001, parseFloat(e.target.value) || 1))}
                      className="w-full text-right pr-8 pl-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded font-mono font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <span className="absolute right-2 top-1 text-[10px] text-slate-400 font-bold">{curr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payout Channels Optimization */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Channel Selection Cards */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">主流第三方提现工具比价</h2>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
              通常入账免费，仅收提结费
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PAYOUT_TOOLS_CONFIG.map((tool) => {
              const currentFee = customPayoutFees[tool.id] !== undefined
                ? customPayoutFees[tool.id]
                : tool.defaultFee * 100;
              const isSelected = tool.id === selectedPayoutId;
              const isCheapest = tool.id === cheapestTool.id;

              return (
                <div
                  key={tool.id}
                  onClick={() => onChangePayoutId(tool.id)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/20 shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Badge */}
                  {isCheapest && (
                    <span className="absolute top-3 right-3 text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3" /> 最优推荐
                    </span>
                  )}

                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tool.logoColor }}
                    />
                    <h3 className="text-sm font-bold text-slate-800">{tool.name}</h3>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="border-t border-slate-100/50 my-3 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Sliders className="h-3 w-3" /> 设定费率 (%)
                    </span>
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        step="0.05"
                        min="0.1"
                        max="2"
                        value={currentFee}
                        onChange={(e) => onUpdatePayoutFee(tool.id, Math.max(0.01, parseFloat(e.target.value) || 0.1))}
                        className="w-16 px-1.5 py-0.5 text-xs font-mono font-semibold text-right bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span>标准费率区间: {(tool.withdrawalFeeMin * 100).toFixed(1)}% - {(tool.withdrawalFeeMax * 100).toFixed(1)}%</span>
                    {isSelected && (
                      <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> 已启用
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1.5% Exchange Rate loss warning and system suggestion */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 relative overflow-hidden shadow">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
             2026 跨境结汇提现避坑指南
          </h3>

          <div className="mt-4 space-y-4 text-xs font-light text-slate-300">
            <div className="flex items-start space-x-2">
              <div className="p-1 px-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded font-semibold text-[10px]">
                必防
              </div>
              <div>
                <p className="font-semibold text-white">1.5% 汇率损耗防洪线：</p>
                <p className="text-slate-400 mt-1">
                  结算提现中，TikTok 平台对美金转本币折算含有 **1.5%** 的隐性汇率波动溢价或电汇手续费。无论采用哪种第三方收款工具，在做最终毛利核算时，公式中应严格扣除此 **1.5% 的汇损空间**，避免“名义盈利、实际亏空”。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <div className="p-1 px-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded font-semibold text-[10px]">
                指南
              </div>
              <div>
                <p className="font-semibold text-white">第三方费率撮合技巧：</p>
                <p className="text-slate-400 mt-1">
                  目前的各大支付牌照中，当月结汇量超过 $50,000 USD 时，应主动向派安盈、连连、空中云汇等客服申请下调服务手续费。大卖家可直接协商砍至 **0.3% - 0.5%**，这一层优化能直接提升 **0.5% 以上的净利润率**。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <div className="p-1 px-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-semibold text-[10px]">
                推荐
              </div>
              <div>
                <p className="font-semibold text-white">当前最优路径选择：</p>
                <p className="text-slate-400 mt-1">
                  当前设定的手续费配置中，**{cheapestTool.name}** 服务费率最低 ({(customPayoutFees[cheapestTool.id] || cheapestTool.defaultFee * 100).toFixed(2)}%)，预计多站点年销千万级可累计省下 **￥{(6800000 * 0.005).toFixed(0)}** 元净成本。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
