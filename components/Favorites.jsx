import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "react-router-dom";

const Favorites = (props) => {
  const {userId} = useParams()
  const { showsData } = props;


  const [allPreviewData, setAllPreviewData] = useState([])
  const [allShowData, setAllShowData] = useState([])

  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
  const [sortOption, setSortOption] = useState("All");

  // Function to fetch user's favorite episodes from Supabase
  const fetchFavoriteEpisodes = async () => {
    const user = supabase.auth.getUser();
    if (user) {
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", userId);

        if (error) {
          console.error("Error fetching favorite episodes:", error.message);
        } else {
          // Convert fetched data to the desired format, including showTitle and seasonTitle
          const favoriteEpisodesData = data.map(async (episode) => {
            const showId = episode.show_id;
            const seasonNumber = episode.season_number - 1;
            const episodeNumber = episode.episode_number - 1;
            const id = episode.id;
            const time = episode.time_added;

            const showTitle = getShowTitle(showId); // Fetch showTitle
            const seasonTitle = getSeasonTitle(showId, seasonNumber); // Fetch seasonTitle

            // Fetch the episode data to include in the favoriteEpisodesData array
            const show = showsData.find((item) => item.id === showId);
            const episodeData = show?.seasons[seasonNumber]?.episodes[episodeNumber];

            return {
              showId,
              seasonNumber,
              episodeNumber,
              id,
              time,
              showTitle,
              seasonTitle,
              episodeData, // Include the episode data for sorting and rendering
            };
          });

          // Wait for all async calls to complete and then set the favoriteEpisodes state
          Promise.all(favoriteEpisodesData).then((data) => setFavoriteEpisodes(data));
        }
      } catch (error) {
        console.error("Error fetching favorite episodes:", error.message);
      }
    }
  };

  // Use useEffect to fetch favorite episodes when the component mounts
  // Use useEffect to fetch data when the component mounts, but only if showsData is not provided through props
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch previewData
        if (!showsData) {
          const res = await fetch("https://podcast-api.netlify.app/shows");
          const previewData = await res.json();
          setAllPreviewData(previewData);
        }

        // Fetch showData
        if (!showsData || !showsData.showData || !showsData.apiComplete) {
          const showIds = allPreviewData.map((item) => item.id);
          const showPromises = showIds.map((id) =>
            fetch(`https://podcast-api.netlify.app/id/${id}`).then((res) => res.json())
          );
          const showData = await Promise.all(showPromises);
          setAllShowData(showData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    fetchFavoriteEpisodes();
  }, [showsData, userId]);

  // Function to get the show title based on showId
  const getShowTitle = (showId) => {
    const show = showsData.find((item) => item.id === showId);
    return show ? show.title : "Unknown Show";
  };

  // Function to get the season title based on showId and season number
  const getSeasonTitle = (showId, seasonNumber) => {
    const show = showsData.find((item) => item.id === showId);
    return show && show.seasons[seasonNumber]
      ? show.seasons[seasonNumber].season
      : "Unknown Season";
  };

  // Function to handle removing an item from favorites
  const handleRemoveFromFavorites = async (favoriteId) => {
    try {
      // Remove the item from the local state
      setFavoriteEpisodes((prevFavorites) =>
        prevFavorites.filter((episode) => episode.id !== favoriteId)
      );

      // Remove the item from Supabase
      await supabase.from("favorites").delete().eq("id", favoriteId);
      console.log("Favorite episode removed successfully!");
    } catch (error) {
      console.error("Error removing favorite episode:", error.message);
    }
  };

  // Function to handle the sorting logic
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Function to sort episodes by episode title and time added
  const sortEpisodes = (episodes, option) => {
    switch (option) {
      case "All":
        return episodes;
      case "A-Z":
        return episodes.sort((a, b) => {
          const episodeA = a.episodeData;
          const episodeB = b.episodeData;
          return episodeA?.title.localeCompare(episodeB?.title) || a.showTitle.localeCompare(b.showTitle) || a.seasonTitle.localeCompare(b.seasonTitle);
        });
      case "Z-A":
        return episodes.sort((a, b) => {
          const episodeA = a.episodeData;
          const episodeB = b.episodeData;
          return episodeB?.title.localeCompare(episodeA?.title) || b.showTitle.localeCompare(a.showTitle) || b.seasonTitle.localeCompare(a.seasonTitle);
        });
      case "MOST RECENT":
        return episodes.sort((a, b) => {
          const dateA = new Date(a.time);
          const dateB = new Date(b.time);
          return dateB - dateA || a.showTitle.localeCompare(b.showTitle) || a.seasonTitle.localeCompare(b.seasonTitle);
        });
      case "LEAST RECENT":
        return episodes.sort((a, b) => {
          const dateA = new Date(a.time);
          const dateB = new Date(b.time);
          return dateA - dateB || a.showTitle.localeCompare(b.showTitle) || a.seasonTitle.localeCompare(b.seasonTitle);
        });
      default:
        return episodes;
    }
  };

  // Group favorite episodes by showTitle and seasonTitle
  const groupedFavoriteEpisodes = favoriteEpisodes.reduce((acc, episode) => {
    const showTitle = episode.showTitle;
    const seasonTitle = episode.seasonTitle;
    const key = `${showTitle}-${episode.showId}`;

    if (!acc[key]) {
      acc[key] = {
        showTitle,
        episodes: [],
      };
    }

    acc[key].episodes.push({ ...episode, seasonTitle });
    return acc;
  }, {});

  // Track the last show title to avoid rendering it again
  let lastShowTitle = null;

  // Rendering logic based on the selected sortOption
  let renderedEpisodes;
  if (sortOption === "All") {
    renderedEpisodes = Object.entries(groupedFavoriteEpisodes).map(
      ([groupKey, groupData]) => {
        const { showTitle, episodes } = groupData;

        // Track the last season title for each show to avoid rendering it again
        let lastSeasonTitle = null;

        return (
          <div key={groupKey} className="favorite-group">
            <h2>{showTitle}</h2>
            {episodes.map((episode, index) => {
              const { showId, seasonNumber, episodeNumber, id, time, seasonTitle } = episode;

              // Render the season title only if it's different from the last
              const shouldRenderSeasonTitle = seasonTitle !== lastSeasonTitle;
              lastSeasonTitle = seasonTitle;

              return (
                <div key={index} className="favorite-episode">
                  {/* Render episode details */}
                  {/* Display the time added */}
                  <p>Added to Favorites: {new Date(time).toLocaleString()}</p>
                  {showsData.map((show) => {
                    if (show.id === showId && show.seasons[seasonNumber]) {
                      const episodeData =
                        show.seasons[seasonNumber].episodes[episodeNumber];
                      return (
                        <div key={episodeNumber}>
                          {shouldRenderSeasonTitle && <h3>Season: {seasonTitle}</h3>}
                          <p>Episode {episodeData.episode}</p>
                          <p>Title: {episodeData.title}</p>
                          <p>Description: {episodeData.description}</p>
                          <audio controls>
                            <source src={episodeData.file} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                          {/* Button to remove the episode from favorites */}
                          <button onClick={() => handleRemoveFromFavorites(id)}>
                            Remove from Favorites
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </div>
        );
      }
    );
  } else {
    // Sort episodes based on the selected sorting option
    const sortedEpisodes = sortEpisodes([...favoriteEpisodes], sortOption);

    renderedEpisodes = sortedEpisodes.map((episode, index) => {
      const { showId, seasonNumber, episodeNumber, id, time, showTitle, seasonTitle } = episode; // Added showTitle and seasonTitle here

      // Render the episode details for individual episodes
      return (
        <div key={index} className="favorite-episode">
          {/* Render episode details */}
          {/* Display the time added */}
          <p>Added to Favorites: {new Date(time).toLocaleString()}</p>
          <p>Show Title: {showTitle}</p> {/* Display the showTitle */}
          <p>Season Title: {seasonTitle}</p> {/* Display the seasonTitle */}
          {showsData.map((show) => {
            if (show.id === showId && show.seasons[seasonNumber]) {
              const episodeData = show.seasons[seasonNumber].episodes[episodeNumber];
              return (
                <div key={episodeNumber}>
                  <p>Episode {episodeData.episode}</p>
                  <p>Title: {episodeData.title}</p>
                  <p>Description: {episodeData.description}</p>
                  <audio controls>
                    <source src={episodeData.file} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  {/* Button to remove the episode from favorites */}
                  <button onClick={() => handleRemoveFromFavorites(id)}>
                    Remove from Favorites
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    });
  }

  return (
    <div className="favorites-container">
      <h1>Favorites</h1>
      <AppBar position="relative">
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle1" color="inherit">
              Sort by:
            </Typography>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              variant="outlined"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="A-Z">A-Z</MenuItem>
              <MenuItem value="Z-A">Z-A</MenuItem>
              <MenuItem value="MOST RECENT">Most Recent</MenuItem>
              <MenuItem value="LEAST RECENT">Least Recent</MenuItem>
            </Select>
          </Stack>
        </Toolbar>
      </AppBar>
      {renderedEpisodes}
    </div>
  );
};

export default Favorites;