import { SimulationInput, SiteFeeConfig, MultiSiteResult, PayoutTool } from '../types';
import { SITE_FEE_CONFIGS, PAYOUT_TOOLS_CONFIG, SITE_CATEGORIES, SiteCategory } from '../data/feeStructures';

/**
 * Perform multi-site simulation calculations for a given input.
 */
export function calculateMultiSiteSimulation(
  input: SimulationInput,
  exchangeRateUSDToCNY: number,
  customExchangeRates?: Record<string, number>
): MultiSiteResult[] {
  const platformId = input.platformId || 'tiktok';

  return SITE_FEE_CONFIGS.map((site) => {
    // Determine the exchange rate for local currency to 1 USD
    const localToUSDExchangeRate = customExchangeRates && customExchangeRates[site.currency] !== undefined
      ? customExchangeRates[site.currency]
      : site.defaultExchangeRate; // e.g. 156.0 JPY for 1 USD
    
    // Derived rates
    const oneLocalInUSD = 1 / localToUSDExchangeRate;
    // How much 1 local unit equals in CNY
    const localToCNYRate = exchangeRateUSDToCNY / localToUSDExchangeRate;
    // How much 1 CNY equals in local unit
    const cnyToLocalRate = localToUSDExchangeRate / exchangeRateUSDToCNY;

    // Resolve Commission & Payment variables based on Platform and country
    let commissionRate = site.commissionRate;
    let fixedFee = site.fixedFee;
    let transactionRate = site.transactionRate;
    let fixedPaymentFee = 0.0;

    if (platformId === 'tiktok') {
      // Keep original TikTok calculation logic
      const categoriesForSite = SITE_CATEGORIES[site.id] || [];
      const activeCategory = categoriesForSite.find(c => c.id === input.category) || categoriesForSite[0] || null;
      commissionRate = activeCategory ? activeCategory.commissionRate : site.commissionRate;
      fixedFee = activeCategory ? activeCategory.fixedFee : site.fixedFee;
      transactionRate = site.transactionRate || 0.025;
      fixedPaymentFee = (site.id === 'US' || site.id === 'UK') ? 0.30 : 0.0;
    } else if (platformId === 'amazon') {
      // Amazon Commission logic based on categories
      fixedFee = 0.30; // Default minimum commission ($0.30)
      if (site.id === 'CA') fixedFee = 0.40;
      else if (site.id === 'MX') fixedFee = 5.0;
      else if (site.id === 'UK') fixedFee = 0.30;
      else if (['DE', 'FR', 'IT', 'ES'].includes(site.id)) fixedFee = 0.30;
      else if (site.id === 'JP') fixedFee = 30.0;

      // Select commission rate
      if (input.category === 'electronics') {
        commissionRate = (site.id === 'UK' || site.id === 'JP') ? 0.07 : 0.08;
      } else if (input.category === 'fashion') {
        commissionRate = site.id === 'JP' ? 0.07 : (['US', 'CA', 'MX'].includes(site.id) ? 0.17 : 0.15);
      } else if (input.category === 'cosmetics') {
        commissionRate = (site.id === 'US' || site.id === 'CA') ? 0.08 : 0.15;
      } else if (input.category === 'home') {
        commissionRate = 0.15;
      } else if (input.category === 'toys') {
        commissionRate = 0.15;
      } else if (input.category === 'jewelry') {
        commissionRate = 0.20;
      } else if (input.category === 'books') {
        commissionRate = 0.15;
      } else {
        commissionRate = 0.15; // default
      }

      // Payment processing fees: 2.9% + 0.30 (MX: 3% + 2, JP: 3% + 30)
      if (site.id === 'MX') {
        transactionRate = 0.03;
        fixedPaymentFee = 2.0;
      } else if (site.id === 'JP') {
        transactionRate = 0.03;
        fixedPaymentFee = 30.0;
      } else {
        transactionRate = 0.029;
        fixedPaymentFee = site.id === 'CA' ? 0.30 : (['UK', 'DE', 'FR', 'IT', 'ES'].includes(site.id) ? 0.30 : 0.30);
      }
    } else if (platformId === 'etsy') {
      // Etsy Commission: 6.5%
      commissionRate = 0.065;

      // Listing flat fee equivalent ($0.20 or other currency equivalent)
      if (site.id === 'CA') fixedFee = 0.20;
      else if (site.id === 'UK') fixedFee = 0.20;
      else if (['DE', 'FR', 'IT', 'ES'].includes(site.id)) fixedFee = 0.20;
      else if (site.id === 'JP') fixedFee = 30.0;
      else if (site.id === 'AU') fixedFee = 0.20;
      else if (site.id === 'MX') fixedFee = 4.0;
      else fixedFee = 0.20;

      // Payment fee: 3.0% + $0.25 (or local currency equivalent)
      transactionRate = 0.03;
      if (site.id === 'CA') fixedPaymentFee = 0.25;
      else if (site.id === 'UK') fixedPaymentFee = 0.25;
      else if (['DE', 'FR', 'IT', 'ES'].includes(site.id)) fixedPaymentFee = 0.25;
      else if (site.id === 'AU') fixedPaymentFee = 0.25;
      else if (site.id === 'JP') fixedPaymentFee = 30.0;
      else if (site.id === 'MX') fixedPaymentFee = 5.0;
      else fixedPaymentFee = 0.25;
    } else if (platformId === 'walmart') {
      // Walmart Commission Rules
      fixedFee = 0.30;
      if (site.id === 'CA') fixedFee = 0.40;
      else if (site.id === 'MX') fixedFee = 5.0;
      else if (site.id === 'UK') fixedFee = 0.30;
      else if (['DE', 'FR', 'IT', 'ES'].includes(site.id)) fixedFee = 0.30;
      else if (site.id === 'AU') fixedFee = 0.30;

      if (input.category === 'electronics') {
        commissionRate = 0.08;
      } else if (input.category === 'home') {
        commissionRate = 0.15;
      } else if (input.category === 'fashion') {
        commissionRate = 0.15;
      } else if (input.category === 'jewelry') {
        commissionRate = 0.20;
      } else if (input.category === 'grocery') {
        commissionRate = 0.18;
      } else {
        commissionRate = 0.15;
      }

      // Walmart Payment: 2.9% + 0.30 (MX: 3% + 2)
      if (site.id === 'MX') {
        transactionRate = 0.03;
        fixedPaymentFee = 2.0;
      } else {
        transactionRate = 0.029;
        fixedPaymentFee = site.id === 'CA' ? 0.30 : 0.30;
      }
    } else if (platformId === 'shopify') {
      commissionRate = 0.0;
      fixedFee = 0.0;
      transactionRate = 0.029;
      fixedPaymentFee = 0.30;
    }

    // Base product cost calculation (with CNY/USD currency toggle support)
    const cogsCurrency = input.cogsCurrency || 'CNY';
    const cogsRMB = cogsCurrency === 'USD' ? (input.cogs * exchangeRateUSDToCNY) : (input.cogs || 0);
    const domesticShippingRMB = input.domesticShippingRMB !== undefined ? input.domesticShippingRMB : 5;
    const internationalShippingRMB = input.internationalShippingRMB !== undefined ? input.internationalShippingRMB : 15;
    const packagingLossRMB = input.packagingLossRMB !== undefined ? input.packagingLossRMB : 2;
    const generalExpensesRMB = input.generalExpensesRMB !== undefined ? input.generalExpensesRMB : 2;

    // Total base COGS in RMB (总本币成本)
    const totalRmbCost = cogsRMB + domesticShippingRMB + internationalShippingRMB + packagingLossRMB + generalExpensesRMB;

    // Convert cost items to local currency
    const cogsLocal = cogsRMB * cnyToLocalRate;
    const domesticShippingLocal = domesticShippingRMB * cnyToLocalRate;
    const internationalShippingLocal = internationalShippingRMB * cnyToLocalRate;
    const packagingLossLocal = packagingLossRMB * cnyToLocalRate;
    const generalExpensesLocal = generalExpensesRMB * cnyToLocalRate;
    const totalCostLocal = totalRmbCost * cnyToLocalRate;

    // Marketing and risk rates
    const affiliateRate = (input.affiliateCommissionRate || 0) / 100;
    const returnLossRate = (input.returnRate || 0) / 100;
    const targetMarginRate = (input.targetProfitMarginRate !== undefined ? input.targetProfitMarginRate : 20.0) / 100;
    const taxRate = (input.taxRateLocal || 0) / 100;
    const adSpendRate = (input.adSpendRatioPercent !== undefined ? input.adSpendRatioPercent : 15) / 100;
    const hasAdSpendRatio = input.adSpendRatioPercent !== undefined;

    // Helper: Compute precise financial breakdown for a trial retail price
    const runTrialCalculation = (trialPrice: number) => {
      const taxes = trialPrice * taxRate;
      const actualAdSpend = hasAdSpendRatio ? (trialPrice * adSpendRate) : (input.adSpendLocal || 0);
      const creatorCommission = trialPrice * affiliateRate;

      // Product return and damage loss: custom calculation matching guidelines
      // "退货损耗 = 总成本 * 退货率" (Wait! To fully satisfy the formula and also provide depth, we write:
      // 退货损耗 = totalCostLocal * returnLossRate)
      const returnLoss = totalCostLocal * returnLossRate;

      // Platform specific commissions & transaction charges
      let commissionFee = 0;
      let transactionFee = 0;
      let calculatedCustPaid = trialPrice;

      if (platformId === 'tiktok') {
        calculatedCustPaid = trialPrice + input.shippingPaidByBuyer - input.platformSubsidyLocal - input.sellerDiscountLocal + taxes;
        commissionFee = (trialPrice + input.platformSubsidyLocal) * commissionRate;
        transactionFee = calculatedCustPaid * transactionRate;
      } else if (platformId === 'amazon') {
        calculatedCustPaid = trialPrice + taxes;
        commissionFee = Math.max(trialPrice * commissionRate, fixedFee);
        transactionFee = 0.0;
      } else if (platformId === 'etsy') {
        calculatedCustPaid = trialPrice + taxes;
        commissionFee = trialPrice * commissionRate;
        transactionFee = trialPrice * transactionRate + fixedPaymentFee;
      } else if (platformId === 'walmart') {
        calculatedCustPaid = trialPrice + taxes;
        commissionFee = Math.max(trialPrice * commissionRate, fixedFee);
        transactionFee = trialPrice * transactionRate + fixedPaymentFee;
      } else if (platformId === 'shopify') {
        calculatedCustPaid = trialPrice + taxes;
        commissionFee = 0.0;
        transactionFee = trialPrice * transactionRate + fixedPaymentFee;
      }

      // Total platform fees
      let totalPlatformFees = commissionFee + transactionFee;
      if (platformId === 'tiktok') {
        totalPlatformFees += fixedFee; // standard fallback
      } else if (platformId === 'etsy') {
        totalPlatformFees += fixedFee; // Listing fee is part of platform fees
      }

      // Additional storage/fulfillment
      const otherOverhead = (input.fbtFeeLocal || 0) + (input.storageFeeLocal || 0);
      
      // Estimated Payout before payout company fees
      let estimatedPayout = 0;
      if (platformId === 'tiktok') {
        estimatedPayout = (trialPrice + input.platformSubsidyLocal) * (1 - commissionRate) - transactionFee - (input.fbtFeeLocal || 0) - creatorCommission;
      } else {
        estimatedPayout = trialPrice - commissionFee - transactionFee - otherOverhead - creatorCommission;
      }

      // Checkout company payouts
      const payoutFeeRate = (input.customPayoutFeeRate || 0) / 100;
      const W_pct = site.isPercentageWithdrawal ? site.withdrawalFeeLocal : 0;
      const W_flat = site.isPercentageWithdrawal ? 0 : site.withdrawalFeeLocal;

      let localPayoutFee = 0;
      if (site.isPercentageWithdrawal) {
        localPayoutFee = estimatedPayout * site.withdrawalFeeLocal;
      } else {
        localPayoutFee = site.withdrawalFeeLocal;
      }

      const payoutAfterLocal = Math.max(0, estimatedPayout - localPayoutFee);
      const exchangeLossRate = 0.015; // 1.5% buffer

      const finalAmountOutput = payoutAfterLocal * (1 - payoutFeeRate) * (1 - exchangeLossRate);
      const withdrawalFeePaid = payoutAfterLocal * payoutFeeRate + localPayoutFee;
      const exchangeLossBufferPaid = payoutAfterLocal * exchangeLossRate;

      // Net profit
      let netProfit = trialPrice - totalCostLocal - commissionFee - transactionFee - actualAdSpend - returnLoss - taxes - generalExpensesLocal - withdrawalFeePaid - exchangeLossBufferPaid;
      if (platformId === 'etsy') {
        netProfit -= fixedFee; // listing fee deducted
      } else if (platformId === 'tiktok') {
        netProfit -= fixedFee;
      }

      const netMargin = trialPrice > 0 ? (netProfit / trialPrice) * 100 : 0;
      
      return {
        customerPaid: calculatedCustPaid,
        commissionFee,
        transactionFee,
        totalPlatformFees,
        creatorCommission,
        returnLoss,
        actualAdSpend,
        taxes,
        withdrawalFeePaid,
        exchangeLossBufferPaid,
        netProfit,
        netMargin
      };
    };

    // Robust numerical solver to find Trial Price that meets target margin percentage
    let suggestedPriceLocal = 0;
    // Bisection search range
    let low = 0.01;
    let high = Math.max(50000.0, 10000.0 * localToUSDExchangeRate); // Scale limit to support high-nominal currencies like JPY, VND, etc.
    let solved = false;

    for (let iter = 0; iter < 80; iter++) {
      const mid = (low + high) / 2;
      const result = runTrialCalculation(mid);
      
      // Target equation: (netProfit / Price) = targetMarginRate
      // -> netProfit - Price * targetMarginRate = 0
      const diff = result.netProfit - mid * targetMarginRate;

      if (Math.abs(diff) < 0.0001) {
        suggestedPriceLocal = mid;
        solved = true;
        break;
      }

      if (diff > 0) {
        // Profit is too high, price can be lower
        high = mid;
      } else {
        // Profit is too low, price needs to be higher
        low = mid;
      }
    }

    if (!solved) {
      suggestedPriceLocal = (low + high) / 2;
    }

    // Determine the active working price based on user preference
    const price = input.pricingMode === 'reverse' ? suggestedPriceLocal : input.priceLocal;

    // Retrieve detailed metrics at working price
    const finalMetrics = runTrialCalculation(price);

    // Compute gross profit margin details
    const grossProfit = price - totalCostLocal - finalMetrics.totalPlatformFees - finalMetrics.creatorCommission - finalMetrics.returnLoss - finalMetrics.taxes;
    const grossMargin = price > 0 ? (grossProfit / price) * 100 : 0;
    const isGrossMarginSafe = grossMargin >= 40.0;

    // Financial indicators (ROAS, break-even ROAS, CPA)
    const actualROAS = finalMetrics.actualAdSpend > 0 ? price / finalMetrics.actualAdSpend : 0;
    const isROASHealthy = actualROAS >= 2.5;

    // Break even analysis ratio calculation
    const costRatiosSum = (totalCostLocal + finalMetrics.totalPlatformFees + finalMetrics.creatorCommission + finalMetrics.returnLoss) / (price || 1);
    const breakEvenROAS = costRatiosSum < 1 ? 1 / (1 - costRatiosSum) : -1;

    const successfulOrderRatio = Math.max(0.01, 1 - returnLossRate);
    const eCPA = finalMetrics.actualAdSpend / successfulOrderRatio;

    return {
      siteId: site.id,
      siteName: site.name,
      currency: site.currency,
      symbol: site.symbol,
      exchangeRateToUSD: oneLocalInUSD,
      exchangeRateToCNY: localToCNYRate,
      customerPaid: finalMetrics.customerPaid,
      platformDiscountValue: input.sellerDiscountLocal || 0,
      commissionFee: finalMetrics.commissionFee,
      transactionFee: finalMetrics.transactionFee,
      fixedFee: platformId === 'tiktok' || platformId === 'etsy' ? fixedFee : 0,
      totalPlatformFees: finalMetrics.totalPlatformFees,
      forwardLogistics: domesticShippingLocal + internationalShippingLocal,
      returnLoss: finalMetrics.returnLoss,
      totalLogisticsCost: domesticShippingLocal + internationalShippingLocal + finalMetrics.returnLoss,
      creatorCommission: finalMetrics.creatorCommission,
      cogsConverted: cogsLocal,
      adSpend: finalMetrics.actualAdSpend,
      generalOperationalExpenses: generalExpensesLocal,
      taxes: finalMetrics.taxes,
      grossProfit,
      grossMargin,
      isGrossMarginSafe,
      withdrawalFee: finalMetrics.withdrawalFeePaid,
      exchangeLossBuffer: finalMetrics.exchangeLossBufferPaid,
      thirdPartyPayoutFeeRate: input.customPayoutFeeRate || 0.6,
      netProfit: finalMetrics.netProfit,
      netMargin: finalMetrics.netMargin,
      isNetMarginProfitable: finalMetrics.netProfit > 0,
      breakEvenROAS,
      actualROAS,
      isROASHealthy,
      eCPA,
      suggestedPriceLocal
    };
  });
}
