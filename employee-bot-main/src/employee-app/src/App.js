import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddEmployee from './pages/AddEmployee';
import SearchEmployees from './pages/SeacrhEmployees';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="container">
            <Link className="navbar-brand" to="/">Employee Management</Link>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add-employee">Add Employee</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search-employees">Search employees</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/search-employees" element={<SearchEmployees />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
