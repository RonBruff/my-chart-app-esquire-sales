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
  LabelList,
} from "recharts";
import { esqTheme } from "../theme/esqTheme";
import type { ChartRow, MetricKey, MetricOption } from "../types/sales";
import ChartTooltip from "./ChartTooltip";

const METRIC_OPTIONS: MetricOption[] = [
  { value: "netSales", label: "Net Sales" },
  { value: "grossSales", label: "Gross Sales" },
  { value: "returns", label: "Returns / Adjustments" },
  { value: "transactions", label: "Transactions" },
  { value: "averagePositiveSale", label: "Average Positive Sale" },
];

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function getMetricLabel(metric: MetricKey): string {
  return METRIC_OPTIONS.find((option) => option.value === metric)?.label ?? "";
}

function formatAxisValue(value: number, metric: MetricKey): string {
  if (metric === "transactions") return compactNumberFormatter.format(value);
  return compactCurrencyFormatter.format(value);
}

function truncateLabel(value: string, maxLength = 18): string {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function getChartColor(index: number): string {
  return esqTheme.dashboardColors[index % esqTheme.dashboardColors.length];
}

function CustomYAxisTick({ x, y, payload }: any) {
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      fill="#e5e7eb"
      fontSize={13}
      fontWeight={500}
    >
      {truncateLabel(String(payload.value), 18)}
    </text>
  );
}

function PercentLabel(props: any) {
  const { x, y, width, height, payload } = props;

  if (!payload?.percentOfTotal) return null;

  return (
    <text
      x={x + width + 8}
      y={y + height / 2}
      dy={4}
      fill="#cbd5e1"
      fontSize={12}
      fontWeight={700}
    >
      {percentFormatter.format(payload.percentOfTotal)}
    </text>
  );
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

  const total = data.reduce((sum, row) => sum + Math.abs(row.value), 0);

  const chartData = data.map((row) => ({
    ...row,
    percentOfTotal: total > 0 ? Math.abs(row.value) / total : 0,
  }));

  const chartHeight = Math.max(340, chartData.length * 30);

  return (
    <div
      style={{
        backgroundColor: esqTheme.colors.panel,
        border: `1px solid ${esqTheme.colors.border}`,
        borderRadius: esqTheme.radius.card,
        boxShadow: "0 14px 28px rgba(0,0,0,.22)",
        color: esqTheme.colors.text,
        padding: 18,
        minHeight: 400,
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 12,
          color: esqTheme.colors.white,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {title}
      </h3>

      {chartData.length === 0 ? (
        <p style={{ color: "#cbd5e1" }}>No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 75, left: 24, bottom: 24 }}
            barCategoryGap={16}
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
              width={130}
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={<CustomYAxisTick />}
            />

            <Tooltip content={<ChartTooltip metric={metric} />} />

            <Bar
              dataKey="value"
              name={metricLabel}
              radius={[0, 6, 6, 0]}
              barSize={16}
            >
              {chartData.map((row, index) => (
                <Cell key={`cell-${row.name}`} fill={getChartColor(index)} />
              ))}

              <LabelList content={<PercentLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}