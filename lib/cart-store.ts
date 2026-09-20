"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (productId: string, size: string | null, color: string | null) => void;
  updateQuantity: (
    productId: string,
    size: string | null,
    color: string | null,
    quantity: number
  ) => void;
  clear: () => void;
  totalItems: () => number;
  subtotalCents: () => number;
}

function sameLine(a: CartLine, productId: string, size: string | null, color: string | null) {
  return a.productId === productId && a.size === size && a.color === color;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (line) =>
        set((state) => {
          const existing = state.lines.find((l) =>
            sameLine(l, line.productId, line.size, line.color)
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                sameLine(l, line.productId, line.size, line.color)
                  ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.stock || 99) }
                  : l
              ),
            };
          }
          return { lines: [...state.lines, line] };
        }),
      removeLine: (productId, size, color) =>
        set((state) => ({
          lines: state.lines.filter((l) => !sameLine(l, productId, size, color)),
        })),
      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              sameLine(l, productId, size, color) ? { ...l, quantity: Math.max(1, quantity) } : l
            )
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotalCents: () => get().lines.reduce((sum, l) => sum + l.unitCents * l.quantity, 0),
    }),
    { name: "kekia-sally-cart" }
  )
);
