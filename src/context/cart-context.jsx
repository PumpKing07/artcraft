import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

// Делаем корзину пустой по умолчанию.
// После подключения к БД начальные "p1" могли не существовать как UUID и ломали checkout.
const initialItems = [];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(initialItems);

  const cartItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const addItem = (newItem, quantity = 1) => {
    setCartItems((items) => {
      const existing = items.find((i) => i.id === newItem.id);
      if (existing) {
        return items.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...items, { ...newItem, quantity }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, cartItemCount, addItem, updateQuantity, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

