import { create } from "zustand";

// Mantiene la selección al navegar; no almacena datos personales.
export const useServicesStore = create((set) => ({
  cart: {},
  setCart: (update) => set((state) => ({
    cart: typeof update === "function" ? update(state.cart) : update,
  })),
}));
