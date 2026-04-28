import ReactECharts from "echarts-for-react";

const LineChart = ({ data }) => {

  const years = [...new Set(data.map(d => d.year))];
  const causes = [...new Set(data.map(d => d.cause))].slice(0, 5);

  const series = causes.map(cause => ({
    name: cause,
    type: "line",
    smooth: true,
    data: years.map(year => {
      const found = data.find(d => d.year === year && d.cause === cause);
      return found ? found.total : 0;
    })
  }));

  const option = {
    title: { text: "Trend", left: "center" },
    tooltip: { trigger: "axis" },
    legend: { top: 25 },
    xAxis: { type: "category", data: years },
    yAxis: { type: "value" },
    series
  };

  return <ReactECharts option={option} style={{ height: 250 }} />;
};

export default LineChart;