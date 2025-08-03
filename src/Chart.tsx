import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { ChartData } from "./chartTypes";

interface ChartProps {
  chart: ChartData;
}

const width = 500;
const height = 200;
const margin = { top: 20, right: 20, bottom: 30, left: 40 };

const Chart: React.FC<ChartProps> = ({ chart }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);


  const isMultiSeries = chart.data.some((item) => Array.isArray(item[1]));
useEffect(() => {
    if (!svgRef.current) return;


    d3.select(svgRef.current).selectAll("*").remove();

    if (!isMultiSeries) {

      const filteredData = chart.data.filter(
        (d) => typeof d[1] === "number" && d[1] !== null
      ) as [number, number][];

      const x = d3
        .scaleLinear()
        .domain(d3.extent(filteredData, (d) => d[0]) as [number, number])
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(filteredData, (d) => d[1]) as [number, number])
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line<[number, number]>()
        .x((d) => x(d[0]))
        .y((d) => y(d[1]));

      d3.select(svgRef.current)
        .append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "#0074D9") 
        .attr("stroke-width", 2)
        .attr("d", line);

      d3.select(svgRef.current)
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(6));

      d3.select(svgRef.current)
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    } else {

      const seriesData = [[], [], []]; 


      chart.data.forEach((d) => {
        if (Array.isArray(d[1])) {
          d[1].forEach((value, index) => {
            if (value !== null) {
              seriesData[index].push([d[0], value]);
            }
          });
        }
      });

      const x = d3
        .scaleLinear()
        .domain(d3.extent(seriesData[0], (d) => d[0]) as [number, number])
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([
        Math.min(...seriesData.flatMap((d) => d.map((e) => e[1]))),
        Math.max(...seriesData.flatMap((d) => d.map((e) => e[1]))),]
      )
  .range([height - margin.bottom, margin.top]);


      const line = d3
        .line<[number, number]>()
        .x((d) => x(d[0]))
        .y((d) => y(d[1]));


      const colors = ["#0074D9", "#2ECC40", "#FF4136"]; 
      seriesData.forEach((data, index) => {
        const filteredData = data.filter((d) => d[1] !== null);
        d3.select(svgRef.current)
        .append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", colors[index])
        .attr("stroke-width", 2)
        .attr("d", line);
});

      d3.select(svgRef.current)
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(6));

      d3.select(svgRef.current)
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    }
  }, [chart, isMultiSeries]);

  return (
    <div style={{ margin: "40px 0" }}>
      <h2>{chart.title}</h2>
      <p>Type: {isMultiSeries ? "multi" : "single"}</p>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default Chart;
