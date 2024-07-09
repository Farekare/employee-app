import React from "react";
import EmailInput from "./EmailInput";
import NameInput from "./NameInput";
import RegionInput from "./RegionInput";
import TagsInput from "./TagsInput";
import { useState, useEffect } from "react";
import NotesInput from "./NotesInput";
import axios from "axios";

const AddContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [notes, setNotes] = useState("");

  const handleNameChange = (value) => {
    setName(value);
  };
  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handleRegionChange = (value) => {
    setRegion(value);
  };
  const handleTagsInputChange = (value) => {
    setTagsInput(value);
  };
  const handleTagListChange = (value) => {
    setTagsList(value);
  };
  const handleNotesChange = (value) => {
    setNotes(value);
  };
  const clearState = () => {
    setName("");
    setEmail("");
    setRegion("");
    setTagsInput("");
    setTagsList([]);
    setNotes("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contact = {
      name,
      email,
      region,
      tagsList,
      notes,
    };
    console.log(contact);
    try {
      const response = await axios.post(
        "https://rat-cuddly-mostly.ngrok-free.app/api/contacts",
        contact
      );
			console.log("contact Added:", response.data);
    } catch (error) {
      console.error("Error adding contact:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
			
    }
    
    clearState();
  };

  return (
    <div className="mt-5">
      <h1>Add contact</h1>
      <h2>Total: </h2>
      <form onSubmit={handleSubmit}>
        <NameInput value={name} name="name" onChange={handleNameChange} />
        <EmailInput value={email} name="email" onChange={handleEmailChange} />
        <RegionInput
          value={region}
          name="region"
          onChange={handleRegionChange}
          regions={[
            { id: 1, name: "America" },
            { id: 2, name: "Europe" },
            { id: 3, name: "United Kingdom" },
            { id: 4, name: "Asia" },
            { id: 5, name: "AU/NZ" },
            { id: 6, name: "Freelancers" },
          ]}
        />
        <TagsInput
          value={tagsInput}
          name="tags"
          tags={tagsList}
          onChangeInput={handleTagsInputChange}
          onChangeTags={handleTagListChange}
        />
        <NotesInput value={notes} name="notes" onChange={handleNotesChange} />
        <button type="submit" className="btn btn-primary">
          Add contact
        </button>
      </form>
    </div>
  );
};

export default AddContactForm;
