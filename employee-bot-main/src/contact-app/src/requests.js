import axios from "axios";

const API_LINK = "https://jointly-bright-swine.ngrok-free.app" + "/api";

async function fetchContacts(payload) {
  try {
    
    const response = await axios.post(API_LINK + "/fetch-contacts", payload);
    console.log("Contacts fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
  }
}

async function insertContact(payload) {
  try {
    const response = await axios.post(API_LINK + "/insert-contact", payload);
    console.log("Contact inserted:", response.data);
  } catch (error) {
    console.error("Error inserting contact:", error);
  }
}

async function updateContact(payload, id) {
  try {
    await axios.put(API_LINK + `/contacts/${id}`, payload);
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}
async function deleteContact(id) {
  try {
    await axios.delete(API_LINK + `/contacts/${id}`);
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}
export {fetchContacts, insertContact, updateContact, deleteContact};