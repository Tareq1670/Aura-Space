const CURRENCY_MAP: Record<string, string> = {
    usd: "$",
    bdt: "\u09F3",
    eur: "\u20AC",
    gbp: "\u00A3",
    inr: "\u20B9",
};

export function getCurrencyCode(): string {
    return (
        process.env.NEXT_PUBLIC_STRIPE_CURRENCY ||
        process.env.STRIPE_CURRENCY ||
        "usd"
    ).toLowerCase();
}

export function getCurrencySymbol(code?: string): string {
    const c = (code || getCurrencyCode()).toLowerCase();
    return CURRENCY_MAP[c] || "$";
}

export function formatCurrency(amount: number, code?: string): string {
    const symbol = getCurrencySymbol(code);
    return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
