import React from "react";
import "./ColorCheckbox.css";

export default function ColorCheckbox({ id, checked, onChange }) {
  var colorScheme = {
    1900: "#ed0e0e",
    2478: "#f5b342",
    1993: "#882CC0",
    1925: "#128353",
    2557: "#D073C7",
    2069: "#2C56C0",
    "category-1900": "#ed0e0e",
    "category-2478": "#f5b342",
    "category-1993": "#882CC0",
    "category-1925": "#128353",
    "category-2557": "#D073C7",
    "category-2069": "#2C56C0",
    "category-4881": "#FF00FF",
    "category-1955": "#CD5C5C",
    "category-2119": "#FFC0CB",
    "category-2065": "#FFA500",
    "category-1908": "#5CB3FF",
    "category-1910": "#BDEDFF",
    "category-1920": "#50C878",
    "category-3148": "#FFFFC2",
    "category-1918": "#FBE7A1",
    "category-2077": "#F0E68C",
    "category-2072": "#FFFF00",
    "category-2073": "#FDD017",
    "age-all": "#ed0e0e",
    "age-adult": "#f5b342",
    "age-youth12": "#882CC0",
    "age-youth7": "#128353",
    "age-youth9": "#D073C7",
    "age-youth4": "#2C56C0",
    "age-youth5": "#FFA07A",
    "age-false": "#40E0D0",
    "age-youth10": "#6495ED",
    "age-youth6": "#FF7F50",
    "age-youth3": "#DE3163",
    "age-youth1": "#CCCCFF",
    "age-youth2": "#9FE2BF",
    "age-youth11": "#DFFF00",
    "all-events": "#ed0e0e",
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
