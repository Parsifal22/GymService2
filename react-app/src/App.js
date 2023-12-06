import React, { useState } from 'react';
import Popup from './Popup';
import logo from './Logo.png';
import profileIcon from './profileIcon.png';
import treadmillIcon from './treadmillIcon.png';
import rowingIcon from './rowingIcon.png';
import bikeIcon from './bikeIcon.png';
import benchIcon from './benchIcon.png';
import './App.css';

function App() {
   const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="square-container">
          <div className="line left-ver"></div>
          <div className="line left-ver-2"></div>
          <div className="line right-ver"></div>
          <div className="line top-hoz"></div>
          <div className="line bottom-hoz"></div>
          <div className="line bottom-hoz-2"></div>
          <div className="gym-map" onClick={openPopup}>
            <img src={treadmillIcon} alt="Treadmill Button" className="treadmill-2" />
            <img src={treadmillIcon} alt="Treadmill Button" className="treadmill-3" />
            <img src={treadmillIcon} alt="Treadmill Button" className="treadmill-4" />
            <img src={benchIcon} alt="Bench Button" className="bench-1 rotate-icon" />
            <img src={benchIcon} alt="Bench Button" className="bench-2 rotate-icon" />
            <img src={rowingIcon} alt="Rowing Button" className="rowing-1" />
            <img src={rowingIcon} alt="Rowing Button" className="rowing-2" />
            <img src={bikeIcon} alt="Bike Button" className="bike-1" />
            <img src={bikeIcon} alt="Bike Button" className="bike-2" />
          </div>
        </div>
        <div className="Profile-position">
          <img src={profileIcon} alt="Profile" className="profile-icon" />
        </div>
        {isPopupOpen && <Popup onClose={closePopup} />}
        <img src={logo} className="App-logo" alt="logo" />

      </header>
    </div>
  );
}

export default App;

