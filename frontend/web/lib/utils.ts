import { clsx } from "clsx";

export const cn = (...parts: Array<string | false | null | undefined>) => clsx(parts);

export const currency = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);

export const percentage = (value: number) => `${value.toFixed(1)}%`;

export const toTitleCase = (value: string) =>
  value
    .split(/[-_]/g)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
