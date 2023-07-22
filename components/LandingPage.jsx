import Recommendations from './Recommendations'
import { useEffect } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBRow, MDBCardSubTitle } from 'mdb-react-ui-kit';
import { Toolbar } from './Toolbar';
import { useState } from 'react';

export default function LandingPage(props) {
    const { showsData } = props
    const { previewData, showData } = showsData
    console.log(showsData)

    const [data, setData] = useState(showData)
    //(data)

    const shortenString = (text, maxLength, readMoreText = "... Read more") => {
        if (text.length <= maxLength) {
            return text;
        }
        const shortenedText = text.slice(0, maxLength).trim();
        return `${shortenedText}${readMoreText}`;
    }

    const elements = previewData.map((item => {
        const { id, title, description, seasons, image, genres, updated } = item

        const maxLength = 60
        const shortenedDescription = shortenString(description, maxLength);
        //(genres)

        return (
            <MDBCard key={id}>
                <MDBCardImage src={image} position='top' alt='...' />
                <MDBCardBody>
                    <MDBCardTitle>{title}</MDBCardTitle>
                    <MDBCardSubTitle>{ genres ? genres.join() : '' }</MDBCardSubTitle>
                    <MDBCardText>
                        {shortenedDescription}
                    </MDBCardText>
                    <MDBBtn href='#'>Button</MDBBtn>
                </MDBCardBody>
            </MDBCard>
        )


    }))

    return (
        <>
            {/* <Recommendations
                showsData={showsData}
            /> */}
            <Toolbar />
            <MDBRow>
                {elements}
            </MDBRow>

        </>
    );
}