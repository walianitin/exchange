export interface Depth {
  bids: [string, string][];
  asks: [string, string][];
  lastUpdateId: string;
  timestamp: string;
}

export interface Ticker {
  firstPrice: string;
  high: string;
  lastPrice: string;
  low: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  trades: string;
  volume: string;
}

export interface KLine {
  close: string;
  end: string;
  high: string;
  low: string;
  open: string;
  quoteVolume: string;
  start: string;
  trades: string;
  volume: string;
}

export interface marketData {
  lastPrice: string;
  symbol: string;
  priceChangePercent: string;
}

export interface CurrencyData {
  price: number;
  market_cap: number;
  price_change_percentage_24hr: number;
  volume: number;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | number;
  last_updated: string;
  price_change_percentage_24h_in_currency: number;
  currencies: {
    cad: CurrencyData;
    cny: CurrencyData;
    eur: CurrencyData;
    gbp: CurrencyData;
    jpy: CurrencyData;
    usd: CurrencyData;
  };
}

export interface LineCryptoDataPoint {
  close: string;
  end: string;
}

export interface LineCryptoData {
  data: LineCryptoDataPoint[];
  symbol: string;
}

export type CombinedCryptoData = CryptoData & {
  KlineData?: LineCryptoDataPoint[];
};
