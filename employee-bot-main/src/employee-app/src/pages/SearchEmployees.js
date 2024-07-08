import React, { useState } from "react";
import "./AddEmployee.css"; // Import separate CSS file for component styles
import axios from "axios";
import EmployeeModal from "./EmployeeModal"; // Import modal window component

function SearchEmployees() {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [employees, setEmployees] = useState([]); // State to store found employees
  const [editingEmployee, setEditingEmployee] = useState(null); // State to track the employee being edited
  const [selectedRegion, setSelectedRegion] = useState("");
  


  const handleSelectChange = async (event) => {
    let region = event.target.value
    setSelectedRegion(region);
    const employee = {
      region,
      tags
    };
    console.log(employee);
    try {
      const response = await axios.post(
        "https://rat-cuddly-mostly.ngrok-free.app/api/search-employees",
        employee
      );
      console.log("Employees found:", response.data);

      // Save found employees in state
      setEmployees(response.data);

    } catch (error) {
      console.error("Error searching employees:", error);
    }
  };

  const regions = [
    { id: 1, name: "All" },
    { id: 2, name: "America" },
    { id: 3, name: "Europe" },
    { id: 4, name: "United Kingdom" },
    { id: 5, name: "Asia" },
    { id: 6, name: "AU/NZ" },
    { id: 7, name: "Freelancers" },
  ];
  // Function to handle tag input and add tags to state
  const handleTagKeyDown = async (e) => {
    let inputTag = e.target.value;
    setTagInput(inputTag);
    console.log(inputTag)
    if (inputTag.slice(-1) === " " && inputTag.trim() !== "") {
      e.preventDefault();
      let newTag = inputTag.trim();
      if (!newTag.startsWith("#")) {
        newTag = `#${newTag}`;
      }
      // Check for existing tag
      if (!tags.includes(newTag)) {
        let searchTags = [...tags, newTag];
        setTags(searchTags);
        setTagInput("");
        const employee = {
          region: selectedRegion,
          tags: searchTags,
        };
        
        
        console.log(employee);
        try {
          const response = await axios.post(
            "https://rat-cuddly-mostly.ngrok-free.app/api/search-employees",
            employee
          );
          console.log("Employees found:", response.data);
    
          // Save found employees in state
          setEmployees(response.data);
    
        } catch (error) {
          console.error("Error searching employees:", error);
        }
      }
      
    }
  };

  // Function to remove tags from state
  const removeTag = async (indexToRemove) => {
    let newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    const employee = {
      region: selectedRegion,
      tags: newTags,
    };
    console.log(employee);
    try {
      const response = await axios.post(
        "https://rat-cuddly-mostly.ngrok-free.app/api/search-employees",
        employee
      );
      console.log("Employees found:", response.data);

      // Save found employees in state
      setEmployees(response.data);

    } catch (error) {
      console.error("Error searching employees:", error);
    }

  };


  // Function to handle click on employee card for editing
  const handleCardClick = (employee) => {
    setEditingEmployee(employee);
  };

  // Function to handle changes in employee edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  // Function to handle saving edited employee details
  const handleSave = async () => {
    try {
      await axios.put(
        `https://rat-cuddly-mostly.ngrok-free.app/api/employees/${editingEmployee._id}`,
        editingEmployee
      );
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp._id === editingEmployee._id ? editingEmployee : emp
        )
      );
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // Function to handle deleting an employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://rat-cuddly-mostly.ngrok-free.app/api/employees/${id}`
      );
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== id)
      );
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Function to close the employee edit modal
  const handleCloseModal = () => {
    setEditingEmployee(null);
  };

  return (
    <div className="mt-5">
      <h1>Search Employees</h1>
      <h2>Total:{51}</h2>
      <form>
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
              // onChange={(e) => setTagInput(e.target.value)}
              onInput={handleTagKeyDown}
              placeholder="Press Space to add a tag"
            />
          </div>
        </div>
      </form>
      <div className="mt-5">
        <h2>Search Results:</h2>
        {employees.length > 0 ? (
          <div className="card-container">
            {employees.map((employee, index) => (
              <div
                key={index}
                className="employee-card"
                onClick={() => handleCardClick(employee)}
              >
                <div>
                  <div>
                    <strong>Name:</strong> {employee.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {employee.email}
                  </div>
                  <div>
                    <strong>Region:</strong> {employee.region}
                  </div>
                  <div>
                    <strong>Tags:</strong> {employee.tags.join(", ")}
                  </div>
                  <div>
                    <strong>Notes:</strong> {employee.notes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No employees found.</p>
        )}
      </div>
      {/* Render EmployeeModal component for editing */}
      <EmployeeModal
        employee={editingEmployee}
        onClose={handleCloseModal}
        onChange={handleEditChange}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default SearchEmployees;
