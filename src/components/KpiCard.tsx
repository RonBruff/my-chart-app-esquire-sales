import React from "react";
import { esqTheme } from "../theme/esqTheme";

const cardStyle: React.CSSProperties = {
  backgroundColor: esqTheme.colors.panel,
  border: `1px solid ${esqTheme.colors.border}`,
  borderRadius: esqTheme.radius.card,
  boxShadow: "0 14px 28px rgba(0, 0, 0, 0.22)",
  color: esqTheme.colors.text,
};

export default function KpiCard({
  label,
  value,
  subtitle,
  isHero = false,
}: {
  label: string;
  value: string;
  subtitle?: string;
  isHero?: boolean;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        position: "relative",
        padding: "14px 16px",
        minHeight: "108px",
        overflow: "hidden",
        backgroundColor: isHero ? "#242424" : esqTheme.colors.panel,
        border: `1px solid ${
          isHero ? "rgba(234,114,57,.6)" : esqTheme.colors.border
        }`,
      }}
    >
      {isHero && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: esqTheme.colors.orange,
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            color: esqTheme.colors.mutedText,
            fontSize: "13px",
          }}
        >
          {label}
        </div>

        {isHero && (
          <div
            style={{
              color: esqTheme.colors.orange,
              fontSize: "10px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            Primary
          </div>
        )}
      </div>

      <div
        style={{
          color: esqTheme.colors.white,
          fontSize: isHero ? "30px" : "24px",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          position: "relative",
          zIndex: 2,
        }}
      >
        {value}
      </div>

      {subtitle && (
        <div
          style={{
            color: "#cbd5e1",
            fontSize: "12px",
            marginTop: "8px",
            opacity: 0.9,
            position: "relative",
            zIndex: 2,
          }}
        >
          {subtitle}
        </div>
      )}

      {isHero && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "16px",
            bottom: "12px",
            display: "flex",
            alignItems: "flex-end",
            gap: "5px",
            height: "48px",
            opacity: 0.45,
          }}
        >
          {[14, 22, 18, 30, 24, 38, 32, 44].map((height, index) => (
            <div
              key={index}
              style={{
                width: "7px",
                height,
                borderRadius: "999px",
                backgroundColor: esqTheme.colors.orange,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}