import React, { useState } from "react";
import Button from "@mui/material/Button";
import "./EventSidebar.css";
import parse from "html-react-parser";

var monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEPT",
  "OCT",
  "NOV",
  "DEC",
];
var daysOfWeek = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];

const EventSidebar = ({event}) => {
  const parsed = parse(event.desc);
  return (
    <div className="hover-sidebar">
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.2em", fontWeight: "300" }}>
          {monthNames[event?.start.getMonth()]}
        </div>
        <div style={{ fontSize: "2.0em", fontWeight: "800" }}>
          {event?.start.getDate()}
        </div>
        <div style={{ fontSize: "1.2em", fontWeight: "300" }}>
          {daysOfWeek[event?.start.getDay()]}
        </div>
        <div style={{ fontSize: "0.8em", fontWeight: "300" }}>
          {event?.start.getFullYear()}
        </div>
      </div>
      <h2>Description: </h2>
      {parsed}
    </div>
  );
};

export default EventSidebar;
