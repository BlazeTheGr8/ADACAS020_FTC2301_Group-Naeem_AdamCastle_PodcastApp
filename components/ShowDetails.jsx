import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../src/index.css'; // Import the CSS file

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

// Function to map genre numbers to genre names from genreList
const mapGenres = (genreNumbers) => {
    return genreNumbers.map((number) => {
        if (number >= 0 && number < genreList.length) {
            return genreList[number];
        }
        return "Unknown Genre";
    });
};

const ShowDetails = (props) => {
    const { showId } = useParams();
    const { showData, currentShow } = props;

    const [selectedSeason, setSelectedSeason] = useState(null);

    // Use showId to find the corresponding show object
    const result = showData.find(item => item.id === showId);

    // If result is not defined, handle the case gracefully
    if (!result) {
        return <div>Loading...</div>;
    }

    const { description, id, image, seasons, title, updated } = result;

    // Find the genreObject by matching showId in the currentShow array
    const genreObject = currentShow.find(item => item.id === showId);

    // If genreObject is not defined, handle the case gracefully
    if (!genreObject) {
        return <div>Loading...</div>;
    }

    const { genres } = genreObject;

    // Map genre numbers to genre names
    const mappedGenres = mapGenres(genres);

    const handleSeasonButtonClick = (index) => {
        setSelectedSeason(seasons[index]);
    };

    const seasonButtons = seasons.map((season, index) => (
        <button key={index} onClick={() => handleSeasonButtonClick(index)}>
            {index + 1}
        </button>
    ));

    // Render the component content now that we know result and genreObject are defined
    return (
        <div className="show-details-container">
            <img src={image} alt={title} className="show-image" />
            <h1 className="show-title">{title}</h1>
            <p className="show-description">{description}</p>
            <p className="show-genres">Genres: {mappedGenres.join(", ")}</p>
            <p className="show-seasons">Seasons: {seasons.length}</p>

            {/* Display numbered buttons for each season */}
            <div className="season-buttons">
                {seasonButtons}
            </div>

            {/* Display selected season details */}
            {selectedSeason && (
                <div className="selected-season-details">
                    <h2>Selected Season Details</h2>
                    <p className="selected-season">Season: {selectedSeason.season}</p>
                    <p className="selected-title">Title: {selectedSeason.title}</p>
                    <p className="selected-episodes">Episodes:</p>
                    <ul>
                        {selectedSeason.episodes.map((episode, index) => (
                            <li key={index}>
                                <p className="episode">Episode: {episode.episode}</p>
                                <p className="episode-title">Title: {episode.title}</p>
                                <p className="episode-description">Description: {episode.description}</p>
                                <audio controls>
                                    <source src={episode.file} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                </audio>
                                {/* Display other episode details as needed */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ShowDetails;