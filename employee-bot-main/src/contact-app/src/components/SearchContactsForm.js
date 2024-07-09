import React, { useState } from "react";
import axios from "axios";
import ContactModal from "./ContactModal";
import ContactsCount from "./ContactsCount";
import RegionInput from "./RegionInput";
import TagsInput from "./TagsInput";
import ContactCards from "./ContactCards";
const SeacrhContactsForm = () => {
  const [tags, setTags] = useState([]);
  const [tagsInput, setTagsInput] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [region, setRegion] = useState("");
  const [contactsCount, setContactsCount] = useState(0);
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async (reg, tgs) => {
    const contact = {
      region: reg,
      tags: tgs,
    };
    console.log(contact);
    try {
      const response = await axios.post(
        "https://rat-cuddly-mostly.ngrok-free.app/api/search-contacts",
        contact
      );
      console.log("Contacts found:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error searching contacts:", error);
      return undefined;
    }
  };
  const fetchContactsCount = async () => {
    const data = await fetchContacts(undefined, undefined);
    setContactsCount(data.length);
  };

  const handleTagsInputChange = (value) => {
    setTagsInput(value);
  };
  const handleTagsChange = async (value) => {
    setTags(value);
    const data = await fetchContacts(region, value);
    setContacts(data);
  };
  const handleRegionChange = async (value) => {
    setRegion(value);
    const data = await fetchContacts(value, tags);
    setContacts(data);
  };

  const handleCardClick = (contact) => {
    setEditingContact(contact);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

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

  const handleCloseModal = () => {
    setEditingContact(null);
  };
  return (
    <div className="mt-5">
      <h1>Search Contacts</h1>
      <ContactsCount
        fetchContactsCount={fetchContactsCount}
        value={contactsCount}
      />
      <RegionInput
        name="region"
        onChange={handleRegionChange}
        value={region}
        regions={[
          { id: 1, name: "All" },
          { id: 2, name: "America" },
          { id: 3, name: "Europe" },
          { id: 4, name: "United Kingdom" },
          { id: 5, name: "Asia" },
          { id: 6, name: "AU/NZ" },
          { id: 7, name: "Freelancers" },
        ]}
      />
      <TagsInput
        tags={tags}
        onChangeInput={handleTagsInputChange}
        value={tagsInput}
        onChangeTags={handleTagsChange}
      />
      <ContactCards onClick={handleCardClick} contacts={contacts} />
      <ContactModal
        contact={editingContact}
        onClose={handleCloseModal}
        onChange={handleEditChange}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default SeacrhContactsForm;
