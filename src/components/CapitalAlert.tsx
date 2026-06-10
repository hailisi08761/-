import React, { useState } from 'react';
import { Calendar, AlertTriangle, CheckCircle, Info, Landmark, Layers, HelpCircle } from 'lucide-react';

interface CapitalAlertProps {
  priceLocal: number;
  symbol: string;
  exchangeRateToCNY: number;
}

export default function CapitalAlert({ priceLocal, symbol, exchangeRateToCNY }: CapitalAlertProps) {
  // Configurable inputs for cash cycle
  const [sellerLevel, setSellerLevel] = useState<string>('new');
  const [orderVolume, setOrderVolume] = useState<number>(300); // 300 orders batch typical
  const [logisticsDays, setLogisticsDays] = useState<number>(7); // Default 7 days from shipping to delivery

  // Level config mapping
  const levelConfigs: Record<string, { name: string; holdDays: number; desc: string }> = {
    new: { name: '新手卖家/新店 (New Store)', holdDays: 14, desc: '妥投后 14 天放款 (新卖家标准保护期)' },
    bronze: { name: '成长商家/青铜 (Level 1)', holdDays: 8, desc: '妥投后 8 天放款 (有一定的销量与评分)' },
    silver: { name: '白银等级 (Level 2)', holdDays: 5, desc: '妥投后 5 天放款 (综合评级优秀，退款率低)' },
    gold: { name: '金牌/黄金商家 (Level 3)', holdDays: 3, desc: '妥投后 3 天放款 (平台核心大店专享福利)' },
    fast: { name: '极速回款 (Fast Payout)', holdDays: 1, desc: '妥投后 1 天放款 (提供担保或顶尖级别卖家)' }
  };

  const selectedConfig = levelConfigs[sellerLevel] || levelConfigs.new;

  // Real-world logistical milestones
  // 1. Paid -> Shipped: 2 days (国内备货打单发出)
  // 2. Shipped -> Delivered: 7 days (国际干线+目的站海关+海外段配送)
  // 3. Delivered -> Settled: holdDays (TK Shop 规定的结算等待期)
  const stockingDays = 2;
  const transitDays = logisticsDays;
  const holdPeriodDays = selectedConfig.holdDays;
  const totalDays = stockingDays + transitDays + holdPeriodDays;

  // Values calculation
  const totalOrderAmountLocal = priceLocal * orderVolume;
  const totalOrderAmountCNY = totalOrderAmountLocal * exchangeRateToCNY;
  
  // Outstanding funds calculation: Suppose different statuses representing capital distribution
  // e.g. 15% pending packaging/shipping, 50% in logistics transit, 35% in settlement waiting room
  const packagingAmountCNY = totalOrderAmountCNY * 0.15;
  const transitAmountCNY = totalOrderAmountCNY * 0.50;
  const holdAmountCNY = totalOrderAmountCNY * 0.35;

  // Determine warnings based on cash cycle days
  let warningGrade: 'low' | 'medium' | 'high' = 'low';
  if (totalDays > 19) {
    warningGrade = 'high';
  } else if (totalDays > 12) {
    warningGrade = 'medium';
  }

  // Create timeline milestones
  const milestones = [
    { name: '买家下单付款 (Day D)', days: 'Day 0', desc: '买家付款，资金计入暂估账款（不可提）', active: true, color: 'bg-indigo-600' },
    { name: '卖家国内出货 (Day D+2)', days: `Day ${stockingDays}`, desc: `国内仓备货并交付跨境货代，国内物流扣费开始`, active: true, color: 'bg-blue-600' },
    { name: '买家签收妥投 (Day D+9)', days: `Day ${stockingDays + transitDays}`, desc: `跨境干线运输 + 目的国配送。运货时长：${transitDays} 天`, active: true, color: 'bg-emerald-600' },
    { name: '平台解冻可提 (Day D+X)', days: `Day ${totalDays}`, desc: `根据 ${selectedConfig.name} 等级，在签收妥投 ${holdPeriodDays} 天后解冻`, active: true, color: 'bg-violet-600' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="capital-alert-module">
      
      {/* Configuration & Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Layers className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800">资金周期模拟设置</h2>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">TikTok 卖家综合等级</label>
            <select
              value={sellerLevel}
              onChange={(e) => setSellerLevel(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.keys(levelConfigs).map((k) => (
                <option key={k} value={k}>{levelConfigs[k].name}</option>
              ))}
            </select>
            <p className="text-[11px] text-indigo-600 mt-1.5 font-medium flex items-center gap-1">
              <Info className="h-3 w-3" /> {selectedConfig.desc}
            </p>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">
              单周期模拟成交单数 (Orders)
            </label>
            <input
              type="number"
              min="1"
              value={orderVolume}
              onChange={(e) => setOrderVolume(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none transition font-mono"
            />
            <span className="text-[10px] text-slate-400">单周期营业总额： {symbol}{totalOrderAmountLocal.toLocaleString(undefined, {maximumFractionDigits: 1})} (折合 ￥{totalOrderAmountCNY.toLocaleString(undefined, {maximumFractionDigits: 0})} CNY)</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-slate-500 font-medium">
                国际物流货运时效 (天)
              </label>
              <span className="font-mono text-indigo-600 text-xs font-semibold">{logisticsDays} 天</span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              value={logisticsDays}
              onChange={(e) => setLogisticsDays(parseInt(e.target.value) || 7)}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>空运极其快速 (3天)</span>
              <span>海运陆运慢 (20天)</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-600">
          <div className="flex justify-between font-mono">
            <span>国内货期准备:</span>
            <span className="text-slate-900">{stockingDays} 天</span>
          </div>
          <div className="flex justify-between font-mono">
            <span>跨境货代在途:</span>
            <span className="text-slate-900">{transitDays} 天</span>
          </div>
          <div className="flex justify-between font-mono">
            <span>妥投平台结算冻结:</span>
            <span className="text-indigo-600 font-bold">+{holdPeriodDays} 天</span>
          </div>
          <div className="flex justify-between font-bold text-slate-800 border-t border-dashed border-slate-100 pt-2 text-sm font-mono">
            <span>总财务循环周期 (D2W):</span>
            <span className="text-indigo-900">{totalDays} 天</span>
          </div>
        </div>
      </div>

      {/* Forecast & Alerts */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Warning card */}
        {warningGrade === 'high' ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex items-start space-x-3.5 shadow-sm">
            <AlertTriangle className="h-6 w-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                高危资金周转预警！当前周期：{totalDays} 天
              </h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                您的预计资金回笼极其缓慢 (发货至回笼大于19天)！这意味着如果单批大单成交额达到 **￥{totalOrderAmountCNY.toLocaleString(undefined, {maximumFractionDigits: 0})}**，您在
                本周期内将面临至少 **￥{(totalOrderAmountCNY * 0.9).toLocaleString(undefined, {maximumFractionDigits: 0})}** 的极高上游供货账付压力与物流空仓垫资！
              </p>
              <div className="mt-3 flex gap-2">
                <span className="text-[10px] uppercase font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
                  应对方案
                </span>
                <span className="text-xs text-rose-800 font-medium font-mono">
                  需准备不低于 45 天的预备池流动资金，或考虑申请平台「极速回款」计划以缩短放款期限。
                </span>
              </div>
            </div>
          </div>
        ) : warningGrade === 'medium' ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-2xl flex items-start space-x-3.5 shadow-sm">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                中度现金紧张预警：周转周期 {totalDays} 天
              </h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                您的回款周期尚可，但由于属于新晋阶段等级，依然有 **{holdPeriodDays}天** 的妥投滞期费。爆单时可能导致数日采购现金链断层。建议留存 **￥{(totalOrderAmountCNY * 0.6).toLocaleString(undefined, {maximumFractionDigits: 0})}** 左右的供货信誉。
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl flex items-start space-x-3.5 shadow-sm">
            <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                现金流平顺健康度。周转周期：{totalDays} 天
              </h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                恭喜，由于卖家等级优良并获得了快速放款（妥投仅 {holdPeriodDays} 天放款），资金流周转顺畅。仅需预留约 10-15 天周转资金，便可应付常规补货爆仓需求！
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Financial Roadmap (Timeline milestones) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            货款在途生命周期映射表
          </h3>

          <div className="relative border-l-2 border-slate-100 ml-4 py-1 pl-6 space-y-6">
            {milestones.map((m, idx) => (
              <div key={m.name} className="relative">
                {/* Visual marker circle */}
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ring-2 ${m.color === 'bg-indigo-600' ? 'ring-indigo-600 bg-white' : m.color === 'bg-blue-600' ? 'ring-blue-600 bg-white' : m.color === 'bg-emerald-600' ? 'ring-emerald-600 bg-white' : 'ring-violet-600 bg-violet-600'} flex items-center justify-center`} />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-xs font-bold text-slate-800">{m.name}</span>
                  <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full select-none">{m.days}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transiting Funds Chart representation */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Landmark className="h-4 w-4 text-indigo-600" />
            在途在仓资金分配图
          </h3>
          
          <div className="h-6 bg-slate-100 rounded-full flex overflow-hidden font-mono text-[10px] font-bold text-white mb-4">
            <div className="bg-blue-500 h-full flex items-center justify-center transition-all" style={{ width: '15%' }} title="采购中/仓内装载 (15%)">
              ￥{packagingAmountCNY.toLocaleString(undefined, {maximumFractionDigits: 0})} (15%)
            </div>
            <div className="bg-amber-500 h-full flex items-center justify-center transition-all" style={{ width: '50%' }} title="跨境妥投在途 (50%)">
              ￥{transitAmountCNY.toLocaleString(undefined, {maximumFractionDigits: 0})} (50%)
            </div>
            <div className="bg-violet-500 h-full flex items-center justify-center transition-all" style={{ width: '35%' }} title="妥投平台审核暂押 (35%)">
              ￥{holdAmountCNY.toLocaleString(undefined, {maximumFractionDigits: 0})} (35%)
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-100">
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">仓内处理阶段</span>
              <span className="font-mono text-sm font-bold text-blue-600">CNY ￥{packagingAmountCNY.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">国际货船在途</span>
              <span className="font-mono text-sm font-bold text-amber-600">CNY ￥{transitAmountCNY.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">妥投放款审核</span>
              <span className="font-mono text-sm font-bold text-violet-600">CNY ￥{holdAmountCNY.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
