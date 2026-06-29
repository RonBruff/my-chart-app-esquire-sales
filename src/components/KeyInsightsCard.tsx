import React from "react";
import { esqTheme } from "../theme/esqTheme";
import type { ChartRow, MetricKey, SummaryMetrics } from "../types/sales";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const accentColors = {
  orange: esqTheme.colors.orange,
  green: "#4ade80",
  blue: "#60a5fa",
  red: "#ef4444",
};

function formatMetricValue(value: number, metric: MetricKey) {
  if (metric === "transactions") return numberFormatter.format(value);
  return currencyFormatter.format(value);
}

function getMetricLabel(metric: MetricKey) {
  if (metric === "netSales") return "Net Sales";
  if (metric === "grossSales") return "Gross Sales";
  if (metric === "returns") return "Returns";
  if (metric === "transactions") return "Transactions";
  if (metric === "averagePositiveSale") return "Avg Sale";
  return "Metric";
}

function getMetricValue(summary: SummaryMetrics, metric: MetricKey) {
  if (metric === "netSales") return summary.netSales;
  if (metric === "grossSales") return summary.grossSales;
  if (metric === "returns") return summary.returns;
  if (metric === "transactions") return summary.transactions;
  if (metric === "averagePositiveSale") return summary.averagePositiveSale;
  return 0;
}

function getShare(row: ChartRow | undefined, rows: ChartRow[]) {
  if (!row) return 0;

  const total = rows.reduce((sum, item) => sum + Math.abs(item.value), 0);
  return total > 0 ? Math.abs(row.value) / total : 0;
}

function StrongText({
  children,
  color = esqTheme.colors.white,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <strong
      style={{
        color,
        fontWeight: 800,
        fontSize: "1.06em",
      }}
    >
      {children}
    </strong>
  );
}

function InsightLine({
  accent,
  children,
}: {
  accent: keyof typeof accentColors;
  children: React.ReactNode;
}) {
  const color = accentColors[accent];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: color,
          marginTop: 8,
          flexShrink: 0,
          boxShadow: `0 0 18px ${color}`,
        }}
      />

      <div
        style={{
          color: "#dbe3f4",
          fontSize: 16,
          lineHeight: 1.65,
          fontWeight: 500,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function KeyInsightsCard({
  storeData,
  cityData,
  categoryData,
  vendorData,
  metric,
  filteredCount,
  totalCount,
  filteredSummary,
  totalSummary,
}: {
  storeData: ChartRow[];
  cityData: ChartRow[];
  categoryData: ChartRow[];
  vendorData: ChartRow[];
  metric: MetricKey;
  filteredCount: number;
  totalCount: number;
  filteredSummary: SummaryMetrics;
  totalSummary: SummaryMetrics;
}) {
  const metricLabel = getMetricLabel(metric);

  const filteredMetricValue = getMetricValue(filteredSummary, metric);
  const totalMetricValue = getMetricValue(totalSummary, metric);

  const rowShare = totalCount > 0 ? filteredCount / totalCount : 0;

  const metricShare =
    metric === "averagePositiveSale"
      ? totalSummary.averagePositiveSale > 0
        ? filteredSummary.averagePositiveSale /
            totalSummary.averagePositiveSale -
          1
        : 0
      : totalMetricValue !== 0
      ? filteredMetricValue / totalMetricValue
      : 0;

  const topStore = storeData[0];
  const topCity = cityData[0];
  const topCategory = categoryData[0];
  const topVendor = vendorData[0];

  const topCategoryShare = getShare(topCategory, categoryData);
  const topVendorShare = getShare(topVendor, vendorData);

  const returnTone = filteredSummary.returnRate > 0.1 ? "red" : "green";

  const avgSaleDelta =
    totalSummary.averagePositiveSale > 0
      ? filteredSummary.averagePositiveSale /
          totalSummary.averagePositiveSale -
        1
      : 0;

  return (
    <div
      style={{
        backgroundColor: esqTheme.colors.panel,
        border: `1px solid ${esqTheme.colors.border}`,
        borderRadius: esqTheme.radius.card,
        boxShadow: "0 14px 28px rgba(0,0,0,.22)",
        color: esqTheme.colors.text,
        padding: 24,
        minHeight: 400,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: esqTheme.colors.white,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          At a Glance
        </h3>

        <div
          style={{
            flex: 1,
            height: 1,
            background: "rgba(255,255,255,.08)",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gap: 18,
          marginTop: 6,
        }}
      >
        <InsightLine accent="blue">
          Showing{" "}
          <StrongText>{numberFormatter.format(filteredCount)}</StrongText> of{" "}
          <StrongText>{numberFormatter.format(totalCount)}</StrongText> rows, or{" "}
          <StrongText>{percentFormatter.format(rowShare)}</StrongText> of the
          uploaded file.
        </InsightLine>

        <InsightLine accent="orange">
          {metric === "averagePositiveSale" ? (
            <>
              Average sale is{" "}
              <StrongText>
                {avgSaleDelta >= 0 ? "+" : ""}
                {percentFormatter.format(avgSaleDelta)}
              </StrongText>{" "}
              compared with the full dataset.
            </>
          ) : (
            <>
              This selection accounts for{" "}
              <StrongText>{percentFormatter.format(metricShare)}</StrongText>{" "}
              of total {metricLabel.toLowerCase()}.
            </>
          )}
        </InsightLine>

        {topStore && (
          <InsightLine accent="orange">
            <StrongText color={accentColors.orange}>
              Store {topStore.name}
            </StrongText>{" "}
            is the highest-performing location with{" "}
            <StrongText>{formatMetricValue(topStore.value, metric)}</StrongText>{" "}
            in {metricLabel.toLowerCase()}.
          </InsightLine>
        )}

        {topCategory && (
          <InsightLine accent="green">
            <StrongText color={accentColors.green}>
              {topCategory.name}
            </StrongText>{" "}
            is the leading category, representing{" "}
            <StrongText>{percentFormatter.format(topCategoryShare)}</StrongText>{" "}
            of shown category activity.
          </InsightLine>
        )}

        {topVendor && (
          <InsightLine accent="blue">
            <StrongText color={accentColors.blue}>{topVendor.name}</StrongText>{" "}
            is the highest-performing vendor at{" "}
            <StrongText>{percentFormatter.format(topVendorShare)}</StrongText>{" "}
            of shown vendor activity.
          </InsightLine>
        )}

        {topCity && (
          <InsightLine accent="green">
            <StrongText color={accentColors.green}>{topCity.name}</StrongText>{" "}
            is currently the strongest-performing market.
          </InsightLine>
        )}

        <InsightLine accent={returnTone}>
          Return rate remains{" "}
          <StrongText color={accentColors[returnTone]}>
            {filteredSummary.returnRate > 0.1 ? "elevated" : "healthy"}
          </StrongText>{" "}
          at{" "}
          <StrongText>
            {percentFormatter.format(filteredSummary.returnRate)}
          </StrongText>{" "}
          of gross sales.
        </InsightLine>
      </div>
    </div>
  );
}