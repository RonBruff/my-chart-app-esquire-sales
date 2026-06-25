import React from "react";
import Select, { StylesConfig } from "react-select";
import { esqTheme } from "../theme/esqTheme";

import type {
  MetricKey,
  MetricOption,
  SelectOption,
} from "../types/sales";

const METRIC_OPTIONS: MetricOption[] = [
  { value: "netSales", label: "Net Sales" },
  { value: "grossSales", label: "Gross Sales" },
  { value: "returns", label: "Returns" },
  { value: "transactions", label: "Transactions" },
  { value: "averagePositiveSale", label: "Avg Sale" },
];

const METRIC_DESCRIPTIONS: Record<MetricKey, string> = {
  netSales: "Sales after returns and adjustments.",
  grossSales: "Positive sales only, excluding returns and adjustments.",
  returns: "Absolute value of negative sales or adjustments.",
  transactions: "Total number of rows matching the current filters.",
  averagePositiveSale:
    "Gross sales divided by positive transactions. Best used with enough transaction volume.",
};

const numberFormatter = new Intl.NumberFormat("en-US");

const customStyles: StylesConfig<any, boolean> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: esqTheme.colors.panelSoft,
    borderColor: state.isFocused
      ? esqTheme.colors.orange
      : esqTheme.colors.border,
    borderWidth: 2,
    minHeight: 46,
    borderRadius: 10,
    boxShadow: "none",
    transition: "all .15s ease",
    ":hover": {
      borderColor: esqTheme.colors.orange,
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "2px 12px",
  }),

  input: (base) => ({
    ...base,
    color: esqTheme.colors.white,
  }),

  singleValue: (base) => ({
    ...base,
    color: esqTheme.colors.white,
    fontWeight: 500,
  }),

  placeholder: (base) => ({
    ...base,
    color: esqTheme.colors.mutedText,
  }),

  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "rgba(255,255,255,.15)",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused
      ? esqTheme.colors.orange
      : esqTheme.colors.mutedText,
    ":hover": {
      color: esqTheme.colors.orange,
    },
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: esqTheme.colors.panel,
    borderRadius: 12,
    overflow: "hidden",
    border: `1px solid ${esqTheme.colors.border}`,
    marginTop: 6,
    zIndex: 9999,
  }),

  menuList: (base) => ({
    ...base,
    padding: 6,
  }),

  option: (base, state) => ({
    ...base,
    borderRadius: 8,
    marginBottom: 2,
    backgroundColor: state.isSelected
      ? esqTheme.colors.blue
      : state.isFocused
      ? esqTheme.colors.orange
      : esqTheme.colors.panel,
    color: "#fff",
    cursor: "pointer",
    ":active": {
      backgroundColor: esqTheme.colors.orange,
    },
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: esqTheme.colors.blue,
    borderRadius: 20,
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "#fff",
    fontWeight: 600,
    paddingLeft: 10,
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "#fff",
    ":hover": {
      backgroundColor: esqTheme.colors.red,
      color: "#fff",
    },
  }),
};

function getMetricLabel(metric: MetricKey): string {
  return METRIC_OPTIONS.find((option) => option.value === metric)?.label ?? "";
}

function MetricPills({
  selectedMetric,
  onChange,
}: {
  selectedMetric: MetricKey;
  onChange: (metric: MetricKey) => void;
}) {
  return (
    <div style={{ flex: "1 1 100%", minWidth: "220px" }}>
      <label
        style={{
          display: "block",
          color: esqTheme.colors.white,
          fontSize: "13px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        Metric
      </label>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {METRIC_OPTIONS.map((option) => {
          const isActive = option.value === selectedMetric;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              style={{
                padding: "10px 14px",
                borderRadius: esqTheme.radius.button,
                border: isActive
                  ? `1px solid ${esqTheme.colors.orange}`
                  : `1px solid ${esqTheme.colors.border}`,
                backgroundColor: isActive
                  ? esqTheme.colors.orange
                  : esqTheme.colors.panelSoft,
                color: esqTheme.colors.white,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "13px",
                transition: "all .15s ease",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  options,
  selectedValues,
  onChange,
}: {
  label: string;
  options: SelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div style={{ minWidth: "220px", flex: "1 1 220px" }}>
      <label
        style={{
          display: "block",
          color: esqTheme.colors.white,
          fontSize: "13px",
          fontWeight: 700,
          marginBottom: "6px",
        }}
      >
        {label}
      </label>

      <Select<SelectOption, true>
        options={options}
        isMulti
        styles={customStyles}
        value={options.filter((option) => selectedValues.includes(option.value))}
        onChange={(selected) =>
          onChange(selected ? selected.map((option) => option.value) : [])
        }
        placeholder={`Filter by ${label}`}
      />
    </div>
  );
}

type FilterOptions = {
  states: SelectOption[];
  cities: SelectOption[];
  stores: SelectOption[];
  vendors: SelectOption[];
  categories: SelectOption[];
};

export default function FilterPanel({
  filtersOpen,
  setFiltersOpen,
  selectedMetric,
  setSelectedMetric,
  filterOptions,
  selectedStates,
  setSelectedStates,
  selectedCities,
  setSelectedCities,
  selectedStores,
  setSelectedStores,
  selectedVendors,
  setSelectedVendors,
  selectedCategories,
  setSelectedCategories,
  filteredCount,
  totalCount,
  resetFilters,
}: {
  filtersOpen: boolean;
  setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMetric: MetricKey;
  setSelectedMetric: React.Dispatch<React.SetStateAction<MetricKey>>;
  filterOptions: FilterOptions;
  selectedStates: string[];
  setSelectedStates: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCities: string[];
  setSelectedCities: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStores: string[];
  setSelectedStores: React.Dispatch<React.SetStateAction<string[]>>;
  selectedVendors: string[];
  setSelectedVendors: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  filteredCount: number;
  totalCount: number;
  resetFilters: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: esqTheme.colors.panel,
        border: `1px solid ${esqTheme.colors.border}`,
        borderRadius: esqTheme.radius.card,
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
        color: esqTheme.colors.text,
        padding: "16px",
        marginBottom: "18px",
      }}
    >
      <button
        onClick={() => setFiltersOpen((current) => !current)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "transparent",
          border: "none",
          padding: 0,
          marginBottom: filtersOpen ? "16px" : 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: esqTheme.colors.white,
              fontSize: "18px",
              fontWeight: 800,
            }}
          >
            {filtersOpen ? "▼" : "▶"} Filters
          </h3>

          <div
            style={{
              color: "#cbd5e1",
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            Showing {numberFormatter.format(filteredCount)} of{" "}
            {numberFormatter.format(totalCount)} rows.
          </div>
        </div>

        <span
          style={{
            color: esqTheme.colors.orange,
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          {filtersOpen ? "Collapse" : "Expand"}
        </span>
      </button>

      {filtersOpen && (
        <>
          <MetricPills
            selectedMetric={selectedMetric}
            onChange={setSelectedMetric}
          />

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              alignItems: "flex-end",
              marginTop: "16px",
            }}
          >
            <FilterSelect
              label="State"
              options={filterOptions.states}
              selectedValues={selectedStates}
              onChange={setSelectedStates}
            />

            <FilterSelect
              label="City"
              options={filterOptions.cities}
              selectedValues={selectedCities}
              onChange={setSelectedCities}
            />

            <FilterSelect
              label="Store"
              options={filterOptions.stores}
              selectedValues={selectedStores}
              onChange={setSelectedStores}
            />

            <FilterSelect
              label="Vendor"
              options={filterOptions.vendors}
              selectedValues={selectedVendors}
              onChange={setSelectedVendors}
            />

            <FilterSelect
              label="Category"
              options={filterOptions.categories}
              selectedValues={selectedCategories}
              onChange={setSelectedCategories}
            />

            <button
              onClick={resetFilters}
              style={{
                minHeight: "46px",
                padding: "0 16px",
                borderRadius: esqTheme.radius.input,
                border: `1px solid ${esqTheme.colors.border}`,
                backgroundColor: esqTheme.colors.panelSoft,
                color: esqTheme.colors.white,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Reset Filters
            </button>
          </div>

          <div
            style={{
              marginTop: "16px",
              padding: "12px 16px",
              backgroundColor: esqTheme.colors.panelSoft,
              border: `1px solid ${esqTheme.colors.border}`,
              borderRadius: "10px",
              color: "#cbd5e1",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: esqTheme.colors.orange }}>
              {getMetricLabel(selectedMetric)}
            </strong>

            <div style={{ marginTop: "4px" }}>
              {METRIC_DESCRIPTIONS[selectedMetric]}
            </div>
          </div>
        </>
      )}
    </div>
  );
}