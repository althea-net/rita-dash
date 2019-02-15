import React from "react";

export default ({ children }) => {
  return (
    <div id="content">
      {React.Children.map(children, (child, i) => {
        return child;
      })}
    </div>
  );
};
