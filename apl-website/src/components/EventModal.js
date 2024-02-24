import React, { useState } from "react";
import { addEventToGoogleCalendar } from "../utils/CalendarAPI";

const EventModal = ({ show, onClose, event }) => {
  const [accessToken, setAccessToken] = useState(null);

  if (!show) return null;

  const handleAddToCalendar = () => {
    addEventToGoogleCalendar(event, accessToken, setAccessToken, onClose);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{event?.title}</h2>
        <p>{event?.description}</p>
        <button onClick={() => handleAddToCalendar()}>Add to Calendar</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EventModal;
