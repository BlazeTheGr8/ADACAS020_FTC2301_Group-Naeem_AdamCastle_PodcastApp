import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from '../components/Header';
import LandingPage from '../components/LandingPage';
import Recommendations from '../components/Recommendations';
import ShowDetails from '../components/ShowDetails';
import Login from '../components/Login';
import Signup from "../components/Signup"
import Favorites from "../components/Favorites"

/* The `App` component is the main component of the application. It is responsible for rendering the
different routes and components based on the current URL. */
const App = () => {
  const [state, setState] = useState({
    signedIn: false,
    previewData: [],
    showData: [],
    apiComplete: false,
    currentShow: '',
  });

  /* The `useEffect` hook is used to perform side effects in functional components. In this case, it is
  used to fetch data from an API when the component mounts for the first time. */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://podcast-api.netlify.app/shows");
        const previewData = await res.json();
        setState(prev => ({ ...prev, previewData }));

        const showIds = previewData.map(item => item.id);
        const showPromises = showIds.map(id =>
          fetch(`https://podcast-api.netlify.app/id/${id}`)
            .then(res => res.json())
        );

        const showData = await Promise.all(showPromises);
        setState(prev => ({ ...prev, showData, apiComplete: true }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleShowClick = (showId) => {
    setState(prev => ({ ...prev, currentShow: showId }));
  };

  const handleSignIn = () => {
    setState(prev => ({...prev, signedIn: true}))
  }

  return (
    <Router>
      <Header signedIn={state.signedIn} />
      <Routes>
        <Route
          exact
          path="/"
          element={
            state.showData &&
            (state.signedIn ? (
              <>
                <Recommendations
                  showsData={state}
                  onShowClick={handleShowClick}
                />
                <LandingPage
                  showsData={state}
                  onShowClick={handleShowClick} 
                />
              </>
            ) : (
              <Login signIn={handleSignIn} />
            ))
          }
        />
        <Route
          exact
          path="/shows"
          element={
            state.signedIn ? (
              <ShowDetails
                showData={state.showData}
                currentShow={state.currentShow}
              />
            ) : (
              <Login signIn={handleSignIn} />
            )
          }
        />
        <Route
          exact
          path="/shows/:showId"
          element={
            state.signedIn ? (
              <ShowDetails
                showData={state.showData}
                currentShow={state.previewData}
              />
            ) : (
              <Login signIn={handleSignIn} />
            )
          }
        />
        <Route
          exact
          path="/favorites/:userId"
          element={
            
            <Favorites
              showsData={state.showData}
              currentShow={state.previewData}
            />
          }
        />
        <Route exact path="/login" element={<Login signIn={handleSignIn} />} />
        <Route exact path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;