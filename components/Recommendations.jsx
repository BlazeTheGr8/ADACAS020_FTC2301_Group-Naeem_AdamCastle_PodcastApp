import React from 'react';
import {
    MDBCarousel,
    MDBCarouselItem,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

export default function Recommendations(props) {
    const { showsData, onShowClick } = props
    const { previewData, showData, apiComplete } = showsData
    const navigate = useNavigate()
    const featured = []
    for (let item of showData) {
        if (item.genres) {
            if (item.genres.includes('Featured'))
                featured.push(item)
        }
    }

    const handleShowClick = (showId) => {
        onShowClick(showId); // Update the currentShow in the App component's state
        navigate(`/shows/${showId}`); // Programmatically navigate to the ShowDetails route using useNavigate
      };

    const elements = featured.map(item => {
        const { title, description, image, seasons, id } = item;
        return (
            <div key={id} onClick={() => handleShowClick(id)}>
                <MDBCarouselItem
                key={item.id}
                className='w-100 d-block'
                itemId={item.id}
                src={image}
                alt='...'
                placeholder='Hello there'
            >
                <h5 className='transparent-blur'>{title}</h5>
                <p className='transparent-blur'>Seasons: {seasons.length}</p>
            </MDBCarouselItem>
            </div>
        )
    })

    

    return (
        <>
            {!apiComplete ? <p>Fetching your recommendations</p> : <MDBCarousel showControls showIndicators fade dark className='parent'>
                <p className='recommended'>Recommended</p>
                {elements}
            </MDBCarousel>}
        </>

    );
}