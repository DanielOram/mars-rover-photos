import React, {useState, useEffect} from 'react';
import axios from 'axios';


const { REACT_APP_NASA_API_KEY } = process.env;


export default function ListRoverPhotos(){

    const [photos, setPhotos] = useState([]);

    const [numApiCalls, setNumApiCalls] = useState(0);

    useEffect(() => {
        axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`, {
            params: {
                "api_key": REACT_APP_NASA_API_KEY,
                "sol": 100
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
      });
    },[])

    return (
        <div className="container">
            <h1>List Mars Rover Photos</h1>
            <h4>api calls: {numApiCalls}</h4>
            <div className="row">
                    
                    {photos.map(photo => (
                        <div className="col-4">
                            <div className="card bg-dark text-white">
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
        </div>
        
    )
}