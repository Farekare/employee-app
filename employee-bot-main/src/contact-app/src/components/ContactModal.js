import React, { useState, useEffect } from "react";
import "./ContactModal.css";
import NameInput from "./NameInput";
import EmailInput from "./EmailInput";
import RegionInput from "./RegionInput";
import TagsInput from "./TagsInput";
import NotesInput from "./NotesInput";

const ContactModal = ({ contact, onClose, onChange, onSave, onDelete }) => {
  const [tags, setTags] = useState([]);
  const [tagsInput, setTagsInput] = useState("");
  useEffect(() => {
    if (contact) {
      setTags(contact.tags);
    }
  }, [contact]);
  const handleTagsInputChange = (value) => {
    setTagsInput(value);
  };
  const handleTagsChange = (value) => {
    setTags(value);
    onChange({ target: { name: "tags", value: value } })
  };

  if (!contact) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Contact</h2>
        </div>
        <div className="modal-body">
          <NameInput value={contact.name} onChange={onChange} name="name" />
          <EmailInput value={contact.email} onChange={onChange} name="email" />
          <RegionInput
            value={contact.region}
            onChange={onChange}
            name="region"
            regions={[
              { id: 1, name: "America" },
              { id: 2, name: "Europe" },
              { id: 3, name: "United Kingdom" },
              { id: 4, name: "Asia" },
              { id: 5, name: "AU/NZ" },
              { id: 6, name: "Freelancers" },
            ]}
          />
          <TagsInput value={tagsInput} name="tags" onChangeInput={handleTagsInputChange} onChangeTags={handleTagsChange} tags={tags}/>
          <NotesInput value={contact.notes} name="notes" onChange={onChange} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-success" onClick={onSave}>
            Save
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onDelete(contact._id)}
          >
            Delete
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
