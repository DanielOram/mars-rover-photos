import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { RoversContext } from '../contexts';

import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';


import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import Moment from 'react-moment';

const { REACT_APP_NASA_API_KEY } = process.env;




const DisplayPhotos = (props) => {

    //photos currently a dictionary of format camera_name: [photos]
    const [photos, setPhotos] = useState([]);
    const [apiError, setApiError] = useState(null);

    // filterOptions is an array of all available cameras that have photos
    const [filterOptions, setFilterOptions] = useState([]);
    // toggle all filters on or off on button click
    const [toggleOn, setToggleOn] = useState(true);

    const [sol, setSol] = useState(1);

    const [numApiCalls, setNumApiCalls] = useState(0);
    const [photosLoaded, setPhotosLoaded] = useState(false);

    // For Modal once photo is selected
    const [showModal, setShowModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const { rovers, selectedRover, setSelectedRover, dateOfPhotos, setDateOfPhotos } = useContext(RoversContext);

    useEffect(() => {
        // Set selectedRover once App component has updated state if user went straight to /:rover path and did not set rover name 
        if ((selectedRover === null | selectedRover === undefined) && rovers.length > 0) {
            setSelectedRover(() => {
                const rover = rovers.filter(rover => rover.name.toLowerCase() === props.match.params.rover.toLowerCase())[0];
                return rover;
            });
        }
    },[rovers]);

    useEffect(() => {
        getPhotos();
    },[sol]);

    const getPhotos = () => {
        setPhotosLoaded(false);
        // Call to get photos
        axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${props.match.params.rover.toLowerCase()}/photos`, {
            params: {
                "api_key": REACT_APP_NASA_API_KEY,
                "sol": sol
            }
        })
      .then(res => {
        setPhotos(() => {
            const photo_objects = processPhotoData(res.data);
            setFilterOptions(() => {return photo_objects.map(photo => {return photo.camera})});
            //set dateOfPhotos state var
            setDateOfPhotos(() => {
                var date = null;
                if (photo_objects && photo_objects.length > 0) {
                    date = photo_objects[0].photos[0].earth_date;
                };
                return date;
            })
            return photo_objects;
        });
        
        setNumApiCalls((prev) => prev + 1);
        setPhotosLoaded(true);
        setApiError(null);
      })
      .catch(error => {
          setApiError(error.message);
      });
    }

    const handleFilterOptionsChange = (selectedValues) => {
        setFilterOptions(selectedValues);
    }

    const handleSolSliderChange = (e) => {
        setSol(e.target.value);
    }


    //process api data
    function processPhotoData(data) {
        const data_objects = data.photos.map(photo => (
            {
                id: photo.id,
                sol: photo.sol,
                camera: {
                    id: photo.camera.id,
                    name: photo.camera.name,
                    full_name: photo.camera.full_name,
                    rover_id: photo.camera.rover_id
                },
                img_src: photo.img_src,
                earth_date: photo.earth_date,
                rover: {
                    id: photo.rover.id,
                    name: photo.rover.name,
                    landing_date: photo.rover.landing_date,
                    launch_date: photo.rover.launch_date,
                    status: photo.rover.status
                }
            }
        ));

        const grouped_data = data_objects
            .reduce((newDataDict, obj) => {
                return Object.assign(
                newDataDict, 
                {
                    [obj['camera']['name']]:(newDataDict[obj['camera']['name']] || []).concat(obj)
                }
                );
            },{});

        const grouped_data_keys = Object.keys(grouped_data)
            .map((camera) => {
                return { 
                    camera: camera,
                    name: grouped_data[camera][0]['camera']['full_name'],
                    photos: grouped_data[camera]
                }
        });


        return grouped_data_keys;
    }

    return (
        <>
            <div className="container">
                {!apiError && 

                    <>
                        {/* Slider for selecting sol/day */}
                        <div className="row mb-2">
                            <div className="col pl-3 pr-3">
                                <SliderWithInputFormControl 
                                    min={1}
                                    max={selectedRover ? selectedRover.max_sol : 1}
                                    initial={sol}
                                    sliderValue={sol}
                                    onSliderChange={handleSolSliderChange}
                                />
                                
                            </div>
                        </div>
                        {/* End of Slider */}

                        


                        {/* Toggle Buttons for Filtering Photos by Camera */}
                        {dateOfPhotos &&
                            <div className="row pr-3 pb-2">
                                <div className="pl-3 pr-3">
                                    {/* Button to toggle all filters on or off */}
                                    <ButtonGroup toggle>
                                        <ToggleButton
                                        type="checkbox"
                                        variant="outline-secondary"
                                        checked={toggleOn}
                                        value="1"
                                        onChange={(e) => {
                                            setToggleOn(e.currentTarget.checked);
                                            if (e.currentTarget.checked) {
                                                setFilterOptions(() => {return photos.map(photo_group => {return photo_group.camera})});
                                            } else {
                                                setFilterOptions([]);
                                            }
                                        }}
                                        >
                                        Toggle Filter
                                        </ToggleButton>
                                    </ButtonGroup>
                                    
                                </div>
                                <div className="col overflow-auto pl-0 pr-0 pb-3">
                                    <ToggleButtonGroup 
                                        type='checkbox' 
                                        name='camera_filter_options' 
                                        defaultValue={[]} // defaultValue not working
                                        value={filterOptions} 
                                        onChange={handleFilterOptionsChange}
                                    >
                                    {photos.map(photo_group => (
                                                <ToggleButton key={photo_group.camera} value={photo_group.camera} className="d-flex justify-content-between align-items-start photo" variant="outline-primary">
                                                    <Badge  text="dark">{photo_group.photos.length} photos</Badge>
                                                    <span className="pl-2">{photo_group.camera}</span>
                                                </ToggleButton>
                                        ))}
                                        
                                                
                                    </ToggleButtonGroup>
                                </div>
                            </div>

                        }
                        {/* End of ToggleButtons for Camera Filters */}
                        

                        {/* Filter Images */}
                        {!dateOfPhotos &&
                            <div className="m-3">
                                <h5>There are no photos available for this sol...</h5> 
                                <p>This most likely means no photos were taken by this rover on this day.</p>
                            </div>
                        }
                        {dateOfPhotos &&
                            <div className="row bg-dark">
                                <div className="col d-flex overflow-auto px-0">
                                    {photos.filter(photo_group => {return filterOptions.includes(photo_group.camera) }).map(photo_group => {
                                        return (
                                            <>
                                                <CameraPhotoList photo_group={photo_group} setSelectedPhotoObj={setSelectedPhoto}/>
                                            </>
                                        )
                                    })}
                                </div>
                                
                                    
                                
                            </div>
                        }
                        {/* End of Filter Images */}
                        
                    </>

                }

                {apiError && 
                    <>
                        <h3>There was an error making the api request...</h3>
                        <p>{apiError}</p>
                    </>
                    
                }
                
            </div>

            {/* Modal for displaying selected photo */}
            {<SelectedPhotoModal show={showModal} modalPhotoObj={selectedPhoto} setModalPhotoObj={setSelectedPhoto}/>}
        </>
    )
};


export default DisplayPhotos;


const CameraPhotoList = ({ photo_group, setSelectedPhotoObj }) => {

    return (
        <div key={photo_group.camera} className="d-flex" style={{height: '50vh'}}>
            <div 
                style={{zIndex: 1, position: 'absolute', cursor: 'pointer'}} 
                className="m-2 text-white bg-primary rounded"
            >
                <h5 className="m-1 ml-2 mr-2">{photo_group.camera}</h5>
            </div>

            {photo_group.photos.map(photo => (
                <Photo photo={photo} setModalPhotoObj={setSelectedPhotoObj}/>
            ))}

        </div>
    )
};

const Photo = ({ photo, setModalPhotoObj }) => {

    const handleClick = (event) => {
        event.preventDefault();
        setModalPhotoObj(photo);
    }
    return (
        <img onClick={handleClick} key={photo.id} className="mr-1 photo" src={photo.img_src} alt=""/>
    );
}



const SolToolTipOverlayTrigger = () =>{
    const solToolTipText = 'A sol is a solar day on Mars. The range slider value represents the number of days on mars from the time the rover landed.';

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>{solToolTipText}</Tooltip>}
            >
            <div>Sol</div>
            
        </OverlayTrigger>
    )
}

const SliderWithInputFormControl = (props) => {

    

    const initialSliderValue = props.initial;
    const [ value, setValue ] = useState(initialSliderValue);
  
    return (
      <Form>
        <Form.Group as={Row}>
          <Col xs="6" md="8" lg="10"className="pr-0 pl-0">
            <RangeSlider
              min={props.min}
              max={props.max}
              value={value}
              tooltipPlacement='top'
              onChange={e => setValue(e.target.value)}
              onAfterChange={props.onSliderChange}
            />
          </Col>
          <Col xs="6" md="4" lg="2" className="pr-0">
          <InputGroup>
          
        <InputGroup.Text>
            <SolToolTipOverlayTrigger/>
        </InputGroup.Text>
          
            <Form.Control 
                value={props.sliderValue} 
                onChange={(e) => {
                    props.onSliderChange(e);
                    setValue(e.target.value);
                }}/>
          </InputGroup>
          
          </Col>
        </Form.Group>
      </Form>
    );
  
  };


export const DateDisplay = () => {
const { dateOfPhotos } = useContext(RoversContext);
useEffect(() => {
},[dateOfPhotos])
return (
    <Moment format="D MMM YYYY">
        {dateOfPhotos}
    </Moment>
);
}

const SelectedPhotoModal = ({show, modalPhotoObj, setModalPhotoObj}) => {

    

    const handleClose = () => {
        setModalPhotoObj(null);
    };

    return (
        <>
            {/* Modal shows if the modalPhotoObj state variable is anything but null */}
            <Modal show={modalPhotoObj ? true : false} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                <Modal.Title>
                    {modalPhotoObj && 
                        `${modalPhotoObj.rover.name} Photo (ID: ${modalPhotoObj.id})`
                    }
                </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display: "flex", justifyContent: "center"}}>
                    {modalPhotoObj && 
                        <img style={{overflow: "hidden"}}src={modalPhotoObj.img_src} alt="" />
                    }
                </Modal.Body>
                <Modal.Footer style={{display: 'inline'}}>
                    {modalPhotoObj &&
                        <>
                            <p><span className="font-weight-bold">Date Taken:</span> <Moment format="D MMM YYYY">{modalPhotoObj.earth_date}</Moment></p>
                            <p><span className="font-weight-bold">Camera:</span> {`${modalPhotoObj.camera.full_name} (${modalPhotoObj.camera.name})`}</p>
                        </>

                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}