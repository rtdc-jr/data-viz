// RightPanel.jsx

import { Card, Progress, Spin } from "antd";
import ReactECharts from "echarts-for-react";

const RightPanel = ({ loading, topCauses, trends }) => {
  return (
    <div className="h-full flex flex-col p-4 space-y-4 overflow-auto">

      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Top Causes of Death</h2>
        <span className="text-blue-500 text-sm cursor-pointer">View all</span>
      </div>

      <Spin spinning={loading}>

        <Card className="rounded-2xl">
          <div className="space-y-3">
            {topCauses.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{i + 1}. {c.cause}</span>
                  <span>{c.total}</span>
                </div>
                <Progress percent={c.percent || 50} showInfo={false} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl">
          <h3 className="mb-2 font-medium">Trends Over Time</h3>
          <ReactECharts
            option={{
              tooltip: { trigger: "axis" },
              xAxis: { type: "category", data: trends.map(d => d.year) },
              yAxis: { type: "value" },
              series: [{
                type: "line",
                smooth: true,
                data: trends.map(d => d.total)
              }]
            }}
            style={{ height: 220 }}
          />
        </Card>

      </Spin>

    </div>
  );
};

RightPanel.Pie = ({ data }) => {
  // 🔥 get top 5 only
  const formattedData = data
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(d => ({
      name: d.country,
      value: Number(d.total) // 👈 FORCE NUMBER
    }));

  const sorted = [...data].sort((a, b) => b.total - a.total);
  const top5 = sorted.slice(0, 5);

  const total = formattedData.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const formatNumber = (num) => {
      if (!num || isNaN(num)) return "0";

      const abs = Math.abs(num);

      if (abs >= 1e9) return (num / 1e9).toFixed(1).replace(".0", "") + "B";
      if (abs >= 1e6) return (num / 1e6).toFixed(1).replace(".0", "") + "M";
      if (abs >= 1e3) return (num / 1e3).toFixed(1).replace(".0", "") + "K";

      return num.toFixed(1);
    };
  return (
    <ReactECharts
      option={{
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },

        series: [
  {
    type: "pie",
    radius: ["60%", "80%"],
    tooltip: {
            trigger: "item",
            formatter: (params) => {
              const formatNumber = (num) => {
                if (!num || isNaN(num)) return "0";

                if (num >= 1e9) return (num / 1e9).toFixed(1).replace(".0", "") + "B";
                if (num >= 1e6) return (num / 1e6).toFixed(1).replace(".0", "") + "M";
                if (num >= 1e3) return (num / 1e3).toFixed(1).replace(".0", "") + "K";

                return num.toFixed(1);
              };

              return `
                <div style="font-size:12px;">
                  <strong>${params.name}</strong><br/>
                  ${formatNumber(params.value)} (${params.percent.toFixed(1)}%)
                </div>
              `;
            }
          },
    // 🔥 SHOW LABELS WITH PERCENT
    label: {
        show: true,
        position: "outside",
        
        formatter: (params) => {
          const value = params.value;

          // 🔥 FORMAT NUMBER (K / M / B)
          const formatNumber = (num) => {
            if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
            if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
            if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
            return num;
          };

          return `${params.name}\n${formatNumber(value)} (${params.percent}%)`;
        },
        fontSize: 11,
        color: "#374151",
        lineHeight: 16
      },

    // 🔥 LINE CONNECTOR
    labelLine: {
      show: true,
      length: 12,
      length2: 8,
      smooth: true
    },

    itemStyle: {
      borderRadius: 6,
      borderColor: "#fff",
      borderWidth: 2
    },

    emphasis: {
      scale: true,
      scaleSize: 6
    },

    data: formattedData
  }
],

        graphic: [
  {
    type: "text",
    left: "center",
    top: "45%", // 👈 adjust vertical balance
    style: {
      text: formatNumber(total),
      fill: "#111827",
      fontSize: 16, // 👈 smaller (prevents overlap)
      fontWeight: 600,
      textAlign: "center"
    }
  },
  {
    type: "text",
    left: "center",
    top: "60%", // 👈 move label lower
    style: {
      text: "Top 5 Total",
      fill: "#6B7280",
      fontSize: 11,
      textAlign: "center"
    }
  }
]
      }}
      style={{ height: 200 }}
    />
  );
};

RightPanel.Line = ({ data }) => {
  const lastIndex = data.length - 1;

  const formatNumber = (val) => {
    if (val == null) return "";
    return val.toLocaleString();
  };

  return (
    <ReactECharts
      option={{
        grid: {
          left: 45,
          right: 20,
          top: 10,
          bottom: 30
        },

        tooltip: {
          trigger: "axis",
          backgroundColor: "#ffffff",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          padding: 10,
          textStyle: { color: "#111827" },
          extraCssText:
            "box-shadow: 0 6px 16px rgba(0,0,0,0.08); border-radius:10px;",
          formatter: (params) => {
            const d = params[0];
            return `
              <div style="font-size:12px">
                <div style="font-weight:600; margin-bottom:4px;">
                  ${d.axisValue}
                </div>
                <div>${Number(d.value).toLocaleString()} </div>
              </div>
            `;
          }
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.map((d) => d.year),
          axisLine: { lineStyle: { color: "#e5e7eb" } },
          axisTick: { show: false },

          axisLabel: {
            color: "#6b7280",
            fontSize: 11,
            margin: 10,

          }
        },

        yAxis: {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: {
            lineStyle: {
              color: "#f1f5f9",
              type: "dashed"
            }
          },
          axisLabel: {
            color: "#6b7280",
            fontSize: 11,
            formatter: (value) => formatNumber(value)
          }
        },

        series: [
          {
            type: "line",
            smooth: true,

            data: data.map((d, i) => ({
              value: d.total,
              itemStyle:
                i === lastIndex
                  ? {
                      color: "#6366f1",
                      borderColor: "#fff",
                      borderWidth: 3
                    }
                  : {}
            })),

            lineStyle: {
              width: 3,
              color: "#6366f1"
            },

            symbol: "circle",
            symbolSize: (val, params) =>
              params.dataIndex === lastIndex ? 10 : 6,

            itemStyle: {
              color: "#6366f1",
              borderColor: "#fff",
              borderWidth: 2
            },

            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(99,102,241,0.35)" },
                  { offset: 1, color: "rgba(99,102,241,0.04)" }
                ]
              }
            },

            emphasis: {
              focus: "series"
            },

            animationDuration: 800
          }
        ]
      }}
      style={{ height: 200 }}
    />
  );
};

export default RightPanel;