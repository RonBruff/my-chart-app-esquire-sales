import React from "react";
import { esqTheme } from "../theme/esqTheme";
import type { ChartRow } from "../types/sales";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function getShare(row: ChartRow | undefined, rows: ChartRow[]) {
  if (!row) return 0;

  const total = rows.reduce((sum, item) => sum + Math.abs(item.value), 0);
  return total > 0 ? Math.abs(row.value) / total : 0;
}

function InsightItem({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div
        style={{
          color: esqTheme.colors.orange,
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: ".08em",
          marginBottom: 5,
        }}
      >
        {eyebrow}
      </div>

      <div
        style={{
          color: esqTheme.colors.white,
          fontSize: 15,
          fontWeight: 800,
          marginBottom: 4,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#cbd5e1",
          fontSize: 13,
          lineHeight: 1.35,
        }}
      >
        {detail}
      </div>
    </div>
  );
}

export default function KeyInsightsCard({
  storeData,
  cityData,
  categoryData,
  vendorData,
  returnRate,
}: {
  storeData: ChartRow[];
  cityData: ChartRow[];
  categoryData: ChartRow[];
  vendorData: ChartRow[];
  returnRate: number;
}) {
  const topStore = storeData[0];
  const topCity = cityData[0];
  const topCategory = categoryData[0];
  const topVendor = vendorData[0];

  const topCategoryShare = getShare(topCategory, categoryData);
  const topVendorShare = getShare(topVendor, vendorData);

  return (
    <div
      style={{
        backgroundColor: esqTheme.colors.panel,
        border: `1px solid ${esqTheme.colors.border}`,
        borderRadius: esqTheme.radius.card,
        boxShadow: "0 14px 28px rgba(0,0,0,.22)",
        color: esqTheme.colors.text,
        padding: 24,
        minHeight: 400,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: esqTheme.colors.white,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Key Insights
        </h3>

        <div
          style={{
            flex: 1,
            height: 1,
            background: "rgba(255,255,255,.08)",
          }}
        />
      </div>

      <InsightItem
        eyebrow="Top store"
        title={
          topStore
            ? `Store ${topStore.name} leads sales`
            : "No store data available"
        }
        detail={
          topStore
            ? `${topStore.name} generated ${currencyFormatter.format(
                topStore.value
              )} in the current view.`
            : "Upload or filter data to see store insights."
        }
      />

      <InsightItem
        eyebrow="Category mix"
        title={
          topCategory
            ? `${topCategory.name} is the largest category`
            : "No category data available"
        }
        detail={
          topCategory
            ? `${topCategory.name} represents ${percentFormatter.format(
                topCategoryShare
              )} of the shown category total.`
            : "Category share will appear once data is available."
        }
      />

      <InsightItem
        eyebrow="Vendor concentration"
        title={
          topVendor
            ? `${topVendor.name} has the highest vendor share`
            : "No vendor data available"
        }
        detail={
          topVendor
            ? `${topVendor.name} accounts for ${percentFormatter.format(
                topVendorShare
              )} of the shown vendor total.`
            : "Vendor share will appear once data is available."
        }
      />

      <InsightItem
        eyebrow="Geography"
        title={
          topCity
            ? `${topCity.name} is the strongest city`
            : "No city data available"
        }
        detail={
          topCity
            ? `${topCity.name} ranks first among cities in the current filters.`
            : "City insights will appear once data is available."
        }
      />

      <div
        style={{
          paddingTop: 14,
        }}
      >
        <div
          style={{
            color: esqTheme.colors.orange,
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: ".08em",
            marginBottom: 5,
          }}
        >
          Returns
        </div>

        <div
          style={{
            color: esqTheme.colors.white,
            fontSize: 15,
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          Returns are {percentFormatter.format(returnRate)} of gross sales
        </div>

        <div
          style={{
            color: "#cbd5e1",
            fontSize: 13,
            lineHeight: 1.35,
          }}
        >
          Use this to quickly monitor whether returns are becoming material.
        </div>
      </div>
    </div>
  );
}