# CRYPTO GENIE APP

## Description
Crypto Genie is a single-page application that pulls up-to-date crypto data for the current top-100 cryptocurrencies from the [CoinGecko API]('https://www.coingecko.com/en/api/documentation') and displays that data in the DOM.

Visit the [Crypto Genie Demo](https://matthewkohn.github.io/phase-1-project/) to try it out yourself! 

This app was created as a final project for Flatiron Schools Software Engineering course, Phase-1.

## Usage
1. When the DOM loads, a dropdown menu containing the current top-100 cryptocurrencies is loaded.
2. When a cryptocurrency name in the dropdown is selected, that coin's most recent price information is displayed in the DOM.
3. Selecting the "Learn More About..." button below the price info display will toggle an info screen for that cryptocurrency, so you can read more about it.
  a. If no information is provided by the CoinGecko API for the selected coin, a link for that coin is displayed that will take you to an outside page for that coin.
4. When another cryptocurrency is selected, the page updates to display the selected coin's price information.
5. If an error occurs, an error message loads in the DOM letting the user know to try again later.

## Visuals
![CryptoGenie Demo Gif](media/cryptoGenieDemo.gif)

## Roadmap
Further additions to this project might include:
- Store user input for coins they own and use the price data from the API to display the users assets for each coin saved
- Create predictive text to search by name instead of searching the dropdown
- Create a reset button
- Expand on the data displayed, including sparkline charts and price history
- Find and create links to recent news sources

## Contributing
I am not accepting contributions at this time, as this is a project for school I am submitting.

## License
[MIT]('https://choosealicense.com/licenses/mit/')
