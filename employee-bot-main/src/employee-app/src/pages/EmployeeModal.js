import React, { useState, useEffect } from 'react';
import './EmployeeModal.css';

const EmployeeModal = ({ employee, onClose, onChange, onSave, onDelete }) => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (employee) {
      setTags(employee.tags);
    }
  }, [employee]);

  const handleTagKeyDown = (e) => {
    if (e.key === ' ' && tagInput.trim() !== '') {
      e.preventDefault();
      let newTag = tagInput.trim();
      if (!newTag.startsWith('#')) {
        newTag = `#${newTag}`;
      }
      if (!tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        onChange({ target: { name: 'tags', value: newTags } });
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange({ target: { name: 'tags', value: newTags } });
  };

  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  if (!employee) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Employee</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={employee.name}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={employee.email}
              onChange={onChange}
            />
          </div>
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
                onChange={handleTagChange}
                onKeyDown={handleTagKeyDown}
                placeholder="Press Space to add a tag"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes:</label>
            <input
              type="text"
              className="form-control"
              name="notes"
              value={employee.notes}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-success" onClick={onSave}>Save</button>
          <button className="btn btn-danger" onClick={() => onDelete(employee._id)}>Delete</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
