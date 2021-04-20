import React, {useState, useEffect} from 'react';
import axios from 'axios';


const { REACT_APP_NASA_API_KEY } = process.env;

export default function ListRoverCameras() {

    //display json data for rovers
    const [rovers, setRovers] = useState([]);

    const [numApiCalls, setNumApiCalls] = useState(0);

    useEffect(() => {
        axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers`, {
            params: {
                "api_key": REACT_APP_NASA_API_KEY
            }
        })
      .then(res => {
        // alert('Response: ' + JSON.stringify(res,'',2));
        setRovers(res.data.rovers);
        setNumApiCalls((prev) => prev + 1);
      });
    },[])

    return (
        <div className="container">
            <h2>
                Container Component
            </h2>
            <h4>api calls: {numApiCalls}</h4>

            
            {/* <div>
                {rovers.map(rover => (
                    <>
                    <h3>{rover.name}</h3>
                    {rover.cameras.map(camera => (
                        <>
                            <p>{camera.name} - {camera.full_name}</p>
                        </>
                    ))}
                    </>
                ))}
            </div> */}
            {rovers.map((rover, index) => (
                <>
                    <h2>{rover.name}</h2>
                    
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Camera Name</th>
                                <th scope="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rover.cameras.map((camera, index) => (
                                <tr>
                                    <th scope="row">{index}</th>
                                    <td>{camera.name}</td>
                                    <td>{camera.full_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ))}
        </div>
    )
}