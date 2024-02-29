import React from 'react';
import moment from 'moment';

const CustomEvent = ({ event, onClick }) => (
  <div onClick={() => onClick(event)}>
    <div className="container">
      <div className="colorbar"></div>
      <div className="colorlabel">
        <span style={{ fontWeight: "600", whiteSpace: "normal" }}>
          {event.title}
        </span>
        <br />
        {moment(event.start).format("LT")} - {moment(event.end).format("LT")}
      </div>
    </div>
  </div>
);

export default CustomEvent;