import { Select, Checkbox, Input, Button } from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  CalendarOutlined,
  GlobalOutlined,
  HeartOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useState, useMemo } from "react";

const LeftPanel = ({ years = [], causes = [], countries = [], onApply }) => {
  const [year, setYear] = useState(null);
  const [country, setCountry] = useState(null);
  const [selectedCauses, setSelectedCauses] = useState(null); // null = ALL
  const [search, setSearch] = useState("");

  const isAllSelected = selectedCauses === null;

  // Normalize causes
  const normalizedCauses = useMemo(() => {
    return causes
      .map(c => {
        if (typeof c === "string") return { name: c, count: 0 };
        if (c?.name) return c;
        if (c?.cause) return { name: c.cause, count: c.count || 0 };
        return null;
      })
      .filter(Boolean);
  }, [causes]);

  // Filter causes
  const filteredCauses = useMemo(() => {
    return normalizedCauses.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [normalizedCauses, search]);

  const handleReset = () => {
    setYear(null);
    setCountry(null);
    setSelectedCauses([]);
    setSearch("");
    onApply({});
  };

const handleApply = () => {
  onApply({
    year,
    country,
    cause: selectedCauses === null ? null : selectedCauses
  });
};

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="h-screen w-80 bg-white rounded-3xl shadow-sm border border-gray-200 p-5 flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold text-gray-800 text-lg">Filters</h2>
        <button
          onClick={handleReset}
          className="text-blue-500 text-sm flex items-center gap-1"
        >
          <ReloadOutlined /> Reset
        </button>
      </div>

      {/* YEAR */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
          <CalendarOutlined /> Year
        </label>
        <Select
          size="large"
          value={year}
          onChange={setYear}
          className="w-full rounded-xl"
          options={[
            { label: "All Years", value: null },
            ...years.map(y => ({ label: y, value: y }))
          ]}
        />
      </div>

      {/* REGION */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
          <GlobalOutlined /> Country
        </label>
        <Select
          size="large"
          value={country}
          onChange={setCountry}
          className="w-full rounded-xl"
          options={[
            { label: "All Countries", value: null },
            ...countries.map(c => ({ label: c, value: c }))
          ]}
        />
      </div>

      {/* CAUSES */}
      <div className="mb-4 flex flex-col">
        <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
          <HeartOutlined /> Cause of Death
        </label>

        <Input
          placeholder="Search causes..."
          className="mb-2 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* SCROLL AREA */}
        <div className="max-h-[550px] overflow-y-auto pr-1 space-y-2">

          {/* ALL */}
          <div className="flex items-center justify-between">
            <Checkbox
              checked={isAllSelected}
              onChange={() => {
                if (isAllSelected) {
                  setSelectedCauses([]); // uncheck all
                } else {
                  setSelectedCauses(null); // check all
                }
              }}
            >
              All Causes
            </Checkbox>
          </div>

          {/* LIST */}
          {filteredCauses.map((c) => (
            <div key={c.name} className="flex items-center justify-between">
              <Checkbox
                  className="flex-1"
                  checked={isAllSelected || selectedCauses?.includes(c.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (isAllSelected) {
                        // from ALL → switch to single
                        setSelectedCauses([c.name]);
                      } else {
                        setSelectedCauses(prev => [...prev, c.name]);
                      }
                    } else {
                      if (isAllSelected) {
                        // from ALL → remove one = select all except this
                        const all = normalizedCauses.map(x => x.name);
                        setSelectedCauses(all.filter(x => x !== c.name));
                      } else {
                        const updated = selectedCauses.filter(x => x !== c.name);
                        setSelectedCauses(updated.length ? updated : []);
                      }
                    }
                  }}
                >
                  {c.name}
                </Checkbox>

              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                {formatNumber(c.count)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AGE GROUP */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
          <UserOutlined /> Age Group
        </label>
        <Select
          size="large"
          className="w-full rounded-xl"
          placeholder="All Age Groups"
        />
      </div>

      {/* APPLY */}
      <Button
        size="large"
        onClick={handleApply}
        className="w-full h-12 rounded-xl text-white font-medium border-0"
        style={{
          background: "linear-gradient(90deg, #7c3aed, #3b82f6)"
        }}
        icon={<FilterOutlined />}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default LeftPanel;