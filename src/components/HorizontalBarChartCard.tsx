import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { esqTheme } from "../theme/esqTheme";
import type { ChartRow, MetricKey, MetricOption } from "../types/sales";

const METRIC_OPTIONS: MetricOption[] = [
  { value: "netSales", label: "Net Sales" },
  { value: "grossSales", label: "Gross Sales" },
  { value: "returns", label: "Returns / Adjustments" },
  { value: "transactions", label: "Transactions" },
  { value: "averagePositiveSale", label: "Average Positive Sale" },
];

const cardStyle: React.CSSProperties = {
  backgroundColor: esqTheme.colors.panel,
  border: `1px solid ${esqTheme.colors.border}`,
  borderRadius: esqTheme.radius.card,
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
  color: esqTheme.colors.text,
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function getMetricLabel(metric: MetricKey): string {
  return METRIC_OPTIONS.find((option) => option.value === metric)?.label ?? "";
}

function formatMetricValue(value: number, metric: MetricKey): string {
  if (metric === "transactions") return numberFormatter.format(value);
  return currencyFormatter.format(value);
}

function formatAxisValue(value: number, metric: MetricKey): string {
  if (metric === "transactions") return compactNumberFormatter.format(value);
  return compactCurrencyFormatter.format(value);
}

function truncateLabel(value: string, maxLength = 24): string {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function getChartColor(index: number): string {
  return esqTheme.dashboardColors[index % esqTheme.dashboardColors.length];
}

export default function HorizontalBarChartCard({
  title,
  data,
  metric,
}: {
  title: string;
  data: ChartRow[];
  metric: MetricKey;
}) {
  const metricLabel = getMetricLabel(metric);

  return (
    <div style={{ ...cardStyle, padding: "20px", minHeight: "460px" }}>
      <h3
        style={{
          marginTop: 0,
          marginBottom: "16px",
          color: esqTheme.colors.white,
          fontSize: "20px",
          fontWeight: 800,
        }}
      >
        {title}
      </h3>

      {data.length === 0 ? (
        <p style={{ color: "#cbd5e1" }}>No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={430}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 32, left: 12, bottom: 24 }}
            barCategoryGap={8}
          >
            <CartesianGrid
              stroke="rgba(255,255,255,0.14)"
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis
              type="number"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.25)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.25)" }}
              tickFormatter={(value) => formatAxisValue(Number(value), metric)}
            />

            <YAxis
              type="category"
              dataKey="name"
              width={95}
              tick={{ fill: "#e5e7eb", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => truncateLabel(String(value), 14)}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: esqTheme.colors.panelSoft,
                border: `1px solid ${esqTheme.colors.border}`,
                borderRadius: "10px",
                color: esqTheme.colors.white,
              }}
              labelStyle={{
                color: esqTheme.colors.white,
                fontWeight: 700,
              }}
              itemStyle={{
                color: esqTheme.colors.white,
              }}
              formatter={(value) => [
                formatMetricValue(Number(value), metric),
                metricLabel,
              ]}
              labelFormatter={(label) => String(label)}
            />

            <Bar
              dataKey="value"
              name={metricLabel}
              radius={[0, 6, 6, 0]}
              barSize={18}
            >
              {data.map((row, index) => (
                <Cell key={`cell-${row.name}`} fill={getChartColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}