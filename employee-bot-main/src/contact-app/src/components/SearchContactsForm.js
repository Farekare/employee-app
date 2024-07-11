import React, { useState } from "react";
import ContactModal from "./ContactModal";
import ContactsCount from "./ContactsCount";
import RegionInput from "./RegionInput";
import TagsInput from "./TagsInput";
import ContactCards from "./ContactCards";
import { fetchContacts, updateContact, deleteContact } from "../requests";

const SeacrhContactsForm = () => {
  const [tags, setTags] = useState([]);
  const [tagsInput, setTagsInput] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [region, setRegion] = useState("");
  const [contacts, setContacts] = useState([]);

  // value is computed in <TagInput/> component so we don't pass event as an argument
  const handleTagsInputChange = (value) => {
    setTagsInput(value);
  };
  const handleTagsChange = async (value) => {
    setTags(value);
    const data = await fetchContacts(region, value);
    setContacts(data);
  };
  const handleRegionChange = async (e) => {
    const value = e.target.value;
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
      // first we use spread operator
      ...prevContact,
      // then we use computed properties
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (editingContact != null)
      await updateContact(editingContact, editingContact._id);
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact._id === editingContact._id ? editingContact : contact
      )
    );
    setEditingContact(null);
  };

  const handleDelete = async (id) => {
    await deleteContact(id);
    setContacts((prevContacts) => prevContacts.filter((emp) => emp._id !== id));
    setEditingContact(null);
  };

  const handleCloseModal = () => {
    setEditingContact(null);
  };
  return (
    <div className="mt-5">
      <h1>Search Contacts</h1>
      <h2>Contacts found: {contacts.length}</h2>
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
