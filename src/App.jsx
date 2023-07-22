import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import LandingPage from '../components/LandingPage'
import Recommendations from '../components/Recommendations';
// import ShowList from './ShowList';
// import ShowDetails from './ShowDetails';
// import Favorites from './Favorites';
// import Login from './Login';

const App = () => {
  const [state, setState] = useState({
    signedIn: false,
    previewData: [],
    showData: [],
    apiComplete: false,
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
  }, [state.apiComplete]);

  console.log(state.showData);

  return (
    <Router>
      <Header signedIn={state.signedIn} />
      <Routes>
        <Route exact path="/" element={state.showData && <>
          {state.apiComplete && <Recommendations
            showsData = {state}
          />}
          <LandingPage
          showsData={state}
        />
        </>} />
        {/* <Route exact path="/login" component={Login} />
        <Route exact path="/shows" component={ShowList} />
        <Route exact path="/shows/:showId" component={ShowDetails} />
        <Route exact path="/favorites" component={Favorites} /> */}
      </Routes>
    </Router>
  );
};

export default App;