import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { esqTheme } from "../theme/esqTheme";
import KpiCard from "./KpiCard";
import HorizontalBarChartCard from "./HorizontalBarChartCard";
import SalesMap from "./SalesMap";
import FilterPanel from "./FilterPanel";
import UploadCard from "./UploadCard";

import type {
  FilterKey,
  MetricKey,
  SalesRow,
  SelectOption,
  Tab,
} from "../types/sales";

import {
  buildChartSections,
  buildMapData,
  calculateSummary,
  currencyFormatter,
  makeOptions,
  matchesFilter,
  numberFormatter,
  percentFormatter,
} from "../utils/salesUtils";

const cardStyle: React.CSSProperties = {
  backgroundColor: esqTheme.colors.panel,
  border: `1px solid ${esqTheme.colors.border}`,
  borderRadius: esqTheme.radius.card,
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
  color: esqTheme.colors.text,
};

const SalesCharts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Charts");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [allData, setAllData] = useState<SalesRow[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("netSales");

  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [fileName, setFileName] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const rowsMatchingFilters = useMemo(() => {
    return (ignoredFilter?: FilterKey): SalesRow[] => {
      return allData.filter((row) => {
        return (
          (ignoredFilter === "state" ||
            matchesFilter(selectedStates, row["state_abbreviation"])) &&
          (ignoredFilter === "city" ||
            matchesFilter(selectedCities, row["city_name"])) &&
          (ignoredFilter === "store" ||
            matchesFilter(selectedStores, row["store location"])) &&
          (ignoredFilter === "vendor" ||
            matchesFilter(selectedVendors, row["vendor"])) &&
          (ignoredFilter === "category" ||
            matchesFilter(selectedCategories, row["category"]))
        );
      });
    };
  }, [
    allData,
    selectedStates,
    selectedCities,
    selectedStores,
    selectedVendors,
    selectedCategories,
  ]);

  const filteredData = useMemo(
    () => rowsMatchingFilters(),
    [rowsMatchingFilters]
  );

  const filterOptions = useMemo(
    () => ({
      states: makeOptions(rowsMatchingFilters("state"), "state_abbreviation"),
      cities: makeOptions(rowsMatchingFilters("city"), "city_name"),
      stores: makeOptions(rowsMatchingFilters("store"), "store location"),
      vendors: makeOptions(rowsMatchingFilters("vendor"), "vendor"),
      categories: makeOptions(rowsMatchingFilters("category"), "category"),
    }),
    [rowsMatchingFilters]
  );

  useEffect(() => {
    const pruneValues = (current: string[], options: SelectOption[]) => {
      const validValues = new Set(options.map((option) => option.value));
      const next = current.filter((value) => validValues.has(value));

      return next.length === current.length ? current : next;
    };

    setSelectedStates((current) => pruneValues(current, filterOptions.states));
    setSelectedCities((current) => pruneValues(current, filterOptions.cities));
    setSelectedStores((current) => pruneValues(current, filterOptions.stores));
    setSelectedVendors((current) => pruneValues(current, filterOptions.vendors));
    setSelectedCategories((current) =>
      pruneValues(current, filterOptions.categories)
    );
  }, [filterOptions]);

  const summary = useMemo(() => calculateSummary(filteredData), [filteredData]);

  const chartSections = useMemo(
    () => buildChartSections(filteredData, selectedMetric),
    [filteredData, selectedMetric]
  );

  const mapData = useMemo(() => buildMapData(filteredData), [filteredData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      try {
        const fileData = readerEvent.target?.result;

        if (!(fileData instanceof ArrayBuffer)) {
          setUploadError("The file could not be read.");
          return;
        }

        const workbook = XLSX.read(fileData, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json<SalesRow>(sheet, {
          defval: "",
        });

        if (jsonData.length === 0) {
          setUploadError("The selected workbook does not contain any rows.");
          return;
        }

        setAllData(jsonData);
        setFileName(file.name);
        setActiveTab("Charts");
        setFiltersOpen(true);
        resetFilters();
      } catch (error) {
        setUploadError(
          error instanceof Error
            ? error.message
            : "Something went wrong while reading the file."
        );
      }
    };

    reader.onerror = () => {
      setUploadError("Something went wrong while reading the file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const resetFilters = () => {
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedStores([]);
    setSelectedVendors([]);
    setSelectedCategories([]);
  };

  const tabButtonStyle = (tab: Tab): React.CSSProperties => ({
    padding: "10px 18px",
    borderRadius: esqTheme.radius.button,
    border:
      activeTab === tab
        ? `1px solid ${esqTheme.colors.orange}`
        : `1px solid ${esqTheme.colors.border}`,
    backgroundColor:
      activeTab === tab ? esqTheme.colors.orange : esqTheme.colors.panelSoft,
    color: esqTheme.colors.white,
    cursor: "pointer",
    fontWeight: 700,
  });

  const kpiCards = [
    {
      label: "Net Sales",
      value: currencyFormatter.format(summary.netSales),
      subtitle: "Sales after returns / adjustments",
    },
    {
      label: "Transactions",
      value: numberFormatter.format(summary.transactions),
      subtitle: `${numberFormatter.format(
        summary.positiveTransactions
      )} positive transactions`,
    },
    {
      label: "Average Sale",
      value: currencyFormatter.format(summary.averagePositiveSale),
      subtitle: "Based on positive sales",
    },
    {
      label: "Gross Sales",
      value: currencyFormatter.format(summary.grossSales),
      subtitle: "Positive sales only",
    },
    {
      label: "Returns",
      value: currencyFormatter.format(summary.returns),
      subtitle: `${percentFormatter.format(summary.returnRate)} of gross sales`,
    },
    {
      label: "Stores",
      value: numberFormatter.format(summary.uniqueStores),
      subtitle: "Active store locations",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${esqTheme.colors.nearBlack}, ${esqTheme.colors.darkGray})`,
        color: esqTheme.colors.text,
        fontFamily: esqTheme.fonts.body,
        padding: "16px",
      }}
    >
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
  <h2 style={{ margin: 0, color: esqTheme.colors.white }}>
    Sales Insights
  </h2>
  <p style={{ color: "#cbd5e1", marginTop: "6px" }}>
    Upload an Excel file and explore sales by state, city, store,
    vendor, category, ZIP code, and geography.
  </p>
</div>

<div
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
  }}
>
  <UploadCard
    fileName={fileName}
    rowCount={allData.length}
    onFileUpload={handleFileUpload}
  />
</div>

<div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setActiveTab("Charts")}
              style={tabButtonStyle("Charts")}
            >
              Charts
            </button>

            <button
              onClick={() => setActiveTab("Map")}
              style={tabButtonStyle("Map")}
            >
              Map
            </button>
          </div>
        </div>

        {uploadError && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              color: "#991b1b",
              padding: "12px",
              marginBottom: "18px",
            }}
          >
            {uploadError}
          </div>
        )}

        {allData.length === 0 && !uploadError && (
          <div
            style={{
              ...cardStyle,
              padding: "28px",
              color: "#cbd5e1",
              textAlign: "center",
            }}
          >
            Upload your sales Excel file to generate KPIs, charts, filters, and
            the map.
          </div>
        )}

        {allData.length > 0 && (
          <>
            <FilterPanel
              filtersOpen={filtersOpen}
              setFiltersOpen={setFiltersOpen}
              selectedMetric={selectedMetric}
              setSelectedMetric={setSelectedMetric}
              filterOptions={filterOptions}
              selectedStates={selectedStates}
              setSelectedStates={setSelectedStates}
              selectedCities={selectedCities}
              setSelectedCities={setSelectedCities}
              selectedStores={selectedStores}
              setSelectedStores={setSelectedStores}
              selectedVendors={selectedVendors}
              setSelectedVendors={setSelectedVendors}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              filteredCount={filteredData.length}
              totalCount={allData.length}
              resetFilters={resetFilters}
            />

            <div
  style={{
    display: "grid",
    gridTemplateColumns: "2fr repeat(5, 1fr)",
    gap: "12px",
    marginBottom: "20px",
    alignItems: "stretch",
  }}
>
  <KpiCard
    label={kpiCards[0].label}
    value={kpiCards[0].value}
    subtitle={kpiCards[0].subtitle}
    isHero
  />

  {kpiCards.slice(1).map((kpi) => (
    <KpiCard
      key={kpi.label}
      label={kpi.label}
      value={kpi.value}
      subtitle={kpi.subtitle}
    />
  ))}
</div>

            {activeTab === "Charts" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(620px, 1fr))",
                  gap: "24px",
                }}
              >
                {chartSections.map((section) => (
                  <HorizontalBarChartCard
                    key={section.title}
                    title={section.title}
                    data={section.data}
                    metric={selectedMetric}
                  />
                ))}
              </div>
            )}

            {activeTab === "Map" && <SalesMap mapData={mapData} />}
          </>
        )}
      </div>
    </div>
  );
};

export default SalesCharts;