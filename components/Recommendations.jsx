import React from 'react';
import {
    MDBCarousel,
    MDBCarouselItem,
} from 'mdb-react-ui-kit';

export default function Recommendations(props) {
    const { showsData } = props
    const {previewData, showData} = showsData
    console.log(previewData)
    const featured = []
    for (let item of showData) {
        if (item.genres) {
            if (item.genres.includes('Featured'))
                featured.push(item)
        }
    }
    const elements = featured.map(item => {
        const { title, description, image, seasons } = item;
        return (
            <MDBCarouselItem
                key={item.id}
                className='w-100 d-block'
                itemId={item.id}
                src={image}
                alt='...'
            >
                <h5 className='transparent-blur'>{title}</h5>
                <p className='transparent-blur'>Seasons: {seasons.length}</p>
            </MDBCarouselItem>
        )
    })

    console.log(elements)

    return (
        <MDBCarousel showControls showIndicators dark className='parent'>
            <p className='recommended'>Recommended</p>
            {elements}
        </MDBCarousel>
    );
}