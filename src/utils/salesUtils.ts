import { CHART_CONFIG_BY_METRIC, MAX_MARKERS, METRIC_OPTIONS } from "../constants/salesDashboard";
import type {
  ChartRow,
  GroupKey,
  MapPoint,
  MetricKey,
  SalesRow,
  SelectOption,
  SummaryMetrics,
} from "../types/sales";

export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const numberFormatter = new Intl.NumberFormat("en-US");

export function getText(value: unknown, fallback = "N/A"): string {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : fallback;
}

export function cleanValue(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const isParenthesesNegative =
      trimmed.startsWith("(") && trimmed.endsWith(")");

    const cleaned = trimmed.replace(/[$,%\s,()]/g, "");
    const parsed = Number(cleaned);

    if (!Number.isFinite(parsed)) return 0;

    return isParenthesesNegative ? -Math.abs(parsed) : parsed;
  }

  return 0;
}

export function parseCoordinate(value: unknown): number | null {
  const text = getText(value, "");
  if (!text) return null;

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getMetricLabel(metric: MetricKey): string {
  return METRIC_OPTIONS.find((option) => option.value === metric)?.label ?? "";
}

export function makeOptions(rows: SalesRow[], key: GroupKey): SelectOption[] {
  const values = new Set<string>();

  rows.forEach((row) => {
    values.add(getText(row[key]));
  });

  return Array.from(values)
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({
      value,
      label: value,
    }));
}

export function matchesFilter(selectedValues: string[], value: unknown): boolean {
  return selectedValues.length === 0 || selectedValues.includes(getText(value));
}

function getChartValue(row: ChartRow, metric: MetricKey): number {
  if (metric === "netSales") return row.netSales;
  if (metric === "grossSales") return row.grossSales;
  if (metric === "returns") return row.returns;
  if (metric === "transactions") return row.transactions;
  if (metric === "averagePositiveSale") return row.averagePositiveSale;

  return row.netSales;
}

export function aggregateRows(
  rows: SalesRow[],
  groupKey: GroupKey,
  metric: MetricKey
): ChartRow[] {
  const grouped = new Map<string, ChartRow>();

  rows.forEach((row) => {
    const name = getText(row[groupKey]);
    const amount = cleanValue(row["sales amount"]);

    const existing = grouped.get(name);

    const entry: ChartRow =
      existing ??
      {
        name,
        value: 0,
        netSales: 0,
        grossSales: 0,
        returns: 0,
        transactions: 0,
        positiveTransactions: 0,
        averagePositiveSale: 0,
      };

    entry.netSales += amount;
    entry.transactions += 1;

    if (amount > 0) {
      entry.grossSales += amount;
      entry.positiveTransactions += 1;
    }

    if (amount < 0) {
      entry.returns += Math.abs(amount);
    }

    grouped.set(name, entry);
  });

  return Array.from(grouped.values())
    .map((row) => {
      const averagePositiveSale =
        row.positiveTransactions > 0
          ? row.grossSales / row.positiveTransactions
          : 0;

      const completedRow = {
        ...row,
        averagePositiveSale,
      };

      return {
        ...completedRow,
        value: getChartValue(completedRow, metric),
      };
    })
    .sort((a, b) => b.value - a.value);
}

export function calculateSummary(rows: SalesRow[]): SummaryMetrics {
  const uniqueStores = new Set<string>();
  const uniqueAddresses = new Set<string>();

  let netSales = 0;
  let grossSales = 0;
  let returns = 0;
  let positiveTransactions = 0;

  rows.forEach((row) => {
    const amount = cleanValue(row["sales amount"]);

    netSales += amount;

    if (amount > 0) {
      grossSales += amount;
      positiveTransactions += 1;
    }

    if (amount < 0) {
      returns += Math.abs(amount);
    }

    const store = getText(row["store location"], "");
    if (store) uniqueStores.add(store);

    const address = [
      getText(row["delivery_line_1"], ""),
      getText(row["city_name"], ""),
      getText(row["state_abbreviation"], ""),
      getText(row["zipcode"], ""),
    ]
      .filter(Boolean)
      .join("|");

    if (address) uniqueAddresses.add(address);
  });

  return {
    netSales,
    grossSales,
    returns,
    returnRate: grossSales > 0 ? returns / grossSales : 0,
    transactions: rows.length,
    positiveTransactions,
    averagePositiveSale:
      positiveTransactions > 0 ? grossSales / positiveTransactions : 0,
    uniqueStores: uniqueStores.size,
    uniqueAddresses: uniqueAddresses.size,
  };
}

export function buildMapData(rows: SalesRow[]): MapPoint[] {
  const points: MapPoint[] = [];

  rows.forEach((row) => {
    const lat = parseCoordinate(row["latitude"]);
    const lng = parseCoordinate(row["longitude"]);

    if (lat === null || lng === null) return;
    if (lat < -90 || lat > 90) return;
    if (lng < -180 || lng > 180) return;

    points.push({
      lat,
      lng,
      amount: cleanValue(row["sales amount"]),
      store: getText(row["store location"], "Unknown Store"),
      city: getText(row["city_name"], "Unknown City"),
      state: getText(row["state_abbreviation"], "Unknown State"),
      zip: getText(row["zipcode"], "Unknown ZIP"),
      vendor: getText(row["vendor"], "Unknown Vendor"),
      category: getText(row["category"], "Unknown Category"),
    });
  });

  return points
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, MAX_MARKERS);
}

export function buildChartSections(
  rows: SalesRow[],
  selectedMetric: MetricKey
) {
  const metricLabel = getMetricLabel(selectedMetric);
  const rowLimit = selectedMetric === "averagePositiveSale" ? 10 : 15;
  const chartConfig = CHART_CONFIG_BY_METRIC[selectedMetric];

  return chartConfig.map((config) => ({
    title: `${metricLabel} by ${config.label}`,
    data: aggregateRows(rows, config.key, selectedMetric).slice(0, rowLimit),
  }));
}