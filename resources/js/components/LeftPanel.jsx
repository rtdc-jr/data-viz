import { Select, Checkbox, Input, Button } from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  CalendarOutlined,
  GlobalOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const LeftPanel = ({ years = [], causes = [], onFilter }) => {
  const [selectedCauses, setSelectedCauses] = useState([]);

  const handleReset = () => {
    setSelectedCauses([]);
    onFilter("year", null);
    onFilter("region", "");
    onFilter("age", "");
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] rounded-2xl shadow-sm border border-gray-200 p-5 w-80">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-base text-gray-800">Filters</h2>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-blue-500 text-sm hover:text-blue-600"
        >
          <ReloadOutlined />
          Reset
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">

        {/* YEAR */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-gray-500">Year</p>
            <CalendarOutlined className="text-gray-400" />
          </div>

          <Select
            className="w-full custom-select"
            size="large"
            placeholder="Select year"
            onChange={(v) => onFilter("year", v)}
            options={years.map(y => ({ label: y, value: y }))}
          />
        </div>

        {/* REGION */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-gray-500">Region</p>
            <GlobalOutlined className="text-gray-400" />
          </div>

          <Select
            className="w-full custom-select"
            size="large"
            defaultValue=""
            onChange={(v) => onFilter("region", v)}
            options={[{ label: "All Regions", value: "" }]}
          />
        </div>

        {/* CAUSE */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-500">Cause of Death</p>
            <HeartOutlined className="text-gray-400" />
          </div>

          <Input
            placeholder="Search causes..."
            className="mb-3 rounded-lg"
          />

          {/* ALL CAUSES */}
          <div className="flex items-center justify-between mb-2">
            <Checkbox
              checked={selectedCauses.length === causes.length}
              onChange={(e) =>
                setSelectedCauses(e.target.checked ? causes : [])
              }
            >
              <span className="text-gray-700">All Causes</span>
            </Checkbox>

            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">
              {causes.length.toLocaleString()}
            </span>
          </div>

          {/* LIST */}
          <div className="max-h-[45vh] overflow-y-auto space-y-1 pr-1">
            {causes.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <Checkbox
                  checked={selectedCauses.includes(c)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCauses([...selectedCauses, c]);
                    } else {
                      setSelectedCauses(
                        selectedCauses.filter(x => x !== c)
                      );
                    }
                  }}
                >
                  <span className="text-gray-700 text-sm">{c}</span>
                </Checkbox>

                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                  {Math.floor(Math.random() * 300)}
                </span>
              </div>
            ))}
          </div>

          <button className="text-blue-500 text-sm mt-2 hover:underline">
            Show more ↓
          </button>
        </div>

        {/* AGE GROUP */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-gray-500">Age Group</p>
            <UserOutlined className="text-gray-400" />
          </div>

          <Select
            className="w-full custom-select"
            size="large"
            defaultValue=""
            onChange={(v) => onFilter("age", v)}
            options={[{ label: "All Age Groups", value: "" }]}
          />
        </div>
      </div>

      {/* APPLY BUTTON */}
      <Button
        type="primary"
        icon={<FilterOutlined />}
        className="w-full mt-5 h-12 rounded-xl border-0 text-white font-medium text-sm"
        style={{
          background: "linear-gradient(90deg, #7c3aed, #3b82f6)",
        }}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default LeftPanel;