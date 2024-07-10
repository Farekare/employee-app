import React from "react";

const ContactCards = ({onClick, contacts}) => {
  return (
    <div className="mt-5">
      <h2>Search Results:</h2>
      {contacts.length > 0 ? (
        <div className="card-container">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="contact-card"
              onClick={() => onClick(contact)}
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
  );
};

export default ContactCards;
