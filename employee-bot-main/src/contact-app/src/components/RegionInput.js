import React from "react";

const RegionInput = ({ name, value, onChange, regions }) => {
  return (
    <div className="form-group">
      <label htmlFor="region-select">Select region:</label>
      <select id="region-select" value={value} onChange={(e) => onChange(e.target.value)} name={name}>
        <option value="" disabled>
          Select...
        </option>
        {regions.map((region) => (
          <option key={region.id} value={region.name}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionInput;