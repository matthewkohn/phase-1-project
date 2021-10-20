// DECLARE VARIABLES
// API docs: https://www.coingecko.com/en/api/documentation
const baseURLpre = 'https://api.coingecko.com/api/v3/coins/';
const baseURLpost = '/tickers?fields=market';
const coinsListURL = 'https://api.coingecko.com/api/v3/coins/cardano/tickers/binance';
// Global target object & coin container
let targetObject;
const coinContainer = document.getElementById('coin-container');

// Fetch data from selected item in dropdown
const selectedCoinList = document.getElementById('coins-dropdown');
selectedCoinList.addEventListener('change', handleSelection);

function handleSelection(event) {
  event.preventDefault();  
  // Clear the DOM for each selection
  removeAllChildNodes(coinContainer);

  // Capture the input chosen in the dropdown
  const input = selectedCoinList.options[selectedCoinList.selectedIndex];
  // Fetch data from CoinGecko
  fetch(baseURLpre + input.value + baseURLpost)
    .then(response => response.json())
    .then(data => targetAPIData(data))
    .catch(error => console.log(error))
}

  // Handle target data and store in targetObject
function targetAPIData(data) {
  // Push the json object to tickerContainer
  let tickerContainer = [];
  tickerContainer.push(data);
  let targetObj;
  // Narrow down to the data we want to use for USD from Binance
  tickerContainer.find(ticker => {
    let obj = ticker.tickers;
    targetObj = obj.filter(e => e.market.name === "Binance");
  });
  targetObject = JSON.parse(JSON.stringify(targetObj[0]));
  console.log(targetObject);
  // Callback function that handles displaying data in the DOM
  displayData(targetObject);
}

// Update the coin container, displaying selected coin data
function displayData(obj) {
  // COIN SYMBOL
  const symbol = document.createElement('span');
  symbol.id = 'symbol';
  symbol.innerText = obj.base;
  // PRICE
  let price = obj.last;
  const h2 = document.createElement('h2');
  h2.id = 'price';
  // Prices over a dollar are shown with 2 numbers after the decimal. 
  // Otherwise show all numbers after the decimal
  if (price > parseInt(1)) {
    price = obj.last.toFixed(2);
  }
  h2.innerText = `$${price}`;
  // NAME OF COIN
  const coinName = capitalizeFirstLetter(obj.coin_id);
  const h3 = document.createElement('h3');
  h3.id = 'coin-name';
  h3.innerText = coinName;
  // TIMESTAMP
  const time = getTimeFromDate(obj.timestamp);
  const timestamp = document.createElement('span');
  timestamp.id = 'time';
  timestamp.innerText = `Price last updated at ${time}`
  // LINK to CoinGecko for this coin
  const coinURL = `https://www.coingecko.com/en/coins/${obj.coin_id}`
  const link = document.createElement('a');
  link.id = 'trade-link';
  link.href = coinURL;
  link.innerText = `Find out more about ${coinName} here!`
  link.target = "_blank"
  // ADD coin data to the coin container
  coinContainer.append( symbol, h2, h3, timestamp, link );
}

// Function to clear the Coin Container in the DOM:
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

// Capitalize name of coin function
// Source: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Convert timestamp to readable time for DOM
// Modified from source: https://stackoverflow.com/questions/40927938/extract-time-from-timestamp-in-js
function getTimeFromDate(timestamp) {
  const pad = num => ("0" + num).slice(-2);
  // Format from JSON: "2021-10-20T00:04:26+00:00"
  const date = new Date(timestamp);
  // figure out AM or PM
  let hours, amOrPm;
  if (date.getHours() >= 12) {
    amOrPm = 'pm';
    hours = date.getHours() % 12;
  } else {
    amOrPm = 'am';
    hours = date.getHours();
  }
  const minutes = date.getMinutes();
  return `${hours}:${pad(minutes)} ${amOrPm}`
}
