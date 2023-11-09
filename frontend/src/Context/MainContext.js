import React, { useState } from "react";
import { GetCurrSem } from "../Components/Common/GetCurrSem";

export const MainContext = React.createContext();

export const MainProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [actions, setActions] = useState([]);

  const currDate = new Date().getDate();
  const currMonth = new Date().getMonth();
  const currYear = new Date().getFullYear();
  const [sem, setSem] = useState(GetCurrSem(currDate, currMonth));
  const [year, setYear] = useState(currYear);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        actions,
        currDate,
        currYear,
        currMonth,
        year,
        sem,
        setIsLoggedIn,
        setActions,
        setSem,
        setYear,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
