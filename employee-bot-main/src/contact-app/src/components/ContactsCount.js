import React, { useEffect} from "react";

const ContactsCount = ({value, fetchContactsCount}) => {

  useEffect(() => {
    // first fetching right after component render
    fetchContactsCount();

    // interfval for 10 seconds 
    const intervalId = setInterval(fetchContactsCount, 10000);

    return () => clearInterval(intervalId);
  }, []);
  return <h2>Total: {value}</h2>;
};
export default ContactsCount;