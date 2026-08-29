"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export type OrderSide = "buy" | "sell";
export type OrderType = "limit" | "market";
export type OrderStatus = "open" | "filled" | "cancelled";

export interface Order {
  id: string;
  market: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  quantity: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
}

interface WalletState {
  balances: Record<string, number>;
  orders: Order[];
  favorites: string[];
}

interface PlaceOrderInput {
  market: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  quantity: number;
}

interface WalletContextValue extends WalletState {
  deposit: (amount: number) => boolean;
  withdraw: (amount: number) => boolean;
  placeOrder: (input: PlaceOrderInput) => boolean;
  cancelOrder: (id: string) => void;
  toggleFavorite: (symbol: string) => void;
  isFavorite: (symbol: string) => boolean;
}

const STORAGE_KEY = "exchange-wallet";

const defaultState: WalletState = {
  balances: { USDC: 10000 },
  orders: [],
  favorites: ["SOL", "BTC", "ETH"],
};

const WalletContext = createContext<WalletContextValue | null>(null);

function loadState(): WalletState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<WalletState>;
    return {
      balances: parsed.balances ?? defaultState.balances,
      orders: parsed.orders ?? [],
      favorites: parsed.favorites ?? defaultState.favorites,
    };
  } catch {
    return defaultState;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const deposit = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return false;
    }
    setState((prev) => ({
      ...prev,
      balances: {
        ...prev.balances,
        USDC: (prev.balances.USDC ?? 0) + amount,
      },
    }));
    toast.success(`Deposited ${amount.toFixed(2)} USDC`);
    return true;
  }, []);

  const withdraw = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid amount");
      return false;
    }
    let ok = true;
    setState((prev) => {
      const current = prev.balances.USDC ?? 0;
      if (amount > current) {
        ok = false;
        toast.error("Insufficient USDC");
        return prev;
      }
      toast.success(`Withdrew ${amount.toFixed(2)} USDC`);
      return {
        ...prev,
        balances: { ...prev.balances, USDC: current - amount },
      };
    });
    return ok;
  }, []);

  const placeOrder = useCallback((input: PlaceOrderInput) => {
    const { market, side, type, price, quantity } = input;
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(quantity) || quantity <= 0) {
      toast.error("Enter a valid price and quantity");
      return false;
    }

    const [base, quote] = market.split("_");
    const total = price * quantity;
    const status: OrderStatus = type === "market" ? "filled" : "open";

    let accepted = true;
    setState((prev) => {
      const balances = { ...prev.balances };
      if (side === "buy") {
        const quoteBal = balances[quote] ?? 0;
        if (quoteBal < total) {
          accepted = false;
          toast.error(`Insufficient ${quote}`);
          return prev;
        }
        balances[quote] = quoteBal - total;
        if (status === "filled") {
          balances[base] = (balances[base] ?? 0) + quantity;
        }
      } else {
        const baseBal = balances[base] ?? 0;
        if (baseBal < quantity) {
          accepted = false;
          toast.error(`Insufficient ${base}`);
          return prev;
        }
        balances[base] = baseBal - quantity;
        if (status === "filled") {
          balances[quote] = (balances[quote] ?? 0) + total;
        }
      }

      const order: Order = {
        id: crypto.randomUUID(),
        market,
        side,
        type,
        price,
        quantity,
        total,
        status,
        createdAt: Date.now(),
      };

      toast.success(
        status === "filled"
          ? `${side === "buy" ? "Bought" : "Sold"} ${quantity} ${base}`
          : `${side === "buy" ? "Buy" : "Sell"} order opened`
      );

      return {
        ...prev,
        balances,
        orders: [order, ...prev.orders],
      };
    });

    return accepted;
  }, []);

  const cancelOrder = useCallback((id: string) => {
    setState((prev) => {
      const order = prev.orders.find((item) => item.id === id);
      if (!order || order.status !== "open") return prev;

      const [base, quote] = order.market.split("_");
      const balances = { ...prev.balances };
      if (order.side === "buy") {
        balances[quote] = (balances[quote] ?? 0) + order.total;
      } else {
        balances[base] = (balances[base] ?? 0) + order.quantity;
      }

      toast.success("Order cancelled");
      return {
        ...prev,
        balances,
        orders: prev.orders.map((item) =>
          item.id === id ? { ...item, status: "cancelled" } : item
        ),
      };
    });
  }, []);

  const toggleFavorite = useCallback((symbol: string) => {
    const key = symbol.toUpperCase();
    setState((prev) => {
      const exists = prev.favorites.includes(key);
      return {
        ...prev,
        favorites: exists
          ? prev.favorites.filter((item) => item !== key)
          : [...prev.favorites, key],
      };
    });
  }, []);

  const isFavorite = useCallback(
    (symbol: string) => state.favorites.includes(symbol.toUpperCase()),
    [state.favorites]
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      ...state,
      deposit,
      withdraw,
      placeOrder,
      cancelOrder,
      toggleFavorite,
      isFavorite,
    }),
    [state, deposit, withdraw, placeOrder, cancelOrder, toggleFavorite, isFavorite]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
