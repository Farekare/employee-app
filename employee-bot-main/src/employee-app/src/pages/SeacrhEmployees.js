import React, { useState } from 'react';
import './AddEmployee.css'; // Import separate CSS file for component styles
import axios from 'axios';
import EmployeeModal from './EmployeeModal'; // Import modal window component

function SearchEmployees() {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [employees, setEmployees] = useState([]); // State to store found employees
  const [editingEmployee, setEditingEmployee] = useState(null); // State to track the employee being edited

  // Function to handle tag input and add tags to state
  const handleTagKeyDown = (e) => {
    if (e.key === ' ' && tagInput.trim() !== '') {
      e.preventDefault();
      let newTag = tagInput.trim();
      // Automatically add '#' if not entered
      if (!newTag.startsWith('#')) {
        newTag = `#${newTag}`;
      }
      // Check for existing tag
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  // Function to remove tags from state
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Function to handle form submission and search for employees
  const handleSubmit = async (event) => {
    event.preventDefault();
    const employee = {
      tags,
    };
    console.log(employee);
    try {
      const response = await axios.post('https://solid-bull-quickly.ngrok-free.app/api/search-employees', employee);
      console.log('Employees found:', response.data);

      // Save found employees in state
      setEmployees(response.data);

      // Clear form after successful search
      setTags([]);
    } catch (error) {
      console.error('Error searching employees:', error);
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
      await axios.put(`https://solid-bull-quickly.ngrok-free.app/api/employees/${editingEmployee._id}`, editingEmployee);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) => (emp._id === editingEmployee._id ? editingEmployee : emp))
      );
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Function to handle deleting an employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://solid-bull-quickly.ngrok-free.app/api/employees/${id}`);
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp._id !== id));
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Function to close the employee edit modal
  const handleCloseModal = () => {
    setEditingEmployee(null);
  };

  return (
    <div className="mt-5">
      <h1>Search Employees</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tags:</label>
          <div className="tags-input-container">
            {tags.map((tag, index) => (
              <div className="tag-item" key={index}>
                <span className="tag-text">{tag}</span>
                <span className="tag-remove" onClick={() => removeTag(index)}>x</span>
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
        <button type="submit" className="btn btn-primary">Search Employees</button>
      </form>
      <div className="mt-5">
        <h2>Search Results:</h2>
        {employees.length > 0 ? (
          <div className="card-container">
            {employees.map((employee, index) => (
              <div key={index} className="employee-card" onClick={() => handleCardClick(employee)}>
                <div>
                  <div><strong>Name:</strong> {employee.name}</div>
                  <div><strong>Email:</strong> {employee.email}</div>
                  <div><strong>Tags:</strong> {employee.tags.join(', ')}</div>
                  <div><strong>Notes:</strong> {employee.notes}</div>
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
