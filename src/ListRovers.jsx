import React, {useState, useContext } from 'react';
import { Link } from 'react-router-dom'
// import axios from 'axios';

import { RoversContext } from './contexts';

// import RoverPhotos from './RoverPhotos';

// const { REACT_APP_NASA_API_KEY } = process.env;

export default function ListRovers() {

    // const [rovers, setRovers] = useState([]);

    // const [selectedRover, setSelectedRover] = useState({cameras: { map: () => {}}});

    // const [numApiCalls, setNumApiCalls] = useState(0);

    // const [apiError, setApiError] = useState();

    const { rovers, selectedRover, setSelectedRover } = useContext(RoversContext);

    // useEffect(() => {
    //     axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers`, {
    //         params: {
    //             "api_key": REACT_APP_NASA_API_KEY
    //         }
    //     })
    //   .then(res => {
    //     setRovers(res.data.rovers.map(rover => (
    //         {
    //             id: rover.id,
    //             name: rover.name,
    //             landing_date: rover.landing_date,
    //             launch_date: rover.launch_date,
    //             status: rover.status,
    //             max_sol: rover.max_sol,
    //             max_date: rover.max_date,
    //             total_photos: rover.total_photos,
    //             cameras: rover.cameras.map(camera => (
    //                 {
    //                     id: camera.id,
    //                     name: camera.name,
    //                     rover_id: camera.rover_id,
    //                     full_name: camera.full_name
    //                 }
    //             ))
    //         }
    //     )))
    //     setNumApiCalls((prev) => prev + 1);
    //   })
    //   .catch(error => {
    //     console.log(error.response.data.error);
    //     setApiError(error);
    //  });;
    // },[])

    const handleClick = (event, roverID) => {
        event.preventDefault();
        console.log('clicked on ' + roverID);
        setSelectedRover(rovers.filter((rover) => rover.id == roverID)[0]);
    }


    return (
        <>
            <div className="container">
                {/* <h1>List Rovers</h1> */}
                {/* <h4>api calls: {numApiCalls}</h4> */}
                {/* API Error */}
                {/* {apiError && 
                    <h4>There was an api error: {apiError}</h4>
                } */}
                {/* End of API Error */}

                {/* Card Group for RoverCard components */}
                <div className="row pt-3">
                    <div className="col">
                        <div className="card-group">
                            {rovers.map(rover => (
                                <RoverCard rover={rover} onClick={(event) => handleClick(event, rover.id)}/>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* End Card Group for RoverCard components*/}

                {/* Selected Rover */}
                    {/* <h4>Current Selected Rover: {selectedRover.name ? selectedRover.name : "None Selected"}</h4> */}
                {/* End of Selected Rover */}

                {/* Selected Rover Detail */}
                {selectedRover && 
                <>
                    <div className="row  pt-3">
                        <div className="col">
                            <h2>{selectedRover.name}</h2>
                            <p>Landing Date: {selectedRover.landing_date}</p>
                            <p>Total Mission Time On Mars: </p>
                            <p>Status: {selectedRover.status}</p>
                            <p>Total Photos: {selectedRover.total_photos}</p>
                            <Link to={selectedRover.name} className="btn btn-primary">View All Photos</Link>
                        </div>
                        <div className="col">
                            <ol className="list-group list-group-numbered">
                                {selectedRover.cameras.map(camera => (
                                    <li key={camera.key} className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold"><strong>{camera.name}</strong></div>
                                            <span className="text-secondary">{camera.full_name}</span>
                                        </div>
                                        <span className="badge bg-secondary rounded-pill">14</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                    </div>
                    
                </>
                }
                {/* End of Selected Rover Detail */}
            </div>
            
        </>
    )
}


const RoverCard = ({ rover, onClick }) => {
    
    return (
        <div
        //   className={`card ${rover.status==='active' ? "border-success" : "border-secondary"}`}
            className="card"
            onClick={onClick}
        >
            <div 
                // className={`card-body ${rover.status==='active' ? "text-success" : "text-secondary"}`}
                className="card-body"
            >
                <h5 className="card-title">{rover.name}</h5>
                <p className="card-text">Mission Status: <span className={`card-text ${rover.status==='active' ? "text-success" : "text-secondary"}`}>{rover.status}</span> </p>
            </div>
                <div 
                // className={`card-footer ${rover.status==='active' ? "border-success" : "border-secondary"}`}
                    className="card-footer"
                >
                <small className="text-muted">Available Photos: {rover.total_photos}</small>
            </div>
        </div>
    )}