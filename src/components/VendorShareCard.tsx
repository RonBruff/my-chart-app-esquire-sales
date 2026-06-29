import React from "react";
import { esqTheme } from "../theme/esqTheme";
import type { ChartRow, MetricKey } from "../types/sales";
//import ChartTooltip from "./ChartTooltip"; - Old usage may use again

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

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

function getChartColor(index: number): string {
  return esqTheme.dashboardColors[index % esqTheme.dashboardColors.length];
}

function formatValue(value: number, metric: MetricKey): string {
  if (metric === "transactions") return numberFormatter.format(value);
  return currencyFormatter.format(value);
}

export default function VenderShareCard ({
  title,
  data,
  metric,
}: {
  title: string;
  data: ChartRow[];
  metric: MetricKey;
}) {
  const topRows = data.slice(0, 8);
  const total = topRows.reduce((sum, row) => sum + Math.abs(row.value), 0);

  const topData = topRows.map((row) => ({
    ...row,
    percentOfTotal: total > 0 ? Math.abs(row.value) / total : 0,
  }));

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
          marginBottom: 16,
          color: esqTheme.colors.white,
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        {title}
      </h3>

      <div style={{ display: "grid", gap: 14 }}>
        {topData.map((row, index) => (
          <div key={row.name}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: 10,
                alignItems: "baseline",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  color: esqTheme.colors.white,
                  fontSize: 13,
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={row.name}
              >
                {row.name}
              </div>

              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {formatValue(row.value, metric)}
              </div>

              <div
                style={{
                  color: esqTheme.colors.orange,
                  fontSize: 12,
                  fontWeight: 800,
                  minWidth: 48,
                  textAlign: "right",
                }}
              >
                {percentFormatter.format(row.percentOfTotal)}
              </div>
            </div>

            <div
              style={{
                height: 9,
                backgroundColor: esqTheme.colors.panelSoft,
                borderRadius: 999,
                overflow: "hidden",
                border: `1px solid ${esqTheme.colors.border}`,
              }}
            >
              <div
                style={{
                  width: `${row.percentOfTotal * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: getChartColor(index),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}