// Popup.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import moment from 'moment';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import './Popup.css';

const Popup = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('12:15');
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState(false); // State for date error visibility

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDateError(false); // Clear date error when a date is selected
    setError('')
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    validateTimeInterval(time, endTime);
  };

  const handleEndTimeChange = (time) => {
    setEndTime(time);
    validateTimeInterval(startTime, time);
  };

  const validateTimeInterval = (start, end) => {
    const startMoment = moment(start, 'HH:mm');
    const endMoment = moment(end, 'HH:mm');
    const duration = moment.duration(endMoment.diff(startMoment));

    if (duration.asMinutes() > 15) {
      setError("You can book a gym equipment for no more than 15 minutes.");
    } else {
      setError('');
    }
  };


  const handleApply = () => {
  // Check if there is an error before sending the request
  if (error) {
    return;
  }

  // Prepare data for the POST request
  const postData = {
    selected_date: selectedDate.toLocaleDateString('en-GB').split('/').reverse().join('-'),
    start_time: startTime,
    end_time: endTime,
  };

  // Send a POST request to the Django server
  fetch('http://127.0.0.1:8000/api/save_booking/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); // Handle the response from the server as needed
    onClose(); // Close the popup after successfully applying
  })
  .catch(error => console.error('Error:', error));
};
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Select a Date and Time Range</h2>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          calendarClassName="custom-calendar"
          customInput={<CalendarIcon />}
        />
        {dateError && (
          <div className="error-container">
            <p className="error-message">Please select a date.</p>
          </div>
        )}
        <div className="time-picker-container">
          <div className="time-picker">
            <label>From Time:</label>
            <CustomTimePicker
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </div>
          <div className="time-picker">
            <label>Until Time:</label>
            <CustomTimePicker
              value={endTime}
              onChange={handleEndTimeChange}
            />
          </div>
        </div>
        {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )}
        {selectedDate && (
          <p className="selected-date">
            You selected: {selectedDate.toLocaleDateString('en-GB')} from {startTime} to {endTime}
          </p>
        )}
        <button onClick={onClose}>
          Close
        </button>
        <button onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
}

const CalendarIcon = ({ onClick }) => (
  <button className="calendar-icon" onClick={onClick}>
    <FaCalendarAlt />
  </button>
);

const CustomTimePicker = ({ value, onChange }) => (
  <TimePicker
    value={value}
    onChange={onChange}
    format="HH:mm"
    disableClock // Disable the clock
    clearIcon={null} // Remove the clear icon
    clockIcon={null} // Remove the clock icon
    renderArrow={(props, direction) => (
      <button {...props} className={`arrow-button ${direction}`}>
        {direction === 'up' ? '▲' : '▼'}
      </button>
    )}
    step={5} // Set the time interval to 5 minutes
  />
);

export default Popup;