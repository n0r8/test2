import constate from "constate";
import { useState } from "react";

const useAppState = () => {
  const [currencyFrom, setCurrencyFrom] = useState("EUR");
  const [currencyTo, setCurrencyTo] = useState("USD");

  return {
    currencyTo,
    currencyFrom,
    setCurrencyFrom,
    setCurrencyTo,
  };
};

export const [AppStateProvider, useAppStateContext] = constate(useAppState);
