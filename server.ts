import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser for POST requests
app.use(express.json());

// Memory cache for exchange rates to avoid hitting rate limits and provide high speed
let cachedRates: {

  rates: Record<string, number>;
  fetchedAt: string;
  source: string;
} | null = null;

// High quality parity fallbacks for 2026
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  CNY: 7.25,
  GBP: 0.78,
  JPY: 156.0,
  MXN: 18.2,
  VND: 25400,
  THB: 36.5,
  MYR: 4.70,
  PHP: 58.5,
  SGD: 1.35
};

// Safe historical limits for exchange rates validation to avoid anomalies (1 USD = X local)
const RATE_BOUNDS: Record<string, { min: number; max: number; label: string }> = {
  USD: { min: 0.99, max: 1.01, label: "美元 (USD)" },
  CNY: { min: 6.0, max: 8.5, label: "人民币 (CNY)" },
  GBP: { min: 0.6, max: 1.0, label: "英镑 (GBP)" },
  JPY: { min: 100.0, max: 200.0, label: "日元 (JPY)" },
  MXN: { min: 12.0, max: 25.0, label: "墨西哥比索 (MXN)" },
  VND: { min: 20000.0, max: 30000.0, label: "越南盾 (VND)" },
  THB: { min: 28.0, max: 45.0, label: "泰铢 (THB)" },
  MYR: { min: 3.5, max: 5.5, label: "马来西亚林吉特 (MYR)" },
  PHP: { min: 45.0, max: 70.0, label: "菲律宾比索 (PHP)" },
  SGD: { min: 1.1, max: 1.6, label: "新加坡元 (SGD)" }
};

let lastVerificationStatus = {
  verified: true,
  lastCheckedAt: new Date().toISOString(),
  status: "汇率数据获取成功",
  errors: [] as string[]
};

// Verify content and audit rate validity
function verifyExchangeRates(rates: Record<string, number>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const [currency, bounds] of Object.entries(RATE_BOUNDS)) {
    const rate = rates[currency];
    if (rate === undefined || rate === null || typeof rate !== "number" || isNaN(rate)) {
      errors.push(`${bounds.label} 汇率缺失或格式不正确`);
    } else if (rate < bounds.min || rate > bounds.max) {
      errors.push(`${bounds.label} 汇率 ${rate} 超出安全波动区间 (${bounds.min} - ${bounds.max})`);
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

// API endpoint to fetch real-time exchange rates (USD based base rates)
app.get("/api/rates", async (req, res) => {
  const cacheDurationMs = 15 * 60 * 1000; // 15 minutes cache
  const now = Date.now();

  if (cachedRates && (now - new Date(cachedRates.fetchedAt).getTime() < cacheDurationMs)) {
    return res.json({
      success: true,
      rates: cachedRates.rates,
      fetchedAt: cachedRates.fetchedAt,
      source: cachedRates.source,
      cached: true,
      verification: lastVerificationStatus
    });
  }

  // List of public exchange rate endpoints to try in sequence for failover redundancy
  const endpoints = [
    "https://open.er-api.com/v6/latest/USD",
    "https://api.exchangerate-api.com/v4/latest/USD"
  ];

  for (const url of endpoints) {
    try {
      console.log(`Fetching exchange rates from of: ${url}...`);
      const response = await fetch(url);
      if (!response.ok) continue;
      
      const data = await response.json();
      if (data && data.rates) {
        // Extract required currencies
        const filteredRates: Record<string, number> = {};
        const keys = Object.keys(FALLBACK_RATES);
        
        for (const k of keys) {
          if (data.rates[k]) {
            filteredRates[k] = Number(data.rates[k]);
          } else {
            filteredRates[k] = FALLBACK_RATES[k]; // fallback if specific is missing
          }
        }

        // Validate content and verify daily rates
        const audit = verifyExchangeRates(filteredRates);
        if (audit.isValid) {
          cachedRates = {
            rates: filteredRates,
            fetchedAt: new Date().toISOString(),
            source: url
          };

          lastVerificationStatus = {
            verified: true,
            lastCheckedAt: new Date().toISOString(),
            status: "汇率数据获取成功",
            errors: []
          };

          return res.json({
            success: true,
            rates: cachedRates.rates,
            fetchedAt: cachedRates.fetchedAt,
            source: cachedRates.source,
            cached: false,
            verification: lastVerificationStatus
          });
        } else {
          console.warn(`Exchange rate validation failed for ${url}:`, audit.errors);
          lastVerificationStatus = {
            verified: false,
            lastCheckedAt: new Date().toISOString(),
            status: "汇率API数据内容异常，已启用安全本位币锚定及备用库",
            errors: audit.errors
          };
        }
      }
    } catch (err) {
      console.error(`Error loading rate from ${url}:`, err);
    }
  }

  // If both endpoints failed, use memory cache fallback or absolute static fallback
  const finalRates = cachedRates ? cachedRates.rates : FALLBACK_RATES;
  const finalFetchedAt = cachedRates ? cachedRates.fetchedAt : new Date().toISOString();
  const finalSource = cachedRates ? `${cachedRates.source} (stale)` : "SAFE Parity static fallback";

  res.json({
    success: true,
    rates: finalRates,
    fetchedAt: finalFetchedAt,
    source: finalSource,
    cached: true,
    isFallback: !cachedRates,
    verification: lastVerificationStatus
  });
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting development backend server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting production backend server...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
