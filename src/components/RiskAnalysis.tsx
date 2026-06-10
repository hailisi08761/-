import React from 'react';
import { MultiSiteResult, SimulationInput } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ShieldAlert, RefreshCw, BarChart2, DollarSign, HelpCircle, Activity } from 'lucide-react';
import { CATEGORY_THRESHOLDS } from '../data/feeStructures';

interface RiskAnalysisProps {
  results: MultiSiteResult[];
  input: SimulationInput;
  onChangeInput: (key: keyof SimulationInput, value: number) => void;
  exchangeRateUSDToCNY: number;
}

export default function RiskAnalysis({ results, input, onChangeInput, exchangeRateUSDToCNY }: RiskAnalysisProps) {
  // We will perform calculations for a chosen site (e.g. US) to draw Return Sensitivity Curve
  const [activeSiteId, setActiveSiteId] = React.useState<string>('US');
  
  const activeResult = results.find(r => r.siteId === activeSiteId) || results[0];

  // Helper to retrieve category thresholds
  const categoryThreshold = CATEGORY_THRESHOLDS[input.category] || CATEGORY_THRESHOLDS.other;
  const isReturnOverThreshold = (input.returnRate / 100) > categoryThreshold.maxReturnRate;

  // Generate sensitivity curve data points (0% to 40% return rate)
  const sensitivityData = Array.from({ length: 9 }, (_, idx) => {
    const simReturn = idx * 5; // 0%, 5%, 10%, 15%, 20%, 25%, 30%, 35%, 40%
    
    // Recalculate margins with varying return rates
    const returnShippingOverhead = (simReturn / 100) * input.returnShippingFeeLocal;
    const badReturnLoss = (simReturn / 100) * (input.badReturnInoperableRate / 100) * activeResult.cogsConverted;
    const logisticsCost = input.fbtFeeLocal + input.storageFeeLocal + returnShippingOverhead + badReturnLoss;
    
    const simGrossProfit = activeResult.customerPaid - activeResult.totalPlatformFees - activeResult.creatorCommission - activeResult.cogsConverted - logisticsCost;
    const simGrossMargin = activeResult.customerPaid > 0 ? (simGrossProfit / input.priceLocal) * 100 : 0;
    
    const simNetProfit = simGrossProfit - input.adSpendLocal - activeResult.withdrawalFee - activeResult.exchangeLossBuffer - input.generalExpensesLocal;
    const simNetMargin = activeResult.customerPaid > 0 ? (simNetProfit / input.priceLocal) * 100 : 0;

    return {
      returnRate: `${simReturn}%`,
      '预估毛利率 (%)': parseFloat(simGrossMargin.toFixed(1)),
      '预估净利率 (%)': parseFloat(simNetMargin.toFixed(1)),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="risk-analysis-module">
      
      {/* Simulation Inputs */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Activity className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800">运营风险模拟器</h2>
        </div>

        <div className="space-y-5 text-xs">
          {/* Return Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-500 font-medium">退货退款率 (Return Rate)</label>
              <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-xs ${
                isReturnOverThreshold ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {input.returnRate}%
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="50"
              value={input.returnRate}
              onChange={(e) => onChangeInput('returnRate', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>理想状态 (0%)</span>
              <span>行业安全阀: {(categoryThreshold.maxReturnRate * 100).toFixed(0)}%</span>
              <span>极高退货 (50%)</span>
            </div>
          </div>

          {/* Damaged returns slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-500 font-medium">退货损毁率 (无二次分销价值)</label>
              <span className="font-mono text-slate-700 font-bold">{input.badReturnInoperableRate}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={input.badReturnInoperableRate}
              onChange={(e) => onChangeInput('badReturnInoperableRate', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>全部重新包装上架 (0%)</span>
              <span>100% 货损直接报废</span>
            </div>
            <p className="text-[10px] text-slate-400/80 mt-1">
              注：海外件如退货损毁，通常无法二次销售，意味着完全损失本次采购成本 (COGS)。
            </p>
          </div>

          {/* Reverse Freight Costs */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-500 font-medium">逆向单件退货派送费 (本币)</label>
              <span className="text-slate-400">折合 RMB: ￥{(input.returnShippingFeeLocal * activeResult.exchangeRateToCNY).toFixed(2)}</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.1"
              value={input.returnShippingFeeLocal}
              onChange={(e) => onChangeInput('returnShippingFeeLocal', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono"
            />
          </div>

          {/* Advertising budget per unit */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold text-slate-700 mb-3">广告与引流核算</h3>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-500 font-medium">单件均摊广告费 (Ad Spend)</label>
                <span className="text-slate-400">折合 ￥: ￥{(input.adSpendLocal * activeResult.exchangeRateToCNY).toFixed(2)}</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.1"
                value={input.adSpendLocal}
                onChange={(e) => onChangeInput('adSpendLocal', Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                投放支出占本币比例：{input.priceLocal > 0 ? ((input.adSpendLocal / input.priceLocal) * 100).toFixed(0) : 0}% 售价
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Sensitivity Curves and breakeven ROAS */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Ad Breakeven ROAS Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="h-4.5 w-4.5 text-indigo-600" />
              投流损益与盈亏平衡 ROAS (Break-even ROAS)
            </h3>
            <select
              value={activeSiteId}
              onChange={(e) => setActiveSiteId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 px-2 py-1 rounded focus:outline-none"
            >
              {results.map(r => (
                <option key={r.siteId} value={r.siteId}>{r.siteName}</option>
              ))}
            </select>
          </div>

          {activeResult.breakEvenROAS < 0 ? (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">产品底价出现硬亏损 (已破产状态)！</p>
                <p className="mt-1 leading-relaxed">
                  当前设定的 **采购、佣金、物流、逆向退货** 等刚性硬成本支出（总毛成本比：{((activeResult.cogsConverted + activeResult.totalPlatformFees + activeResult.totalLogisticsCost + activeResult.creatorCommission) / input.priceLocal * 100).toFixed(1)}%）已经强于您的销售售价！
                  在此状态下，**您的毛利润为负。无论产生多少广告转化率（ROAS），投放广告都将以等比速度放大您的财务亏损**！
                </p>
                <p className="mt-2 font-bold text-rose-700">优化方案：请立即在第一板块上调单件售价，或设法压低国内采购成本和物流配送扣率！</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100 text-center">
                <span className="block text-[11px] text-indigo-900">盈亏平衡临界 ROAS</span>
                <span className="block text-2xl font-extrabold font-mono text-indigo-600 mt-1">
                  {activeResult.breakEvenROAS.toFixed(2)}
                </span>
                <p className="text-[10px] text-indigo-500 mt-1">在这个 ROAS 下，您的净亏损为 0</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <span className="block text-[11px] text-slate-500">模拟实际投流 ROAS</span>
                <span className="block text-2xl font-extrabold font-mono text-slate-700 mt-1">
                  {activeResult.actualROAS > 0 ? activeResult.actualROAS.toFixed(2) : '暂无广告消耗'}
                </span>
                <span className={`inline-block text-[9px] mt-1 px-1.5 py-0.5 rounded-full font-bold ${
                  activeResult.actualROAS >= activeResult.breakEvenROAS ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {activeResult.actualROAS >= activeResult.breakEvenROAS ? '处于盈利获客区' : '处于亏损获客区'}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <span className="block text-[11px] text-slate-500">有效单客获客成本 (eCPA)</span>
                <span className="block text-2xl font-extrabold font-mono text-slate-700 mt-1">
                  {activeResult.currency} {activeResult.eCPA.toFixed(2)}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">考虑了退货扣减后的有效发件成本</p>
              </div>
            </div>
          )}
        </div>

        {/* Return Rate Sensitivity Line Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <RefreshCw className="h-4.5 w-4.5 text-indigo-600 animate-spin-slow" />
            退货敏感度与利润衰减曲线 ({activeResult.siteName})
          </h3>

          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sensitivityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="returnRate" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: any) => [`${value}%`]} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                <ReferenceLine y={40} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '安全大盘毛利线', fill: '#EF4444', fontSize: 9 }} />
                <ReferenceLine y={0} stroke="#6B7280" />
                <Line type="monotone" dataKey="预估毛利率 (%)" stroke="#6366F1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="预估净利率 (%)" stroke="#10B981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            随着退货率攀升，逆向仓运费加上【毁坏报废损失】将极速侵蚀毛利，导致盈亏平衡ROAS呈指数级恶化！
          </p>
        </div>

        {/* Warnings on category return rules */}
        {isReturnOverThreshold && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start space-x-3 text-xs leading-relaxed">
            <ShieldAlert className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-950">退货警报线预警：</span>
              由于您的销售类目是 **{categoryThreshold.name}**，当前您模拟设置的退货率 **{input.returnRate}%** 已经突破了该行业的安全阀值 **{(categoryThreshold.maxReturnRate * 100).toFixed(0)}%**！跨境大件退运成本高昂且无法全额理赔，极易引发严重积压亏损。请设法优化尺码详情，或升级出仓质检流程以降低退货风险！
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
