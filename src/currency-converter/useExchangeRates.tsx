import { useObservable, useObservableState } from "observable-hooks";

import { filter, from, Observable, switchMap } from "rxjs";
import { getExchangeRates } from "../api/api";
import { CURRENCIES } from "../api/currencies";

export interface useExchangeRateProps {
  currencyFrom: string;
  currencyTo: string;
}

export const checkIfCurrencyExists = (name: string) => {
  return !!CURRENCIES.find((currency) => currency["currency code"] === name);
};

export const useExchangeRate = ({
  currencyFrom,
  currencyTo,
}: useExchangeRateProps) => {
  const transform = (inputs: Observable<[string, string]>) =>
    inputs.pipe(
      // check if currencies names are here and correct
      filter(([curFrom, curTo]) => {
        return (
          !!curFrom &&
          !!curTo &&
          checkIfCurrencyExists(curFrom) &&
          checkIfCurrencyExists(curTo)
        );
      }),
      switchMap(([curFrom, curTo]) => {
        return from(
          getExchangeRates({
            from_currency: curFrom,
            to_currency: curTo,
          })
        );
      })
    );

  const output = useObservable(transform, [currencyFrom, currencyTo]);

  const exchangeRate = useObservableState(output);

  return { exchangeRate };
};
