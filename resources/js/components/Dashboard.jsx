// Dashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Card, Typography, Tag, Select } from "antd";
import LeftPanel from "./LeftPanel";
import MapPanel from "./MapPanel";
import RightPanel from "./RightPanel";
import {
  TeamOutlined,
  GlobalOutlined,
  LineChartOutlined,
  RiseOutlined
} from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const [filters, setFilters] = useState({});
  const [years, setYears] = useState([]);
  const [causes, setCauses] = useState([]);

  const [topCauses, setTopCauses] = useState([]);
  const [trends, setTrends] = useState([]);
  const [mapData, setMapData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    loadFilters();
    loadTrends();
  }, []);

useEffect(() => {
  loadTopCauses();
  loadMap();
}, [appliedFilters]);

  const loadFilters = async () => {
  const res = await axios.get("/api/deaths/filters");
  setYears(res.data.years);
  setCauses(res.data.causes);
  setCountries(res.data.countries);
};

  const loadTopCauses = async () => {
  setLoading(true);
  const res = await axios.get("/api/deaths/top-causes", {
    params: appliedFilters
  });
  setTopCauses(res.data);
  setLoading(false);
};

const loadMap = async () => {
  const res = await axios.get("/api/deaths/map", {
    params: appliedFilters
  });
  setMapData(res.data);
};

  const loadTrends = async () => {
    const res = await axios.get("/api/deaths/trends");
    setTrends(res.data);
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const kpis = [
  {
    label: "Total Deaths",
    value: "56.7M",
    sub: "+2.4% vs 2022",
    icon: <TeamOutlined />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    label: "Countries",
    value: "195",
    sub: "+0 vs 2022",
    icon: <GlobalOutlined />,
    color: "bg-green-100 text-green-600"
  },
  {
    label: "Avg. Death Rate",
    value: "721",
    sub: "per 100K people",
    icon: <LineChartOutlined />,
    color: "bg-orange-100 text-orange-600"
  },
  {
    label: "Most Affected Region",
    value: "Africa",
    sub: "18.7M Deaths",
    icon: <RiseOutlined />,
    color: "bg-purple-100 text-purple-600"
  }
];

  return (
    <Layout className="h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 overflow-hidden">

      {/* LEFT SIDEBAR */}
      <Sider
        width={350}
        theme="light"
        className="!bg-transparent p-4"
      >
        <div className="h-full rounded-3xl bg-white/70 backdrop-blur border border-white/40 shadow-2xl overflow-hidden">
          <LeftPanel
            years={years}
            causes={causes}
            countries={countries}
            onApply={setAppliedFilters}
          />
        </div>
      </Sider>

      {/* CENTER */}
      <Content className="pt-2 px-4 pb-4 flex flex-col gap-2 overflow-hidden">

        {/* KPI */}
        <div className="grid grid-cols-4 gap-3">
          {kpis.map((kpi, i) => (
            <Card
              key={i}
              className="rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${kpi.color}`}>
                  {kpi.icon}
                </div>

                <div>
                  <p className="text-xs text-gray-500">{kpi.label}</p>
                  <h2 className="text-xl font-semibold">{kpi.value}</h2>
                  <p className="text-xs text-green-500">{kpi.sub}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">

        {/* MAP CARD (BIGGER) */}
        <Card className="flex-[1.5] flex flex-col rounded-2xl bg-white border border-gray-200 shadow-sm">
          {/* HEADER */}
          <div className="flex justify-between items-center ">
            <h3 className="text-sm font-semibold">
              Global Deaths by Country
            </h3>

            <Select
              size="small"
              defaultValue="Deaths per 100K"
              className="w-40"
              options={[
                { value: "rate", label: "Deaths per 100K" },
                { value: "total", label: "Total Deaths" }
              ]}
            />
          </div>

          {/* MAP */}
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
              <MapPanel mapData={mapData} />
            </div>

                {/* FOOTER */}
                <p className="text-xs text-gray-400 mt-2">
                  Note: Data is estimated and may not reflect recent updates.
                </p>
          </Card>

              {/* LOWER GRID (SMALLER) */}
              <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">

                  {/* PIE */}
                  <Card className="flex flex-col rounded-3xl bg-white border border-gray-200 shadow-sm flex-1 min-h-0">

                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-700 mb-4">
                      Top 5 Deaths by Region
                    </h3>

                    {/* Content */}
                    <div className="flex-1 flex items-center justify-center min-h-0">
                        <div className="w-full h-full">
                        <RightPanel.Pie data={mapData} />
                      </div>
                    </div>

                  </Card>


                  {/* LINE */}
                  <Card className="flex flex-col rounded-3xl bg-white border border-gray-200 shadow-sm flex-1 min-h-0">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-semibold text-gray-700">
                        Death Rate Over Time (Global)
                      </h3>

                      <Tag className="rounded-full px-3 py-1 text-xs font-medium">
                        2023
                      </Tag>
                    </div>

                    {/* Chart */}
                    <div className="flex-1 min-h-0">
                      <div className="w-full h-full">
                        <RightPanel.Line data={trends} />
                      </div>
                    </div>

                  </Card>

                </div>

            </div>

      </Content>

      {/* RIGHT SIDEBAR */}
      <Sider width={360} className="bg-transparent p-4">
        <div className="h-full rounded-3xl bg-white/70 backdrop-blur border border-white/40 shadow-md overflow-hidden">
          <RightPanel
            loading={loading}
            topCauses={topCauses}
            data={mapData}
          />
        </div>
      </Sider>

    </Layout>
  );
};

export default Dashboard;