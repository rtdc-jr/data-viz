import { Card, Spin } from "antd";
import BarChart from "./charts/BarChart";
import LineChart from "./charts/LineChart";

const RightPanel = ({ loading, topCauses, trends }) => {
  return (
    <div className="w-96 bg-white p-4 border-l flex flex-col overflow-y-auto space-y-4">

      <h2 className="font-semibold text-lg">Analytics</h2>

      <Spin spinning={loading}>
        <Card>
          <BarChart data={topCauses} />
        </Card>

        <Card>
          <LineChart data={trends} />
        </Card>
      </Spin>

    </div>
  );
};

export default RightPanel;