
import { create } from 'zustand'

type CartItem = {
    id: number
    name: string
    price: number
    quantity: number
}

type CartState = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (item) => set((state) => {
    const existing = state.cart.find((i) => i.id === item.id)
    if (existing) {
        return {
            cart: state.cart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        }
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] }
  }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
}))
