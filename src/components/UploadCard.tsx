import React from "react";
import { esqTheme } from "../theme/esqTheme";
import { numberFormatter } from "../utils/salesUtils";

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
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: esqTheme.colors.panel,
        border: `1px solid ${esqTheme.colors.border}`,
        borderRadius: "999px",
        padding: "8px 10px 8px 14px",
        maxWidth: "520px",
      }}
    >
      {fileName && (
        <div
          style={{
            color: "#cbd5e1",
            fontSize: "13px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "320px",
          }}
        >
          📄 <strong>{fileName}</strong> · {numberFormatter.format(rowCount)} rows
        </div>
      )}

      <label
        style={{
          padding: "8px 12px",
          borderRadius: "999px",
          backgroundColor: esqTheme.colors.orange,
          color: esqTheme.colors.white,
          fontWeight: 700,
          cursor: "pointer",
          fontSize: "13px",
          whiteSpace: "nowrap",
        }}
      >
        {fileName ? "Replace" : "Load Data"}

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onFileUpload}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
}