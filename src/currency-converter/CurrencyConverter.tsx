import { AutoComplete } from "antd";
import { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { CURRENCIES } from "../api/currencies";
import { useExchangeRate } from "./useExchangeRates";
import { Big } from "big.js";
import { useAppStateContext } from "../useAppState";
import { DP } from "../appConfig";

const currenciesList = CURRENCIES.map((cur) => ({
  value: cur["currency code"],
}));

export const convertFrom = (from?: string, rate?: number) => {
  return rate && from ? new Big(rate).times(from).toFixed(DP) : "";
};

export const convertTo = (to?: string, rate?: number) => {
  return rate && to ? new Big(to).div(rate).toFixed(DP) : "";
};

export const CurrencyConverter = () => {
  const { currencyFrom, setCurrencyFrom, currencyTo, setCurrencyTo } =
    useAppStateContext();
  const [currencyFromValue, setCurrencyFromValue] = useState("");
  const [currencyToValue, setCurrencyToValue] = useState("");

  const { exchangeRate } = useExchangeRate({ currencyFrom, currencyTo });

  return (
    <div data-testid="currency-converter">
      <Wrap>
        <Row>
          <AutoComplete
            value={currencyFrom}
            options={currenciesList}
            onChange={(data) => {
              setCurrencyFrom(data);
            }}
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
          <Input
            type="number"
            placeholder="0"
            min="0"
            data-testid="currency-from-value"
            value={currencyFromValue}
            onChange={(e) => {
              setCurrencyFromValue(e.target.value);
              setCurrencyToValue(convertFrom(e.target.value, exchangeRate));
            }}
          />
        </Row>
        <Rate>
          1 {currencyFrom} = {currencyTo} {exchangeRate}
        </Rate>
        <Row>
          <AutoComplete
            value={currencyTo}
            options={currenciesList}
            onChange={(data) => {
              setCurrencyTo(data);
            }}
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
          <Input
            type="number"
            placeholder="0"
            min="0"
            data-testid="currency-to-value"
            value={currencyToValue}
            onChange={(e) => {
              setCurrencyToValue(e.target.value);
              setCurrencyFromValue(convertTo(e.target.value, exchangeRate));
            }}
          />
        </Row>
      </Wrap>
    </div>
  );
};

const Input = styled.input`
  ${tw`width[50%] border-0 height[62px] text-lg bg-transparent outline-none`}
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const Wrap = styled.div`
  ${tw`border border-solid border-gray-200 lg:(width[400px]) p-4 w-full`}
`;

const Row = styled.div`
  ${tw`flex justify-between border rounded-sm  height[62px] relative`}

  & > .ant-select {
    ${tw`width[40%]`}
  }

  .ant-select .ant-select-selector {
    ${tw`height[62px] border-0 bg-transparent`}
  }
  .ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector
    .ant-select-selection-search-input {
    ${tw`height[62px] text-lg`}
  }
  .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
    .ant-select-selector {
    ${tw`shadow-none`}
    border: 0!important;
  }
  .ant-select-single:not(.ant-select-customize-input)
    .ant-select-selector::after {
    ${tw`hidden`}
  }
  .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
    ${tw`border-none`}
  }

  &:after {
    content: "";
    ${tw`absolute left[40%] top[10px] bottom[10px] width[1px] bg-gray-200`}
  }
`;

const Rate = styled.div`
  ${tw`py-4 font-semibold text-gray-300`}
`;
