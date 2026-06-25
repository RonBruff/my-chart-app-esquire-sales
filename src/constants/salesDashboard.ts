import type { GroupKey, MetricKey, MetricOption } from "../types/sales";

export const MAX_MARKERS = 500;

export const METRIC_OPTIONS: MetricOption[] = [
  { value: "netSales", label: "Net Sales" },
  { value: "grossSales", label: "Gross Sales" },
  { value: "returns", label: "Returns" },
  { value: "transactions", label: "Transactions" },
  { value: "averagePositiveSale", label: "Avg Sale" },
];

export const METRIC_DESCRIPTIONS: Record<MetricKey, string> = {
  netSales: "Sales after returns and adjustments.",
  grossSales: "Positive sales only, excluding returns and adjustments.",
  returns: "Absolute value of negative sales or adjustments.",
  transactions: "Total number of rows matching the current filters.",
  averagePositiveSale:
    "Gross sales divided by positive transactions. Best used with enough transaction volume.",
};

export const CHART_CONFIG_BY_METRIC: Record<
  MetricKey,
  { key: GroupKey; label: string }[]
> = {
  netSales: [
    { key: "store location", label: "Store" },
    { key: "city_name", label: "City" },
    { key: "category", label: "Category" },
    { key: "vendor", label: "Vendor" },
  ],
  grossSales: [
    { key: "store location", label: "Store" },
    { key: "city_name", label: "City" },
    { key: "category", label: "Category" },
    { key: "vendor", label: "Vendor" },
  ],
  returns: [
    { key: "store location", label: "Store" },
    { key: "vendor", label: "Vendor" },
    { key: "category", label: "Category" },
    { key: "city_name", label: "City" },
  ],
  transactions: [
    { key: "store location", label: "Store" },
    { key: "city_name", label: "City" },
    { key: "category", label: "Category" },
    { key: "vendor", label: "Vendor" },
  ],
  averagePositiveSale: [
    { key: "store location", label: "Store" },
    { key: "category", label: "Category" },
    { key: "vendor", label: "Vendor" },
    { key: "city_name", label: "City" },
  ],
};