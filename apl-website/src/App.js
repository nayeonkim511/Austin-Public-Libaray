import React, { useState } from "react";
import "./App.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Records from "./event_json_files/apl_events.json";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment); //globalize Localizer

function App() {

  var json = JSON.stringify(Records);
  return (
    <div className="App">
      <Calendar
        localizer={localizer}
        events={json.apl_event}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
}

export default App;
