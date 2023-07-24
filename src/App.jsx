import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from '../components/Header';
import LandingPage from '../components/LandingPage';
import Recommendations from '../components/Recommendations';
import ShowDetails from '../components/ShowDetails';

const App = () => {
  const [state, setState] = useState({
    signedIn: false,
    previewData: [],
    showData: [],
    apiComplete: false,
    currentShow: '',
  });

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

  return (
    <Router>
      <Header signedIn={state.signedIn} />
      <Routes>
        <Route exact path="/" element={state.showData && <>
          <Recommendations
            showsData={state}
            onShowClick={handleShowClick}
          />
          <LandingPage
            showsData={state}
            onShowClick={handleShowClick} // Pass the handleShowClick function to LandingPage
          />
        </>} />
        <Route exact path="/shows" element={<ShowDetails
        showData={state.showData}  currentShow={state.currentShow} />} />
        <Route exact path="/shows/:showId" element={<ShowDetails
        showData={state.showData}  currentShow={state.previewData} />} />
        {/* <Route exact path="/login" component={Login} />
        <Route exact path="/shows" component={ShowList} />
        <Route exact path="/shows/:showId" component={ShowDetails} />
        <Route exact path="/favorites" component={Favorites} /> */}
      </Routes>
    </Router>
  );
};

export default App;