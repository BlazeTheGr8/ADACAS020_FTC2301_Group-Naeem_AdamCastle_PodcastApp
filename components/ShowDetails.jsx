import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../src/index.css"; // Import the CSS file
import { MenuItem, Toolbar, Stack, Typography, Select } from "@mui/material";
import { MDBBtn } from "mdb-react-ui-kit";
import supabase from "../supabase";

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

  // Use showId to find the corresponding show object
  const result = showData.find((item) => item.id === showId);

  // If result is not defined, handle the case gracefully
  if (!result) {
    return <div>Loading...</div>;
  }

  const { description, id, image, seasons, title, updated } = result;

  // Find the genreObject by matching showId in the currentShow array
  const genreObject = currentShow.find((item) => item.id === showId);

  // If genreObject is not defined, handle the case gracefully
  if (!genreObject) {
    return <div>Loading...</div>;
  }

  const { genres } = genreObject;

  // Map genre numbers to genre names
  const mappedGenres = mapGenres(genres);

  const handleSeasonSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSeason(selectedValue);
  };

  const allEpisodes = seasons.flatMap((season) => season.episodes);

  const [selectedSeason, setSelectedSeason] = useState(null);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  // Function to fetch user's favorite episodes from Supabase
  const fetchFavoriteEpisodes = async () => {
    const user = supabase.auth.getUser();
    if (user) {
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", (await supabase.auth.getUser()).data.user.id)
          .eq("show_id", showId);

        if (error) {
          console.error("Error fetching favorite episodes:", error.message);
        } else {
          // Convert fetched data to the desired format
          const favoriteEpisodesData = data.map((episode) => ({
            showId: episode.show_id,
            seasonNumber: episode.season_number - 1,
            episodeNumber: episode.episode_number - 1,
          }));
          setFavoriteEpisodes(favoriteEpisodesData);
        }
      } catch (error) {
        console.error("Error fetching favorite episodes:", error.message);
      }
    }
  };

  // Use useEffect to fetch favorite episodes when the component mounts
  useEffect(() => {
    async function getUserAndLog() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    getUserAndLog();
    fetchFavoriteEpisodes();
  }, []);

  // Function to handle marking episodes as favorites or unfavorites
  const handleFavoriteEpisode = async (seasonNumber, episodeNumber) => {
    // Check if the episode is already marked as a favorite
    const isFavorite = favoriteEpisodes.some(
      (episode) =>
        episode.seasonNumber === seasonNumber &&
        episode.episodeNumber === episodeNumber
    );

    if (isFavorite) {
      // If the episode is already marked as a favorite, remove it from the list
      const updatedFavorites = favoriteEpisodes.filter(
        (episode) =>
          episode.seasonNumber !== seasonNumber ||
          episode.episodeNumber !== episodeNumber
      );
      setFavoriteEpisodes(updatedFavorites);

      // Remove the episode from the database
      await removeFavoriteEpisode(showId, seasonNumber, episodeNumber);
    } else {
      // If the episode is not marked as a favorite, add it to the list
      const newFavorite = {
        showId: showId,
        seasonNumber: seasonNumber,
        episodeNumber: episodeNumber,
      };
      setFavoriteEpisodes([...favoriteEpisodes, newFavorite]);

      // Save the updated favorite episodes list to Supabase
      saveFavoriteEpisodes([...favoriteEpisodes, newFavorite]);
    }
  };

  // Function to remove a favorite episode from the Supabase database
  const removeFavoriteEpisode = async (showId, seasonNumber, episodeNumber) => {
    try {
      const user = supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to remove favorite episodes.");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", (await supabase.auth.getUser()).data.user.id)
        .eq("show_id", showId)
        .eq("season_number", seasonNumber + 1)
        .eq("episode_number", episodeNumber + 1);

      if (error) {
        console.error("Error removing favorite episode:", error.message);
      } else {
        console.log("Favorite episode removed successfully!");
      }
    } catch (error) {
      console.error("Error removing favorite episode:", error.message);
    }
  };

  // Function to save favorite episodes to Supabase
  const saveFavoriteEpisodes = async (episodes) => {
    // Check if the user is signed in
    const user = supabase.auth.getUser();
    if (!user) {
      alert("Please sign in to save favorite episodes.");
      return;
    }

    // Save favorite episodes to Supabase
    try {
      const { data, error } = await supabase.from("favorites").insert({
        user_id: (await supabase.auth.getUser()).data.user.id,
        show_id: episodes[episodes.length - 1].showId,
        season_number: episodes[episodes.length - 1].seasonNumber + 1,
        episode_number: episodes[episodes.length - 1].episodeNumber + 1,
      });
      if (error) {
        console.error("Error saving favorite episodes:", error.message);
      } else {
        console.log("Favorite episodes saved successfully!");
      }
    } catch (error) {
      console.error("Error saving favorite episodes:", error.message);
    }
  };

  // Render the component content
  return (
    <div className="show-details-container">
      <img src={image} alt={title} className="show-image" />
      <h1 className="show-title">{title}</h1>
      <p className="show-description">{description}</p>
      <p className="show-genres">Genres: {mappedGenres.join(", ")}</p>
      <p className="show-seasons">Seasons: {seasons.length}</p>

      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle1" color="inherit">
            Season:
          </Typography>
          <Select
            value={selectedSeason === null ? "none" : selectedSeason}
            onChange={handleSeasonSelectChange}
            variant="outlined"
          >
            <MenuItem value="none">Select Season</MenuItem>
            <MenuItem value="all">All</MenuItem>
            {seasons.map((season, index) => (
              <MenuItem key={index} value={index}>
                Season {index + 1}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Toolbar>

      {selectedSeason !== null &&
        selectedSeason !== "none" &&
        selectedSeason !== "all" && (
          <div className="selected-season-details">
            <h2>Selected Season Details</h2>
            <p className="selected-season">
              Season: {seasons[selectedSeason].season}
            </p>
            <p className="selected-title">
              Title: {seasons[selectedSeason].title}
            </p>
            <p className="selected-episodes">Episodes:</p>
            <ul>
              {seasons[selectedSeason].episodes.map((episode, index) => (
                <li key={index}>
                  <p className="episode">Episode: {episode.episode}</p>
                  <p className="episode-title">Title: {episode.title}</p>
                  <p className="episode-description">
                    Description: {episode.description}
                  </p>
                  <audio controls>
                    <source src={episode.file} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  {/* Button to mark episode as favorite */}
                  <MDBBtn
                    onClick={() => handleFavoriteEpisode(selectedSeason, index)}
                  >
                    {favoriteEpisodes.some(
                      (favEpisode) =>
                        favEpisode.seasonNumber === selectedSeason &&
                        favEpisode.episodeNumber === index
                    )
                      ? "Unfavorite"
                      : "Favorite"}
                  </MDBBtn>
                </li>
              ))}
            </ul>
            {/* Button to save favorite episodes */}
            <MDBBtn onClick={() => saveFavoriteEpisodes(favoriteEpisodes)}>
              Save Favorite Episodes
            </MDBBtn>
          </div>
        )}

      {selectedSeason === "all" && (
        <div className="selected-season-details">
          <h2>All Episodes of All Seasons</h2>
          {seasons.map((season, seasonIndex) => (
            <div key={seasonIndex}>
              <h3>Season {seasonIndex + 1}</h3>
              <ul>
                {season.episodes.map((episode, episodeIndex) => (
                  <li key={episodeIndex}>
                    <p className="episode">Episode: {episode.episode}</p>
                    <p className="episode-title">Title: {episode.title}</p>
                    <p className="episode-description">
                      Description: {episode.description}
                    </p>
                    <audio controls>
                      <source src={episode.file} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    {/* Button to mark episode as favorite */}
                    <MDBBtn
                      onClick={() =>
                        handleFavoriteEpisode(seasonIndex, episodeIndex)
                      }
                    >
                      {favoriteEpisodes.some(
                        (favEpisode) =>
                          favEpisode.seasonNumber === seasonIndex &&
                          favEpisode.episodeNumber === episodeIndex
                      )
                        ? "Unfavorite"
                        : "Favorite"}
                    </MDBBtn>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Button to save favorite episodes */}
          <MDBBtn onClick={() => saveFavoriteEpisodes(favoriteEpisodes)}>
            Save Favorite Episodes
          </MDBBtn>
        </div>
      )}
    </div>
  );
};

export default ShowDetails;
