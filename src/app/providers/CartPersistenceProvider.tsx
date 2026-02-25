"use client";

import { useStore } from "react-redux";

import { useCartPersistence } from "@/hooks/useCartPersistence";

import type { RootState } from "@/store";

export function CartPersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useStore<RootState>();
  useCartPersistence(store);
  return <>{children}</>;
}
