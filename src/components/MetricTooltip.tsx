import React from "react";
import { esqTheme } from "../theme/esqTheme";

export default function MetricTooltip({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <span
      className="metric-tooltip"
      style={{
        visibility: "hidden",
        opacity: 0,
        position: "absolute",
        left: 0,
        top: "calc(100% + 10px)",
        width: 280,
        padding: "10px 12px",
        borderRadius: 10,
        backgroundColor: esqTheme.colors.panel,
        border: `1px solid ${esqTheme.colors.border}`,
        color: "#cbd5e1",
        boxShadow: "0 14px 30px rgba(0,0,0,.35)",
        zIndex: 99999,
        textAlign: "left",
        lineHeight: 1.35,
        pointerEvents: "none",
        transition: "opacity .15s ease",
        whiteSpace: "normal",
      }}
    >
      <strong
        style={{
          display: "block",
          color: esqTheme.colors.orange,
          marginBottom: 4,
        }}
      >
        {title}
      </strong>

      {description}
    </span>
  );
}