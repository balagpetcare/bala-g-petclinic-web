'use client';

import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import { useLocalStorage } from '@/hooks';
import type { CartItem } from '@/types';

interface EcommerceState {
  cart: CartItem[];
  wishlist: string[];
}

type EcommerceAction =
  | { type: 'ADD_TO_CART'; productId: string; quantity?: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'SET_CART_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; productId: string }
  | { type: 'HYDRATE'; payload: EcommerceState };

const initialState: EcommerceState = {
  cart: [],
  wishlist: [],
};

function ecommerceReducer(state: EcommerceState, action: EcommerceAction): EcommerceState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const quantityToAdd = Math.max(1, action.quantity ?? 1);
      const existing = state.cart.find((item) => item.productId === action.productId);

      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === action.productId
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, { productId: action.productId, quantity: quantityToAdd }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((item) => item.productId !== action.productId) };
    case 'SET_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.productId === action.productId ? { ...item, quantity: action.quantity } : item
          )
          .filter((item) => item.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.includes(action.productId);
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      };
    }
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
}

interface EcommerceContextValue {
  state: EcommerceState;
  dispatch: Dispatch<EcommerceAction>;
  cartItemsCount: number;
  wishlistItemsCount: number;
  isInWishlist: (productId: string) => boolean;
}

const EcommerceContext = createContext<EcommerceContextValue | null>(null);

export function EcommerceProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useLocalStorage<EcommerceState>('bala-g-ecommerce', initialState);
  const [state, dispatch] = useReducer(ecommerceReducer, persisted);

  useEffect(() => {
    dispatch({ type: 'HYDRATE', payload: persisted });
  }, [persisted]);

  useEffect(() => {
    setPersisted(state);
  }, [state, setPersisted]);

  const value = useMemo<EcommerceContextValue>(
    () => ({
      state,
      dispatch,
      cartItemsCount: state.cart.reduce((acc, item) => acc + item.quantity, 0),
      wishlistItemsCount: state.wishlist.length,
      isInWishlist: (productId: string) => state.wishlist.includes(productId),
    }),
    [state]
  );

  return <EcommerceContext.Provider value={value}>{children}</EcommerceContext.Provider>;
}

export function useEcommerce() {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within EcommerceProvider');
  }
  return context;
}
