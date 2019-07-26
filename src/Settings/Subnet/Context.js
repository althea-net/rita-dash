import React from "react";

export const store = {
  daoAddress: "",
  meshIp: ""
};

const Context = React.createContext();
export default Context;
export const { Consumer, Provider } = Context;
