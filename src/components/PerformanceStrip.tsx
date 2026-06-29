import React from "react";
import { esqTheme } from "../theme/esqTheme";
import type { SummaryMetrics } from "../types/sales";

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "orange" | "blue" | "green" | "red";
}) {
  const colorMap = {
    orange: esqTheme.colors.orange,
    blue: esqTheme.colors.blue,
    green: "#22c55e",
    red: esqTheme.colors.red,
  };

  const color = colorMap[tone];

  return (
    <div
      style={{
        backgroundColor: esqTheme.colors.panel,
        border: `1px solid ${esqTheme.colors.border}`,
        borderRadius: 999,
        padding: "9px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 10px 22px rgba(0,0,0,.18)",
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: 999,
          backgroundColor: color,
          boxShadow: `0 0 16px ${color}`,
        }}
      />

      <span
        style={{
          color: "#cbd5e1",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: esqTheme.colors.white,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function PerformanceStrip({
  filteredCount,
  totalCount,
  filteredSummary,
  totalSummary,
}: {
  filteredCount: number;
  totalCount: number;
  filteredSummary: SummaryMetrics;
  totalSummary: SummaryMetrics;
}) {
  const rowShare = totalCount > 0 ? filteredCount / totalCount : 0;

  const netSalesShare =
    totalSummary.netSales !== 0
      ? filteredSummary.netSales / totalSummary.netSales
      : 0;

  const avgSaleDelta =
    totalSummary.averagePositiveSale > 0
      ? filteredSummary.averagePositiveSale /
          totalSummary.averagePositiveSale -
        1
      : 0;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 18,
      }}
    >
      <StatPill
        label="Filtered rows"
        value={percentFormatter.format(rowShare)}
        tone="blue"
      />

      <StatPill
        label="Net sales share"
        value={percentFormatter.format(netSalesShare)}
        tone="orange"
      />

      <StatPill
        label="Return rate"
        value={percentFormatter.format(filteredSummary.returnRate)}
        tone={filteredSummary.returnRate > 0.1 ? "red" : "green"}
      />

      <StatPill
        label="Avg sale vs all"
        value={`${avgSaleDelta >= 0 ? "+" : ""}${percentFormatter.format(
          avgSaleDelta
        )}`}
        tone={avgSaleDelta >= 0 ? "green" : "red"}
      />
    </div>
  );
}