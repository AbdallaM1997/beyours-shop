/** Prices are stored as integers in piasters (EGP × 100). */
export type Piasters = number;

export function formatPrice(amount: Piasters, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

export type CartLine = { unitPrice: Piasters; qty: number; customPrint?: Piasters };

export function cartSubtotal(lines: CartLine[]): Piasters {
  return lines.reduce((sum, l) => {
    if (!Number.isInteger(l.qty) || l.qty < 1) throw new Error("Quantity must be a positive integer");
    return sum + (l.unitPrice + (l.customPrint ?? 0)) * l.qty;
  }, 0);
}

export function orderTotal(lines: CartLine[], shippingFee: Piasters): Piasters {
  return cartSubtotal(lines) + shippingFee;
}
