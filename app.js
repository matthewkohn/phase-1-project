// DECLARE GLOBAL VARIABLES
// API docs: https://www.coingecko.com/en/api/documentation
const baseURLpre = 'https://api.coingecko.com/api/v3/coins/';
const baseURLpost = '/tickers?fields=market';
// const coinsListURL = 'https://api.coingecko.com/api/v3/coins/cardano/tickers/binance';
// Global target object & coin container
let targetObject;
const coinContainer = document.getElementById('coin-container');

// LOAD IMAGE FOR BLANK COIN CONTAINER
const imageURL = 'https://images.unsplash.com/photo-1515879128292-964efc3ebb25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80';
document.addEventListener('DOMContentLoaded', showImage);

function showImage() {
  const image = document.createElement('img');
  image.src= imageURL;
  image.style.width = "200px";
  image.style.maxHeight = "400px";
  image.style.borderRadius = "50%";
  image.style.opacity = "0.7";
  coinContainer.append(image);
}


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
  if (input.value === "default") {
    return showImage();
  }

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
  link.addEventListener("mouseover", activateLinkButton, false);
  link.addEventListener("mouseout", deactivateLinkButton, false);
  // ADD coin data to the coin container
  coinContainer.append( symbol, h2, h3, timestamp, link );
}


// Change styling of link button when cursor hovers over it
function activateLinkButton(e) {
  const elStyle = e.target.style;
  elStyle.backgroundColor = "#000";
  elStyle.color = "rgba(89, 179, 0.25)"
  elStyle.padding = "20px 60px";
  elStyle.letterSpacing = "2px";
  elStyle.transition = "background-color 1s ease-out, color 1s ease-out, padding 1s ease-in, letter-spacing 1s linear";
}

function deactivateLinkButton(e) {
  const elStyle = e.target.style;
  elStyle.backgroundColor = "rgb(89, 179, 0)";
  elStyle.color = "#fff"
  elStyle.padding = "20px 34px";
  elStyle.letterSpacing = "normal";
  elStyle.transition = "background-color 1s ease-out, color 1s ease-out, padding 1s ease-in, letter-spacing 1s linear";
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
// Adapted from source: https://stackoverflow.com/questions/40927938/extract-time-from-timestamp-in-js
function getTimeFromDate(timestamp) {
  // Format from JSON: "2021-10-20T00:04:26+00:00"
  const date = new Date(timestamp);
  return formatAMPM(date);
}

// Souce: https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}