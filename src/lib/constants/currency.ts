export const DEFAULT_CURRENCY = "USD";

export function formatCurrency(amount: number, currency = DEFAULT_CURRENCY): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}
