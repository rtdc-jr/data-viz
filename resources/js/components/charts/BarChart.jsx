import ReactECharts from "echarts-for-react";

const BarChart = ({ data }) => {

  const option = {
    title: { text: "Top Causes", left: "center" },
    grid: { left: 150 },
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: data.map(d => d.cause),
      inverse: true
    },
    series: [{
      type: "bar",
      data: data.map(d => d.total)
    }]
  };

  return <ReactECharts option={option} style={{ height: 250 }} />;
};

export default BarChart;