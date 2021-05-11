import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { RoversContext } from './contexts';

import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Badge from 'react-bootstrap/Badge';


import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import Collapse from 'react-bootstrap/Collapse';
import Fade from 'react-bootstrap/Fade';
import Card from 'react-bootstrap/Card';

const { REACT_APP_NASA_API_KEY } = process.env;


const input_json = 
    {
        "id": 4477,
        "sol": 1,
        "camera": {
            "id": 22,
            "name": "MAST",
            "rover_id": 5,
            "full_name": "Mast Camera"
        },
        "img_src": "http://mars.jpl.nasa.gov/msl-raw-images/msss/00001/mcam/0001ML0000001000I1_DXXX.jpg",
        "earth_date": "2012-08-07",
        "rover": {
            "id": 5,
            "name": "Curiosity",
            "landing_date": "2012-08-06",
            "launch_date": "2011-11-26",
            "status": "active"
        }
    };

const output_photo_obj = {
    "camera": "EDL_RUCAM",
    "name": "Rover Up-Look Camera",
    "photos": [
      {
        "id": 811024,
        "sol": 1,
        "camera": {
          "id": 33,
          "name": "EDL_RUCAM",
          "full_name": "Rover Up-Look Camera",
          "rover_id": 8
        },
        "img_src": "https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00001/ids/edr/browse/edl/EUF_0001_0667022666_963ECV_N0010052EDLC00001_0010LUJ01_1200.jpg",
        "earth_date": "2021-02-19",
        "rover": {
          "id": 8,
          "name": "Perseverance",
          "landing_date": "2021-02-18",
          "launch_date": "2020-07-30",
          "status": "active"
        }
      }
    ]
};

const DisplayPhotos = (props) => {

    //photos currently a dictionary of format camera_name: [photos]
    const [photos, setPhotos] = useState([]);
    const [apiError, setApiError] = useState(null);

    // filterOptions is an array of all available cameras that have photos
    const [filterOptions, setFilterOptions] = useState([]);
    // toggle all filters on or off on button click
    const [toggleOn, setToggleOn] = useState(true);

    const [sol, setSol] = useState(1);
    // const [earthDay, setEarthDay] = useState(null);


    // const [ rangeSliderValue, setRangeSliderValue ] = useState(0); 
    // const [rangeSliderUnit, setRangeSliderUnit] = useState('Martian Sol');

    const [numApiCalls, setNumApiCalls] = useState(0);

    const { rovers, selectedRover, setSelectedRover } = useContext(RoversContext);

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
        // Call to get photos
        axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${props.match.params.rover.toLowerCase()}/photos`, {
            params: {
                "api_key": REACT_APP_NASA_API_KEY,
                "sol": sol
            }
        })
      .then(res => {
        // alert('Response: ' + JSON.stringify(res,'',2));
        // setPhotos(res.data.photos.map(photo => (
        //     photo.img_src
        // )));
        setPhotos(() => {
            const photo_objects = processPhotoData(res.data);
            
            setFilterOptions(() => {return photo_objects.map(photo => {return photo.camera})});

            return photo_objects;
        });
        
        setNumApiCalls((prev) => prev + 1);
        setApiError(null);
      })
      .catch(error => {
          setApiError(error.message);
      });
    }

    const handleFilterOptionsChange = (selectedValues) => {
        setFilterOptions(selectedValues);
    }

    // const handleSliderUnitChange = (selectedUnit) => {
    //     setRangeSliderUnit(selectedUnit);
    // }

    const handleSolSliderChange = (e) => {
        console.log('sol = ' + e.target.value);
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
    

    //  function groupByCamera(photo_array, camera_key, camera_name_key) {
    //     return photo_array
    //       .reduce((hash, obj) => {
    //         if(obj[camera_key] === undefined) return hash; 
    //         return Object.assign(hash, { [obj[camera_key][camera_name_key]]:( hash[obj[camera_key][camera_name_key]] || [] ).concat(obj)})
    //       }, {})
    //  }

    return (
        <>
            <div className="container">
                <h1>{props.match.params.rover} Photos</h1>
                <h4>api calls: {numApiCalls}</h4>
                <p>number of cameras: {photos.length}</p>
                
                {/* <FilterViewOptions /> */}



                {!apiError && 

                    <>

                        {/* Slider for selecting sol/day */}
                        <div className="row pr-3 mb-2">
                            <div className="col pl-3 pr-3">
                                {/* <RangeSlider
                                    value={rangeSliderValue}
                                    tooltipPlacement='top'
                                    onChange={changeEvent => setRangeSliderValue(changeEvent.target.value)}
                                /> */}
                                <SliderWithInputFormControl 
                                    min={1}
                                    max={selectedRover ? selectedRover.max_sol : 1}
                                    initial={sol}
                                    // unit={rangeSliderUnit}
                                    sliderValue={sol}
                                    onSliderChange={handleSolSliderChange}
                                    // onSelect={handleSliderUnitChange}
                                />
                                
                            </div>
                        </div>
                        {/* End of Slider */}

                        


                        {/* Toggle Buttons for Filtering Photos by Camera */}
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
                                            <ToggleButton value={photo_group.camera} className="d-flex justify-content-between align-items-start" variant="outline-primary">
                                                <Badge variant="secondary" pill>{photo_group.photos.length} photos</Badge>
                                                <span className="pl-2">{photo_group.camera}</span>
                                            </ToggleButton>
                                    ))}
                                    
                                            
                                </ToggleButtonGroup>
                            </div>
                        </div>
                        {/* End of ToggleButtons for Camera Filters */}

                        

                        {/* Filter Images */}
                        <div className="row">
                            <div className="col">
                                
                                {photos.filter(photo_group => {return filterOptions.includes(photo_group.camera) }).map(photo_group => {
                                    return (
                                        <>
                                            
                                            <div className="d-flex overflow-auto">
                                                <div style={{zIndex: 1, position: 'absolute'}} className="m-2 text-white bg-primary rounded">
                                                    {/* <div className="card-body"> */}
                                                        <h5 className="m-1 ml-2 mr-2">{photo_group.camera}</h5>
                                                    {/* </div> */}
                                                </div>
                                                {/* <p>{photo_group.camera}</p> */}
                                                {photo_group.photos.map(photo => (
                                                // <div className="">
                                                    <img key={photo.id} style={{maxHeight: 200}} className="mr-1 mb-1" src={photo.img_src} alt=""/>
                                                // </div>
                                                ))}
                                            </div>
                                        
                                        </>
                                        
                                    )
                                })}
                            </div>
                            
                                
                            
                        </div>
                        
                        
                    </>

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



// const CameraFilterButtonGroup = () => {
//     return (
//         <ToggleButtonGroup type='checkbox' name='cameras' defaultValue={[]} size="sm" vertical>
//             {photos.map(photo_group => (
//                     <ToggleButton value={photo_group.camera} className="d-flex justify-content-between align-items-start" variant="outline-primary">
//                         {photo_group.camera}<Badge variant="light" className="">{photo_group.photos.length}</Badge>
//                     </ToggleButton>
//             ))}
//         </ToggleButtonGroup>
//     )
// }



// Parent Component for all Filtering and View Options
// is a row within the outer container

// const FilterViewOptions = (props) => {


//     return (
//         <div className="row">
//             <div className="col-sm-12">
//                 <h2>Filter View Options</h2>
//             </div>
//             {/* RangeSlider for selecting Martian Sol */}
//             <div className="col-sm-12">
//                 <MartianSolRangeSlider />
//             </div>

//             {/* Date selector for selecting Earth date */}
//             <div className="col-sm-12">
//                 {/* <EarthDatePicker /> */}
//             </div>
//         </div>
//     );
// }


// const MartianSolRangeSlider = (props) => {
//     return (
//         <h3>MartianSolRangeSlider</h3>
//     )
// }

// const EarthDatePicker = (props) => {

//     return (
//         <>
//             <h3>DatePicker</h3>
//         </>
//     );
// }


const SliderWithInputFormControl = (props) => {

    const initialSliderValue = props.initial;
    const [ value, setValue ] = useState(initialSliderValue);
    // const [ finalValue, setFinalValue ] = useState(initialSliderValue);

    // const handleChange = (e) => setValue(e.target.value);

    // function handleChange(e) {
    //     setValue(e.target.value);
    // }
  
    return (
      <Form>
        <Form.Group as={Row}>
          <Col xs="10" className="pr-0">
            <RangeSlider
              min={props.min}
              max={props.max}
              value={value}
              tooltipPlacement='top'
            //   onChange = {props.onChange}
              onChange={e => setValue(e.target.value)}
            //   onChange={handleChange}
              onAfterChange={props.onSliderChange}
            />
          </Col>
          <Col xs="2"  className="pr-0">
          <InputGroup>
            {/* <DropdownButton
                as={InputGroup.Prepend}
                variant="outline-secondary"
                title={props.unit}
                id="input-group-dropdown-1"
                onSelect={props.onSelect}
            >
                <Dropdown.Item eventKey="Martian Sol">Martian Sol</Dropdown.Item>
                <Dropdown.Item eventKey="Earth Day">Earth Day</Dropdown.Item>
            </DropdownButton> */}
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



  {/* <div className="row">
    <div className="col">
    <InputGroup className="mb-3">
        <DropdownButton
            as={InputGroup.Prepend}
            variant="outline-secondary"
            title={rangeSliderUnit}
            id="input-group-dropdown-1"
            onSelect={handleSliderUnitChange}
        >
            <Dropdown.Item eventKey="Martian Sol">Martian Sol</Dropdown.Item>
            <Dropdown.Item eventKey="Earth Day">Earth Day</Dropdown.Item>
        </DropdownButton>
        <FormControl
            placeholder=""
            aria-label="RangeSliderUnit"
            aria-describedby="RangeSliderUnit"
        />
    </InputGroup>
    </div>
</div> */}


{/* Display Options buttons */}
{/* <div className="row pb-2">
    <div className="col pb-3">
        <ToggleButtonGroup
            type='checkbox'
            name='photo-display-options'
            defaultValue={[]}
            value={['display option']}  
            style={{display: 'flex'}}                                  
        >
            <ToggleButton 
                value={1}
            >
                display option 1
            </ToggleButton>
            <ToggleButton 
                value={2}
            >
                display option 2
            </ToggleButton>
            <ToggleButton 
                value={3}
            >
                display option 3
            </ToggleButton>
        </ToggleButtonGroup>
    </div>
</div> */}
{/* End of Display Options buttons */}