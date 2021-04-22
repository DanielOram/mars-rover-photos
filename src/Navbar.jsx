import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-light bg-light sticky-top">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Mars Rover Photos</Link>
                {/* <a className="navbar-brand" href="#">Mars Rover Photos</a> */}
            </div>
        </nav>
    )
}

export default Navbar;