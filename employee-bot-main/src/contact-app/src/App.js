import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
// import AddContact from './pages/AddContact';
import AddContactForm from './components/AddContactForm';
// import SearchContacts from './pages/SearchContacts';
import SeacrhContactsForm from './components/SearchContactsForm';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="container">
            <Link className="navbar-brand" to="/employee-app">Contacts Management</Link>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/employee-app">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/employee-app/add-contact">Add Contacts</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/employee-app/search-contacts">Search Contacts</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/employee-app" element={<Home />} />
            <Route path="/employee-app/add-contact" element={<AddContactForm />} />
            <Route path="/employee-app/search-contacts" element={<SeacrhContactsForm />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
