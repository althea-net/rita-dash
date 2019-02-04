import React from "react";
import "../styles/sidebar.css";

export default ({ children }) => {
  return (
    <div className="wrapper">
      <div id="content">
        {React.Children.map(children, (child, i) => {
          return child;
        })}
      </div>
    </div>
  );
};
