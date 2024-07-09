import React from "react";

const TagsInput = ({ value, name, tags, onChangeInput, onChangeTags }) => {
  const handleTagInput = (e) => {
    let inputTag = e.target.value;
    // onChangeInput passes inputTag value to a parent component. Parent components handles this value and passes it back to a child component as a value field in <input> tag
    onChangeInput(inputTag);
    if (inputTag.slice(-1) === " " && inputTag.trim() !== "") {
      e.preventDefault();
      let newTag = inputTag.trim();
      if (!newTag.startsWith("#")) {
        newTag = `#${newTag}`;
      }
      if (!tags.includes(newTag)) {
        // same idea as with onChangeInput function
        onChangeTags([...tags, newTag]);
      }
      onChangeInput("");
    }
  };
  const removeTag = () => {};
  return (
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
          value={value}
          onInput={handleTagInput}
          placeholder="Press Space to add a tag"
          name={name}
        />
      </div>
    </div>
  );
};

export default TagsInput;
