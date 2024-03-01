import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Records from "./event_json_files/apl_events.json";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@fontsource/inter";
import ColorCheckbox from "./components/ColorCheckbox.js";

import CustomEvent from "./components/CustomEvent";
import SearchResultsModal from "./components/SearchResultsModal";
import EventModal from "./components/EventModal";

const localizer = momentLocalizer(moment);

function App() {
  const [events] = useState(Records.apl_event);
  const [selectedAges, setSelectedAges] = useState(new Set());
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedLocations, setSelectedLocations] = useState(new Set());
  const [showAllEvents, setShowAllEvents] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEventsOpen, setAllEventsOpen] = useState(false);
  const [ageOpen, setAgeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const uniqueAges = useMemo(() => {
    const ages = new Set(
      events.map((event) => event.field_event_recommended_ages)
    );
    return Array.from(ages);
  }, [events]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(events.map((event) => event.event_category));
    return Array.from(categories);
  }, [events]);

  const handleAllEventsChange = () => {
    setShowAllEvents(!showAllEvents);
    setSelectedAges(new Set());
    setSelectedCategories(new Set());
    setSelectedLocations(new Set());
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

  const handleLocationChange = (location) => {
    const newLocations = new Set(selectedLocations);
    if (newLocations.has(location)) {
      newLocations.delete(location);
    } else {
      newLocations.add(location);
    }
    setSelectedLocations(newLocations);
    setShowAllEvents(newLocations.size === 0);
  };

  const filteredEvents = useMemo(() => {
    if (showAllEvents) return events;

    return events.filter((event) => {
      const ageMatch =
        selectedAges.size === 0 ||
        selectedAges.has(event.field_event_recommended_ages);
      const categoryMatch =
        selectedCategories.size === 0 ||
        selectedCategories.has(event.event_category);
      const locationMatch =
        selectedLocations.size === 0 ||
        selectedLocations.has(event.field_event_loc);
      return ageMatch && categoryMatch && locationMatch;
    });
  }, [
    events,
    showAllEvents,
    selectedAges,
    selectedCategories,
    selectedLocations,
  ]);

  const convertedEvents = filteredEvents.map((event) => ({
    id: event.nid,
    title: event.title,
    start: new Date(parseInt(event.field_slr_time_start) * 1000),
    end: new Date(parseInt(event.field_slr_time_end) * 1000),
    desc: event.body,
    location: event.field_event_loc,
    allDay: true,
  }));

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredEvents);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, events]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#E8E8E8",
      borderRadius: "5px",
      opacity: 1,
      color: "black",
      border: "1px solid #E8E8E8",
      display: "block",
      cursor: "pointer",
      margin: "0 0 5px 0",
    };

    return {
      style,
    };
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="filters-sidebar">
          <div>
            <b>FILTERS</b>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <button onClick={() => setAllEventsOpen(!allEventsOpen)}>
              All Events
            </button>
            {allEventsOpen && (
              <div>
                {/* <input
                  type="checkbox"
                  id="all-events"
                  checked={showAllEvents}
                  onChange={handleAllEventsChange}
                />
                <label htmlFor="all-events"> Show All</label> */}
                <ColorCheckbox
                  id={`all-events`}
                  checked={showAllEvents}
                  onChange={handleAllEventsChange}
                />
              </div>
            )}
          </div>
          <div className="filter-dropdown">
            <button onClick={() => setAgeOpen(!ageOpen)}>Filter by Age</button>
            {ageOpen &&
              uniqueAges.map((age) => (
                <div key={age}>
                  {/* <input
                    type="checkbox"
                    id={`age-${age}`}
                    checked={selectedAges.has(age)}
                    onChange={() => handleAgeChange(age)}
                  />
                  <label htmlFor={`age-${age}`}>{age}</label> */}
                  <ColorCheckbox
                    id={`age-${age}`}
                    checked={selectedAges.has(age)}
                    onChange={() => handleAgeChange(age)}
                  />
                </div>
              ))}
          </div>
          <div className="filter-dropdown">
            <button onClick={() => setCategoryOpen(!categoryOpen)}>
              Filter by Category
            </button>
            {categoryOpen &&
              uniqueCategories.map((category) => (
                <div key={category}>
                  {/* <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={selectedCategories.has(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <label htmlFor={`category-${category}`}>{category}</label> */}
                  <ColorCheckbox
                    id={`category-${category}`}
                    checked={selectedCategories.has(category)}
                    onChange={() => handleLocationChange(category)}
                  />
                </div>
              ))}
          </div>
          <div className="filter-dropdown">
            <button onClick={() => setLocationOpen(!locationOpen)}>
              Filter by Location
            </button>
            {locationOpen &&
              uniqueCategories.map((location) => (
                <div key={location}>
                  {
                    /* <input
                    type="checkbox"
                    id={`category-${location}`}
                    checked={selectedCategories.has(location)}
                    onChange={() => handleLocationChange(location)}
                  /> */
                    <ColorCheckbox
                      id={`${location}`}
                      checked={selectedCategories.has(location)}
                      onChange={() => handleLocationChange(location)}
                    />
                  }

                  {/* <label htmlFor={`Location-${location}`}>{location}</label> */}
                </div>
              ))}
          </div>
        </div>
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={convertedEvents}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            components={{
              event: (props) => (
                <CustomEvent
                  {...props}
                  onClick={handleEventClick}
                  style={{ zIndex: 0 }}
                />
              ),
            }}
            formats={{
              eventTimeRangeFormat: ({ start, end }) =>
                `${moment(start).format("LT")} - ${moment(end).format("LT")}`,
            }}
            toolbar={(toolbar) => (
              <div>
                <span style={{ fontSize: "1.5em", fontWeight: "Semi-Bold" }}>
                  {toolbar.label}
                </span>
              </div>
            )}
            style={{ zIndex: 0 }}
          />
          <EventModal
            show={modalVisible}
            onClose={closeModal}
            event={selectedEvent}
          />
          <SearchResultsModal
            results={searchResults}
            show={searchResults.length > 0}
            onClose={() => setSearchResults([])}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
