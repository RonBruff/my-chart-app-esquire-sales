import React from "react";
import { esqTheme } from "../theme/esqTheme";

const cardStyle: React.CSSProperties = {
  backgroundColor: esqTheme.colors.panel,
  border: `1px solid ${esqTheme.colors.border}`,
  borderRadius: esqTheme.radius.card,
  boxShadow: "0 14px 28px rgba(0,0,0,.22)",
  color: esqTheme.colors.text,
};

type Props = {
  label: string;
  value: string;
  exactValue?: string;
  subtitle?: string;
  isHero?: boolean;
};

export default function KpiCard({
  label,
  value,
  exactValue,
  subtitle,
  isHero = false,
}: Props) {
  return (
    <div
      title={exactValue ? `${label}: ${exactValue}` : label}
      style={{
        ...cardStyle,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: isHero ? "center" : "flex-start",
        padding: isHero ? "18px 22px" : "12px 16px",
        minHeight: isHero ? 118 : 76,
        backgroundColor: isHero ? "#242424" : esqTheme.colors.panel,
        border: `1px solid ${
          isHero ? "rgba(234,114,57,.55)" : esqTheme.colors.border
        }`,
      }}
    >
      {isHero && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 4,
              background: esqTheme.colors.orange,
            }}
          />

          <svg
            viewBox="0 0 260 110"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              right: 18,
              bottom: 18,
              width: "42%",
              height: "58%",
              opacity: 0.16,
              pointerEvents: "none",
            }}
          >
            <path
              d="M0 82 C22 72 38 76 58 62 C78 48 92 55 112 40 C136 22 150 35 172 22 C196 8 210 18 232 10 C244 6 252 6 260 2"
              fill="none"
              stroke={esqTheme.colors.orange}
              strokeWidth="9"
              strokeLinecap="round"
            />

            <path
              d="M0 102 C28 90 42 94 66 78 C92 60 104 66 128 50 C154 32 166 44 190 30 C214 16 228 22 250 14"
              fill="none"
              stroke={esqTheme.colors.orange}
              strokeWidth="3"
              strokeLinecap="round"
              opacity={0.75}
            />
          </svg>
        </>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: esqTheme.colors.mutedText,
            fontSize: isHero ? 16 : 13,
            fontWeight: 500,
            marginBottom: isHero ? 10 : 6,
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: esqTheme.colors.white,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            fontSize: isHero ? 42 : 24,
            marginBottom: isHero ? 12 : 8,
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>

        {subtitle && (
          <div
            style={{
              color: "#cbd5e1",
              fontSize: isHero ? 13 : 10,
              lineHeight: 1.3,
              opacity: 0.9,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}