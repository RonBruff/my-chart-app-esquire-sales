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
  subtitle?: string;
  isHero?: boolean;
};

export default function KpiCard({
  label,
  value,
  subtitle,
  isHero = false,
}: Props) {
  return (
    <div
      style={{
        ...cardStyle,
        position: "relative",
        overflow: "hidden",

        display: "flex",
        flexDirection: "column",

        justifyContent: isHero ? "space-between" : "flex-start",

        padding: isHero ? "16px 20px" : "12px 16px",

        minHeight: isHero ? 96 : 76,

        backgroundColor: isHero
          ? "#242424"
          : esqTheme.colors.panel,

        border: `1px solid ${
          isHero
            ? "rgba(234,114,57,.55)"
            : esqTheme.colors.border
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
            viewBox="0 0 240 90"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              right: 16,
              bottom: 12,
              width: "30%",
              height: "44%",
              opacity: 0.18,
              pointerEvents: "none",
            }}
          >
            <path
              d="M0 70
                 C25 55 45 68 65 48
                 S110 38 130 26
                 S175 30 195 18
                 S220 18 240 8"
              fill="none"
              stroke={esqTheme.colors.orange}
              strokeWidth="7"
              strokeLinecap="round"
            />

            <path
              d="M0 82
                 C30 72 48 80 70 62
                 S120 52 142 38
                 S185 40 206 30
                 S226 28 240 18"
              fill="none"
              stroke={esqTheme.colors.orange}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: isHero ? "68%" : "100%",
        }}
      >
        <div
          style={{
            color: esqTheme.colors.mutedText,
            fontSize: 13,
            fontWeight: 500,
            marginBottom: isHero ? 8 : 6,
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: esqTheme.colors.white,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,

            fontSize: isHero ? 34 : 24,

            marginBottom: isHero ? 0 : 8,

            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>
      </div>

      {subtitle && (
        <div
          style={{
            color: "#cbd5e1",
            fontSize: isHero ? 11 : 10,
            lineHeight: 1.3,
            opacity: 0.9,
            position: "relative",
            zIndex: 2,
            maxWidth: isHero ? "68%" : "100%",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}