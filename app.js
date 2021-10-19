// API docs: https://www.coingecko.com/en/api/documentation
const baseURLpre = 'https://api.coingecko.com/api/v3/coins/';
const baseURLpost = '/tickers?fields=market';
const coinsListURL = 'https://api.coingecko.com/api/v3/coins/cardano/tickers/binance';
let tickerContainer = [];



const searchForm = document.getElementById("search-form");
const input = document.getElementById("search-input");

searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  fetch(baseURLpre + input.value + baseURLpost)
    .then(response => response.json())
    .then(targetAPIData)
}

function targetAPIData(data) {
  // Push the json object to tickerContainer
  tickerContainer.push(data);
  // Narrow down to the data we want to use
  tickerContainer.find(ticker => {
    let obj = ticker.tickers;
    let targetObj = obj.filter(e => e.market.name === "Binance");
    console.log(targetObj[0]);
  })
}





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