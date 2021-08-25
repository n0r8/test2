import tw from "twin.macro";
import styled from "styled-components";
import { CurrencyConverter } from "./currency-converter/CurrencyConverter";
import { AppStateProvider } from "./useAppState";
import { CurrencyChart } from "./currency-chart/CurrencyChart";

const App = () => {
  return (
    <AppWrap>
      <AppStateProvider>
        <CurrencyConverter />
        <CurrencyChart />
      </AppStateProvider>
    </AppWrap>
  );
};

export default App;

const AppWrap = styled.div`
  ${tw`lg:flex p-4 bg-white lg:max-width[1200px] margin[0 auto]`}
`;
