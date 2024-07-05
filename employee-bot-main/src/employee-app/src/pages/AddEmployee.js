import React, { useState } from "react";
import "./AddEmployee.css"; // Add a separate CSS file for component styles
import axios from "axios";

function AddEmployee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const handleSelectChange = (event) => {
    setSelectedRegion(event.target.value);
  };
  const handleTagKeyDown = (e) => {
    if (e.key === " " && tagInput.trim() !== "") {
      e.preventDefault();
      let newTag = tagInput.trim();
      if (!newTag.startsWith("#")) {
        newTag = `#${newTag}`;
      }
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const employee = {
      name,
      email,
      selectedRegion,
      tags,
      notes,
    };
    console.log(employee);
    try {
      const response = await axios.post(
        "https://solid-bull-quickly.ngrok-free.app/api/employees",
        employee
      );
      console.log("Employee Added:", response.data);

      setName("");
      setEmail("");
      setTags([]);
      setNotes("");
    } catch (error) {
      console.error("Error adding employee:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
    }
  };

  const regions = [
    { id: 1, name: "America" },
    { id: 2, name: "Europe" },
    { id: 3, name: "United Kingdom" },
    { id: 4, name: "Азия" },
    { id: 5, name: "АВ/НЗ" },
  ];

  return (
    <div className="mt-5">
      <h1>Add Employee</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="region-select">Select region:</label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={handleSelectChange}
          >
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
        <div className="form-group">
          <label>Tags:</label>
          <div className="tags-input-container">
            {tags.map((tag, index) => (
              <div className="tag-item" key={index}>
                <span className="tag-text">{tag}</span>
                <span className="tag-remove" onClick={() => removeTag(index)}>
                  x
                </span>
              </div>
            ))}
            <input
              type="text"
              className="form-control tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Press Space to add a tag"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
