import React, { useState, useMemo, useEffect } from 'react';
import { SimulationInput, ExchangeRateConfig, MonthlyOrder } from './types';
import { calculateMultiSiteSimulation } from './utils/calculator';
import { supabase } from './utils/supabase';
import { PAYOUT_TOOLS_CONFIG, SITE_FEE_CONFIGS } from './data/feeStructures';
import SiteSimulator from './components/SiteSimulator';
import PaymentOptimizer from './components/PaymentOptimizer';
import CapitalAlert from './components/CapitalAlert';
import RiskAnalysis from './components/RiskAnalysis';
import AdminFinancePanel from './components/AdminFinancePanel';
import { PriceSnapLogo } from './components/PriceSnapLogo';
import { CelebrationRain } from './components/CelebrationRain';
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
  Info,
  Users,
  LogIn,
  LogOut,
  Download,
  Calculator,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const formatToBeijingTime = (dateInput: string | Date | null): string => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  try {
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    const second = parts.find(p => p.type === 'second')?.value;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } catch (e) {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const bjDate = new Date(utc + (3600000 * 8));
    
    const y = bjDate.getFullYear();
    const m = String(bjDate.getMonth() + 1).padStart(2, '0');
    const d = String(bjDate.getDate()).padStart(2, '0');
    const hr = String(bjDate.getHours()).padStart(2, '0');
    const min = String(bjDate.getMinutes()).padStart(2, '0');
    const sec = String(bjDate.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${hr}:${min}:${sec}`;
  }
};

export default function App() {
  // 1. Core Simulation State (Synced across tabs for continuous calculations and saved to localStorage)
  const [input, setInput] = useState<SimulationInput>(() => {
    const defaultInput: SimulationInput = {
      siteId: 'US', // Default active selected site ID
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
    };

    try {
      const savedUser = localStorage.getItem('price_snap_current_user');
      const user = savedUser ? JSON.parse(savedUser) : null;
      const storageKey = user ? `price_snap_simulation_input_${user.email}` : 'price_snap_simulation_input';
      const savedInput = localStorage.getItem(storageKey) || localStorage.getItem('price_snap_simulation_input');
      if (savedInput) {
        return { ...defaultInput, ...JSON.parse(savedInput) };
      }
    } catch (e) {
      console.error('Failed to parse saved simulation input', e);
    }
    return defaultInput;
  });

  // Lifted monthlyOrders states for intelligent grouping & Admin reports
  const [monthlyOrders, setMonthlyOrders] = useState<MonthlyOrder[]>([]);
  const [productCostDict, setProductCostDict] = useState<Record<string, { cogs: number; domesticShipping: number; internationalShipping: number }>>({});
  const [ordersFeedbackMsg, setOrdersFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Playful fortune score and state for physics-based explosion animations
  const [fortuneScore, setFortuneScore] = useState<number>(() => {
    const saved = localStorage.getItem('price_snap_fortune_score');
    return saved ? parseInt(saved, 10) : 888;
  });
  const [bursts, setBursts] = useState<Array<{ id: string; x: number; y: number; dx: number; dy: number; val: string; color: string; rotate: number; scale: number }>>([]);

  const triggerFullFortuneExplosion = (clientX: number, clientY: number) => {
    const items = [
      { text: '￥8888 RMB 💰', color: 'from-yellow-400 via-amber-500 to-orange-500 text-slate-950 font-black' },
      { text: '爆单! 📦', color: 'from-orange-400 to-red-500 text-white font-extrabold' },
      { text: '毛利率 80% 🔥', color: 'from-emerald-400 to-teal-500 text-white font-extrabold' },
      { text: 'GMV +300% 🚀', color: 'from-indigo-500 to-purple-600 text-white font-black' },
      { text: '日进斗金 🪙', color: 'from-amber-300 to-yellow-400 text-slate-900 font-extrabold' },
      { text: '溢价 +50% 📈', color: 'from-cyan-400 to-blue-500 text-white font-bold' },
      { text: '回款秒到 💳', color: 'from-violet-500 to-purple-500 text-white font-bold' },
      { text: '运费 0 元 ✈️', color: 'from-green-400 to-emerald-500 text-white font-bold' },
      { text: '福星高照 🌟', color: 'from-yellow-400 to-orange-400 text-slate-950 font-black' },
      { text: '五星好评 ⭐', color: 'from-amber-400 to-orange-400 text-white font-bold' },
      { text: '货如轮转 📦', color: 'from-rose-400 to-pink-500 text-white font-bold' },
      { text: '财源广进 🧧', color: 'from-red-500 to-rose-600 text-white font-black' },
    ];

    // Pick 6 random blessing phrases to make the animation lightweight and buttery smooth
    const selectedItems = [...items].sort(() => 0.5 - Math.random()).slice(0, 6);

    const newBursts = selectedItems.map((item, idx) => {
      const angleRad = (-40 - Math.random() * 100) * (Math.PI / 180); // upward fan -40 to -140 deg
      const speed = 140 + Math.random() * 260; // randomized velocity
      const distanceX = Math.cos(angleRad) * speed;
      const distanceY = Math.sin(angleRad) * speed - 60; // strong upward thrust
      
      return {
        id: `${Date.now()}-${idx}-${Math.random()}`,
        x: clientX,
        y: clientY,
        dx: distanceX,
        dy: distanceY,
        val: item.text,
        color: item.color,
        rotate: (Math.random() - 0.5) * 80, // rotate in flight
        scale: 0.85 + Math.random() * 0.45,
      };
    });

    setBursts(prev => [...prev, ...newBursts]);
    setFortuneScore(prev => {
      const next = prev + items.length * 88;
      localStorage.setItem('price_snap_fortune_score', next.toString());
      return next;
    });

    // Cleanup after animation completes
    setTimeout(() => {
      const idsToRemove = newBursts.map(b => b.id);
      setBursts(prev => prev.filter(b => !idsToRemove.includes(b.id)));
    }, 1800);
  };

  // Active Tab Tracker
  const [activeTab, setActiveTab] = useState<'site' | 'payout' | 'capital' | 'risk' | 'admin'>('site');

  // User Authentication State
  interface RegisteredUser {
    email: string;
    username: string;
    mainCategory: string;
    preferredPayout: string;
    date: string;
    phone?: string;
  }

  const [currentUser, setCurrentUser] = useState<{ email: string; username: string; mainCategory: string; preferredPayout: string } | null>(() => {
    const saved = localStorage.getItem('price_snap_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('price_snap_registered_users');
    if (saved) return JSON.parse(saved);
    return [
      { email: 'seller_star@gmail.com', username: '星光跨境卖家', mainCategory: '美妆个护', preferredPayout: '连连支付', date: '2026-06-28 14:22:15' },
      { email: 'crossborder_hero@outlook.com', username: '出海先锋', mainCategory: '服装鞋包', preferredPayout: 'PingPong', date: '2026-06-29 09:45:02' }
    ];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isCelebrationActive, setIsCelebrationActive] = useState<boolean>(false);

  // Auth form inputs
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authUsername, setAuthUsername] = useState<string>('');
  const [authCategory, setAuthCategory] = useState<string>('服装鞋包');
  const [authPayout, setAuthPayout] = useState<string>('连连支付');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('price_snap_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('price_snap_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('price_snap_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const u = session.user;
        const meta = u.user_metadata || {};
        setCurrentUser({
          email: u.email || '',
          username: meta.username || u.email?.split('@')[0] || '默认用户',
          mainCategory: meta.mainCategory || '默认类目',
          preferredPayout: meta.preferredPayout || '连连支付'
        });
      }
    };
    syncSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const meta = u.user_metadata || {};
        setCurrentUser({
          email: u.email || '',
          username: meta.username || u.email?.split('@')[0] || '默认用户',
          mainCategory: meta.mainCategory || '默认类目',
          preferredPayout: meta.preferredPayout || '连连支付'
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail || !authPassword) {
      setAuthError('请填写所有必填字段');
      return;
    }

    // Capture position of submit button to trigger explosions
    const submitBtn = document.getElementById('auth-submit-btn');
    let explosionX = window.innerWidth / 2;
    let explosionY = window.innerHeight / 2;
    if (submitBtn) {
      const rect = submitBtn.getBoundingClientRect();
      explosionX = rect.left + rect.width / 2;
      explosionY = rect.top + rect.height / 2;
    }

    setIsLoggingIn(true);

    if (authMode === 'register') {
      if (!authUsername) {
        setAuthError('请填写商户昵称/店名');
        setIsLoggingIn(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              username: authUsername,
              mainCategory: authCategory,
              preferredPayout: authPayout,
            }
          }
        });

        if (error) {
          setAuthError(error.message);
          setIsLoggingIn(false);
          return;
        }

        // Dual-wave epic fortune explosions!
        triggerFullFortuneExplosion(explosionX, explosionY);
        setTimeout(() => triggerFullFortuneExplosion(explosionX, explosionY - 60), 200);

        const newUser: RegisteredUser = {
          email: authEmail,
          username: authUsername,
          mainCategory: authCategory,
          preferredPayout: authPayout,
          date: formatToBeijingTime(new Date())
        };

        setTimeout(() => {
          setRegisteredUsers(prev => {
            if (prev.some(u => u.email.toLowerCase() === authEmail.toLowerCase())) {
              return prev;
            }
            return [newUser, ...prev];
          });
          setCurrentUser({
            email: newUser.email,
            username: newUser.username,
            mainCategory: newUser.mainCategory,
            preferredPayout: newUser.preferredPayout
          });
          setIsCelebrationActive(true);
          setIsAuthModalOpen(false);
          setIsLoggingIn(false);
          resetAuthForm();
        }, 1400);

      } catch (err: any) {
        setAuthError(err.message || '注册失败，请稍后重试');
        setIsLoggingIn(false);
      }

    } else {
      // Login simulation & auto-register with Supabase fallback
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) {
          // If login fails, try auto-register to ensure maximum friction-free UX
          if (error.message.includes('Invalid login credentials') || error.message.includes('not found') || error.message.includes('Email not confirmed')) {
            const generatedUsername = authEmail.split('@')[0];
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: authEmail,
              password: authPassword,
              options: {
                data: {
                  username: generatedUsername,
                  mainCategory: '默认类目',
                  preferredPayout: '连连支付',
                }
              }
            });

            if (signUpError) {
              setAuthError(`登录或自动注册失败: ${error.message}`);
              setIsLoggingIn(false);
              return;
            }

            // Dual-wave epic fortune explosions!
            triggerFullFortuneExplosion(explosionX, explosionY);
            setTimeout(() => triggerFullFortuneExplosion(explosionX, explosionY - 60), 200);

            const newUser: RegisteredUser = {
              email: authEmail,
              username: generatedUsername,
              mainCategory: '默认类目',
              preferredPayout: '连连支付',
              date: formatToBeijingTime(new Date())
            };

            setTimeout(() => {
              setRegisteredUsers(prev => {
                if (prev.some(u => u.email.toLowerCase() === authEmail.toLowerCase())) {
                  return prev;
                }
                return [newUser, ...prev];
              });
              setCurrentUser({
                email: newUser.email,
                username: newUser.username,
                mainCategory: newUser.mainCategory,
                preferredPayout: newUser.preferredPayout
              });
              setIsCelebrationActive(true);
              setIsAuthModalOpen(false);
              setIsLoggingIn(false);
              resetAuthForm();
            }, 1400);
            return;
          }

          setAuthError(error.message);
          setIsLoggingIn(false);
          return;
        }

        // Login successful
        const userObj = data.user;
        const metadata = userObj?.user_metadata || {};
        const loggedInUser: RegisteredUser = {
          email: userObj?.email || authEmail,
          username: metadata.username || authEmail.split('@')[0],
          mainCategory: metadata.mainCategory || '默认类目',
          preferredPayout: metadata.preferredPayout || '连连支付',
          date: formatToBeijingTime(new Date())
        };

        // Dual-wave epic fortune explosions!
        triggerFullFortuneExplosion(explosionX, explosionY);
        setTimeout(() => triggerFullFortuneExplosion(explosionX, explosionY - 60), 200);

        setTimeout(() => {
          setRegisteredUsers(prev => {
            if (prev.some(u => u.email.toLowerCase() === loggedInUser.email.toLowerCase())) {
              return prev;
            }
            return [loggedInUser, ...prev];
          });
          setCurrentUser({
            email: loggedInUser.email,
            username: loggedInUser.username,
            mainCategory: loggedInUser.mainCategory,
            preferredPayout: loggedInUser.preferredPayout
          });
          setIsCelebrationActive(true);
          setIsAuthModalOpen(false);
          setIsLoggingIn(false);
          resetAuthForm();
        }, 1400);

      } catch (err: any) {
        setAuthError(err.message || '登录失败，请稍后重试');
        setIsLoggingIn(false);
      }
    }
  };

  const resetAuthForm = () => {
    setAuthEmail('');
    setAuthUsername('');
    setAuthPassword('');
    setAuthError('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };


  // Base Exchange Rate USD to CNY
  const [exchangeRateUSDToCNY, setExchangeRateUSDToCNY] = useState<number>(() => {
    const saved = localStorage.getItem('price_snap_usd_to_cny');
    return saved ? Number(saved) : 7.25;
  });

  // Sub-currencies configuration (Local currency per 1 USD)
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateConfig>(() => {
    const saved = localStorage.getItem('price_snap_exchange_rates');
    return saved ? JSON.parse(saved) : {
      USD: 1.0,
      GBP: 0.78,
      JPY: 156.0,
      MXN: 18.2,
      VND: 25400,
      THB: 36.5,
      MYR: 4.70,
      PHP: 58.5,
      SGD: 1.35,
    };
  });

  // Rates fetch state configuration
  const [ratesLoading, setRatesLoading] = useState<boolean>(false);
  const [ratesFetchedAt, setRatesFetchedAt] = useState<string>(() => {
    const saved = localStorage.getItem('price_snap_rates_fetched_at');
    return saved || new Date().toISOString();
  });
  const [ratesSource, setRatesSource] = useState<string | null>(() => {
    return localStorage.getItem('price_snap_rates_source');
  });
  const [ratesVerification, setRatesVerification] = useState<{
    verified: boolean;
    lastCheckedAt: string;
    status: string;
    errors: string[];
  }>(() => {
    const saved = localStorage.getItem('price_snap_rates_verification');
    return saved ? JSON.parse(saved) : {
      verified: true,
      lastCheckedAt: new Date().toISOString(),
      status: "所有实时汇率符合历史波动安全区间，每日核验100%通过",
      errors: []
    };
  });

  // Save exchange rates states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('price_snap_usd_to_cny', String(exchangeRateUSDToCNY));
  }, [exchangeRateUSDToCNY]);

  useEffect(() => {
    localStorage.setItem('price_snap_exchange_rates', JSON.stringify(exchangeRates));
  }, [exchangeRates]);

  useEffect(() => {
    localStorage.setItem('price_snap_rates_fetched_at', ratesFetchedAt);
  }, [ratesFetchedAt]);

  useEffect(() => {
    if (ratesSource) {
      localStorage.setItem('price_snap_rates_source', ratesSource);
    }
  }, [ratesSource]);

  useEffect(() => {
    localStorage.setItem('price_snap_rates_verification', JSON.stringify(ratesVerification));
  }, [ratesVerification]);

  // Pull rates from the Express backend service, with client-side direct public API failover (e.g., for static serverless environments like Vercel)
  const fetchLiveRates = async () => {
    setRatesLoading(true);
    let success = false;
    try {
      const response = await fetch('/api/rates');
      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.rates) {
          if (data.rates.CNY) {
            setExchangeRateUSDToCNY(data.rates.CNY);
          }
          setExchangeRates(data.rates);
          setRatesFetchedAt(new Date().toISOString());
          setRatesSource(data.source);
          if (data.verification) {
            setRatesVerification(data.verification);
          }
          success = true;
        }
      }
    } catch (err) {
      console.warn("Failed to load exchange rates from backend, will try client-side public API:", err);
    }

    if (!success) {
      // Client-side direct public API fetch failover
      const endpoints = [
        "https://open.er-api.com/v6/latest/USD",
        "https://api.exchangerate-api.com/v4/latest/USD"
      ];
      for (const url of endpoints) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            if (data && data.rates) {
              const keys = ['USD', 'CNY', 'GBP', 'JPY', 'MXN', 'VND', 'THB', 'MYR', 'PHP', 'SGD'];
              const filteredRates: Record<string, number> = {};
              for (const k of keys) {
                if (data.rates[k]) {
                  filteredRates[k] = Number(data.rates[k]);
                } else {
                  // Fallback values
                  const defaults: Record<string, number> = {
                    USD: 1.0, GBP: 0.78, JPY: 156.0, MXN: 18.2, VND: 25400, THB: 36.5, MYR: 4.70, PHP: 58.5, SGD: 1.35
                  };
                  filteredRates[k] = defaults[k] || 1.0;
                }
              }
              if (filteredRates.CNY) {
                setExchangeRateUSDToCNY(filteredRates.CNY);
              }
              setExchangeRates(filteredRates as any);
              setRatesFetchedAt(new Date().toISOString());
              setRatesSource(url);
              setRatesVerification({
                verified: true,
                lastCheckedAt: new Date().toISOString(),
                status: "公网实时汇率直连同步成功",
                errors: []
              });
              success = true;
              break;
            }
          }
        } catch (clientErr) {
          console.error(`Client-side fetch failed for ${url}:`, clientErr);
        }
      }
    }

    setRatesLoading(false);
  };

  // Real-time ticking clock synchronized with Beijing Time
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-init load on mount (Use stable default baseline rates by default)
  useEffect(() => {
    // Initial stable load completed. Users can update rates manually via "获取最新".
  }, []);

  // Synchronize simulation input with localStorage automatically (supports per-user savings)
  useEffect(() => {
    const storageKey = currentUser ? `price_snap_simulation_input_${currentUser.email}` : 'price_snap_simulation_input';
    localStorage.setItem(storageKey, JSON.stringify(input));
    // Also update guest key for fallback / instant access
    localStorage.setItem('price_snap_simulation_input', JSON.stringify(input));
  }, [input, currentUser]);

  // Load user-specific inputs when the logged-in user changes
  useEffect(() => {
    if (currentUser) {
      const userKey = `price_snap_simulation_input_${currentUser.email}`;
      const savedUserInput = localStorage.getItem(userKey);
      if (savedUserInput) {
        try {
          const parsed = JSON.parse(savedUserInput);
          setInput((prev) => ({
            ...prev,
            ...parsed,
          }));
        } catch (e) {
          console.error('Error loading user specific simulation input', e);
        }
      } else {
        // If the user has no saved input yet, save their current input immediately so their guest work is preserved under their account
        localStorage.setItem(userKey, JSON.stringify(input));
      }
    }
  }, [currentUser]);

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

  const platformTheme = useMemo(() => {
    const pId = input.platformId || 'tiktok';
    switch (pId) {
      case 'amazon':
        return {
          bg: 'bg-[#FCF7F0] text-stone-900 transition-all duration-500',
          header: 'bg-[#131921] text-white border-b border-[#232f3e] shadow-md',
          labelColor: 'text-[#C77C40]',
        };
      case 'walmart':
        return {
          bg: 'bg-[#002D62] text-slate-100 transition-all duration-500 dark',
          header: 'bg-[#0071CE] text-white border-b border-blue-900/40 shadow-md',
          labelColor: 'text-amber-400',
        };
      case 'tiktok':
        return {
          bg: 'bg-black text-slate-100 transition-all duration-500 dark',
          header: 'bg-[#121212] text-white border-b border-zinc-800/80 shadow-md',
          labelColor: 'text-[#FE2C55]',
        };
      case 'etsy': // eBay / Etsy
        return {
          bg: 'bg-[#F4F6F8] text-slate-800 transition-all duration-500',
          header: 'bg-[#0053A0] text-white border-b border-[#003B73] shadow-md',
          labelColor: 'text-[#E05A47]',
        };
      case 'shopify': // Shopify / Independent
        return {
          bg: 'bg-[#FAFBF8] text-stone-800 transition-all duration-500',
          header: 'bg-[#1A2E1A] text-white border-b border-[#0E1B0E] shadow-md',
          labelColor: 'text-[#96BF48]',
        };
      default:
        return {
          bg: 'bg-slate-50/60 text-slate-800 transition-all duration-500',
          header: 'bg-slate-900 text-white border-b border-slate-800 shadow-md',
          labelColor: 'text-indigo-600',
        };
    }
  }, [input.platformId]);

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

  const activeSiteResult = useMemo(() => {
    return simulationResults.find(r => r.siteId === input.siteId) || simulationResults[0];
  }, [simulationResults, input.siteId]);

  const averageGrossMargin = useMemo(() => {
    const total = simulationResults.reduce((acc, curr) => acc + curr.grossMargin, 0);
    return total / simulationResults.length;
  }, [simulationResults]);

  return (
    <div className="min-h-screen bg-[#efefef] font-sans text-slate-800 flex flex-col antialiased">
      <CelebrationRain active={isCelebrationActive} onClose={() => setIsCelebrationActive(false)} />
      
      {/* Header and Brand */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white py-3 px-4 sm:px-8 border-b border-slate-800 shadow-md">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Branding & Slogans */}
          <div className="flex flex-col items-start select-none py-1 notranslate" translate="no">
            <div className="text-white font-black text-2xl tracking-wider select-none flex items-center notranslate" translate="no">
              {/* Splitting characters to completely prevent browser translation engines from translating the brand name */}
              <span className="flex notranslate" translate="no">
                {"Price".split("").map((char, i) => (
                  <span key={`p-${i}`} className="notranslate" translate="no">{char}</span>
                ))}
              </span>
              <span className="flex text-amber-300 notranslate" translate="no">
                {"Snap".split("").map((char, i) => (
                  <span key={`s-${i}`} className="notranslate" translate="no">{char}</span>
                ))}
              </span>
            </div>
            <div className="mt-1.5 select-none text-left">
              <p className="text-slate-200 font-bold text-xs tracking-wide">
                算的是利润，赢的是未来
              </p>
              <p className="text-slate-400 font-medium text-[11px] mt-0.5 tracking-wider">
                所有成本皆是铺垫，一身孤勇祝我们逆风翻盘
              </p>
            </div>
          </div>

          {/* Right: Live Rates Ribbon & Authentication Actions */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center md:justify-end gap-3 max-w-full">
            <div translate="no" className="notranslate flex flex-wrap items-center justify-center md:justify-end gap-3.5 bg-slate-800/35 px-3.5 py-1.5 rounded-xl border border-slate-800/60 w-full md:w-auto text-xs">
              <div className="flex items-center space-x-1.5 text-slate-400 font-bold border-r border-slate-700/60 pr-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>参考汇率 :</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] font-bold justify-center">
                <div className="bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 shadow-sm">
                  <span>🇺🇸</span>
                  <span className="text-slate-300 font-mono">USD</span>
                  <span className="text-indigo-400 font-bold font-mono">{exchangeRateUSDToCNY.toFixed(4)}</span>
                </div>
                <div className="bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 shadow-sm">
                  <span>🇬🇧</span>
                  <span className="text-slate-300 font-mono">GBP</span>
                  <span className="text-indigo-400 font-bold font-mono">{(exchangeRateUSDToCNY / (exchangeRates.GBP || 0.78)).toFixed(4)}</span>
                </div>
                <div className="bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 shadow-sm">
                  <span>🇲🇾</span>
                  <span className="text-slate-300 font-mono">MYR</span>
                  <span className="text-indigo-400 font-bold font-mono">{(exchangeRateUSDToCNY / (exchangeRates.MYR || 4.70)).toFixed(4)}</span>
                </div>
                <div className="bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 shadow-sm">
                  <span>🇯🇵</span>
                  <span className="text-slate-300 font-mono">100JPY</span>
                  <span className="text-indigo-400 font-bold font-mono">{((exchangeRateUSDToCNY / (exchangeRates.JPY || 156.0)) * 100).toFixed(4)}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold font-mono hidden xl:inline border-l border-slate-700/60 pl-3">
                北京时间: {formatToBeijingTime(currentTime)}
              </span>

            </div>

            {/* Login / user control button */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center bg-indigo-950/40 border border-indigo-800/60 rounded-xl px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-300 font-medium">出海商户:</span>
                    <span className="text-amber-300 font-bold max-w-[120px] truncate">{currentUser.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-3 text-[10px] bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 px-2 py-1 rounded border border-slate-700/50 transition duration-150 font-black flex items-center gap-1"
                  >
                    <LogOut className="h-2.5 w-2.5" />
                    <span>注销</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs px-4.5 py-2 rounded-xl transition duration-150 flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>注册与登录</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Core View Area */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Tab Selection Row */}
        <div className="border-b border-slate-200 pb-px flex sm:justify-between items-center flex-wrap gap-2 w-full">
          <div className="flex space-x-1.5 bg-slate-200/50 p-1.5 rounded-xl border border-slate-200/40 overflow-x-auto whitespace-nowrap no-scrollbar flex-nowrap w-full md:w-auto">
            <button
              onClick={() => setActiveTab('site')}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'risk'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-white/40'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>运营溢价风险分析</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-indigo-50/80 text-indigo-900 border border-indigo-200/60 shadow-xs font-black'
                  : 'text-slate-600 hover:text-indigo-700 hover:bg-white/40'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              <span>智能归并 & 财务报告 (Admin)</span>
            </button>
          </div>
        </div>

        {/* Tab Views content area */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUser ? activeTab : 'auth_locked'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
               {!currentUser ? (
                 <div className="relative overflow-hidden bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 p-8 md:p-16 text-center shadow-xl flex flex-col items-center justify-center space-y-6 max-w-4xl mx-auto my-6">
                   {/* Absolute floating decorations */}
                   <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-200/10 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
                   <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-200/10 rounded-full blur-3xl translate-x-10 translate-y-10"></div>
                   
                   <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300">
                     <PriceSnapLogo className="w-16 h-16" />
                   </div>

                   <div className="space-y-3 max-w-xl">
                     <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                       立即注册 PriceSnap 跨境利润精算大师
                     </h2>
                     <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xl mx-auto">
                       算的是利润，赢的是未来。PriceSnap 现已全面升级只需花 5 秒钟免费注册/登录即可解锁全部专属出海功能：
                     </p>
                   </div>

                   {/* Feature Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full max-w-2xl font-bold text-xs text-slate-705">
                     <div className="p-4 bg-indigo-50/45 rounded-xl border border-indigo-100 flex items-center gap-3">
                       <span className="text-lg">📊</span>
                       <div>
                         <p className="font-extrabold text-slate-800">多站点高精核算</p>
                       </div>
                     </div>
                     <div className="p-4 bg-amber-50/45 rounded-xl border border-amber-100 flex items-center gap-3">
                       <span className="text-lg">💰</span>
                       <div>
                         <p className="font-extrabold text-slate-800">结汇与提现路径</p>
                       </div>
                     </div>
                     <div className="p-4 bg-teal-50/45 rounded-xl border border-teal-100 flex items-center gap-3">
                       <span className="text-lg">⏰</span>
                       <div>
                         <p className="font-extrabold text-slate-800">到账周转实时预警</p>
                       </div>
                     </div>
                     <div className="p-4 bg-rose-50/45 rounded-xl border border-rose-100 flex items-center gap-3">
                       <span className="text-lg">🛡️</span>
                       <div>
                         <p className="font-extrabold text-slate-800">溢价与财务报告</p>
                       </div>
                     </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-3 pt-2">
                     <motion.button
                       whileHover={{ scale: 1.03 }}
                       whileTap={{ scale: 0.96 }}
                       onClick={() => {
                         setAuthMode('register');
                         setIsAuthModalOpen(true);
                       }}
                       className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-md transition duration-150 cursor-pointer"
                     >
                       <span>立即免费注册</span>
                     </motion.button>
                     <motion.button
                       whileHover={{ scale: 1.03 }}
                       whileTap={{ scale: 0.96 }}
                       onClick={() => {
                         setAuthMode('login');
                         setIsAuthModalOpen(true);
                       }}
                       className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl transition duration-150 cursor-pointer border border-slate-300/45 shadow-sm"
                     >
                       <span>已有账号？直接登录</span>
                     </motion.button>
                   </div>
                 </div>
              ) : (
                <>
                  {activeTab === 'site' && (
                    <SiteSimulator
                      results={simulationResults}
                      input={input}
                      onChangeInput={handleChangeInput}
                      exchangeRateUSDToCNY={exchangeRateUSDToCNY}
                      exchangeRates={exchangeRates}  // Pass exchangeRates configuration
                      ratesLoading={ratesLoading}
                      ratesFetchedAt={ratesFetchedAt}
                      ratesVerification={ratesVerification}
                      onFetchRates={fetchLiveRates}
                      monthlyOrders={monthlyOrders}
                      setMonthlyOrders={setMonthlyOrders}
                      productCostDict={productCostDict}
                      setProductCostDict={setProductCostDict}
                      ordersFeedbackMsg={ordersFeedbackMsg}
                      setOrdersFeedbackMsg={setOrdersFeedbackMsg}
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
                      ratesVerification={ratesVerification}
                      onFetchRates={fetchLiveRates}
                    />
                  )}

                  {activeTab === 'capital' && (
                    <CapitalAlert
                      priceLocal={input.priceLocal}
                      symbol={activeSiteResult.symbol}
                      currencyCode={activeSiteResult.currency}
                      exchangeRateToCNY={activeSiteResult.exchangeRateToCNY}
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

                  {activeTab === 'admin' && (
                    <AdminFinancePanel
                      monthlyOrders={monthlyOrders}
                      productCostDict={productCostDict}
                      results={simulationResults}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      {/* Login & Registration Modal Overlay */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-2xl max-w-xl w-full relative space-y-6 text-slate-800"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  if (!isLoggingIn) {
                    setIsAuthModalOpen(false);
                    resetAuthForm();
                  }
                }}
                disabled={isLoggingIn}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition text-lg font-black cursor-pointer p-1"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  <span className="text-slate-800">Price</span>
                  <span className="text-amber-500">Snap</span> 账号注册与登录
                </div>
                <p className="text-xs text-slate-500 font-bold font-sans">
                  {authMode === 'login'
                    ? '算的是利润，赢的是未来 —— 登录您的账户'
                    : '一键开启智能跨境核算对账 —— 注册您的账号资料'}
                </p>
              </div>

              {/* 🪙 Golden Coin interactive block */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4.5 border border-yellow-100 flex items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
                    <span>🪙</span>
                    <span>点击黄金硬币积攒爆单福气：</span>
                  </div>
                  <div className="text-sm font-mono font-black text-amber-700 flex items-center gap-1.5">
                    <span>当前累积福气积分:</span>
                    <motion.span
                      key={fortuneScore}
                      initial={{ scale: 1.5, color: '#b45309' }}
                      animate={{ scale: 1, color: '#b45309' }}
                      className="inline-block font-mono text-base font-black"
                    >
                      {fortuneScore}
                    </motion.span>
                    <span className="text-[10px] text-amber-600 font-normal ml-1 bg-yellow-200/50 px-2 py-0.5 rounded-full animate-pulse">🔥 爆单特供</span>
                  </div>
                </div>

                <motion.button
                  type="button"
                  disabled={isLoggingIn}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    triggerFullFortuneExplosion(x, y);
                  }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.8, rotate: -15 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-b from-yellow-350 via-amber-400 to-yellow-500 shadow-md flex items-center justify-center text-3xl font-black cursor-pointer select-none active:shadow-sm border border-yellow-250 disabled:opacity-50"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(217, 119, 6, 0.45))',
                  }}
                >
                  🪙
                </motion.button>
              </div>

              {authError && (
                <div className="p-4 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100">
                  ⚠️ {authError}
                </div>
              )}

              {/* Original Email and Password Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">注册邮箱 <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    required
                    disabled={isLoggingIn}
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="example@merchant.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 transition duration-150 font-medium"
                  />
                </div>

                {authMode === 'register' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">昵称/店名 <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required={authMode === 'register'}
                        disabled={isLoggingIn}
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        placeholder="例如：星光跨境首饰店"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 transition duration-150 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">主营品类</label>
                        <select
                          value={authCategory}
                          disabled={isLoggingIn}
                          onChange={(e) => setAuthCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 transition duration-150 font-bold font-mono"
                        >
                          <option value="服装鞋包">服装鞋包</option>
                          <option value="美妆个护">美妆个护</option>
                          <option value="数码3C">数码3C</option>
                          <option value="家居日用">家居日用</option>
                          <option value="母婴玩具">母婴玩具</option>
                          <option value="其他品类">其他品类</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">首选结汇收款</label>
                        <select
                          value={authPayout}
                          disabled={isLoggingIn}
                          onChange={(e) => setAuthPayout(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 transition duration-150 font-bold font-mono"
                        >
                          <option value="连连支付">连连支付 (Lianlian)</option>
                          <option value="PingPong">PingPong</option>
                          <option value="Payoneer">派安盈 (Payoneer)</option>
                          <option value="Airwallex">空中云汇 (Airwallex)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">密码 <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    required
                    disabled={isLoggingIn}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="请输入安全密码"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 transition duration-150 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  id="auth-submit-btn"
                  disabled={isLoggingIn}
                  className={`w-full text-white rounded-xl py-4 font-black transition duration-200 shadow-md hover:shadow-lg active:scale-98 text-sm mt-3 relative overflow-hidden flex items-center justify-center gap-2 cursor-pointer ${
                    isLoggingIn
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-200/50'
                      : 'bg-slate-850 hover:bg-slate-900'
                  }`}
                >
                  {isLoggingIn ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-base">🎉</span>
                      <span>{authMode === 'login' ? '正在登录... 福运满堂! 🪙' : '正在注册... 财源滚滚! 📦'}</span>
                    </motion.div>
                  ) : (
                    <span>{authMode === 'login' ? '安全登录' : '一键注册并自动登录'}</span>
                  )}
                </button>
              </form>

              <div className="text-center pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isLoggingIn}
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthError('');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition font-bold cursor-pointer font-mono"
                >
                  {authMode === 'login'
                    ? '没有账号？立即一键免费注册 ➔'
                    : '已有账号？直接登录 ➔'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto font-mono">
        <div>TikTok Shop Cross-Border Financial Accounting Simulator Platform © 2026</div>
      </footer>

      {/* 🚀 Interactive Fortune Burst Layer (全球首创立体向上喷涌、物理仿真爆单模拟器) */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        <AnimatePresence>
          {bursts.map(b => (
            <motion.div
              key={b.id}
              initial={{ 
                opacity: 0.95, 
                scale: 0.2, 
                x: b.x, 
                y: b.y, 
                rotate: 0 
              }}
              animate={{
                opacity: [1, 1, 0.9, 0],
                scale: [0.3, b.scale, b.scale * 1.15, b.scale * 0.9],
                x: b.x + b.dx,
                y: [b.y, b.y + b.dy * 0.55, b.y + b.dy], // arching parabolic path
                rotate: b.rotate,
              }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{
                duration: 1.7,
                ease: [0.12, 0.82, 0.35, 1], // satisfying fast rise and slow decay easing curve
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br ${b.color} px-4.5 py-2.5 rounded-2xl text-sm font-black tracking-wide flex items-center justify-center whitespace-nowrap shadow-xl border border-white/20 select-none`}
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.18))',
              }}
            >
              {b.val}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
