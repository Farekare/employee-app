import React, { useEffect} from "react";

const ContactsCount = ({value, fetchContactsCount}) => {

  useEffect(() => {
    // Первый запрос сразу при монтировании компонента
    fetchContactsCount();

    // Установка интервала для выполнения запроса каждые 10 секунд
    const intervalId = setInterval(fetchContactsCount, 10000);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);
  return <h2>Total: {value}</h2>;
};
export default ContactsCount;