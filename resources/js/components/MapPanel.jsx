import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import worldJson from "../world.json";

echarts.registerMap("world", worldJson);

const MapPanel = ({ mapData }) => {
  const option = {
  backgroundColor: "transparent",

  tooltip: {
    trigger: "item",
    formatter: (params) => {
      if (!params.value) return `${params.name}<br/>No data`;
      return `${params.name}<br/>Deaths: ${params.value.toLocaleString()}`;
    }
  },

  visualMap: {
    min: 0,
    max: 1000000,
    left: 10,
    bottom: 10,
    itemWidth: 10,
    itemHeight: 80,
    text: ["High", "Low"],
    calculable: true,
    inRange: {
      color: [
        "#e0f2fe",
        "#bae6fd",
        "#7dd3fc",
        "#38bdf8",
        "#0ea5e9",
        "#0369a1"
      ]
    }
  },

  // 🔥 THIS CONTROLS FULL SIZE MAP
  geo: {
      map: "world",
      roam: true,

      layoutCenter: ["50%", "50%"],
      layoutSize: "130%",

      // 🔥 THIS IS THE REAL FIX
      boundingCoords: [
        [-180, 90],
        [180, -90]
      ],

      itemStyle: {
        areaColor: "#e5e7eb",
        borderColor: "#ffffff",
        borderWidth: 0.5
      },

      emphasis: {
        itemStyle: {
          areaColor: "#0ea5e9"
        }
      }
    },

  series: [
  {
    type: "map",
    map: "world",
    coordinateSystem: "geo",

    // 🔥 FORCE FIT
    geoIndex: 0,

    data: mapData.map((d) => ({
      name: d.country,
      value: d.total
    }))
  }
]
};

  return (
    <div className="h-[50vh] w-full">
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }}
        notMerge={true}
        lazyUpdate={true}
        autoResize={true}
      />
    </div>
  );
};

export default MapPanel;