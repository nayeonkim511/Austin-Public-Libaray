import React, { useState, useMemo } from "react";
import "./App.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Records from "./event_json_files/apl_events.json";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function App() {
  let url = 'http://dev-apl2023.pantheonsite.io/api/event';
  let response = fetch(url);

  //const eventsArray = Records.apl_event;
  const eventsArray = response;
  const [selectedAges, setSelectedAges] = useState({});

  const uniqueAges = useMemo(() => {
    const ages = new Set();
    eventsArray.forEach((event) => {
      ages.add(event.field_event_recommended_ages);
    });
    return Array.from(ages);
  }, [eventsArray]);

  const handleCheckboxChange = (age) => {
    setSelectedAges((prevSelectedAges) => ({
      ...prevSelectedAges,
      [age]: !prevSelectedAges[age],
    }));
  };

  const filteredEvents = useMemo(() => {
    const selectedAgeGroups = Object.entries(selectedAges).filter(
      ([, value]) => value
    ).length;

    if (selectedAgeGroups === 0) {
      return eventsArray.map((event) => ({
        id: event.nid,
        title: event.title,
        start: new Date(parseInt(event.field_slr_time_start) * 1000),
        end: new Date(parseInt(event.field_slr_time_end) * 1000),
        allDay: false,
      }));
    }

    return eventsArray
      .filter((event) => selectedAges[event.field_event_recommended_ages])
      .map((event) => ({
        id: event.nid,
        title: event.title,
        start: new Date(parseInt(event.field_slr_time_start) * 1000),
        end: new Date(parseInt(event.field_slr_time_end) * 1000),
        allDay: false,
      }));
  }, [eventsArray, selectedAges]);

  return (
    <div className="App">
      <div className="filters">
        <h3>Filter by Age</h3>
        {uniqueAges.map((age) => (
          <div key={age}>
            <input
              type="checkbox"
              id={age}
              name={age}
              checked={selectedAges[age] || false}
              onChange={() => handleCheckboxChange(age)}
            />
            <label htmlFor={age}>{age}</label>
          </div>
        ))}
      </div>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}

export default App;
