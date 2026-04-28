import { useEffect, useState } from "react";
import axios from "axios";
import { Layout } from "antd";

import LeftPanel from "./LeftPanel";
import MapPanel from "./MapPanel";
import RightPanel from "./RightPanel";

const { Sider, Content } = Layout;

const Dashboard = () => {
  const [filters, setFilters] = useState({});
  const [years, setYears] = useState([]);
  const [causes, setCauses] = useState([]);

  const [topCauses, setTopCauses] = useState([]);
  const [trends, setTrends] = useState([]);
  const [mapData, setMapData] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilters();
    loadTrends();
  }, []);

  useEffect(() => {
    loadTopCauses();
    loadMap();
  }, [filters]);

  const loadFilters = async () => {
    const res = await axios.get("/api/deaths/filters");
    setYears(res.data.years);
    setCauses(res.data.causes);
  };

  const loadTopCauses = async () => {
    setLoading(true);
    const res = await axios.get("/api/deaths/top-causes", {
      params: { year: filters.year }
    });
    setTopCauses(res.data);
    setLoading(false);
  };

  const loadTrends = async () => {
    const res = await axios.get("/api/deaths/trends");
    setTrends(res.data);
  };

  const loadMap = async () => {
    const res = await axios.get("/api/deaths/map", {
      params: filters
    });
    setMapData(res.data);
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout style={{ height: "100vh" }}>

      {/* LEFT PANEL */}
      <Sider
        width={280}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          overflow: "auto"
        }}
      >
        <LeftPanel
          years={years}
          causes={causes}
          onFilter={handleFilter}
        />
      </Sider>

      {/* CENTER MAP */}
      <Content style={{ background: "#f5f5f5" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <MapPanel
            mapData={mapData}
            filters={filters}
            topCauses={topCauses}
          />
        </div>
      </Content>

      {/* RIGHT PANEL */}
      <Sider
        width={350}
        style={{
          background: "#fff",
          borderLeft: "1px solid #f0f0f0",
          overflow: "auto"
        }}
      >
        <RightPanel
          loading={loading}
          topCauses={topCauses}
          trends={trends}
        />
      </Sider>

    </Layout>
  );
};

export default Dashboard;