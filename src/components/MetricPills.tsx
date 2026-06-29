import React from "react";
import { esqTheme } from "../theme/esqTheme";
import type { MetricKey, MetricOption } from "../types/sales";
import MetricTooltip from "./MetricTooltip";

const METRIC_OPTIONS: MetricOption[] = [
  { value: "netSales", label: "Net Sales" },
  { value: "grossSales", label: "Gross Sales" },
  { value: "returns", label: "Returns" },
  { value: "transactions", label: "Transactions" },
  { value: "averagePositiveSale", label: "Avg Sale" },
];

const METRIC_DESCRIPTIONS: Record<MetricKey, string> = {
  netSales: "Sales after returns and adjustments.",
  grossSales: "Positive sales only, excluding returns and adjustments.",
  returns: "Absolute value of negative sales or adjustments.",
  transactions: "Total number of rows matching the current filters.",
  averagePositiveSale:
    "Gross sales divided by positive transactions. Best used with enough transaction volume.",
};

export default function MetricPills({
  selectedMetric,
  onChange,
}: {
  selectedMetric: MetricKey;
  onChange: (metric: MetricKey) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {METRIC_OPTIONS.map((option) => {
        const active = option.value === selectedMetric;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 13px",
              borderRadius: 999,
              border: active
                ? `1px solid ${esqTheme.colors.orange}`
                : `1px solid ${esqTheme.colors.border}`,
              backgroundColor: active
                ? esqTheme.colors.orange
                : esqTheme.colors.panelSoft,
              color: esqTheme.colors.white,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
          >
            {option.label}

            {active && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 17,
                  height: 17,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,.35)",
                  background: "transparent",
                  color: "rgba(255,255,255,.9)",
                  fontSize: 11,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                i
              </span>
            )}

            {active && (
              <MetricTooltip
                title={option.label}
                description={METRIC_DESCRIPTIONS[option.value]}
              />
            )}
          </button>
        );
      })}

      <style>
        {`
          button:hover .metric-tooltip {
            visibility: visible !important;
            opacity: 1 !important;
          }
        `}
      </style>
    </div>
  );
}