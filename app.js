// API docs: https://www.coingecko.com/en/api/documentation
const baseURLpre = 'https://api.coingecko.com/api/v3/coins/';
const baseURLpost = '/tickers?fields=market';
const coinsListURL = 'https://api.coingecko.com/api/v3/coins/cardano/tickers/binance';
let tickerContainer = [];
let targetObject;


const searchForm = document.getElementById('search-form');
const input = document.getElementById('search-input');
const coinContainer = document.getElementById('coin-container');

searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  fetch(baseURLpre + input.value + baseURLpost)
    .then(response => response.json())
    .then(data => {
      targetAPIData(data);
      searchForm.reset();
    })
}

// Handle target data and store in targetObject
function targetAPIData(data) {
  // Push the json object to tickerContainer
  tickerContainer.push(data);
  let targetObj;
  // Narrow down to the data we want to use
  tickerContainer.find(ticker => {
    let obj = ticker.tickers;
    targetObj = obj.filter(e => e.market.name === "Binance");
  });
  targetObject = JSON.parse(JSON.stringify(targetObj[0]));
  displayData(targetObject);
}

// Make it appear on the screen
function displayData(obj) {
  // Create HTML elements
  // Price
  const h2 = document.createElement('h2');
  h2.id = 'last-price';
  h2.innerText = obj.last;

  // Name of coin
  const h3 = document.createElement('h3');
  h3.id = 'coin-name';
  h3.innerText = obj.coin_id;
  
  // Link to Binance for this coin
  const coinName = capitalizeFirstLetter(obj.coin_id);
  const link = document.createElement('a');
  link.id = 'trade-link';
  link.href = obj.trade_url;
  link.innerText = `Buy or sell ${coinName}!`
  
  // Coin symbol
  const symbol = document.createElement('span');
  symbol.id = 'symbol';
  symbol.innerText = obj.base;
  
  coinContainer.append( symbol, h2, h3, link );
  // console.log(h2, h3, link, symbol);
  
}

// Borrowed helper function from https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/* 
  targetObject.last

*/





// const options = {
//   method: 'GET',
//   mode: 'no-cors',
//   headers: {
//     'Content-Type': 'application/json'
//   },
// }
// function getCrypto() {
//   fetch(API_URL, options)
//     .then(response => console.log(response.json()))
//     .then(result => console.log(result));
// }

// document.addEventListener('DOMContentLoaded', getCrypto);