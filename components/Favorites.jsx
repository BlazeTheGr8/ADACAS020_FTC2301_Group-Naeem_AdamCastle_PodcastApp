import React, { useState, useEffect } from "react";
import supabase from "../supabase";

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
          .eq("user_id", "920f053c-f7cd-427e-b1b9-8c7e1222e513");

        if (error) {
          console.error("Error fetching favorite episodes:", error.message);
        } else {
          // Convert fetched data to the desired format
          const favoriteEpisodesData = data.map((episode) => ({
            showId: episode.show_id,
            seasonNumber: episode.season_number - 1,
            episodeNumber: episode.episode_number - 1,
            id: episode.id, // Include the id of the favorite episode from Supabase
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

  return (
    <div className="favorites-container">
      <h1>Favorites</h1>
      {favoriteEpisodes.map((episode, index) => {
        const { showId, seasonNumber, episodeNumber, id } = episode;
        const showTitle = getShowTitle(showId);
        const seasonTitle = getSeasonTitle(showId, seasonNumber);

        // You can render the episode details here as needed
        return (
          <div key={index} className="favorite-episode">
            <h2>{showTitle}</h2>
            <h3>{seasonTitle}</h3>
            {/* Render episode details */}
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
  );
};

export default Favorites;
