### How much time did you end up spending on it?
  6-8 hours 
### What are some of the design decisions you made?
  - responsive, easy to understand what to what converted, simple chart with last 24 course change indicator. 
### What do you like about your implementation?
  - I made it easy for user to understand what will be converted to what. With help of preview exchange rate e.g. 1 EUR = USD 1.17364000.  Also ability to change amount for target currency. 
### What would you improve next time?
  - use currencies symbols if possible to make it more clear in the UI.
  - highlight search results
	- polling for lates exchange rates and chart data, so user will see correct latest data. With that free API limitations( 5 calls per minute) I think it might be hard.
	- API for chart contains high, low, close, open values which are not needed for simple chart (I made chart with average between high and low values). And so the exchange rate doesn’t match with last value on chart. I would fix this.
	- I would add loading and error states for the interface (API error response).
	- for the chart ability to use other time ranges e.g. 7 days, 1 year…
	- save to cookies for what user already selected and use it for the next time as preselected values.
	- Use a currency name and not only a symbol for the search.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

