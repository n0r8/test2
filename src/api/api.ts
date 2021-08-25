import axios from "axios";

export const getExchangeRates = ({from_currency, to_currency}: {from_currency: string, to_currency: string}): Promise<number | undefined> => {
  return axios.get('https://www.alphavantage.co/query', {
    params: {
      apikey: "ML6FMOCDJZG6596S",
      function: "CURRENCY_EXCHANGE_RATE",
      from_currency,
      to_currency
    }
  })
  .then((response) => {
    return response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
  })
  .catch((error) => {
    return undefined;
  }); 
}

export interface FXDailyItem {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
}
export interface FXDailyList {
  [key: string]: FXDailyItem; 
}

export const getFXDaily = ({from_currency, to_currency}: {from_currency: string, to_currency: string}): Promise<FXDailyList | undefined> => {
  return axios.get('https://www.alphavantage.co/query', {
    params: {
      apikey: "ML6FMOCDJZG6596S",
      function: "FX_DAILY",
      from_symbol: from_currency,
      to_symbol: to_currency,
    }
  })
  .then((response) => {
    return response.data["Time Series FX (Daily)"];
  })
  .catch((error) => {
    return undefined;
  }); 
}
