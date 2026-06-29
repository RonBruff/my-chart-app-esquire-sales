import React from "react";
import { esqTheme } from "../theme/esqTheme";
import type { MetricKey } from "../types/sales";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatValue(value: number, metric: MetricKey) {
  if (metric === "transactions") return numberFormatter.format(value);
  return currencyFormatter.format(value);
}

function getPayloadValue(item: any, key: string) {
  return (
    item?.payload?.[key] ??
    item?.payload?.root?.[key] ??
    item?.payload?.payload?.[key] ??
    item?.[key] ??
    undefined
  );
}

export default function ChartTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  metric: MetricKey;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];

  const name =
    getPayloadValue(item, "name") ??
    item?.name ??
    label ??
    "N/A";

  const value = Number(
    getPayloadValue(item, "value") ??
      item?.value ??
      0
  );

  const percentOfTotal = Number(
    getPayloadValue(item, "percentOfTotal") ?? 0
  );

  return (
    <div
      style={{
        backgroundColor: esqTheme.colors.panelSoft,
        border: `1px solid ${esqTheme.colors.border}`,
        borderRadius: 10,
        color: esqTheme.colors.white,
        padding: "10px 12px",
        boxShadow: "0 12px 28px rgba(0,0,0,.35)",
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontWeight: 800,
          marginBottom: 6,
          color: esqTheme.colors.white,
        }}
      >
        {String(name)}
      </div>

      <div style={{ color: "#cbd5e1", fontSize: 13 }}>
        {formatValue(value, metric)}
      </div>

      {percentOfTotal > 0 && (
        <div
          style={{
            color: esqTheme.colors.orange,
            fontSize: 12,
            marginTop: 4,
            fontWeight: 700,
          }}
        >
          {percentFormatter.format(percentOfTotal)} of shown total
        </div>
      )}
    </div>
  );
}