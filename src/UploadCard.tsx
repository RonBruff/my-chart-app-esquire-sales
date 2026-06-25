import React from "react";
import { esqTheme } from "./theme/esqTheme";
import { numberFormatter } from "./utils/salesUtils";

const cardStyle: React.CSSProperties = {
  backgroundColor: esqTheme.colors.panel,
  border: `1px solid ${esqTheme.colors.border}`,
  borderRadius: esqTheme.radius.card,
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
  color: esqTheme.colors.text,
};

export default function UploadCard({
  fileName,
  rowCount,
  onFileUpload,
}: {
  fileName: string;
  rowCount: number;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        padding: "16px",
        marginBottom: "18px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        flexWrap: "wrap",
      }}
    >
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 14px",
          borderRadius: "10px",
          backgroundColor: esqTheme.colors.orange,
          color: esqTheme.colors.white,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Upload Excel File
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileUpload}
          style={{ display: "none" }}
        />
      </label>

      {fileName ? (
        <span style={{ color: "#cbd5e1" }}>
          Loaded <strong>{fileName}</strong> with{" "}
          <strong>{numberFormatter.format(rowCount)}</strong> rows.
        </span>
      ) : (
        <span style={{ color: "#cbd5e1" }}>
          Choose the sales workbook to begin.
        </span>
      )}
    </div>
  );
}