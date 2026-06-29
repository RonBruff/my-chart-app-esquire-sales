export type Tab = "Charts" | "Map";

export type MetricKey =
  | "netSales"
  | "grossSales"
  | "returns"
  | "transactions"
  | "averagePositiveSale";

export type GroupKey =
  | "state_abbreviation"
  | "city_name"
  | "store location"
  | "vendor"
  | "category"
  | "zipcode";

export type FilterKey = "state" | "city" | "store" | "vendor" | "category";

export interface SalesRow {
  delivery_line_1?: string | number;
  city_name?: string | number;
  state_abbreviation?: string | number;
  zipcode?: string | number;
  plus4_code?: string | number;
  latitude?: string | number;
  longitude?: string | number;
  "sales amount"?: string | number;
  "store location"?: string | number;
  vendor?: string | number;
  category?: string | number;
  [key: string]: unknown;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface MetricOption {
  value: MetricKey;
  label: string;
}

export interface ChartRow {
  name: string;
  value: number;
  netSales: number;
  grossSales: number;
  returns: number;
  transactions: number;
  positiveTransactions: number;
  averagePositiveSale: number;
}

export interface SummaryMetrics {
  netSales: number;
  grossSales: number;
  returns: number;
  returnRate: number;
  transactions: number;
  positiveTransactions: number;
  averagePositiveSale: number;
  uniqueStores: number;
  uniqueAddresses: number;
}

export interface MapPoint {
  lat: number;
  lng: number;
  amount: number;
  store: string;
  city: string;
  state: string;
  zip: string;
  vendor: string;
  category: string;
}