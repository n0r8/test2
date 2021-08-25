import { Line } from "@ant-design/charts";
import { Statistic } from "antd";
import Big from "big.js";
import { sortBy } from "lodash";
import { useObservable, useObservableState } from "observable-hooks";
import { filter, from, Observable, switchMap } from "rxjs";
import styled from "styled-components";
import tw from "twin.macro";
import { FXDailyList, getFXDaily } from "../api/api";
import { DP } from "../appConfig";
import { checkIfCurrencyExists } from "../currency-converter/useExchangeRates";
import { useAppStateContext } from "../useAppState";

export const formatFXDaily = (data?: FXDailyList) => {
  let formattedData: { date: string; value: number }[] = [];
  if (data) {
    for (var prop in data) {
      formattedData.push({
        date: prop,
        // daily value as average between low and high
        value: Number(
          new Big(data[prop]["2. high"])
            .plus(data[prop]["3. low"])
            .div(2)
            .toFixed(DP)
        ),
      });
    }
    formattedData = sortBy(formattedData, "date").slice(-30);
  }
  return formattedData;
};

export const getMinMax = (
  data: {
    date: string;
    value: number;
  }[]
) => {
  return data
    .map((p) => p.value)
    .reduce(
      (acc, v) => {
        if (acc.min === undefined || v < acc.min) {
          acc.min = v;
        }
        if (acc.max === undefined || v > acc.max) {
          acc.max = v;
        }

        return acc;
      },
      {
        min: undefined as number | undefined,
        max: undefined as number | undefined,
      }
    );
};

export const getLast24Growth = (data: {
  date: string;
  value: number;
}[]) => {
  const lastDay = data.slice(-1)[0]?.value;
  const preLastDay = data.slice(-2)[0]?.value;
  return lastDay && preLastDay ? (lastDay - preLastDay) / preLastDay * 100 : "";
}

export const CurrencyChart = () => {
  const { currencyFrom, currencyTo } = useAppStateContext();

  const transform = (inputs: Observable<[string, string]>) =>
    inputs.pipe(
      filter(([curFrom, curTo]) => {
        return (
          !!curFrom &&
          !!curTo &&
          checkIfCurrencyExists(curFrom) &&
          checkIfCurrencyExists(curTo)
        );
      }),
      switchMap(([curFrom, curTo]) => {
        return from(getFXDaily({ from_currency: curFrom, to_currency: curTo }));
      })
    );

  const output = useObservable(transform, [currencyFrom, currencyTo]);

  const data = useObservableState(output);

  const formatted = formatFXDaily(data);

  const minMax = getMinMax(formatted);

  const growth = getLast24Growth(formatted);

  const config = {
    data: formatted,
    xField: "date",
    yField: "value",
    xAxis: {
      tickCount: 5,
    },
    yAxis: {
      min: minMax.min,
      max: minMax.max,
      grid: {
        line: {
          style: {
            stroke: "black",
            strokeOpacity: 0.03,
          },
        },
      },
    },
    smooth: true,
  };
  return (
    <Wrap>
      <Heading>
        <Title>
          {currencyTo} {formatted.slice(-1)[0]?.value}
        </Title>
        <Stats>
          <Statistic
            value={growth}
            precision={2}
            valueStyle={{ color: growth > 0 ? "#3f8600" : "#cf1322" }}
            suffix="%"
          />
          <Period>(24h)</Period>
        </Stats>
      </Heading>
      <Line {...config} />
    </Wrap>
  );
};

const Title = styled.div`
  ${tw`fontSize[36px] text-black`}
`;

const Stats = styled.div`
  ${tw`flex items-center text-base`}
`;

const Heading = styled.div`
  ${tw`pb-4`}
`;

const Wrap = styled.div`
  ${tw`p-4 lg:(flex-grow border border-solid border-gray-200 ml-8)`}
`;

const Period = styled.div`
  ${tw`text-gray-200 text-sm pl-2`}
`;
