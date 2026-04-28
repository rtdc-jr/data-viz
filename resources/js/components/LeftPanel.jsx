import { Select } from "antd";

const LeftPanel = ({ years, causes, onFilter }) => {
  return (
    <div className="w-64 bg-white p-4 border-r h-full space-y-4">

      <h2 className="font-semibold text-lg">Filters</h2>

      <Select
        placeholder="Year"
        className="w-full"
        onChange={(v) => onFilter("year", v)}
        options={years.map(y => ({ label: y, value: y }))}
      />

      <Select
        placeholder="Cause"
        className="w-full"
        onChange={(v) => onFilter("cause", v)}
        options={causes.map(c => ({ label: c, value: c }))}
      />

      <div>
        <h3 className="font-medium mt-4">Legend</h3>
        <p className="text-sm text-gray-500">
          Color intensity = number of deaths
        </p>
      </div>

    </div>
  );
};

export default LeftPanel;