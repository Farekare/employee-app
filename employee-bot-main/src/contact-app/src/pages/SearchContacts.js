import React, { useState, useEffect } from "react";
import "./AddContact.css"; // Import separate CSS file for component styles
import axios from "axios";
import ContactModal from "./ContactModal"; // Import modal window component

function SearchContacts() {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [contacts, setContacts] = useState([]); // State to store found contacts
  const [editingContact, setEditingContact] = useState(null); // State to track the contact being edited
  const [selectedRegion, setSelectedRegion] = useState("");
  const [totalContacts, setTotalContacts] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          "https://rat-cuddly-mostly.ngrok-free.app/api/search-contacts",
          {}
        );
        console.log("Total contacts found:", response.data.length);
        setTotalContacts(response.data.length);
      } catch (error) {
        console.error("Error searching contacts:", error);
      }
    })();
  });

  const handleSelectChange = async (event) => {
    let region = event.target.value;
    setSelectedRegion(region);
    const contact = {
      region,
      tags,
    };
    console.log(contact);
    try {
      const response = await axios.post(
        "https://rat-cuddly-mostly.ngrok-free.app/api/search-contacts",
        contact
      );
      console.log("Contacts found:", response.data);

      // Save found contacts in state
      setContacts(response.data);
    } catch (error) {
      console.error("Error searching contacts:", error);
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
    console.log(inputTag);
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
        const contact = {
          region: selectedRegion,
          tags: searchTags,
        };

        console.log(contact);
        try {
          const response = await axios.post(
            "https://rat-cuddly-mostly.ngrok-free.app/api/search-contacts",
            contact
          );
          console.log("Contacts found:", response.data);

          // Save found contacts in state
          setContacts(response.data);
        } catch (error) {
          console.error("Error searching contacts:", error);
        }
      }
    }
  };

  // Function to remove tags from state
  const removeTag = async (indexToRemove) => {
    let newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    const contact = {
      region: selectedRegion,
      tags: newTags,
    };
    console.log(contact);
    try {
      const response = await axios.post(
        "https://rat-cuddly-mostly.ngrok-free.app/api/search-contacts",
        contact
      );
      console.log("Contacts found:", response.data);

      // Save found contacts in state
      setContacts(response.data);
    } catch (error) {
      console.error("Error searching contacts:", error);
    }
  };

  // Function to handle click on contact card for editing
  const handleCardClick = (contact) => {
    setEditingContact(contact);
  };

  // Function to handle changes in contact edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  // Function to handle saving edited contact details
  const handleSave = async () => {
    try {
      await axios.put(
        `https://rat-cuddly-mostly.ngrok-free.app/api/contacts/${editingContact._id}`,
        editingContact
      );
      setContacts((prevContacts) =>
        prevContacts.map((emp) =>
          emp._id === editingContact._id ? editingContact : emp
        )
      );
      setEditingContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  // Function to handle deleting an contact
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://rat-cuddly-mostly.ngrok-free.app/api/contacts/${id}`
      );
      setContacts((prevContacts) =>
        prevContacts.filter((emp) => emp._id !== id)
      );
      setEditingContact(null);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // Function to close the contact edit modal
  const handleCloseModal = () => {
    setEditingContact(null);
  };

  return (
    <div className="mt-5">
      <h1>Search Contacts</h1>
      <h2>Total: {totalContacts}</h2>
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
        {contacts.length > 0 ? (
          <div className="card-container">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="contact-card"
                onClick={() => handleCardClick(contact)}
              >
                <div>
                  <div>
                    <strong>Name:</strong> {contact.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {contact.email}
                  </div>
                  <div>
                    <strong>Region:</strong> {contact.region}
                  </div>
                  <div>
                    <strong>Tags:</strong> {contact.tags.join(", ")}
                  </div>
                  <div>
                    <strong>Notes:</strong> {contact.notes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No contacts found.</p>
        )}
      </div>
      {/* Render ContactModal component for editing */}
      <ContactModal
        contact={editingContact}
        onClose={handleCloseModal}
        onChange={handleEditChange}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default SearchContacts;
