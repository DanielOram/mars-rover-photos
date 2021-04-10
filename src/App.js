import './App.css';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Navbar from './Navbar';
// import ListRoverCameras from './ListRoverCameras';
// import ListRoverPhotos from './ListRoverPhotos';
import ListRovers from './ListRovers';
import RoverPhotos from './RoverPhotos';

// import Image from './static/img/oranges.jpg';

// const baseApi = "https://api.nasa.gov/mars-photos/api/v1/"






function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <ListRoverCameras /> */}
      {/* <ListRoverPhotos /> */}
      {/* <ListRovers /> */}

      <Switch>
        <Route exact path="/" component={ListRovers} />
        <Route path="/:rover" component={RoverPhotos} />
      </Switch>
      
    </div>
  );
}

export default App;
