import React from "react";

const UsageContext = React.createContext();
export const { Provider } = UsageContext;
export const { Consumer } = UsageContext;
export default UsageContext;
