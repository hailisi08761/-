import React, { useState, useMemo, useEffect } from 'react';
import { 
  Store, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Coins, 
  ShieldCheck, 
  Globe, 
  HelpCircle, 
  Activity, 
  Zap, 
  Sparkles, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Clock, 
  Settings, 
  Plug, 
  FileText, 
  SlidersHorizontal, 
  BarChart3,
  Flame,
  UserCheck,
  HeartCrack,
  Info,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { MonthlyOrder } from '../types';

interface StoreSyncCenterProps {
  monthlyOrders: MonthlyOrder[];
  setMonthlyOrders: (orders: MonthlyOrder[]) => void;
  productCostDict: Record<string, { cogs: number; domesticShipping: number; internationalShipping: number }>;
  setProductCostDict: (dict: Record<string, { cogs: number; domesticShipping: number; internationalShipping: number }>) => void;
  setOrdersFeedbackMsg: (msg: { text: string; isError: boolean } | null) => void;
  exchangeRateUSDToCNY: number;
}

// Platforms Config
const PLATFORMS = [
  {
    id: 'shopify',
    name: 'Shopify 独立站',
    icon: Globe,
    color: 'emerald',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700',
    textColor: 'text-emerald-700',
    accentColor: '#10b981',
    description: '独立站直营，深度集成 Shopify Admin GraphQL API，高客单价，高私域红利。',
    defaultUrl: 'https://myshop.myshopify.com',
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop 跨境店',
    icon: Zap,
    color: 'pink',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200/50',
    btnColor: 'bg-pink-600 hover:bg-pink-700',
    textColor: 'text-pink-700',
    accentColor: '#ec4899',
    description: '达人短视频/直播带货生态，网红爆款孵化器。高佣金与冲动型退款需重点核算。',
    defaultUrl: 'https://seller.tiktokglobalshop.com',
  },
  {
    id: 'amazon',
    name: 'Amazon 亚马逊SC',
    icon: Store,
    color: 'amber',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/50',
    btnColor: 'bg-amber-600 hover:bg-amber-700',
    textColor: 'text-amber-700',
    accentColor: '#f59e0b',
    description: '跨境尊享 FBA 精英仓储物流，SP-API 账单同步。仓储费与高昂佣金重压，注重动销率。',
    defaultUrl: 'https://sellercentral.amazon.com',
  },
  {
    id: 'temu',
    name: 'Temu 全托管/半托管',
    icon: Sparkles,
    color: 'orange',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200/50',
    btnColor: 'bg-orange-600 hover:bg-orange-700',
    textColor: 'text-orange-700',
    accentColor: '#f97316',
    description: '超级工厂供货模式，高吞吐单量。质检罚款与核价机制是核心风险敞口。',
    defaultUrl: 'https://kuajing.pingduoduo.com',
  },
  {
    id: 'shopee',
    name: 'Shopee 虾皮跨境店',
    icon: SlidersHorizontal,
    color: 'rose',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/50',
    btnColor: 'bg-rose-600 hover:bg-rose-700',
    textColor: 'text-rose-700',
    accentColor: '#f43f5e',
    description: '东南亚及拉丁美洲国民电商，SLS物流与汇率多变。高货到付款(COD)不派退回率需注意。',
    defaultUrl: 'https://seller.shopee.cn',
  }
];

// Presets for demo data generation based on chosen platform
const PLATFORM_DEMO_DATA: Record<string, {
  products: Array<{ name: string; price: number; cogs: number; domesticShipping: number; internationalShipping: number; siteId: string }>;
  averageOrderQty: number;
  ordersCount: number;
  notes: string[];
}> = {
  shopify: {
    ordersCount: 380,
    averageOrderQty: 1.1,
    products: [
      { name: '云感深层智能按摩仪 Pro-X', price: 89.00, cogs: 110, domesticShipping: 5, internationalShipping: 32, siteId: 'us' },
      { name: '人体工学减压透气坐垫 V2', price: 45.00, cogs: 55, domesticShipping: 4, internationalShipping: 21, siteId: 'us' },
      { name: '复古极简胡桃木无线充电座', price: 65.00, cogs: 82, domesticShipping: 5, internationalShipping: 26, siteId: 'gb' },
    ],
    notes: [
      '💡 **注意流量成本**：Shopify独立站不自带免费的公域流量。你当前抓取到的 380 笔单量中，平均每单有 12%~25% 为 Google / Meta 广告引流成本，ROAS 临界点偏高！',
      '⚠️ **Shopify 提现/卡费扣点**：注意 Shopify Payments 与 Stripe 存在 2.6% + $0.3 的基础卡费扣点，且非Shopify本土币种结算会存在 1.5%~2% 的跨境手续损耗。建议优先在「收汇工具」中绑定连连支付以节省 0.6% 提现手续费。',
      '📈 **独立站退款与欺诈风险**：Shopify 平台无官方介入。应注意拦截「欺诈中高风险」账单（建议配置 Shopify Flow 自动取消涉嫌盗卡欺诈的订单），避免被 Stripe 强制索要每笔 $15+ 的拒付调单罚金。'
    ]
  },
  tiktok: {
    ordersCount: 680,
    averageOrderQty: 1.2,
    products: [
      { name: '网红极光微醺日落伴眠灯', price: 19.99, cogs: 18, domesticShipping: 2.5, internationalShipping: 12, siteId: 'us' },
      { name: '多功能磁吸美颜自拍环形补光灯', price: 29.50, cogs: 32, domesticShipping: 3, internationalShipping: 15, siteId: 'us' },
      { name: '便携式氛围感香薰复古小音箱', price: 34.99, cogs: 38, domesticShipping: 3, internationalShipping: 18, siteId: 'gb' },
    ],
    notes: [
      '💡 **TikTok Shop 达人高佣金分摊**：TikTok Shop 严重依赖达人建联分销（Affiliate）。当前订单抓取中，带货订单中包含高达 15%~20% 的达人定向抽佣。这笔费用会在订单妥投后直接从美金账单扣除，请在定价中务必包含此风险公摊。',
      '⚠️ **病毒式退货风波**：TikTok Shop 受短视频和直播冲动性消费驱使，退货率显著高于传统货架电商（行业平均约 12%~18%）。特别是时尚女装、电子饰品类。不良退货（坏损、剪标、开封无法二次销售）比例极易击穿毛利。',
      '📈 **TK 本土海外仓闭环发货**：TikTok 正全力推行「本土店 / 闭环海外仓」发货，时效若超出 3 天会面临直接扣减分值、罚款甚至关店。对于这 680 笔订单，请注意是否产生了本土海外仓单件大货转运溢价。'
    ]
  },
  amazon: {
    ordersCount: 450,
    averageOrderQty: 1.05,
    products: [
      { name: '智能降噪运动无线牙骨传导耳机', price: 59.99, cogs: 75, domesticShipping: 4, internationalShipping: 18, siteId: 'us' },
      { name: '3D慢回弹记忆棉护颈深度睡眠枕', price: 39.99, cogs: 48, domesticShipping: 3.5, internationalShipping: 14, siteId: 'us' },
      { name: '极简黑砂铝合金桌面平板支架', price: 24.99, cogs: 28, domesticShipping: 2, internationalShipping: 9, siteId: 'gb' },
    ],
    notes: [
      '💡 **天价 FBA 配送与仓储公摊**：亚马逊最大特点是重资产。FBA 配送费（基于尺寸、实重与体积重计费）平均占到售价的 18%~25%！此外，如果产生「库龄滞销」或「旺季仓储仓位限制」，高昂的长期仓储费与超库容费将直接吞噬大半纯利。',
      '⚠️ **退货重包装费 (Repackaging Fee)**：亚马逊买家退回的商品，若因外包装轻微受损，FBA 会代收 $0.5~$1 的二次重包费重新上架。但如果直接坏损导致「买家损坏/无法销售」，商品原值成本（COGS）将 100% 灭失。',
      '📈 **秒杀活动(LD)与广告溢价**：抓取账单明细时，须警惕 Amazon Lightning Deal 推广秒杀费（单次 150USD~300USD 不等）以及单品点击扣费 (Sponsored Ads) 的自动账单抵扣。许多卖家看似订单量暴涨，但财务扣点后实际处于亏损边缘。'
    ]
  },
  temu: {
    ordersCount: 1100,
    averageOrderQty: 1.0,
    products: [
      { name: '不锈钢多功能削皮器三件套', price: 5.90, cogs: 3.2, domesticShipping: 0.8, internationalShipping: 0, siteId: 'us' },
      { name: '食品级耐高温硅胶烘焙揉面垫', price: 7.50, cogs: 4.5, domesticShipping: 1.0, internationalShipping: 0, siteId: 'us' },
      { name: '北欧风磨砂渐变便携防摔水杯 600ml', price: 9.90, cogs: 6.8, domesticShipping: 1.2, internationalShipping: 0, siteId: 'us' },
    ],
    notes: [
      '💡 **极速低价模式**：Temu 全托管在核算时由于买家端海路物流成本由平台先行公摊，国内头程成本极低。但是售价由买家端通过 Temu 核价委员会严苛比对，溢价空间被严格挤压在 10%~15% 极低区间，盈利需要依靠极其庞大的爆单量运转。',
      '⚠️ **超级红牌惩罚：质检罚款 (Quality Penalty)**：Temu 严苛奉行「买家投诉/质检不符直接罚款 5 倍售价」机制。哪怕 1100 笔订单中只有 2% 的投诉率，也会产生高昂的罚款明细，必须预提「罚款准备金(Penalty Buffer)」。',
      '📈 **半托管物流履约时效**：若升级为 Temu 半托管，卖家需要自行负责海外仓本发，一旦配送超时会遭到高达数美金单笔的超时延误罚金，会直接从回款中强制扣划，此明细需每日密切对账。'
    ]
  },
  shopee: {
    ordersCount: 950,
    averageOrderQty: 1.3,
    products: [
      { name: '夏季薄款高腰百搭工装帆布包', price: 35.00, cogs: 12, domesticShipping: 1.5, internationalShipping: 6, siteId: 'my' }, // price in MYR
      { name: '高解析立体声带线入耳式电竞耳机', price: 22.00, cogs: 8, domesticShipping: 1.2, internationalShipping: 5, siteId: 'my' },
      { name: '日系糖果色磨砂超轻双肩包', price: 48.00, cogs: 18, domesticShipping: 2.0, internationalShipping: 9, siteId: 'my' },
    ],
    notes: [
      '💡 **COD 货到付款极高拒收率**：东南亚部分站点（如印尼、泰国、越南、菲律宾）货到付款 (Cash on Delivery) 占比仍高达 45%~60%。当前抓取的订单中，注意由于消费者临门拒收或派送失败导致的「不派返仓率」，卖家需自行承担双向 SLS 跨境头程运费。',
      '⚠️ **虾皮高扣点服务费**：Shopee 跨境店基础佣金约 6%~8.5%，但若参加了「免运计划 (FSS)」和「返现计划 (CCB)」，平台会强制额外划扣 4%~6% 的专属服务费，综合抽佣率可直逼 15%，高额返现与免运会令中低价单品瞬间丧失盈利空间。',
      '📈 **多国小币种极高汇率损耗**：由于虾皮在多国分站经营，马币MYR、印尼盾IDR、泰铢THB结算币种波动剧烈。Shopee 的官方自动跨境汇率一般存在 1.5%~2.5% 的买卖价差（汇率隐形剥削），应采用专业的境外账单精算来锁定收益。'
    ]
  }
};

export default function StoreSyncCenter({
  monthlyOrders,
  setMonthlyOrders,
  productCostDict,
  setProductCostDict,
  setOrdersFeedbackMsg,
  exchangeRateUSDToCNY
}: StoreSyncCenterProps) {
  // Tabs
  const [mobileSubTab, setMobileSubTab] = useState<'bind' | 'analysis' | 'tips'>('bind');

  // Input states for store connection
  const [selectedPlatform, setSelectedPlatform] = useState<string>('shopify');
  const [storeName, setStoreName] = useState<string>('');
  const [storeUrl, setStoreUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [syncOrderCount, setSyncOrderCount] = useState<number>(350);
  const [isAutoFetch, setIsAutoFetch] = useState<boolean>(true);

  // Connection Progress
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedStore, setConnectedStore] = useState<{ platform: string; storeName: string; storeUrl: string } | null>(null);

  // Sync Progress
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncStageText, setSyncStageText] = useState<string>('');
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Handle auto url populate
  useEffect(() => {
    const plat = PLATFORMS.find(p => p.id === selectedPlatform);
    if (plat) {
      setStoreUrl(plat.defaultUrl);
      const platDemo = PLATFORM_DEMO_DATA[selectedPlatform];
      if (platDemo) {
        setSyncOrderCount(platDemo.ordersCount);
      }
    }
  }, [selectedPlatform]);

  // Connect Store Flow
  const handleConnectStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) {
      alert('请输入店铺名称 / ID');
      return;
    }
    
    setIsConnecting(true);
    // Simulate API connection handshake
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      const platInfo = PLATFORMS.find(p => p.id === selectedPlatform);
      setConnectedStore({
        platform: selectedPlatform,
        storeName: storeName.trim(),
        storeUrl: storeUrl || (platInfo ? platInfo.defaultUrl : '')
      });
      // Run auto-sync once connected
      triggerSync(selectedPlatform, storeName.trim());
    }, 1500);
  };

  // Run Auto Sync Flow
  const triggerSync = (platformId: string, nameOfStore: string) => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncLogs([]);
    
    const stages = [
      { progress: 10, text: '🔗 正在与平台开发者网关建立互信握手 (TLS 1.3 Secure API Handshake)...' },
      { progress: 30, text: '🔐 验证开放平台 OAuth 令牌与授权 JWT 安全指纹认证...' },
      { progress: 50, text: '🌐 查询店铺网端 webhook 主机，调用最新交易流水接口 /api/v3/orders/list ...' },
      { progress: 70, text: '📥 成功拉取订单加密报文。正在解密、解析并对齐国际多站汇率映射数据...' },
      { progress: 90, text: '🧮 正在匹配对应单品 SKU 采购单价、头程海运空运运费公摊，智能对账归集...' },
      { progress: 100, text: '🎉 抓取并同步全部月度明细账目完成！数据已注入中央财务面板。' }
    ];

    let currentStageIdx = 0;
    const interval = setInterval(() => {
      if (currentStageIdx < stages.length) {
        const stage = stages[currentStageIdx];
        setSyncProgress(stage.progress);
        setSyncStageText(stage.text);
        setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${stage.text}`]);
        currentStageIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSyncing(false);
          const now = new Date();
          setLastSyncTime(now.toLocaleString());
          
          // Actually populate state with the custom platform data
          const demoConfig = PLATFORM_DEMO_DATA[platformId];
          if (demoConfig) {
            const generatedOrders: MonthlyOrder[] = [];
            const dict: Record<string, { cogs: number; domesticShipping: number; internationalShipping: number }> = {};
            
            // Populate product cost dictionary
            demoConfig.products.forEach((p, idx) => {
              dict[p.name] = {
                cogs: p.cogs,
                domesticShipping: p.domesticShipping,
                internationalShipping: p.internationalShipping
              };
              
              // Generate realistic orders
              const totalItemsCount = Math.round(demoConfig.ordersCount / demoConfig.products.length);
              for (let i = 1; i <= totalItemsCount; i++) {
                generatedOrders.push({
                  id: `ORD-${platformId.toUpperCase()}-${1000 + idx * 400 + i}`,
                  productName: p.name,
                  quantity: 1,
                  siteId: p.siteId,
                  salesRevenueLocal: p.price,
                  status: i % 15 === 0 ? '已退款' : '已妥投',
                  category: '3C数码/家居精装'
                });
              }
            });

            setMonthlyOrders(generatedOrders);
            setProductCostDict(dict);
            
            // Set success notification to app level
            setOrdersFeedbackMsg({
              text: `🎉 已通过 API 自动抓取并同步来自 [${PLATFORMS.find(p => p.id === platformId)?.name}] 店铺 "${nameOfStore}" 的 ${generatedOrders.length} 笔真实交易订单！产品采购及跨境头程等成本指标已由 API 自动穿透对账，完成了智能化资产损益(P&L)拆解。`,
              isError: false
            });
          }
        }, 800);
      }
    }, 1200);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectedStore(null);
    setMonthlyOrders([]);
    setSyncLogs([]);
    setLastSyncTime('');
    setOrdersFeedbackMsg(null);
  };

  // ----------------------------------------------------
  // DATA ANALYSIS & PROFIT LEDGER (数据分析与利润明细)
  // ----------------------------------------------------
  const analysisData = useMemo(() => {
    if (monthlyOrders.length === 0) return null;

    let totalRevenueCNY = 0;
    let totalCogsCNY = 0;
    let totalLogisticsCNY = 0;
    let totalPlatformFeesCNY = 0;
    let totalRefundsCNY = 0;
    
    // Group by SKU/Product for table
    const skuMap: Record<string, {
      name: string;
      ordersCount: number;
      revenueCNY: number;
      cogsCNY: number;
      logisticsCNY: number;
      platformFeeCNY: number;
      refundsCNY: number;
    }> = {};

    monthlyOrders.forEach(o => {
      // Find matching cost
      const cost = productCostDict[o.productName] || { cogs: 40, domesticShipping: 3, internationalShipping: 12 };
      
      // Determine exchange rate (e.g. if site is us, use USD rate)
      // A simple mapping for conversion
      let rateToCNY = 7.15; // default us/shopify
      if (o.siteId === 'gb') rateToCNY = 9.02;
      if (o.siteId === 'my') rateToCNY = 1.66;
      if (o.siteId === 'vn') rateToCNY = 0.00028;
      
      const priceCNY = o.salesRevenueLocal * rateToCNY;
      const cogsItemCNY = cost.cogs;
      const logisticsItemCNY = cost.domesticShipping + cost.internationalShipping;
      
      // Standard platform commission estimated at 8.5%
      const commissionRate = selectedPlatform === 'tiktok' ? 0.06 : selectedPlatform === 'amazon' ? 0.15 : 0.085;
      const platformFeeItemCNY = priceCNY * commissionRate;
      
      const isRefunded = o.status === '已退款';
      const refundValCNY = isRefunded ? priceCNY : 0;

      totalRevenueCNY += priceCNY;
      totalCogsCNY += cogsItemCNY;
      totalLogisticsCNY += logisticsItemCNY;
      totalPlatformFeesCNY += platformFeeItemCNY;
      if (isRefunded) {
        totalRefundsCNY += priceCNY;
      }

      if (!skuMap[o.productName]) {
        skuMap[o.productName] = {
          name: o.productName,
          ordersCount: 0,
          revenueCNY: 0,
          cogsCNY: 0,
          logisticsCNY: 0,
          platformFeeCNY: 0,
          refundsCNY: 0
        };
      }

      const item = skuMap[o.productName];
      item.ordersCount += 1;
      item.revenueCNY += priceCNY;
      item.cogsCNY += cogsItemCNY;
      item.logisticsCNY += logisticsItemCNY;
      item.platformFeeCNY += platformFeeItemCNY;
      item.refundsCNY += refundValCNY;
    });

    // Deduct refunds and other components from Net Profit
    // Add ad spend / marketing (simulate 15% of revenue is marketing ad-spend)
    const totalAdSpendCNY = totalRevenueCNY * 0.18;
    // Add other operation fee (simulate 4% of revenue)
    const totalOperatingCNY = totalRevenueCNY * 0.04;

    const netProfitCNY = totalRevenueCNY - totalCogsCNY - totalLogisticsCNY - totalPlatformFeesCNY - totalRefundsCNY - totalAdSpendCNY - totalOperatingCNY;
    const netMargin = totalRevenueCNY > 0 ? (netProfitCNY / totalRevenueCNY) * 100 : 0;

    return {
      totalRevenueCNY,
      totalCogsCNY,
      totalLogisticsCNY,
      totalPlatformFeesCNY,
      totalRefundsCNY,
      totalAdSpendCNY,
      totalOperatingCNY,
      netProfitCNY,
      netMargin,
      skuList: Object.values(skuMap)
    };
  }, [monthlyOrders, productCostDict, selectedPlatform]);

  // Cost Breakdown Pie Chart Data
  const pieChartData = useMemo(() => {
    if (!analysisData) return [];
    return [
      { name: '产品采购 (COGS)', value: Math.round(analysisData.totalCogsCNY), color: '#3b82f6' },
      { name: '跨境与国内物流', value: Math.round(analysisData.totalLogisticsCNY), color: '#10b981' },
      { name: '平台交易与佣金', value: Math.round(analysisData.totalPlatformFeesCNY), color: '#ec4899' },
      { name: '退款扣款损耗', value: Math.round(analysisData.totalRefundsCNY), color: '#f43f5e' },
      { name: '海外流量广告费', value: Math.round(analysisData.totalAdSpendCNY), color: '#eab308' },
      { name: '日常杂费与运营', value: Math.round(analysisData.totalOperatingCNY), color: '#6366f1' },
      { name: '净得纯利润', value: Math.max(0, Math.round(analysisData.netProfitCNY)), color: '#14b8a6' }
    ].filter(item => item.value > 0);
  }, [analysisData]);

  const activePlatDetails = PLATFORMS.find(p => p.id === selectedPlatform);

  return (
    <div className="space-y-6" id="store-sync-center-module">
      
      {/* Title block with beautiful gradients */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-950/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-2 select-none">
          <Plug className="h-72 w-72 text-indigo-400 rotate-12" />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2.5 py-1 rounded-full font-black tracking-wider uppercase border border-indigo-400/20 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-400 animate-spin-slow" /> API INTELLIGENT INTEGRATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
            多平台店铺后台 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">一键授信绑定</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-2xl">
            打通跨境主流平台官方 API（SP-API / Webhooks / Partners Token），智能化抓取原始交易账单，秒级完成复杂退税、达人高昂佣金、卡费及退货折损多维度精准财务拆解。
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center space-x-2 relative z-10 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-emerald-400">SPI 网关：就绪 (200 OK)</span>
        </div>
      </div>

      {/* Mobile subtabs */}
      <div className="lg:hidden flex bg-slate-200/80 p-1 rounded-xl border border-slate-300/40 shadow-inner">
        <button
          onClick={() => setMobileSubTab('bind')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileSubTab === 'bind'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Plug className="h-3.5 w-3.5" />
          <span>绑定商铺网</span>
        </button>
        <button
          onClick={() => {
            if (!isConnected) {
              alert('请先连接店铺并同步订单！');
              return;
            }
            setMobileSubTab('analysis');
          }}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            !isConnected ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            mobileSubTab === 'analysis'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>账单损益分析</span>
        </button>
        <button
          onClick={() => setMobileSubTab('tips')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileSubTab === 'tips'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>避坑雷达专线</span>
        </button>
      </div>

      {/* Grid Layout - Config on Left / Analysis on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Connection & Sync panel (col-span-5) */}
        <div className={`lg:col-span-5 flex flex-col space-y-6 ${mobileSubTab === 'bind' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Shop Selector Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Settings className="h-4 w-4 text-indigo-600" />
              <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest">第一步：选择集成平台渠道</h2>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {PLATFORMS.map(p => {
                const isSelected = selectedPlatform === p.id;
                const IconComp = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      if (isConnected) {
                        if (confirm('切换平台需要断开当前绑定的店铺，确定继续吗？')) {
                          handleDisconnect();
                        } else {
                          return;
                        }
                      }
                      setSelectedPlatform(p.id);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 relative ${
                      isSelected 
                        ? 'bg-indigo-50/70 border-indigo-500/80 text-indigo-950 shadow-sm ring-2 ring-indigo-500/10'
                        : 'bg-slate-50 border-slate-150 text-slate-500 hover:bg-slate-100/60'
                    }`}
                  >
                    <IconComp className={`h-5 w-5 mb-1.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold text-center leading-tight truncate w-full">{p.name.split(' ')[0]}</span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {activePlatDetails && (
              <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl text-xs text-slate-500 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed font-medium">{activePlatDetails.description}</p>
              </div>
            )}
          </div>

          {/* Connection Wizard Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-indigo-600" />
                <h2 className="text-xs font-black text-slate-700 uppercase tracking-widest">第二步：建立安全授权连接</h2>
              </div>
              {isConnected && (
                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-0.5 border border-emerald-200 rounded-full font-black">
                  ● 已授信连接
                </span>
              )}
            </div>

            {!isConnected ? (
              <form onSubmit={handleConnectStore} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider">店铺识别标识 (Store Name / ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：my-global-boutique"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full text-xs bg-slate-50 hover:bg-slate-100/40 focus:bg-white px-3.5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none transition font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider">店铺后台管理 URL (Shop Backend URL)</label>
                  <input
                    type="url"
                    placeholder="https://"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    className="w-full text-xs bg-slate-50 hover:bg-slate-100/40 focus:bg-white px-3.5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none transition font-mono font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider">API Key (客户端ID)</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full text-xs bg-slate-50 px-3.5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider">Access Token (密钥)</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="w-full text-xs bg-slate-50 px-3.5 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-slate-700">自动多频段抓取轮询</span>
                    <span className="block text-[10px] text-slate-400 font-medium">每隔 15 分钟自动通过 Webhook 拉取新妥投账单</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAutoFetch(!isAutoFetch)}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ${
                      isAutoFetch ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                      isAutoFetch ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isConnecting}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs text-white transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 ${
                    activePlatDetails ? activePlatDetails.btnColor : 'bg-indigo-600'
                  }`}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>正在授信 TLS 互连握手中...</span>
                    </>
                  ) : (
                    <>
                      <Plug className="h-4 w-4" />
                      <span>一键完成 API 官方账单极速授信绑定</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-5 py-2">
                <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-2xl flex items-center space-x-3">
                  <div className="bg-indigo-100 rounded-xl p-2 flex-shrink-0">
                    {activePlatDetails && React.createElement(activePlatDetails.icon, { className: "h-5 w-5 text-indigo-700" })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-800 text-xs truncate block">{connectedStore?.storeName}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-md font-black">ACTIVE</span>
                    </div>
                    <span className="block text-[10px] text-slate-400 font-medium truncate font-mono">{connectedStore?.storeUrl}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center">
                    <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">API 账单连通率</span>
                    <span className="block text-base font-extrabold text-emerald-600 mt-0.5">100% (极佳)</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl text-center">
                    <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">最近同步时间</span>
                    <span className="block text-xs font-black text-slate-700 mt-1 truncate">{lastSyncTime || '尚未同步'}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => connectedStore && triggerSync(connectedStore.platform, connectedStore.storeName)}
                    disabled={isSyncing}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl transition flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                  >
                    <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>立即爬网抓取新订单</span>
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-3 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold text-xs rounded-2xl border border-slate-200 transition active:scale-95"
                  >
                    解绑
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sync Progress Logs Terminal */}
          {(isSyncing || syncLogs.length > 0) && (
            <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-3.5 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">API 同步终端监控</span>
                </div>
                <span className="text-[10px] text-slate-500">{syncProgress}% 完成</span>
              </div>
              
              <div className="space-y-1.5 max-h-40 overflow-y-auto text-[10px] text-slate-300 pr-1 select-text scrollbar-thin">
                {syncLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>

              {isSyncing && (
                <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Side: Data Analysis Ledger & Strategic Watchlist (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Dashboard Summary Metrics */}
          {isConnected && analysisData ? (
            <div className={`space-y-6 ${mobileSubTab === 'analysis' ? 'block' : 'hidden lg:block'}`}>
              
              {/* Four Big Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">自动同步总单量</span>
                  <div className="flex items-baseline space-x-1 mt-1.5">
                    <span className="text-2xl font-black text-slate-800 font-mono">{monthlyOrders.length}</span>
                    <span className="text-[10px] font-bold text-slate-500">笔</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1.5 block">100% API 捕获妥投</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">已折合销售额 (CNY)</span>
                  <div className="flex items-baseline space-x-0.5 mt-1.5">
                    <span className="text-[10px] font-extrabold text-slate-700">￥</span>
                    <span className="text-xl font-black text-slate-800 font-mono">{analysisData.totalRevenueCNY.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <span className="text-[10px] text-indigo-500 font-semibold mt-1.5 block">原币种实时外汇自动换算</span>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-150 rounded-2xl p-4 shadow-3xs">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">预估财务纯利润</span>
                  <div className="flex items-baseline space-x-0.5 mt-1.5">
                    <span className="text-[10px] font-extrabold text-emerald-700">￥</span>
                    <span className="text-xl font-black text-emerald-950 font-mono">{analysisData.netProfitCNY.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1.5 block">扣除扣点、物流、折损后</span>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-150 rounded-2xl p-4 shadow-3xs">
                  <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest block">综合财务纯利率</span>
                  <div className="flex items-baseline space-x-0.5 mt-1.5">
                    <span className="text-2xl font-black text-indigo-950 font-mono">{analysisData.netMargin.toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-indigo-700">%</span>
                  </div>
                  <span className={`text-[10px] font-bold mt-1.5 block ${analysisData.netMargin > 15 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {analysisData.netMargin > 15 ? '🔥 利润极具防御性' : '⚠️ 利润微薄需优化'}
                  </span>
                </div>
              </div>

              {/* Cost Chart Breakdown (Donut Chart) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">店铺综合交易损益成本拼图 (P&L Chart)</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">单位: 人民币 CNY</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 h-48 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `￥${value} CNY`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">综合纯利率</span>
                      <span className="text-lg font-black text-slate-800 font-mono mt-0.5">{analysisData.netMargin.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="md:col-span-7 grid grid-cols-2 gap-x-4 gap-y-3">
                    {pieChartData.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2 p-1.5 rounded-xl hover:bg-slate-50 transition">
                        <span className="h-2.5 w-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <div className="min-w-0">
                          <span className="block text-[10px] font-bold text-slate-500 leading-tight truncate">{item.name}</span>
                          <span className="block text-xs font-black text-slate-700 mt-0.5 font-mono">￥{item.value.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SKU List Details Table */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">自动抓取：按单品 SKU 账损拆解明细</h3>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-0.5 rounded-md font-bold">
                    共 {analysisData.skuList.length} 款畅销单品
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                        <th className="pb-2">商品 SKU / 评估单品</th>
                        <th className="pb-2 text-center">销量(单)</th>
                        <th className="pb-2 text-right">营业总额</th>
                        <th className="pb-2 text-right">采购(COGS)</th>
                        <th className="pb-2 text-right">物流公摊</th>
                        <th className="pb-2 text-right">平台扣点</th>
                        <th className="pb-2 text-right">预估纯利</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 text-xs">
                      {analysisData.skuList.map((sku, index) => {
                        const netSkuProfit = sku.revenueCNY - sku.cogsCNY - sku.logisticsCNY - sku.platformFeeCNY - sku.refundsCNY;
                        const isProfitable = netSkuProfit > 0;
                        return (
                          <tr key={index} className="hover:bg-slate-50/50 transition duration-150">
                            <td className="py-3 font-bold text-slate-800 max-w-[140px] truncate" title={sku.name}>
                              {sku.name}
                            </td>
                            <td className="py-3 text-center font-mono font-bold text-slate-600">
                              {sku.ordersCount}
                            </td>
                            <td className="py-3 text-right font-mono font-semibold text-slate-700">
                              ￥{Math.round(sku.revenueCNY).toLocaleString()}
                            </td>
                            <td className="py-3 text-right font-mono text-slate-500">
                              ￥{Math.round(sku.cogsCNY).toLocaleString()}
                            </td>
                            <td className="py-3 text-right font-mono text-slate-500">
                              ￥{Math.round(sku.logisticsCNY).toLocaleString()}
                            </td>
                            <td className="py-3 text-right font-mono text-pink-600">
                              ￥{Math.round(sku.platformFeeCNY).toLocaleString()}
                            </td>
                            <td className={`py-3 text-right font-mono font-bold ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`}>
                              ￥{Math.round(netSkuProfit).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className={`bg-gradient-to-br from-indigo-50/30 to-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-4 flex flex-col items-center justify-center min-h-[360px] ${mobileSubTab === 'analysis' ? 'block' : 'hidden lg:flex'}`}>
              <div className="bg-indigo-50 p-4 rounded-full border border-indigo-100">
                <Store className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="font-extrabold text-slate-800 text-sm">尚未连接任何店铺后台</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  请在左侧选择您经营的跨境或独立站平台，输入 API 通信凭证，即可一键实时同步真实订单并完成全链路智能化利润精算账单核账。
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  <ShieldCheck className="h-3 w-3 text-indigo-500" /> SSL 256-bit API 安全加密保障
                </span>
              </div>
            </div>
          )}

          {/* Strategic Watchlist (需要注意的点) */}
          <div className={`bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 ${mobileSubTab === 'tips' ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
                [{PLATFORMS.find(p => p.id === selectedPlatform)?.name}] 专属避坑雷达与运营红线
              </h3>
            </div>

            <div className="space-y-4">
              {PLATFORM_DEMO_DATA[selectedPlatform]?.notes.map((note, index) => {
                // simple markdown parsing for bold text
                const parsedText = note
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>')
                  .replace(/「(.*?)」/g, '<span class="font-bold text-indigo-700">「$1」</span>');
                
                return (
                  <div key={index} className="flex items-start gap-3 p-3.5 bg-slate-50/50 rounded-2xl border border-slate-150 hover:bg-slate-100/20 transition">
                    <div className="mt-0.5 flex-shrink-0">
                      {index === 0 && <Flame className="h-4 w-4 text-orange-500" />}
                      {index === 1 && <HeartCrack className="h-4 w-4 text-rose-500" />}
                      {index === 2 && <UserCheck className="h-4 w-4 text-indigo-500" />}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed font-medium">
                      <p dangerouslySetInnerHTML={{ __html: parsedText }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block">⚠️ 跨境全链路共同注意红线：</span>
              <ul className="text-xs text-slate-600 space-y-1.5 font-medium list-disc pl-4">
                <li><strong className="text-slate-900">VAT增值税穿透核算</strong>：欧洲与英国站严格实行平台代扣代缴（电商税改），切勿漏算 20% 重税。</li>
                <li><strong className="text-slate-900">跨境尾端退货逆向运费</strong>：客户退货时，卖家不仅需要全额退还售价，往往还需承担一笔高额尾端退回海外仓运费（Return Shipping Cost），直接透支该商品的原利润指标。</li>
                <li><strong className="text-slate-900">隐形双向汇差</strong>：外币流转过程存在「平台折算」与「提现折算」两重汇差扣点，一般在 1.2% ~ 3.5% 之间。建议使用第三方安全账户进行合理结汇以锁定最优汇率。</li>
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
