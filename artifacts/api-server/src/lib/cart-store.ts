export type CartItemRecord = {
  id: string;
  productId: number;
  quantity: number;
  color?: string | null;
  storage?: string | null;
};

export type SessionState = {
  cart: CartItemRecord[];
  wishlist: number[];
  coupon?: { code: string; percentOff: number } | null;
};

const sessions = new Map<string, SessionState>();

export function getSession(sid: string): SessionState {
  let s = sessions.get(sid);
  if (!s) {
    s = { cart: [], wishlist: [], coupon: null };
    sessions.set(sid, s);
  }
  return s;
}

export function clearSessionCart(sid: string): void {
  const s = getSession(sid);
  s.cart = [];
  s.coupon = null;
}
