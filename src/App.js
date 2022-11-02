import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './components/Navbar';
import ListRovers from './components/ListRovers';
import Footer from './components/Footer';
import { RoversContext } from './contexts';

// const baseApi = "https://api.nasa.gov/mars-photos/api/v1/"


const { REACT_APP_NASA_API_KEY } = process.env;



function App() {

  // make api call here to get information about each rover (number of sol etc)
  const [rovers, setRovers] = useState([{ name: 'default'}]);
  const [selectedRover, setSelectedRover] = useState(null);
  const [dateOfPhotos, setDateOfPhotos] = useState(null);
  const [apiError, setApiError] = useState();

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
  })
  .catch(error => {
    console.log(error.response.data.error);
    setApiError(error);
 });;
},[])

  return (
    <div className="App">
      <RoversContext.Provider value={{ rovers, selectedRover, setSelectedRover, dateOfPhotos, setDateOfPhotos }}>
        <Navbar />
        {apiError && 
            <h4>There was an api error: {apiError}</h4>
        }
        <ListRovers />
        <Footer />
      </RoversContext.Provider>
      
      
    </div>
  );
}

export default App;
