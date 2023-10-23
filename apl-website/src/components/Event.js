import React, { Component } from "react";
import Records from "./event_json_files/apl_events.json";

export default class event extends Component {
  render() {
    return (
      <div className="eachevent">
        {Records &
          Records.map((record) => {
            return (
              <div className="box" key={record.nid}>
                
              </div>
            );
          })}
      </div>
    );
  }
}
