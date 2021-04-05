import React, {useState, useEffect} from 'react';
import axios from 'axios';

const { REACT_APP_NASA_API_KEY } = process.env;

export default function ListRovers() {

    const [rovers, setRovers] = useState([]);

    const [numApiCalls, setNumApiCalls] = useState(0);

    const [apiError, setApiError] = useState();

    const json = {
        "id": 5,
        "name": "Curiosity",
        "landing_date": "2012-08-06",
        "launch_date": "2011-11-26",
        "status": "active",
        "max_sol": 3078,
        "max_date": "2021-04-03",
        "total_photos": 484318,
        "cameras": [
            {
                "id": 20,
                "name": "FHAZ",
                "rover_id": 5,
                "full_name": "Front Hazard Avoidance Camera"
            }
        ]
    }

    useEffect(() => {
        axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers`, {
            params: {
                "api_key": REACT_APP_NASA_API_KEY
            }
        })
      .then(res => {
        setRovers(res.data.rovers.map(rover => (
            {
                id: rover.id,
                name: rover.name,
                landing_date: rover.landing_date,
                launch_date: rover.launch_date,
                status: rover.status,
                max_sol: rover.max_sol,
                max_date: rover.max_date,
                total_photos: rover.total_photos,
                cameras: rover.cameras.map(camera => (
                    {
                        id: camera.id,
                        name: camera.name,
                        rover_id: camera.rover_id,
                        full_name: camera.full_name
                    }
                ))
            }
        )))
        setNumApiCalls((prev) => prev + 1);
      })
      .catch(error => {
        console.log(error.response.data.error);
        setApiError(error);
     });;
    },[])

    return (
        <>
            <h1>List Rovers</h1>
            <h4>api calls: {numApiCalls}</h4>
            {apiError && 
                <h4>There was an api error: {apiError}</h4>
            }
            {/* Card Group for RoverCard components */}
            <div className="card-group">
                {rovers.map(rover => (
                    <RoverCard rover={rover}/>
                ))}
            </div>
            {/* End Card Group for RoverCard components*/}
            <h4>Current Selected Rover: </h4>
            {rovers.map(rover => (
                <>
                    <h2>{rover.name}</h2>
                    <p>Landing Date: {rover.landing_date}</p>
                    <p>Status: {rover.status}</p>
                    <p>Total Photos: {rover.total_photos}</p>
                    <ol>
                        {rover.cameras.map(camera => (
                            <li key={camera.key}>
                                <p>{camera.name} - {camera.full_name}</p>
                            </li>
                        ))}
                    </ol>
                </>
            ))}
            
        </>
    )
}


const RoverCard = ({ rover, children }) => (
    <div
    //   className={`card ${rover.status==='active' ? "border-success" : "border-secondary"}`}
        className="card"
    >
        <div 
            // className={`card-body ${rover.status==='active' ? "text-success" : "text-secondary"}`}
            className="card-body"
        >
            <h5 className="card-title">{rover.name}</h5>
            <p className={`card-text ${rover.status==='active' ? "text-success" : "text-secondary"}`}>{rover.status}</p>
        </div>
            <div 
            // className={`card-footer ${rover.status==='active' ? "border-success" : "border-secondary"}`}
                className="card-footer"
            >
            <small className="text-muted">Available Photos: {rover.total_photos}</small>
        </div>
      {children}
    </div>
  );