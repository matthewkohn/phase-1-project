// API docs: https://www.coingecko.com/en/api/documentation

/*---------------- LOADING PAGE ------------------*/
// Global Coin Container variable used in load, fetch, and to append elements created using API data
const coinContainer = document.getElementById('coin-container');

// Display the dropdown and default images when DOM Content Loads
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Fetch data from CoinGecko API, passing data to load Dropdown & populate DOM with selected option data
  fetchCoinList();
  // Creates Dropdown & default page features
  loadStartImages();
}

/*----------------- FETCH DATA ---------------------*/
// Fetch to Coingecko, requesting real-time data on top 100 cryptocurrencies
function fetchCoinList() {
  const apiURL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_rank&per_page100&page=1&sparkline=false';
  fetch(apiURL)
    .then(response => response.json())
    .then(topCryptoData => createDropdown(topCryptoData))
    .catch(error => {
      console.log(error);
      displayErrorMessage();
    });
}

function displayErrorMessage() {
  const section = document.getElementById('dropdown-container');
  const h2 = document.createElement('h2');
  h2.id = 'dom-error';
  h2.textContent = "Sorry, the system isn't working right now. Please try again later.";
  section.append(h2);
}
  
/*---------------- LOAD START IMAGES ---------------*/
function loadStartImages() {
  const stockImageURL = 'https://images.unsplash.com/photo-1515879128292-964efc3ebb25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80';
  const coingeckoImgURL = 'https://static.coingecko.com/s/coingecko-branding-guide-4f5245361f7a47478fa54c2c57808a9e05d31ac7ca498ab189a3827d6000e22b.png';
  const coingeckoLink = document.getElementById('coingecko-link');
  // Loads a stock image inside the Coin Container until a coin is chosen from the dropdown.
  loadImage(stockImageURL, 'placeholder-image', 'Green bottle on the edge of a sandy beach.', coinContainer);
  // Loads Coingecko logo at the footer inside a link element
  loadImage(coingeckoImgURL, 'logo', 'Coingecko logo.', coingeckoLink);
}

function loadImage(url, assignID, alt, appendTarget) {
  const image = document.createElement('img');
  Object.assign(image, {
    id: assignID,
    src: url,
    alt: alt,
  });
  appendTarget.append(image);
}

/*----------- DROPDOWN CREATION & FUNCTIONALITY -------------*/

function createDropdown(data) {
  const dropdownTarget = document.getElementById('dropdown-target');
  const dropdown = document.createElement('select');
  dropdown.id = 'coins-dropdown';
  // Function that appends a disabled default option to the top of the dropdown that's being created
  createDefaultOptionEl(dropdown);
  // Creates the dropdown options and appends to the dropdown that's being created
  createTopOptions(dropdown, data);
  dropdownTarget.append(dropdown);
  dropdown.addEventListener('change', e => handleDropdownSelection(e, data));
}

// Creates Default Option element
function createDefaultOptionEl(dropdownEl) {
  const defaultOption = document.createElement('option');
  Object.assign(defaultOption, {
    id: 'default-label',
    textContent: 'CHOOSE A RANKED COIN',
    value: 'default',
    selected: 'true',
    disabled: 'disabled',
  });
  return dropdownEl.appendChild(defaultOption);
}

// Creates Crypto Coin Options and attaches to Dropdown El
function createTopOptions(dropdownEl, apiData) {
  // Iterate through fetchData, creating an option element out of each object
  apiData.map(data => {
    // console.log(data);
    const marketRank = data.market_cap_rank;
    const name = data.name;
    const option = document.createElement('option');
    // Using Object.assign() here took elements out of order
    option.value = data.id;
    option.className = 'option-item';
    option.textContent = `${marketRank}) ${name}`;
    dropdownEl.appendChild(option);
  });
}



/*-------------- DROPDOWN EVENT LISTENER ---------------*/
function handleDropdownSelection(event, apiData) {
  // Prevent default & capture target value
  event.preventDefault();  
  const targetValue = event.target.value;
  // Clear the DOM for each selection
  removeAllChildNodes(coinContainer);
  // Display the selected cryptocurrency's data in the DOM
  displayData(apiData, targetValue);
  // console.log(apiData);
}

// Function to clear the Coin Container in the DOM:
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function displayData(apiData, selectedValue) {
  // Find the selectedValue inside apiData
  const selectedCoinObj = apiData.find(coin => coin.id === selectedValue);


  // loadImage(url, assignID, alt, appendTarget) from line 49
  loadImage(
    selectedCoinObj.image,
    'coin-image', 
    `${selectedCoinObj.name} logo`, 
    coinContainer);

  const name = createCoinEl('h2', 'coin-name', selectedCoinObj, 'name');
  console.log(name);
  

  console.log(apiData);
  console.log(selectedValue);
  console.log(selectedCoinObj);
}

//   // NAME OF COIN
//   const coinName = obj.coin_id;
//   const h2 = document.createElement('h2');
//   h3.id = 'coin-name';
//   h3.innerText = coinName;

function createCoinEl(tagName, id, coinObj, apiValue) {
  const element = document.createElement(tagName);
  Object.assign(element, {
    id: id,
    textContent: `${coinObj[apiValue]}`,
  })
  return element;
}


/*  symbol  ''
        span, uppercase
      name    ''
        h3, uppercase
      current_price  $
        h2, format price
        
      high_24h  $
        span, format price
      low_24h  $
        span, format price
      price_change_24h  $
        span, format price
      price_change_percentage_24h  %
        span, format percentage
      market_cap_rank   #
        span, format large number
      market_cap  $
        span, format price
      circulating_supply  #
        span, format large number
      total_volume  #
        span, format large number
      
      last_updated  (date)
        span, format date
 */

// Formats how prices are displayed
function formatPrice(coin) {
  let price = coin.current_price;
  const h2 = document.createElement('h2');
  h2.id = 'price';
  // Prices over a dollar are shown with 2 numbers after the decimal. 
  // Otherwise show all numbers after the decimal
  if (price > 1) {
    price = coin.last.toFixed(2);
  }
  // Make large dollar amounts easier to read
  if (price >= 1000) {
    formatLargeNumber(price);
  }
  h2.textContent = `$${price}`; 
}

// Adds commas and rounds to the nearest integer for large numbers
function formatLargeNumber(number) {
  if (number >= 1000) {

  }
}

function formatDate(coin) {

}

function formatPercentage(coin) {

}

/*----------------------------- DROPDOWN API FUNCTIONALITY -------------------------*/

  
  // Update the coin container, displaying selected coin data
  //   function displayData(obj) {
//     // COIN SYMBOL
//     const symbol = document.createElement('span');
//     symbol.id = 'symbol';
//     symbol.innerText = obj.base;

//     // PRICE
//     let price = obj.current_price;
//     const h2 = document.createElement('h2');
//     h2.id = 'price';
//     // Prices over a dollar are shown with 2 numbers after the decimal. 
//     // Otherwise show all numbers after the decimal
//     if (price > 1) {
  //     price = obj.last.toFixed(2);
  //   }
//     h2.innerText = `$${price}`; 

//   // NAME OF COIN
//   const coinName = obj.coin_id;
//   const h2 = document.createElement('h2');
//   h3.id = 'coin-name';
//   h3.innerText = coinName;
//   // TIMESTAMP
//   const time = getTimeFromDate(obj.timestamp);
//   const timestamp = document.createElement('span');
//   timestamp.id = 'time';
//   timestamp.innerText = `Price last updated at ${time}`
//   // LINK to CoinGecko for this coin
//   const coinURL = `https://www.coingecko.com/en/coins/${obj.coin_id}`
//   const link = document.createElement('a');
//   link.id = 'trade-link';
//   link.href = coinURL;
//   link.innerText = `Find out more about ${coinName} here!`
//   link.target = "_blank"
//   link.addEventListener("mouseover", activateLinkButton, false);
//   link.addEventListener("mouseout", deactivateLinkButton, false);
//   // ADD coin data to the coin container
//   coinContainer.append( symbol, h2, h3, timestamp, link );
// }















/*------------------------- Re-usable Functions -----------------------*/

// Convert timestamp to readable time for DOM
// Adapted from source: https://stackoverflow.com/questions/40927938/extract-time-from-timestamp-in-js

// Souce: https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
function formatAMPM(timestamp) {
  // Format from JSON: "2021-10-20T00:04:26+00:00"
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
console.log(formatAMPM("2021-10-20T00:04:26+00:00"))