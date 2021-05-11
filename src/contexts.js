import { createContext } from 'react';

// Context data
export const RoversContext = createContext({
    rovers: []
});

// example json object for rover from api
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