import React, {useState, useEffect} from 'react';
import axios from 'axios';

const { REACT_APP_NASA_API_KEY } = process.env;

const DisplayPhotos = (props) => {

    const [photos, setPhotos] = useState([]);
    const [apiError, setApiError] = useState(null);

    const [numApiCalls, setNumApiCalls] = useState(0);

    useEffect(() => {
        axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${props.match.params.rover.toLowerCase()}/photos`, {
            params: {
                "api_key": REACT_APP_NASA_API_KEY,
                "sol": 1
            }
        })
      .then(res => {
        // alert('Response: ' + JSON.stringify(res,'',2));
        // setPhotos(res.data.photos.map(photo => (
        //     photo.img_src
        // )));
        setPhotos(res.data.photos.map(photo => (
            {
                id: photo.id,
                camera: {
                    name: photo.camera.name,
                    full_name: photo.camera.full_name
                },
                img_src: photo.img_src,
                date: photo.earth_date
            }
        )));
        setNumApiCalls((prev) => prev + 1);
        setApiError(null);
      })
      .catch(error => {
          setApiError(error.message);
      });
    },[])

    return (
        <>
            <div className="container">
                <h1>{props.match.params.rover} Photos</h1>
                <h4>api calls: {numApiCalls}</h4>
                <p>number of photos: {photos.length}</p>
                {!apiError && 
                    <div className="row pt-3">
                        {photos.map(photo => (
                            <div className="col-4 pt-3">
                                <div key={photo.key} className="card bg-dark text-white">
                                    <img className="card-img img-fluid" src={photo.img_src} alt="rover image"/>
                                    <div className="card-img-overlay">
                                        <h5 className="card-title">ID: {photo.id}</h5>
                                        <p className="card-text">DATE: {photo.date}</p>
                                        <p className="card-text">CAMERA: {photo.camera.name}</p>
                                    </div>
                                </div>
                            </div>
                            
                        ))}
                    
                    </div>
                }
                {apiError && 
                    <>
                        <h3>There was an error making the api request...</h3>
                        <p>{apiError}</p>
                    </>
                    
                }
                
            </div>
        </>
    )
}


export default DisplayPhotos;