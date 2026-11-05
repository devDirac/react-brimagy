import { numericFormatter } from "react-number-format";

export const isValidNumber = (value: unknown): value is number | string => {
    if (value === null || value === undefined || value === "") return false;
    const num = typeof value === "string" ? parseFloat(value) : value;
    return typeof num === "number" && !isNaN(num) && isFinite(num);
};

interface FormatOptions {
    prefix?: string;
    suffix?: string;
    decimalScale?: number;
}

export const formatCurrency = (
    value: unknown,
    options: FormatOptions = {}
): string => {
    if (!isValidNumber(value)) return "-";

    return numericFormatter(String(value), {
        thousandSeparator: ",",
        decimalScale: options.decimalScale ?? 2,
        fixedDecimalScale: true,
        prefix: options.prefix ?? "$",
        suffix: options.suffix,
    });
};

export const formatNumber = (value: unknown, decimalScale = 0): string => {
    if (!isValidNumber(value)) return "-";

    return numericFormatter(String(value), {
        thousandSeparator: ",",
        decimalScale,
        fixedDecimalScale: decimalScale > 0,
    });
};

export const formatPercent = (value: unknown, decimalScale = 2): string => {
    if (!isValidNumber(value)) return "-";

    return numericFormatter(String(value), {
        decimalScale,
        fixedDecimalScale: true,
        suffix: "%",
    });
};