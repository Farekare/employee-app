import React from "react";
import EmailInput from "./EmailInput";
import NameInput from "./NameInput";
import RegionInput from "./RegionInput";
import TagsInput from "./TagsInput";
import { useState, useEffect } from "react";
import NotesInput from "./NotesInput";
import axios from "axios";
import ContactsCount from "./ContactsCount";
import "./AddContact.css"

const AddContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState("");
  const [contactsCount, setContactsCount] = useState(0);
	
	const fetchContactsCount = async () =>
	{
		try {
			const response = await axios.post(
				"https://rat-cuddly-mostly.ngrok-free.app/api/search-contacts",
				{}
			);
			console.log("Total contacts found:", response.data.length);
			setContactsCount(response.data.length);
		} catch (error) {
			console.error("Error searching contacts:", error);
		}
	}

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };
  const handleRegionChange = (e) => {
    const value = e.target.value;
    setRegion(value);
  };
  // using value not event here because it computes in <TagInput/> component before calling handler function
  const handleTagsInputChange = (value) => {
    setTagsInput(value);
  };
  // same
  const handleTagsChange = (value) => {
    setTags(value);
  };
  const handleNotesChange = (e) => {
    const value = e.target.value;
    setNotes(value);
  };
  const clearState = () => {
    setName("");
    setEmail("");
    setRegion("");
    setTagsInput("");
    setTags([]);
    setNotes("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contact = {
      name,
      email,
      region,
      tags,
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
		fetchContactsCount();
    clearState();
  };

  return (
    <div className="mt-5">
      <h1>Add contact</h1>
      <ContactsCount value={contactsCount} fetchContactsCount={fetchContactsCount}/>
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
          tags={tags}
          onChangeInput={handleTagsInputChange}
          onChangeTags={handleTagsChange}
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
