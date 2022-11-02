import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as RobotIcon } from '../static/img/robot.svg';


import { RoversContext } from '../contexts';

function Navbar() {

    const { selectedRover, setSelectedRover } = useContext(RoversContext);


    return (
        <nav className="navbar navbar-dark bg-primary sticky-top">
            <div className="container-fluid">
                <Link onClick={() => setSelectedRover(null)} to="/mars-rover-photos" className="navbar-brand"><RobotIcon style={{width: '2em', height: '100%'}} className="d-inline-block align-middle"/><span className="align-middle ml-2">Mars Rover Photos</span></Link>
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        {selectedRover &&
                            <ReturnToRoverSelectionNavLink/>
                        }
                    </li>
                </ul>
            </div>
            
        </nav>
    )
}


const ReturnToRoverSelectionNavLink = () => {
    const { setSelectedRover } = useContext(RoversContext);
    const handleClick = (event) => {
        setSelectedRover((prev) => null);
    }
    return (
        <Link onClick={handleClick} className="nav-link active bg-dark text-light" to="/mars-rover-photos">Select Rover</Link>
    )
}

export default Navbar;