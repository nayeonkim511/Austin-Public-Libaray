import React  from "react";
import "./ColorCheckbox.css";

export default function ColorCheckbox({id}, checked, onChange) {
    var colorScheme = {
      "1900": "#ed0e0e",
      "2478": "#f5b342",
      "1993": "",
    };
    return (
      <div
        className="box"
        style={{
          background: `linear-gradient(to right, ${colorScheme[id]} 5%, 
            ${colorScheme[id]} 5%,${colorScheme[id]} 5%, white 5%, white 100%)`,
        }}
      >
        <input
          class="check"
          type="checkbox"
          id="locations"
          checked={checked}
          onChange={onChange}
        />
        <label for="locations">{id}</label>
      </div>
    );
}