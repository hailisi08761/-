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
  ratesVerification?: {
    verified: boolean;
    lastCheckedAt: string;
    status: string;
    errors: string[];
  } | null;
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
  ratesVerification = null,
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
                  className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    tool.id === 'airwallex'
                      ? isSelected
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/80 shadow-emerald-500/5'
                        : 'border-emerald-300 bg-emerald-50/5 hover:border-emerald-400 hover:bg-emerald-50/10 hover:shadow-xs'
                      : isSelected
                        ? 'border-indigo-600 bg-indigo-50/20 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Badge */}
                  {tool.id === 'airwallex' ? (
                    <span className="absolute top-3 right-3 text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs">
                      <Sparkles className="h-3 w-3" /> 最优推荐首选
                    </span>
                  ) : isCheapest ? (
                    <span className="absolute top-3 right-3 text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3" /> 费率优势
                    </span>
                  ) : null}

                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tool.logoColor }}
                    />
                    <h3 className="text-sm font-bold text-slate-800">
                      {tool.name}
                      {tool.id === 'airwallex' && <span className="text-[10px] text-emerald-600 font-bold ml-1.5">★ 极速降损</span>}
                    </h3>
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
                    {isSelected ? (
                      <span className={tool.id === 'airwallex' ? "text-emerald-600 font-bold flex items-center gap-0.5" : "text-indigo-600 font-bold flex items-center gap-0.5"}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> 已启用
                      </span>
                    ) : tool.id === 'airwallex' ? (
                      <span className="text-emerald-500/80 font-semibold text-[9px]">建议改用此最优选项</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1.5% Exchange Rate loss warning and system suggestion */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 rounded-2xl p-7 relative overflow-hidden shadow-xl border-t-4 border-amber-500">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-black text-amber-400 tracking-wider flex items-center gap-2">
              <span className="p-1 bg-amber-500/20 rounded-md border border-amber-500/30">📖</span>
              <span>2026 年 TikTok 跨境结汇提现避坑与降本增效白皮书</span>
            </h3>
            <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-extrabold px-2 py-0.5 rounded-md border border-indigo-500/30 uppercase tracking-widest">
              实时风控指导
            </span>
          </div>

          <div className="mt-5 space-y-5 text-xs text-slate-300">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 hover:bg-white/8 transition duration-300">
              <div className="flex items-center space-x-2">
                <span className="p-1 px-2 bg-rose-500 text-white rounded font-bold text-[10px] uppercase shadow-sm">
                  重点防范
                </span>
                <p className="font-bold text-white text-sm">1.5% 平台隐性汇率波动损耗防线</p>
              </div>
              <p className="text-slate-400 leading-relaxed pl-1 text-[11px]">
                在 TikTok 平台资金流中，美金转本地账户折算含有大约 <strong className="text-rose-400">1.5% 的隐性汇率损耗区间</strong>（含汇率波幅溢价及电汇转账费）。在进行任何商品零售售价与盈利净值模拟时，<strong className="text-amber-400">必须在终核公式中严格扣减该 1.5% 汇损空间</strong>，以防止出现名义上盈利、实际到账亏空的财务大忌！
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 hover:bg-white/8 transition duration-300">
              <div className="flex items-center space-x-2">
                <span className="p-1 px-2 bg-indigo-600 text-white rounded font-bold text-[10px] uppercase shadow-sm">
                  议价指南
                </span>
                <p className="font-bold text-white text-sm">第三方支付通道费率竞争议价技巧</p>
              </div>
              <p className="text-slate-400 leading-relaxed pl-1 text-[11px]">
                当月结汇量超过 <strong className="text-indigo-400 font-mono">$50,000 USD</strong> 时，请勿仅使用默认费率！应当即刻主动向连连、派安盈、Airwallex 专属客服申请下调通道手续费。符合规模要求的卖家可以直接将费率协商砍至 <strong className="text-emerald-400 font-mono">0.3% - 0.5%</strong>，此流程优化可<strong>直接变相上浮总体商品净利润率达 0.5% - 0.7%</strong>！
              </p>
            </div>

            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/25 space-y-2 hover:bg-emerald-950/60 transition duration-300">
              <div className="flex items-center space-x-2">
                <span className="p-1 px-2 bg-emerald-600 text-white rounded font-bold text-[10px] uppercase shadow-sm">
                  最优建议
                </span>
                <p className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                  <span>推荐：首选通道 Airwallex（空中云汇）</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-normal">费率最低/结算快速</span>
                </p>
              </div>
              <p className="text-slate-300 leading-relaxed pl-1 text-[11px]">
                对比当前所有提现结算工具，<strong className="text-white font-semibold">Airwallex (空中云汇)</strong> 拥有压倒性的服务费率优势，默认最低通道首发费率仅为 <strong className="text-emerald-400 font-mono">0.50%</strong>。按多站点年销平均 1000 万人民币进行对换，选择 Airwallex 每年可直接帮助团队额外多省下约 <strong className="text-emerald-300 font-mono">￥{(6800000 * 0.005).toFixed(0)}元</strong> 的真金白银纯收益，堪称当前首选的完美提效方案。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
