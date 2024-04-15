import React, { useState, useContext, createContext } from "react";
import Button from "@mui/material/Button";
import "./EventSidebar.css";
import { useEventContext } from "./EventContext.js";
import parse from "html-react-parser";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";
import { PanelContext, usePanelContext } from "./PanelContext.js";
import { useModalContext } from "./ModalContext.js";

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
const EventSidebar = () => {
  const { thisEvent, setThisEvent } = useEventContext();
  const { setPanelVisible } =
  usePanelContext();
  const { setIsClicked, setModalEvent } = useModalContext();
  if(thisEvent != null) {
  const temp = thisEvent;
  const parsed = parse(thisEvent.desc);
    return (
      <div>
          <div
            className="hover-sidebar"
            onMouseEnter={() => {
              setPanelVisible(true);
            }}
            onMouseLeave={() => {
              setPanelVisible(false);
              setThisEvent(null);
            }}
            onClick = {() => {
              setIsClicked(true);
              setModalEvent(temp);
            }}
          >
            <div className="date" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.2em", fontWeight: "300" }}>
                {monthNames[thisEvent?.start.getMonth()]}
              </div>
              <div style={{ fontSize: "2.0em", fontWeight: "800" }}>
                {thisEvent?.start.getDate()}
              </div>
              <div style={{ fontSize: "1.2em", fontWeight: "300" }}>
                {daysOfWeek[thisEvent?.start.getDay()]}
              </div>
              <div style={{ fontSize: "0.8em", fontWeight: "300" }}>
                {thisEvent?.start.getFullYear()}
              </div>
            </div>
            <div className="modal-title-container">
              <div className="modal-title">{thisEvent?.title}</div>
              <div style={{ fontSize: "0.8em", fontWeight: "300" }}>
                {" "}
                {thisEvent?.start.getHours()}:00 - {thisEvent?.end.getHours()}
                :00
              </div>
            </div>
            <div className="button1">
              <Button
                style={{ backgroundColor: "#D9D9D9", color: "#000000" }}
                variant="contained"
                startIcon={<DriveFileRenameOutlineIcon />}
              >
                RSVP
              </Button>
            </div>
            <div className="button2">
              <Button
                style={{ backgroundColor: "#D9D9D9", color: "#000000" }}
                variant="contained"
                startIcon={<NotificationAddIcon />}
              >
                Get Notified
              </Button>
            </div>
            <div className="description-container">
              <h4>Description: </h4>
              {parsed}
            </div>
          </div>
      </div>
    );
}
};

export default EventSidebar;
