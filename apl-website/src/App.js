import React, { useState } from "react";
import "./App.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Records from "./event_json_files/apl_events.json";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./Header";

const localizer = momentLocalizer(moment); //globalize Localizer

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

  var array = Records.apl_event;

  const convertedEvents = array.map((event) => ({
    id: event.nid,
    title: event.title,
    start: new Date(parseInt(event.field_slr_time_start) * 1000),
    end: new Date(parseInt(event.field_slr_time_end) * 1000),
    allDay: true,
  }));

  console.log(convertedEvents);

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#E8E8E8', 
      borderRadius: '5px',
      opacity: 1,
      color: 'black', // Set text color 
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
      <Calendar
        localizer={localizer}
        events={convertedEvents}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        views={['week', 'month']} // Display week views
        components={{
          event: CustomEvent,
        }}
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
