import React from "react";
import BarChartComponent from "./components/BarChartComponent";
import { esqTheme } from "./theme/esqTheme";

const App: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: esqTheme.colors.background,
        minHeight: "100vh",
      }}
    >
      <BarChartComponent />
    </div>
  );
};

export default App;

