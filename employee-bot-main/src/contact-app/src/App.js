import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddContactForm from './components/AddContactForm';
import SeacrhContactsForm from './components/SearchContactsForm';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <div>
        <Navbar/>
        <div className="container">
          <Routes>
            <Route path="/employee-app" element={<AddContactForm />} />
            <Route path="/employee-app/search-contacts" element={<SeacrhContactsForm />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
