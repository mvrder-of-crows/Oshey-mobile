// Mock wallet data. Replace with real balance queries (on-chain + custody
// ledger) — kept in one place so screens don't hardcode numbers individually.

export type CryptoAsset = {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  color: string; // brand color used for the asset's icon chip
};

export const CRYPTO_ASSETS: CryptoAsset[] = [
  { symbol: "BTC", name: "Bitcoin", balance: 0.0182, usdValue: 1114.36, color: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", balance: 0.412, usdValue: 1027.94, color: "#627EEA" },
  { symbol: "USDT", name: "Tether", balance: 320.5, usdValue: 320.5, color: "#26A17B" },
  { symbol: "USDC", name: "USD Coin", balance: 150.0, usdValue: 150.0, color: "#2775CA" },
];

// Naira held in-app — e.g. from a reversed/refunded send, or cash-in not yet
// converted. Deliberately modeled as a separate balance, not folded into the
// crypto total, since it behaves differently (no swap needed to spend it).
export const FIAT_BALANCE_NGN = 42_500;

export const USD_TO_NGN = 1585;

export function totalCryptoUsd() {
  return CRYPTO_ASSETS.reduce((sum, a) => sum + a.usdValue, 0);
}

export function totalPortfolioUsd() {
  return totalCryptoUsd() + FIAT_BALANCE_NGN / USD_TO_NGN;
}

export function findAsset(symbol: string) {
  return CRYPTO_ASSETS.find((a) => a.symbol === symbol) ?? CRYPTO_ASSETS[0];
}
