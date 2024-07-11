import React from 'react'
import {Link} from 'react-router-dom'
const Navbar = () => {
  return (<nav className="navbar">
    <div className="container">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/employee-app">Add Contacts</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/employee-app/search-contacts">Search Contacts</Link>
        </li>
      </ul>
    </div>
  </nav>)
}
export default Navbar;