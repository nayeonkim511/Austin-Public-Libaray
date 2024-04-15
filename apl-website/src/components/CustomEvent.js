import React, { useState, useContext, createContext } from "react";
import moment from "moment";
import "./CustomEvent.css";
import { usePanelContext } from "./PanelContext.js";
import { useEventContext } from "./EventContext.js";
// import EventSidebar from "./EventSidebar.js";
import parse from "html-react-parser";

const CustomEvent = ({ event, onClick }) => {
  const { panelVisible } = usePanelContext();
  const { setThisEvent } = useEventContext();
  return (
    <div>
    <div>
        <div
          className="hoverable"
          onMouseEnter={() => {
            setThisEvent(event);
          }}
          onMouseLeave={() => {
            if(!panelVisible) {
              setThisEvent(null);
            }
          }}
        >
          {/* {panelVisible && <EventSidebar event={event} />} */}
          <div onClick={() => onClick(event)}>
            <div className="container">
              <div className="colorbar"></div>
              <div className="colorlabel">
                <span style={{ fontWeight: "600", whiteSpace: "normal" }}>
                  {event.title}
                </span>
                <br />
                {moment(event.start).format("LT")} -{" "}
                {moment(event.end).format("LT")}
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
};

export default CustomEvent;
