import React, { createContext, useContext, useReducer } from "react";

export const StateContext = createContext();
export const StateProvider = ({ children, initialState, reducer }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useStateValue = () => useContext(StateContext);

const AppContext = React.createContext();
export const { Provider } = AppContext;
export const { Consumer } = AppContext;
export default AppContext;
