import React, { useContext } from 'react';
import { Link, Route, Switch, useHistory } from 'react-router-dom';

import RoverPhotos from './RoverPhotos';

import { ReactComponent as RobotIcon } from '../static/img/robot.svg';


import { RoversContext } from '../contexts';

import { DateDisplay } from './RoverPhotos';

import Spinner from 'react-bootstrap/Spinner';

export default function ListRovers() {

    const { rovers, selectedRover, setSelectedRover, dateOfPhotos } = useContext(RoversContext);

    const handleClick = (event, roverID) => {
        event.preventDefault();
        setSelectedRover(rovers.filter((rover) => rover.id === roverID)[0]);
    }


    return (
        <>

            {/* New Card for Rover */}
            <div className="container py-5">
                {/* <div className="icon-square text-bg-light d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                </div> */}
                <div className='col d-flex align-items-start border-bottom px-0'>
                    {/* {selectedRover &&
                        <ReturnToRoverSelectionBtn>
                            <img src={LeftArrowIcon} alt="Back Button" className='btn btn-primary mr-2 mt-1'/>
                        </ReturnToRoverSelectionBtn>
                    } */}
                    <h2 className="">
                        {selectedRover ? selectedRover.name + " Photos" : "Select Rover"}
                        {(rovers[0].name == 'default') &&
                            <Spinner className="ml-2" animation="grow" variant="primary" size='lg'/>
                        }
                    </h2>
                    <h2 className="ml-auto text-nowrap">{selectedRover && dateOfPhotos && <DateDisplay/>}</h2>
                    
                </div>
                
                {!selectedRover && 
                    <>
                        <div className="row g-4 py-5 row-cols-1 row-cols-lg-4">
                            
                            {(rovers[0].name != 'default') && 
                                rovers.map(rover => (
                                    <NavigateToRoverPhotosBtn key={rover.name} roverName={rover.name}>
                                        <FeaturedRover rover={rover} onClick={(event) => handleClick(event, rover.id)}/>
                                    </NavigateToRoverPhotosBtn>
                                ))
                            }
                            
                        </div>
                    </>
                    
                    
                } 
            </div> 
            <Switch>
                <Route path="/mars-rover-photos/:rover" component={RoverPhotos} />
            </Switch>       
        </>
    )
}

export const ReturnToRoverSelectionBtn = (props) => {
    let history = useHistory();
    const { setSelectedRover } = useContext(RoversContext);
    const handleClick = (event) => {
        //set selectedRover to null which will rerender rover selection options.
        event.preventDefault();
        setSelectedRover((prev) => null);
        history.push("/mars-rover-photos");
    }
    return (
        <div onClick={handleClick}>
            {props.children}
        </div>
    )
}

const NavigateToRoverPhotosBtn = (props) => {
    let history = useHistory();
    

    const handleClick = (event) => {
        event.preventDefault();
        history.push(`/mars-rover-photos/${props.roverName}`);
    }

    return (
        <div onClick={handleClick}>
            {props.children}
        </div>
    )
}


const FeaturedRover = ({ rover, onClick }) => {
    return (
        <div 
            className="col btn featured-rover"
            onClick={onClick}
        >
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
                <RobotIcon style={{width: '5vw', height: '5vw'}}/>
            </div>
            <h3 className="fs-2">{rover.name}</h3>
            <p className="card-text">Mission Status: <span className={`card-text ${rover.status==='active' ? "text-success" : "text-secondary"}`}>{rover.status}</span> </p>
            <p className="text-muted">Available Photos: {rover.total_photos}</p>
            <Link to={`/mars-rover-photos/${rover.name}`} className="btn btn-primary">View All Photos</Link>
        </div>
    )
}