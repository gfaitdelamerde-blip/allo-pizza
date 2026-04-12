import * as React from "react";
import { Pizza } from "../constants";

export interface CartItem extends Pizza {
  quantity: number;
  notes?: string;
  pickupTime?: string;
}

export interface OrderDetails {
  items: CartItem[];
  totalPrice: number;
  paymentMethod: 'online' | 'onsite';
  email: string;
  orderId: string;
  timestamp: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (pizza: Pizza, quantity: number, notes?: string, pickupTime?: string) => void;
  removeFromCart: (pizzaId: string) => void;
  updateQuantity: (pizzaId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  lastOrder: OrderDetails | null;
  setLastOrder: (order: OrderDetails) => void;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = React.useState<OrderDetails | null>(null);

  const addToCart = (pizza: Pizza, quantity: number, notes?: string, pickupTime?: string) => {
    setItems((prev) => {
      // For items with notes/pickupTime, we might want to treat them as unique even if same pizza ID
      // But for simplicity, let's just add it as a new entry if notes differ
      const existingIndex = prev.findIndex(
        (item) => item.id === pizza.id && item.notes === notes && item.pickupTime === pickupTime
      );

      if (existingIndex !== -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }

      return [...prev, { ...pizza, quantity, notes, pickupTime }];
    });
  };

  const removeFromCart = (pizzaId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== pizzaId));
  };

  const updateQuantity = (pizzaId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === pizzaId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        lastOrder,
        setLastOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
