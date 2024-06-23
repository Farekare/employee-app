import React, { useState } from 'react';
import './AddEmployee.css'; // Добавим отдельный CSS файл для стилей компонента
import axios from 'axios'
function AddEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [notes, setNotes] = useState('');

  const handleTagKeyDown = (e) => {
    if (e.key === ' ' && tagInput.trim() !== '') {
      e.preventDefault();
      let newTag = tagInput.trim();
      // Автоматическое добавление знака #, если не введен
      if (!newTag.startsWith('#')) {
        newTag = `#${newTag}`;
      }
      // Проверка на существование тега
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
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
      tags,
      notes,
    };
    console.log(employee);
    console.log(process.env.API_URL)
    try {
      const response = await axios.post(process.env.API_URL, employee);
      console.log('Employee Added:', response.data);

      // Очистка формы после успешного добавления
      setName('');
      setEmail('');
      setTags([]);
      setNotes('');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

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
        <div className="form-group">
          <label>Notes:</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;
