// Function to fetch the array of shows
async function fetchShows() {
    try {
      const response = await fetch('https://podcast-api.netlify.app/shows');
      if (!response.ok) {
        // Handle the error if the response status is not OK (e.g., 404, 500, etc.)
        throw new Error('Network response was not OK');
      }
  
      const data = await response.json();
      // 'data' now contains the array of shows
  
      // Do something with the 'data' array (e.g., update state in a React component, etc.)
      // For example, if you are using React and want to update the component state:
      // setShows(data);
      // where 'setShows' is a state setter function.
  
      return data; // If you want to return the array from this function
    } catch (error) {
      // Handle any errors that occurred during the fetch or parsing process
      console.error('Error occurred while fetching data:', error);
      // You might want to return an empty array or throw the error further, depending on your use case
      return [];
    }
  }
  
  // Example usage:
  // You can call the 'fetchShows' function wherever you need the array of shows.
  // If you're using React, you might want to call it inside a useEffect or during component initialization.
  
  // If you want to use async/await:
  export async function getShowsData() {
    try {
      const showsArray = await fetchShows();
      return showsArray
      ; // This will log the array of shows to the console
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
    




  useEffect(() => {
    async function getUserAndLog() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log(user.id);
        setUser(user.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    getUserAndLog();
  }, []);