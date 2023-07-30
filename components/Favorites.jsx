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

const Favorites = (props) => {
  const { showsData } = props;

  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);

  // Function to fetch user's favorite episodes from Supabase
  const fetchFavoriteEpisodes = async () => {
    const user = supabase.auth.getUser();
    if (user) {
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", (await supabase.auth.getUser()).data.user.id);

        if (error) {
          console.error("Error fetching favorite episodes:", error.message);
        } else {
          // Convert fetched data to the desired format
          const favoriteEpisodesData = data.map((episode) => ({
            showId: episode.show_id,
            seasonNumber: episode.season_number - 1,
            episodeNumber: episode.episode_number - 1,
            id: episode.id,
            time: episode.time_added, // Include the time_added from Supabase
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
    fetchFavoriteEpisodes();
  }, []);

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

  // Group favorite episodes by showTitle and seasonTitle
  const groupedFavoriteEpisodes = favoriteEpisodes.reduce((acc, episode) => {
    const showTitle = getShowTitle(episode.showId);
    const seasonTitle = getSeasonTitle(episode.showId, episode.seasonNumber);
    const key = `${showTitle}-${seasonTitle}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(episode);
    return acc;
  }, {});

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
              value="All"
            //   onChange={handleSortChange}
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
      {Object.entries(groupedFavoriteEpisodes).map(([groupKey, episodes]) => (
        <div key={groupKey} className="favorite-group">
          <h2>{groupKey.split("-")[0]}</h2>
          <h3>Season: {groupKey.split("-")[1]}</h3>
          {episodes.map((episode, index) => {
            const { showId, seasonNumber, episodeNumber, id, time } = episode; // Extract time here
            return (
              <div key={index} className="favorite-episode">
                {/* Render episode details */}
                {/* Display the time added */}
                <p>Added to Favorites: {new Date(time).toLocaleString()}</p>
                {showsData.map((show) => {
                  if (show.id === showId && show.seasons[seasonNumber]) {
                    const episode =
                      show.seasons[seasonNumber].episodes[episodeNumber];
                    return (
                      <div key={episodeNumber}>
                        <p>Episode {episode.episode}</p>
                        <p>Title: {episode.title}</p>
                        <p>Description: {episode.description}</p>
                        <audio controls>
                          <source src={episode.file} type="audio/mpeg" />
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
      ))}
    </div>
  );
};

export default Favorites;





