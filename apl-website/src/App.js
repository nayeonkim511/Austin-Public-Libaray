import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Records from "./event_json_files/apl_events.json";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@fontsource/inter";
import ColorCheckbox from "./components/ColorCheckbox.js";
import { gapi } from 'gapi-script'

const localizer = momentLocalizer(moment);

// const clientId = process.env.CLIENT_ID;
// const apiKey = process.env.API_KEY;

const CustomEvent = ({ event, onClick }) => (
  <div onClick={() => onClick(event)}>
    <div className="container">
      <div className="colorbar"></div>
      <div className = "colorlabel">
        <span style={{ fontWeight: "600", whiteSpace: "normal" }}>
          {event.title}
        </span>
        <br />
        {moment(event.start).format("LT")} - {moment(event.end).format("LT")}
      </div>
    </div>
  </div>
);

const SearchResultsModal = ({ results, show, onClose }) => {
  if (!show) return null;
  return (
    <div className="search-results-modal">
      <div className="search-results-content">
        <button onClick={onClose}>Close</button>
        {results.map((event) => (
          <div key={event.id} className="search-result-item">
            {event.title}
            {/* Add other event details as required */}
          </div>
        ))}
      </div>
    </div>
  );
};

const EventModal = ({ show, onClose, event }) => {
  const [googleUser, setGoogleUser] = useState(null);
  
  useEffect(() => {
    // window.onGoogleLibraryLoad = () => {
    //   window.google.accounts.id.initialize({
    //     client_id: "765004802194-fcjsvjjvtpdesed8n6f1ckrmc0julofj.apps.googleusercontent.com",
    //     callback: (response) => {
    //       console.log("Google Identity Services response: ", response.credential);
    //       loadGoogleCalendarApi();
    //     },
    //   });
    //   window.google.accounts.id.renderButton(
    //     document.getElementById("signInDiv"),
    //     { theme: "outline", size: "large" }
    //   );
    // };
  }, []);

  // const loadGoogleCalendarApi = () => {
  //   gapi.load('client', () => {
  //     gapi.client.init({
  //       apiKey: "AIzaSyBPOlC2HGjUf9DyISHD25aDr9gNuNRUkZA",
  //       clientId: "765004802194-fcjsvjjvtpdesed8n6f1ckrmc0julofj.apps.googleusercontent.com",
  //       discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
  //       scope: "https://www.googleapis.com/auth/calendar",
  //       plugin: "austin-public-library"
  //     }).then(() => {
  //       // The API is initialized and the user is signed in.
  //       console.log("Correctly initialized with proper scope");
  //       setGoogleUser(gapi.auth2.getAuthInstance().currentUser.get());
  //     }, (error) => {
  //       console.error("Error loading GAPI client for API", error);
  //     });
  //   });
  // };

  // const handleAddToCalendarClick = async () => {
  //   if (!googleUser) {
  //     window.google.accounts.id.prompt((notification) => {
  //       if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
  //         console.log("Sign-in prompt was not displayed or was skipped.");
  //       } else if (notification.isDismissedMoment()) {
  //         console.log("User dismissed the sign-in prompt.");
  //       }
  //     });
  //   } else {
  //     // User is signed in; proceed with adding the event to Google Calendar
  //     addEventToCalendar();
  //   }
  // };

  const addEventToCalendar = () => {
    if (!googleUser) {
      console.log("User is not signed in.");
      return;
    }

    const eventToAdd = {
      'summary': event.title,
      'location': event.location,
      'description': event.description,
      'start': {
        'dateTime': event.start,
        'timeZone': 'America/Los_Angeles',
      },
      'end': {
        'dateTime': event.end,
        'timeZone': 'America/Los_Angeles',
      },
    };

    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': eventToAdd,
    });

    request.execute((event) => {
      console.log('Event created: ', event.htmlLink);
      onClose(); // Close the modal
    });
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* Modal Content */}
        <h2>{event?.title}</h2>
        <p>{event?.description}</p>
        <div id="signInDiv"></div> {/* Google Sign-in button */}
        <button onClick={handleAddToCalendarClick}>Add to Calendar</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

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
  }

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
  }, [events, showAllEvents, selectedAges, selectedCategories, selectedLocations]);

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
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="all-events"
                  checked={showAllEvents}
                  onChange={handleAllEventsChange}
                />
                <label htmlFor="all-events"> Show All</label>
              </div>
            )}
          </div>
          <div className="filter-dropdown">
            <button onClick={() => setAgeOpen(!ageOpen)}>Filter by Age</button>
            {ageOpen &&
              uniqueAges.map((age) => (
                <div key={age} className="checkbox">
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
          <div className="filter-dropdown">
            <button onClick={() => setCategoryOpen(!categoryOpen)}>
              Filter by Category
            </button>
            {categoryOpen &&
              uniqueCategories.map((category) => (
                <div key={category} className="checkbox">
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
                <CustomEvent {...props} onClick={handleEventClick} />
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
