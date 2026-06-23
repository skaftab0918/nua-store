import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'nua_cart_v1';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, colour, size, quantity = 1 } = action.payload;
      const key = `${product.id}__${colour}__${size}`;
      const existing = state.items.find(i => i.key === key);

      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.key === key
              ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
              : i
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            key,
            productId: product.id,
            title:     product.title,
            image:     product.image,
            price:     product.price,
            colour,
            size,
            quantity,
          },
        ],
      };
    }

    case 'UPDATE_QUANTITY': {
      const { key, quantity } = action.payload;
      if (quantity < 1) {
        return { ...state, items: state.items.filter(i => i.key !== key) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.key === key ? { ...i, quantity: Math.min(quantity, 10) } : i
        ),
      };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.key !== action.payload.key) };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_DRAWER_OPEN':
      return { ...state, drawerOpen: action.payload };

    default:
      return state;
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { items: parsed.items ?? [], drawerOpen: false };
    }
  } catch {
    // corrupted storage — start fresh
  }
  return { items: [], drawerOpen: false };
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

  // Persist cart items (not drawer state) on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [state.items]);

  const totalItems    = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal      = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFree  = subtotal >= 50;
  const grandTotal    = shippingFree ? subtotal : subtotal + 4.99;

  const addItem       = (product, colour, size, quantity) =>
    dispatch({ type: 'ADD_ITEM', payload: { product, colour, size, quantity } });

  const updateQuantity = (key, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } });

  const removeItem    = (key) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { key } });

  const clearCart     = () => dispatch({ type: 'CLEAR_CART' });

  const openDrawer    = () => dispatch({ type: 'SET_DRAWER_OPEN', payload: true });
  const closeDrawer   = () => dispatch({ type: 'SET_DRAWER_OPEN', payload: false });

  return (
    <CartContext.Provider
      value={{
        items:       state.items,
        drawerOpen:  state.drawerOpen,
        totalItems,
        subtotal,
        grandTotal,
        shippingFree,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
