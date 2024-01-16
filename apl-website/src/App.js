import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Records from "./event_json_files/apl_events.json";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./Header";

const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }) => (
  <div>
    <span style={{ fontWeight: "600", whiteSpace: "normal" }}>
      {event.title}
    </span>
    <br />
    {moment(event.start).format("LT")} - {moment(event.end).format("LT")}
  </div>
);

function App() {
  const [events, setEvents] = useState(Records.apl_event);
  const [selectedAges, setSelectedAges] = useState(new Set());
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [showAllEvents, setShowAllEvents] = useState(true);

  const uniqueAges = useMemo(() => {
    const ages = new Set(events.map(event => event.field_event_recommended_ages));
    return Array.from(ages);
  }, [events]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(events.map(event => event.event_category));
    return Array.from(categories);
  }, [events]);

  const handleAllEventsChange = () => {
    setShowAllEvents(!showAllEvents);
    setSelectedAges(new Set());
    setSelectedCategories(new Set());
  };

  const handleAgeChange = (age) => {
    const newAges = new Set(selectedAges);
    if (newAges.has(age)) {
      newAges.delete(age);
    } else {
      newAges.add(age);
    }
    setSelectedAges(newAges);
    setShowAllEvents(newAges.size === 0 && selectedCategories.size === 0);
  };

  const handleCategoryChange = (category) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
    setShowAllEvents(newCategories.size === 0 && selectedAges.size === 0);
  };

  const filteredEvents = useMemo(() => {
    if (showAllEvents) return events;

    return events.filter(event => {
      const ageMatch = selectedAges.size === 0 || selectedAges.has(event.field_event_recommended_ages);
      const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(event.event_category);
      return ageMatch && categoryMatch;
    });
  }, [events, showAllEvents, selectedAges, selectedCategories]);

  const convertedEvents = filteredEvents.map(event => ({
    id: event.nid,
    title: event.title,
    start: new Date(parseInt(event.field_slr_time_start) * 1000),
    end: new Date(parseInt(event.field_slr_time_end) * 1000),
    allDay: true,
  }));

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#E8E8E8', 
      borderRadius: '5px',
      opacity: 1,
      color: 'black', 
      border: '1px solid #E8E8E8', 
      display: 'block',
      cursor: 'pointer',
      margin: '0 0 5px 0',
    };

    return {
      style,
    };
  };

  return (
    <div className="App">
      <Header />
      <div className="filters">
        <div>
          <input
            type="checkbox"
            id="all-events"
            checked={showAllEvents}
            onChange={handleAllEventsChange}
          />
          <label htmlFor="all-events">All Events</label>
        </div>
        <div>
          <h3>Filter by Age</h3>
          {uniqueAges.map(age => (
            <div key={age}>
              <input
                type="checkbox"
                id={`age-${age}`}
                checked={selectedAges.has(age)}
                onChange={() => handleAgeChange(age)}
              />
              <label htmlFor={`age-${age}`}>{age}</label>
            </div>
          ))}
        </div>
        <div>
          <h3>Filter by Category</h3>
          {uniqueCategories.map(category => (
            <div key={category}>
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={selectedCategories.has(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <label htmlFor={`category-${category}`}>{category}</label>
            </div>
          ))}
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={convertedEvents}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        views={['week', 'month']}
        components={{ event: CustomEvent }}
        formats={{
          eventTimeRangeFormat: ({ start, end }) =>
            `${moment(start).format('LT')} - ${moment(end).format('LT')}`,
        }}
        toolbar={(toolbar) => (
          <div>
            <span style={{ fontSize: '1.5em', fontWeight: 'Semi-Bold' }}>
              {toolbar.label}
            </span>
          </div>
        )}
      />
    </div>
  );
}

export default App;
