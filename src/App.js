import './App.css';
import React, { useState, useEffect, createContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Navbar';
// import ListRoverCameras from './ListRoverCameras';
// import ListRoverPhotos from './ListRoverPhotos';
import ListRovers from './ListRovers';
import RoverPhotos from './RoverPhotos';
import Footer from './Footer';
import { RoversContext } from './contexts';

// import Image from './static/img/oranges.jpg';

// const baseApi = "https://api.nasa.gov/mars-photos/api/v1/"

const { REACT_APP_NASA_API_KEY } = process.env;



function App() {

  // make api call here to get information about each rover (number of sol etc)
  const [rovers, setRovers] = useState([{ name: 'default'}]);
  const [selectedRover, setSelectedRover] = useState(null);

  const [numApiCalls, setNumApiCalls] = useState(0);

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
    setNumApiCalls((prev) => prev + 1);
  })
  .catch(error => {
    console.log(error.response.data.error);
    setApiError(error);
 });;
},[])

  return (
    <div className="App">
      <RoversContext.Provider value={{ rovers, selectedRover, setSelectedRover }}>
        <Navbar />
        {/* <ListRoverCameras /> */}
        {/* <ListRoverPhotos /> */}
        {/* <ListRovers /> */}
        ApiCalls: {numApiCalls}
        {apiError && 
            <h4>There was an api error: {apiError}</h4>
        }

        <Switch>
          <Route exact path="/" component={ListRovers} />
          <Route path="/:rover" component={RoverPhotos} />
        </Switch>
        <Footer />
      </RoversContext.Provider>
      
      
    </div>
  );
}

export default App;
