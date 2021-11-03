// API docs: https://www.coingecko.com/en/api/documentation

/*---------------- LOADING PAGE ------------------*/
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
  const coinContainer = document.getElementById('coin-container');
  const coingeckoLink = document.getElementById('coingecko-link');
  // Loads a stock image inside the Coin Container until a coin is chosen from the dropdown.
  const genieImg = loadImage(stockImageURL, 'placeholder-image', 'Green bottle on the edge of a sandy beach.');
  coinContainer.append(genieImg);
  // Loads Coingecko logo at the footer inside a link element
  const geckoImg = loadImage(coingeckoImgURL, 'logo', 'Coingecko logo.');
  coingeckoLink.append(geckoImg);
}

function loadImage(url, assignID, alt) {
  const image = document.createElement('img');
  Object.assign(image, {
    id: assignID,
    src: url,
    alt: alt,
  });
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
  // Display the selected cryptocurrency's data in the DOM
  displayData(apiData, targetValue);
}

// Creates elements and displays variable API data
function displayData(apiData, selectedValue) {
  const headerSection = document.createElement('header');
  headerSection.id = 'coin-header-div';
  const infoSection = document.createElement('div');
  infoSection.id = 'info-section';
  const infoLeft = document.createElement('div');
  infoLeft.id = 'info-left';
  const olLeft = document.createElement('ol');
  infoLeft.append(olLeft);
  const infoRight = document.createElement('div');
  infoRight.id = 'info-right';
  const olRight = document.createElement('ol');
  infoRight.append(olRight);
  infoSection.append(infoLeft, infoRight);
  const footerSection = document.createElement('footer');
  footerSection.id = 'coin-footer-div';
  
  // Clear the DOM for each selection
  const coinContainer = document.getElementById('coin-container');
  removeAllChildNodes(coinContainer);
  // Find the selectedValue inside apiData
  // loadCoinTemplate()
  const chosenCoin = apiData.find(coin => coin.id === selectedValue);
  // loadImage param format: (url, assignClass, alt, appendTarget) from line 49
  const imageEl = loadImage( chosenCoin.image, 'coin-image', `${chosenCoin.name} logo`);
  // createCoinEl param format: (coinObj, tagNameStr, idStr, apiValueStr, formatType(*OPTIONAL)) 
  const nameEl    = createCoinEl(chosenCoin, 'h3', 'coin-name', 'name');
  const priceEl   = createCoinEl(chosenCoin, 'h2', 'price', 'current_price', 'price');
  const symbolEl  = createCoinEl(chosenCoin, 'span', 'symbol', 'symbol');
  // Info section of CoinContainer
  const high24El  = createCoinEl(chosenCoin, 'li', 'high-24', 'high_24h', 'price');
  addLabel(high24El, '24 Hour High:');
  const low24El   = createCoinEl(chosenCoin, 'li', 'low-24', 'low_24h', 'price');
  addLabel(low24El, '24 Hour Low:');
  const volumeEl  = createCoinEl(chosenCoin, 'li', 'volume', 'total_volume', 'bigNumber');
  addLabel(volumeEl, '24 Hour Volume:');
  const rankEl    = createCoinEl(chosenCoin, 'li', 'rank', 'market_cap_rank', 'rank');
  addLabel(rankEl, 'Popularity:')
  const mktCapEl  = createCoinEl(chosenCoin, 'li', 'market-cap', 'market_cap', 'price');
  addLabel(mktCapEl, 'Market Cap:');
  const supplyEl  = createCoinEl(chosenCoin, 'li', 'supply', 'circulating_supply', 'bigNumber');
  addLabel(supplyEl, 'Circulating Supply:');
  // Footer of CoinContainer
  const timeEl    = createCoinEl(chosenCoin, 'span', 'time', 'last_updated', 'date')
  // Append to the DOM
  headerSection.append(imageEl, nameEl, symbolEl, priceEl);
  olLeft.append(high24El, low24El, volumeEl);
  olRight.append(rankEl, mktCapEl, supplyEl);
  
  // infoSection.append(high24El, low24El, volumeEl, rankEl, mktCapEl, supplyEl);
  footerSection.append(timeEl);
  coinContainer.append(headerSection, infoSection, footerSection);
console.log(nameEl, symbolEl, priceEl, high24El, low24El, volumeEl, rankEl, mktCapEl, supplyEl, timeEl);
  // coinContainer.append(nameEl, symbolEl, priceEl, high24El, low24El, volumeEl, rankEl, mktCapEl, supplyEl, timeEl)
}


// Function to clear the Coin Container in the DOM:
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*------------------------ COIN CONTAINER DOM ELEMENTS --------------------*/
// ELEMENT CREATOR FUNCTION
function createCoinEl(coinObj, tagNameStr, idStr, apiValueStr, formatType) {
  const element = document.createElement(tagNameStr);
  element.id = idStr;
  // Switch handles the optional "formatType" parameter
  switch(formatType) {
    case 'price':
      formatPrice(coinObj, apiValueStr, element);
      break;
    case 'bigNumber':
      formatLargeNumber(coinObj, apiValueStr, element);
      break;
    case 'rank':
      element.textContent = `# ${coinObj[apiValueStr]}`
      break;
    case 'date':
      formatDate(coinObj, apiValueStr, element);
      break;
    default:
      element.textContent = coinObj[apiValueStr];
  }
  return element;
}
    
    // Formats how prices are displayed in the DOM
    function formatPrice(coinObj, apiValueStr, elName) {
      let price = coinObj[apiValueStr];
      // Prices over a dollar are shown with 2 numbers after the decimal. 
      if (price >= 1) {
        price = price.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
      } else {
        price = `$${price}`
      }
      elName.textContent = price; 
    }
    
    // Formats large numbers that aren't currency
    function formatLargeNumber(coinObj, apiValueStr, elName) {
      let bigNum = coinObj[apiValueStr];
      elName.textContent = bigNum.toLocaleString();
    }
    
    // Formats timestamp received from the API to a readable local date & time
    function formatDate(coinObj, apiValueStr, elName) {
      const timestamp = new Date(coinObj[apiValueStr]);
      elName.textContent = timestamp;
    }
    
    function addLabel(elNameToPrepend, labelName) {
      const labelEl = document.createElement('label');
      Object.assign(labelEl, {
        className: 'label',
        htmlFor: elNameToPrepend.id,
        textContent: labelName,
      })
      // console.log(labelEl, elNameToPrepend)
      elNameToPrepend.prepend(labelEl);
    }
