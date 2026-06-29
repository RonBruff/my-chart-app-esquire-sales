import React from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { esqTheme } from "../theme/esqTheme";
import type { ChartRow, MetricKey } from "../types/sales";
import ChartTooltip from "./ChartTooltip";

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function getChartColor(index: number): string {
  return esqTheme.dashboardColors[index % esqTheme.dashboardColors.length];
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}

function CustomTreemapContent(props: any) {
  const { x, y, width, height, name, index, percentOfTotal } = props;

  const showName = width >= 42 && height >= 24;
  const showPercent = width >= 42 && height >= 46;
  const compact = width < 90;
  const veryCompact = width < 65;

  const labelFontSize = veryCompact ? 10 : compact ? 11 : 14;
  const percentFontSize = veryCompact ? 9 : compact ? 10 : 13;
  const labelMaxLength = veryCompact ? 4 : compact ? 5 : 12;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={3}
        ry={3}
        fill={getChartColor(index)}
        stroke="rgba(255,255,255,.08)"
        strokeWidth={1}
      />

      {showName && (
        <text
          x={x + 8}
          y={y + 20}
          fill="#fff"
          fontSize={labelFontSize}
          fontWeight={800}
          style={{ pointerEvents: "none" }}
        >
          {truncate(String(name), labelMaxLength)}
        </text>
      )}

      {showPercent && (
        <text
          x={x + 8}
          y={y + 38}
          fill="rgba(255,255,255,.9)"
          fontSize={percentFontSize}
          fontWeight={700}
          style={{ pointerEvents: "none" }}
        >
          {percentFormatter.format(percentOfTotal ?? 0)}
        </text>
      )}
    </g>
  );
}

export default function TreemapChartCard({
  title,
  data,
  metric,
}: {
  title: string;
  data: ChartRow[];
  metric: MetricKey;
}) {
  const topRows = data.slice(0, 12);
  const total = topRows.reduce((sum, row) => sum + row.value, 0);

  const topData = topRows.map((row) => ({
    ...row,
    percentOfTotal: total > 0 ? row.value / total : 0,
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
          marginBottom: 12,
          color: esqTheme.colors.white,
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={330}>
        <Treemap
          data={topData}
          dataKey="value"
          nameKey="name"
          stroke="transparent"
          isAnimationActive={false}
          content={<CustomTreemapContent />}
        >
          <Tooltip content={<ChartTooltip metric={metric} />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}