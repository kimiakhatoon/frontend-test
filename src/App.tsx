import React, { useEffect, useState } from "react";
import Chart from "./Chart"; 
import type { ChartData } from "./chartTypes.ts";

function App() {
  
  const [chartsData, setChartsData] = useState <ChartData[]> ([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setChartsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

   return (
    <div>
      <h1>Charts App</h1>
      {loading && <p>Loading data...</p>}
      {!loading &&
        chartsData.map((chart, idx) => <Chart chart={chart} key={idx} />)}
    </div>
  );
}

export default App;
