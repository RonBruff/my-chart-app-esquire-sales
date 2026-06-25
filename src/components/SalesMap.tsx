import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { esqTheme } from "../theme/esqTheme";
import type { MapPoint } from "../types/sales";
import "leaflet/dist/leaflet.css";

const DEFAULT_MAP_CENTER: [number, number] = [46.2, -119.1];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const cardStyle: React.CSSProperties = {
  backgroundColor: esqTheme.colors.panel,
  border: `1px solid ${esqTheme.colors.border}`,
  borderRadius: esqTheme.radius.card,
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
  color: esqTheme.colors.text,
};

function getCircleRadius(amount: number): number {
  return Math.min(2500, Math.max(150, Math.sqrt(Math.abs(amount)) * 8));
}

function FitMapToPoints({ points }: { points: MapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 10);
      return;
    }

    const bounds = points.map(
      (point) => [point.lat, point.lng] as [number, number]
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, points]);

  return null;
}

export default function SalesMap({ mapData }: { mapData: MapPoint[] }) {
  return (
    <div style={{ ...cardStyle, padding: "18px" }}>
      <h3 style={{ marginTop: 0, color: esqTheme.colors.white }}>
        Geographic Sales Map
      </h3>

      <p style={{ color: "#cbd5e1", marginTop: 0 }}>
        Showing the top {numberFormatter.format(mapData.length)} mapped rows by
        absolute sales amount. Exact customer street addresses are intentionally
        hidden.
      </p>

      {mapData.length === 0 ? (
        <p style={{ color: "#cbd5e1" }}>
          No latitude and longitude values are available for the current filters.
        </p>
      ) : (
        <MapContainer
          center={DEFAULT_MAP_CENTER}
          zoom={6}
          zoomControl={false}
          style={{
            width: "100%",
            height: "70vh",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <FitMapToPoints points={mapData} />

          <ZoomControl position="topright" />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='<a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap contributors</a>'
          />

          {mapData.map((point, index) => (
            <Circle
              key={`${point.lat}-${point.lng}-${index}`}
              center={[point.lat, point.lng]}
              radius={getCircleRadius(point.amount)}
              color={point.amount < 0 ? esqTheme.colors.red : esqTheme.colors.blue}
              fillColor={
                point.amount < 0 ? esqTheme.colors.red : esqTheme.colors.blue
              }
              fillOpacity={0.45}
              eventHandlers={{
                mouseover: (event) => event.target.openPopup(),
                mouseout: (event) => event.target.closePopup(),
              }}
            >
              <Popup>
                <strong>Store: {point.store}</strong>
                <br />
                City: {point.city}, {point.state}
                <br />
                ZIP: {point.zip}
                <br />
                Sales Amount: {currencyFormatter.format(point.amount)}
                <br />
                Vendor: {point.vendor}
                <br />
                Category: {point.category}
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      )}
    </div>
  );
}