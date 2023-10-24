import React, { useState } from "react";
import "./App.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Records from "./event_json_files/apl_events.json";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment); //globalize Localizer

function App() {

  var array = Records.apl_event;

  const convertedEvents = array.map((event) => ({
    id: event.nid,
    title: event.title,
    start: new Date(parseInt(event.field_slr_time_start) * 1000),
    end: new Date(parseInt(event.field_slr_time_end) * 1000),
    allDay: 0,
  }));

  console.log(convertedEvents);

  return (
    <div className="App">
      <Calendar
        localizer={localizer}
        events={convertedEvents}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}

export default App;
