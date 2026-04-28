import ReactECharts from "echarts-for-react";
import { Card } from "antd";
import * as echarts from "echarts";
import worldJson from "../world.json";

echarts.registerMap("world", worldJson);

const MapPanel = ({ mapData, filters, topCauses }) => {

  const mapOption = {
    title: {
      text: "Global Death Distribution",
      left: "center"
    },
    tooltip: { trigger: "item" },
    visualMap: {
      min: 0,
      max: 1000000,
      left: "left",
      bottom: 20,
      text: ["High", "Low"],
      calculable: true
    },
    series: [{
      type: "map",
      map: "world",
      roam: true,
      data: mapData.map(d => ({
        name: d.country,
        value: d.total
      }))
    }]
  };

  return (
    <div className="flex-1 p-4 flex flex-col">

      <h2 className="text-lg font-semibold mb-2">
        In {filters.year || "selected year"}, leading cause is{" "}
        <span className="text-blue-600">
          {topCauses[0]?.cause || "Loading..."}
        </span>
      </h2>

      <div className="flex-1">
        <Card className="h-full" bodyStyle={{ height: "100%" }}>

          <ReactECharts
            option={mapOption}
            style={{ height: "100%", width: "100%" }}
          />

        </Card>
      </div>

    </div>
  );
};

export default MapPanel;