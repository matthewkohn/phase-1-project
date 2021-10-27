/*------------------------------- GLOBAL VARIABLES -------------------------*/
// API docs: https://www.coingecko.com/en/api/documentation

// Used inside dynamicDropdown() and the apiURL
let optionValue;
let targetObject;

// Coin Container
const coinContainer = document.getElementById('coin-container');
// The select element created in dynamicDropdown() when loadDropdown() is called on DOMContentLoaded
const dropdownMenu = document.getElementById('coins-dropdown');


/*--------------------------- LOADING PAGE ---------------------------------*/

// Display the dropdown and default images when DOM Content Loads
document.addEventListener('DOMContentLoaded', loadStartScreen);
function loadStartScreen() {
  // URLs
  const stockImageURL = 'https://images.unsplash.com/photo-1515879128292-964efc3ebb25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80';
  const coingeckoImgURL = 'https://static.coingecko.com/s/coingecko-branding-guide-4f5245361f7a47478fa54c2c57808a9e05d31ac7ca498ab189a3827d6000e22b.png';
  const coingeckoLink = document.getElementById('coingecko-link');

  // Loads the dropdown menu
  loadDropdown();
  // Loads a stock image inside the Coin Container until a coin is chosen from the dropdown.
  loadImage(stockImageURL, 'placeholder-image', 'Green bottle on the edge of a sandy beach.', coinContainer);
  // Loads Coingecko logo at the footer inside a link element
  loadImage(coingeckoImgURL, 'logo', 'Coingecko logo.', coingeckoLink);
}

// Function to load the dropdown menu
function loadDropdown() {
  const dropdownTarget = document.getElementById('dropdown-target');
  dropdownTarget.append(dynamicDropdown());
}

// Function to create and return the Dropdown Menu
function dynamicDropdown() {
  const dropdown = document.createElement('select');
  dropdown.id = 'coins-dropdown'
  // Array of top coins by market value
  const topCoinsIdArray = ['CHOOSE A COIN', 'bitcoin', 'ethereum', 'binancecoin', 'tether', 'cardano', 'solana', 'ripple', 'polkadot', 'shibainu', 'dogecoin', 'terra', 'avalanche', 'chainlink', 'uniswap', 'litecoin', 'polygon', 'algorand', 'cosmos', 'bitcoincash', 'stellar'];
  
  // Iterate through topCoinsIdArray to turn each item into an Option element and append to Dropdown.
  topCoinsIdArray.map((val, i) => {
    const option = document.createElement('option');
    option.value = optionValue = val;
    option.innerText = `${i}. ${capitalizeFirstLetter(val)}`;
    dropdown.appendChild(option);
  });
  return dropdown;
}



/*----------------------------- MAIN FUNCTIONS -------------------------*/

// Fetch data from selected item in dropdown

dropdownMenu.addEventListener('change', handleDropdownSelection);

function handleDropdownSelection(event) {
  event.preventDefault();  
  // Clear the DOM for each selection
  removeAllChildNodes(coinContainer);
  
  // Capture the input chosen in the dropdown
  // const input = selectedCoinList.options[selectedCoinList.selectedIndex];
  // Fetch data from CoinGecko
  if (optionValue === "CHOOSE A COIN") {
    loadImage(stockImageURL, 'placeholder-image', 'Green bottle on the edge of a sandy beach.', coinContainer);
  } else {
    fetchTargetData();
    displayData(targetObject);
  }
  
}


// Fetch promises to GET data in JSON form once its promise to get a response from the API is successful
function fetchTargetData() {
  // Dynamic URL based on the Value selected in the Dropdown.
  const apiURL = `https://api.coingecko.com/api/v3/coins/${optionValue}`;
  fetch(apiURL)
  .then(response => response.json())
  .then(data => targetObject = data)
  .catch(error => console.log(error));
}

/*------------------------- Re-usable Functions -----------------------*/
function loadImage(url, assignID, alt, appendTarget) {
  const image = document.createElement('img');
  image.src = url;
  image.id = assignID;
  image.alt = alt;
  appendTarget.append(image);
  return image;
}







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
  if (price > 1) {
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
  elStyle.color = "rgb(89, 179, 0)"
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