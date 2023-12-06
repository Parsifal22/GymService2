// Popup.js
import React, { useState} from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import moment from 'moment';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import './Popup.css';

const Popup = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('12:15');
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState(false);
  const [fetchedData, setFetchedData] = useState(null); // State to store fetched data

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Reset dateError when a new date is selected
    setDateError(false);
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const apiUrl = `http://127.0.0.1:8000/api/get_bookings/${formattedDate}/`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data); // Handle the response from the server as needed
        setFetchedData(data); // Store fetched data in state
      })
      .catch(error => console.error('Error:', error));
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
  } else if (end < start) {

    setError("End time must be greater than start time.");
  } else {
    setError('');
  }


  };


const handleApply = () => {
  // Check if there is an error before sending the request
  if (error || dateError) {
    return;
  }

  // Check for overlapping times with fetchedData
  const hasOverlap = Array.isArray(fetchedData) && fetchedData.some(item => {
  const itemStartTime = moment(item.start_time, 'HH:mm');
  const itemEndTime = moment(item.end_time, 'HH:mm');
  const newStartTime = moment(`${selectedDate.toLocaleDateString()} ${startTime}`, 'DD/MM/YYYY HH:mm');
  const newEndTime = moment(`${selectedDate.toLocaleDateString()} ${endTime}`, 'DD/MM/YYYY HH:mm');

  return (
      (newStartTime.isSameOrAfter(itemStartTime) && newStartTime.isBefore(itemEndTime)) ||
      (newEndTime.isAfter(itemStartTime) && newEndTime.isSameOrBefore(itemEndTime))
  );
});

  if (hasOverlap) {
    setError("The selected time overlaps with an existing booking. Please choose a different time.");
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
      if ('error' in data) {
        setError(data.error);

        // Handle the case where the user has not selected a date
        if (data.error === 'Please select a date.') {
          setDateError(true);
        }
      } else {
        console.log(data); // Handle the response from the server as needed
        onClose(); // Close the popup after successfully applying
      }
    })
    .catch(error => console.error('Error:', error));
  };
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Treadmill</h2>
        {fetchedData && (
          <div className="fetched-data-container">
            <h3>Fetched Data:</h3>
            <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
          </div>
        )}
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