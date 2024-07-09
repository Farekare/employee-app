import React from "react";

const NameInput = ({ value, onChange, name }) => {
  return (
    <div className="form-group">
      <label>Name:</label>
      <input
        type="text"
        className="form-control"
        value={value}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default NameInput;
