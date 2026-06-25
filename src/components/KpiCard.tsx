import React from "react";
import { esqTheme } from "../theme/esqTheme";

const cardStyle: React.CSSProperties = {
  backgroundColor: esqTheme.colors.panel,
  border: `1px solid ${esqTheme.colors.border}`,
  borderRadius: esqTheme.radius.card,
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
  color: esqTheme.colors.text,
};

export default function KpiCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div style={{ ...cardStyle, padding: "18px" }}>
      <div
        style={{
          color: esqTheme.colors.mutedText,
          fontSize: "14px",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: esqTheme.colors.white,
          fontSize: "26px",
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      {subtitle && (
        <div style={{ color: "#cbd5e1", fontSize: "12px", marginTop: "6px" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}