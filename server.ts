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
      cached: true
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

        cachedRates = {
          rates: filteredRates,
          fetchedAt: new Date().toISOString(),
          source: url
        };

        return res.json({
          success: true,
          rates: cachedRates.rates,
          fetchedAt: cachedRates.fetchedAt,
          source: cachedRates.source,
          cached: false
        });
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
    isFallback: !cachedRates
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
