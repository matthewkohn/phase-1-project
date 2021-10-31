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
  const h2 = document.createElement('h2');
  const section = document.getElementById('dropdown-container');
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
  image.src = url;
  image.id = assignID;
  image.alt = alt;
  appendTarget.append(image);
  return image;
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
    value: 'default',
    textContent: 'CHOOSE A RANKED COIN',
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

  console.log(apiData);
  console.log(selectedValue);
  console.log(selectedCoinObj);
}

/*----------------------------- DROPDOWN API FUNCTIONALITY -------------------------*/

// Event listener assigned on DOMContentLoaded after Dropdown is created
// function dropdownEvent() {
//   const dropdownMenu = document.getElementById('coins-dropdown');
//   dropdownMenu.addEventListener('change', handleDropdownSelection);
// }

// displaySelectedData


// // Handle target data and store in targetObject
// function targetAPIData(data) {
  //   // Push the json object to tickerContainer
//   let tickerContainer = [];
//   tickerContainer.push(data);

//   // Narrow down to the data we want to use for USD from Binance
//   tickerContainer.find(ticker => {
  //     let targetObject = ticker.tickers[0];
  //     displayData(targetObject);
  //   });
  // }
  
  
  // Update the coin container, displaying selected coin data
  //   function displayData(obj) {
    //     // COIN SYMBOL
    //     const symbol = document.createElement('span');
    //     symbol.id = 'symbol';
    //     symbol.innerText = obj.base;
    //     // PRICE
    //     let price = obj.last;
    //     const h2 = document.createElement('h2');
//     h2.id = 'price';
//     // Prices over a dollar are shown with 2 numbers after the decimal. 
//     // Otherwise show all numbers after the decimal
//     if (price > 1) {
  //     price = obj.last.toFixed(2);
  //   }
//   h2.innerText = `$${price}`; 
//   // NAME OF COIN
//   const coinName = capitalizeFirstLetter(obj.coin_id);
//   const h3 = document.createElement('h3');
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




// Fetch promises to GET data in JSON form once its promise to get a response from the API is successful
// function fetchTargetData(target) {
//   // Dynamic URL based on the Value selected in the Dropdown.
//   const apiURL = `https://api.coingecko.com/api/v3/coins/${target}`;

//   fetch(apiURL)
//     .then(response => response.json())
//     .then(data => displayData(data))
//     .catch(error => console.log(error));
// }

// // Change styling of link button when cursor hovers over it
// function activateLinkButton(e) {
//   const elStyle = e.target.style;
//   elStyle.backgroundColor = "#000";
//   elStyle.color = "rgb(89, 179, 0)"
//   elStyle.padding = "20px 60px";
//   elStyle.letterSpacing = "2px";
//   elStyle.transition = "background-color 1s ease-out, color 1s ease-out, padding 1s ease-in, letter-spacing 1s linear";
// }

// function deactivateLinkButton(e) {
//   const elStyle = e.target.style;
//   elStyle.backgroundColor = "rgb(89, 179, 0)";
//   elStyle.color = "#fff"
//   elStyle.padding = "20px 34px";
//   elStyle.letterSpacing = "normal";
//   elStyle.transition = "background-color 1s ease-out, color 1s ease-out, padding 1s ease-in, letter-spacing 1s linear";
// }