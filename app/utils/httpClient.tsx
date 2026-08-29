import axios from "axios";
import { Ticker, KLine, marketData } from "./types";

const BASE_URL = "/api/v1";

export const COINS_INDEXER_URL =
  "https://price-indexer.workers.madlads.com/?ids=solana,usd-coin,pyth-network,jito-governance-token,tether,bonk,helium,helium-mobile,bitcoin,ethereum,dogwifcoin,jupiter-exchange-solana,parcl,render-token,tensor,wormhole,wen-4,cat-in-a-dogs-world,book-of-meme,raydium,hivemapper,kamino,drift-protocol,nyan,jeo-boden,habibi-sol,io,zeta,mother-iggy,sanctum-2,moo-deng,debridge,shuffle-2,pepe,shiba-inu,chainlink,uniswap,ondo-finance,holograph,starknet,matic-network,mon-protocol,blur,worldcoin-wld,polyhedra-network,unagi-token,layerzero,aave,lido-dao,matr1x,polygon-ecosystem-token";

export async function getDepth(market: string) {
  const response = await axios.get(`${BASE_URL}/depth`, {
    params: { symbol: market },
  });
  return response.data;
}

export async function getTickers() {
  const response = await axios.get(`${BASE_URL}/tickers`);
  return response.data;
}

export async function getTicker(market: string) {
  const response = await getTickers();
  return response.find((t: Ticker) => t.symbol === market);
}

export async function getKlines({
  market,
  interval,
  startTime,
  endTime,
}: {
  market: string;
  interval: string;
  startTime: string;
  endTime: string;
}) {
  const response = await axios.get(`${BASE_URL}/klines`, {
    params: { symbol: market, interval, startTime, endTime },
  });
  const data: KLine[] = response.data;
  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function getinfo(): Promise<marketData[]> {
  const response = await axios.get(`${BASE_URL}/tickers`);
  return response.data.map(
    ({ symbol, lastPrice, priceChangePercent }: marketData) => ({
      symbol,
      lastPrice,
      priceChangePercent,
    })
  );
}

export async function getMarketKlines(startTime: number, endTime: number) {
  const response = await fetch(
    `https://api.backpack.exchange/wapi/v1/marketDataKlines?interval=6h&startTime=${startTime}&endTime=${endTime}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch market klines");
  }
  return response.json();
}

export async function getAllInfo() {
  const url =
    typeof window === "undefined" ? COINS_INDEXER_URL : `${BASE_URL}/coins`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch coins: ${response.status}`);
  }
  return response.json();
}
