import React from 'react';
import axios from 'axios';

const DisplayPhotos = (props) => {
    return (
        <>
            <h1>{props.match.params.rover} Photos</h1>
        </>
    )
}


export default DisplayPhotos;