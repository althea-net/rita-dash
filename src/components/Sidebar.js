import React from "react";

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
