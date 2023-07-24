import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBRow, MDBCardSubTitle, MDBBtnGroup } from 'mdb-react-ui-kit';

const genreList = [
  "Personal Growth",
  "True Crime and Investigative Journalism",
  "History",
  "Comedy",
  "Entertainment",
  "Business",
  "Fiction",
  "News",
  "Kids and Family",
];

export default function LandingPage(props) {
  const { showsData, onShowClick } = props;
  const { previewData } = showsData;

  const [sortingMethod, setSortingMethod] = useState('All');
  const navigate = useNavigate(); // Use useNavigate hook

  const shortenString = (text, maxLength, readMoreText = "... Read more") => {
    if (text.length <= maxLength) {
      return text;
    }
    const shortenedText = text.slice(0, maxLength).trim();
    return `${shortenedText}${readMoreText}`;
  };

  const sortData = (method) => {
    switch (method) {
      case 'A-Z':
        return previewData.slice().sort((a, b) => a.title.localeCompare(b.title));
      case 'Z-A':
        return previewData.slice().sort((a, b) => b.title.localeCompare(a.title));
      case 'MOST RECENT':
        return previewData.slice().sort((a, b) => new Date(b.updated) - new Date(a.updated));
      case 'LEAST RECENT':
        return previewData.slice().sort((a, b) => new Date(a.updated) - new Date(b.updated));
      default:
        return previewData;
    }
  };

  const sortedData = sortData(sortingMethod);

  const elements = sortedData.map((item) => {
    const { id, title, description, seasons, image, genres, updated } = item;

    const maxLength = 60;
    const shortenedDescription = shortenString(description, maxLength);
    const genresWithNames = genres ? genres.map((num) => genreList[num - 1]) : [];

    const handleShowClick = (showId) => {
      onShowClick(showId); // Update the currentShow in the parent component's state
      navigate(`/shows/${showId}`); // Programmatically navigate to the ShowDetails route using useNavigate
    };

    return (
      <div key={id} onClick={() => handleShowClick(id)}>
        <MDBCard>
          <MDBCardImage src={image} position='top' alt='...' />
          <MDBCardBody>
            <MDBCardTitle>{title}</MDBCardTitle>
            <MDBCardSubTitle>{genresWithNames.join(", ")}</MDBCardSubTitle>
            <MDBCardText>{shortenedDescription}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </div>
    );
  });

  const handleSortButtonClick = (method) => {
    setSortingMethod(method);
  };

  return (
    <>
      <MDBBtnGroup toolbar role='toolbar' aria-label='Toolbar with button groups' className='tool-container'>
        <MDBBtnGroup size='sm' className='me-2 toolbar' aria-label='First Group'>
          <MDBBtn onClick={() => handleSortButtonClick('All')}>All</MDBBtn>
          <MDBBtn onClick={() => handleSortButtonClick('A-Z')}>A-Z</MDBBtn>
          <MDBBtn onClick={() => handleSortButtonClick('Z-A')}>Z-A</MDBBtn>
          <MDBBtn onClick={() => handleSortButtonClick('MOST RECENT')}>MOST RECENT</MDBBtn>
          <MDBBtn onClick={() => handleSortButtonClick('LEAST RECENT')}>LEAST RECENT</MDBBtn>
        </MDBBtnGroup>
      </MDBBtnGroup>
      <MDBRow>
        {elements}
      </MDBRow>
    </>
  );
}