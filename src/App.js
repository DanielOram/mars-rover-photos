import './App.css';

import Navbar from './Navbar';
import ListRoverCameras from './ListRoverCameras';
import ListRoverPhotos from './ListRoverPhotos';
import ListRovers from './ListRovers';

// import Image from './static/img/oranges.jpg';

const baseApi = "https://api.nasa.gov/mars-photos/api/v1/"






function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <ListRoverCameras /> */}
      {/* <ListRoverPhotos /> */}
      <ListRovers />
      
    </div>
  );
}

export default App;
