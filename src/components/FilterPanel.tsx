import React from "react";
import Select, { StylesConfig } from "react-select";
import { esqTheme } from "../theme/esqTheme";
import MetricPills from "./MetricPills";

import type { MetricKey, SelectOption } from "../types/sales";

const numberFormatter = new Intl.NumberFormat("en-US");

const customStyles: StylesConfig<SelectOption, true> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: esqTheme.colors.panelSoft,
    borderColor: state.isFocused
      ? esqTheme.colors.orange
      : esqTheme.colors.border,
    borderWidth: 1,
    minHeight: 38,
    borderRadius: 999,
    boxShadow: "none",
    cursor: "pointer",
    ":hover": {
      borderColor: esqTheme.colors.orange,
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 9px",
  }),
  input: (base) => ({
    ...base,
    color: esqTheme.colors.white,
  }),
  placeholder: (base) => ({
    ...base,
    color: esqTheme.colors.mutedText,
    fontSize: 13,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: esqTheme.colors.mutedText,
    padding: "4px 8px",
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
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? esqTheme.colors.blue
      : state.isFocused
      ? esqTheme.colors.orange
      : esqTheme.colors.panel,
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: esqTheme.colors.blue,
    borderRadius: 999,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
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

function CompactFilterSelect({
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
    <div style={{ minWidth: 175, flex: "1 1 175px" }}>
      <Select<SelectOption, true>
        options={options}
        isMulti
        styles={customStyles}
        value={options.filter((option) => selectedValues.includes(option.value))}
        onChange={(selected) =>
          onChange(selected ? selected.map((option) => option.value) : [])
        }
        placeholder={label}
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
        backgroundColor: "transparent",
        borderBottom: `1px solid ${esqTheme.colors.border}`,
        padding: "8px 0 12px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "flex-start",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              color: esqTheme.colors.white,
              fontSize: 15,
              fontWeight: 800,
              marginBottom: 6,
            }}
          >
            Dashboard Controls
          </div>

          <MetricPills
            selectedMetric={selectedMetric}
            onChange={setSelectedMetric}
          />
        </div>

        <div
          style={{
            color: "#cbd5e1",
            fontSize: 12,
            whiteSpace: "nowrap",
            marginTop: 2,
          }}
        >
          {numberFormatter.format(filteredCount)} of{" "}
          {numberFormatter.format(totalCount)} rows
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <CompactFilterSelect
          label="State"
          options={filterOptions.states}
          selectedValues={selectedStates}
          onChange={setSelectedStates}
        />

        <CompactFilterSelect
          label="City"
          options={filterOptions.cities}
          selectedValues={selectedCities}
          onChange={setSelectedCities}
        />

        <CompactFilterSelect
          label="Store"
          options={filterOptions.stores}
          selectedValues={selectedStores}
          onChange={setSelectedStores}
        />

        <CompactFilterSelect
          label="Vendor"
          options={filterOptions.vendors}
          selectedValues={selectedVendors}
          onChange={setSelectedVendors}
        />

        <CompactFilterSelect
          label="Category"
          options={filterOptions.categories}
          selectedValues={selectedCategories}
          onChange={setSelectedCategories}
        />

        <button
          onClick={resetFilters}
          style={{
            minHeight: 38,
            padding: "0 14px",
            borderRadius: 999,
            border: `1px solid ${esqTheme.colors.border}`,
            backgroundColor: esqTheme.colors.panelSoft,
            color: esqTheme.colors.white,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            whiteSpace: "nowrap",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}