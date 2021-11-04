/*---------------- LOADING PAGE ------------------*/
// Display the dropdown and default images when DOM Content Loads
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Fetch data from CoinGecko API, passing data to load Dropdown & populate DOM with selected option data
  fetchCoinList();
  // Creates Dropdown & default page features
  loadStartImages();
}
/*----------------- FETCH RANKED DATA ---------------------*/
// Fetch to Coingecko, requesting real-time data on top 100 cryptocurrencies
function fetchCoinList() {
  fetchFunction(createDropdown, 
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_rank&per_page100&page=1&sparkline=false');
  } 
/*---------------- LOAD START IMAGES ---------------*/
function loadStartImages() {
  const coinContainer = document.getElementById('coin-container');
  const coingeckoLink = document.getElementById('coingecko-link');
  // Loads a stock image inside the Coin Container until a coin is chosen from the dropdown.
  const stockImageURL = 
  'https://images.unsplash.com/photo-1515879128292-964efc3ebb25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80';
  const genieImg = loadImage(stockImageURL, 'placeholder-image', 'Green bottle on the edge of a sandy beach.');
  coinContainer.append(genieImg);
  // Loads Coingecko logo at the footer inside a link element
  const coingeckoImgURL = 
  'https://static.coingecko.com/s/coingecko-branding-guide-4f5245361f7a47478fa54c2c57808a9e05d31ac7ca498ab189a3827d6000e22b.png';
  const geckoImg = loadImage(coingeckoImgURL, 'logo', 'Coingecko logo.');
  coingeckoLink.append(geckoImg);
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
  // dropdown.addEventListener('change', e => handleDropdownSelection(e, data));
  dropdown.addEventListener('change', handleDropdownSelection);
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

// Creates Ranked crypto coin options and attaches to the dropdown element
function createTopOptions(dropdownEl, apiData) {
  // Iterate through fetchData, creating an option element out of each object
  apiData.map(data => {
    // console.log(data);
    const marketRank = data.market_cap_rank;
    const name = data.name;
    // REMINDER: Using Object.assign() here took elements out of order
    const option = document.createElement('option');
    option.value = data.id;
    option.className = 'option-item';
    option.textContent = `${marketRank}) ${name}`;
    dropdownEl.appendChild(option);
  });
}

/*-------------- DROPDOWN EVENT LISTENER ---------------*/
function handleDropdownSelection(event) {
  // Prevent default & capture target value
  event.preventDefault();  
  const targetValue = event.target.value;
  fetchFunction(displayData,
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${targetValue}&sparkline=false`);
  }
  
// Creates elements and displays variable API data
function displayData(apiData) {
  const coinContainer = document.getElementById('coin-container');
  // Clear the DOM for each selection
  removeAllChildNodes(coinContainer);
  const chosenCoin = apiData[0];
  buildCoinContainer(coinContainer, chosenCoin);
}



function buildCoinContainer(element, coinObj) {
  const container = element;
  // Create the structure for the Coin Container (tagNameStr, id(//OPTIONAL))
  const headerSection = createCoinStructure('header', 'coin-header-div');
  const infoSection = createCoinStructure('div', 'info-section');
  const footerSection = createCoinStructure('footer', 'coin-footer-div');
  const infoLeft = createCoinStructure('div', 'info-left');
  const infoRight = createCoinStructure('div', 'info-right');
  const olLeft = createCoinStructure('ol');
  const olRight = createCoinStructure('ol');
  infoLeft.append(olLeft);
  infoRight.append(olRight);
  infoSection.append(infoLeft, infoRight);

  // const elementArray = [ imageEl, nameEl, priceEl, symbolEl, high24El, low24El, volumeEl, rankEl, mktCapEl, supplyEl, timeEl ];
  // createDynamicEls(coinObj, elementArray);

  // loadImage param format: (url, assignClass, alt, appendTarget)
  const imageEl   = loadImage( coinObj.image, 'coin-image', `${coinObj.name} logo`);
  // // // createCoinEl param format: (coinObj, tagNameStr, idStr, apiValueStr, formatType(//OPTIONAL), labelName(//OPTIONAL)) 
  const nameEl    = createDynamicCoinEl(coinObj, 'h3', 'coin-name', 'name');
  const priceEl   = createDynamicCoinEl(coinObj, 'h2', 'price', 'current_price', 'price');
  const symbolEl  = createDynamicCoinEl(coinObj, 'span', 'symbol', 'symbol');
  // // // Info section of CoinContainer
  const high24El  = createDynamicCoinEl(coinObj, 'li', 'high-24', 'high_24h', 'price', '24 Hour High:');
  const low24El   = createDynamicCoinEl(coinObj, 'li', 'low-24', 'low_24h', 'price', '24 Hour Low:');
  const volumeEl  = createDynamicCoinEl(coinObj, 'li', 'volume', 'total_volume', 'bigNumber', '24 Hour Volume:');
  const rankEl    = createDynamicCoinEl(coinObj, 'li', 'rank', 'market_cap_rank', 'rank', 'Popularity:');
  const mktCapEl  = createDynamicCoinEl(coinObj, 'li', 'market-cap', 'market_cap', 'price', 'Market Cap:');
  const supplyEl  = createDynamicCoinEl(coinObj, 'li', 'supply', 'circulating_supply', 'bigNumber', 'Circulating Supply:');
  // // // Footer of CoinContainer
  const timeEl    = createDynamicCoinEl(coinObj, 'span', 'time', 'last_updated', 'date', 'Last Updated:');
  


  // // Bring it all together, appending all elements to the DOM
  headerSection.append(imageEl, nameEl, symbolEl, priceEl);
  olLeft.append(high24El, low24El, volumeEl);
  olRight.append(rankEl, mktCapEl, supplyEl);
  footerSection.append(timeEl);
  container.append(headerSection, infoSection, footerSection);
  return container;
};

// function createDynamicEls(coinObj, elementArray) {
//   elementArray.map(el => {

//   })
  // // loadImage param format: (url, assignClass, alt, appendTarget)
  // const imageEl   = loadImage( coinObj.image, 'coin-image', `${coinObj.name} logo`);
  // // // createCoinEl param format: (coinObj, tagNameStr, idStr, apiValueStr, formatType(//OPTIONAL), labelName(//OPTIONAL)) 
  // const nameEl    = createDynamicCoinEl(coinObj, 'h3', 'coin-name', 'name');
  // const priceEl   = createDynamicCoinEl(coinObj, 'h2', 'price', 'current_price', 'price');
  // const symbolEl  = createDynamicCoinEl(coinObj, 'span', 'symbol', 'symbol');
  // // // Info section of CoinContainer
  // const high24El  = createDynamicCoinEl(coinObj, 'li', 'high-24', 'high_24h', 'price', '24 Hour High:');
  // const low24El   = createDynamicCoinEl(coinObj, 'li', 'low-24', 'low_24h', 'price', '24 Hour Low:');
  // const volumeEl  = createDynamicCoinEl(coinObj, 'li', 'volume', 'total_volume', 'bigNumber', '24 Hour Volume:');
  // const rankEl    = createDynamicCoinEl(coinObj, 'li', 'rank', 'market_cap_rank', 'rank', 'Popularity:');
  // const mktCapEl  = createDynamicCoinEl(coinObj, 'li', 'market-cap', 'market_cap', 'price', 'Market Cap:');
  // const supplyEl  = createDynamicCoinEl(coinObj, 'li', 'supply', 'circulating_supply', 'bigNumber', 'Circulating Supply:');
  // // // Footer of CoinContainer
  // const timeEl    = createDynamicCoinEl(coinObj, 'span', 'time', 'last_updated', 'date', 'Last Updated:');
  
// }

// coinContainer.addEventListener('click', linkToSite);
// function linkToSite() {
  
  // }
  
/*------------------------ COIN CONTAINER DOM ELEMENTS --------------------*/
// ELEMENT CREATOR FUNCTIONS
function createCoinStructure(tagNameStr, id) {
  const element = document.createElement(tagNameStr);
  element.id = id;
  return element;
}

function createDynamicCoinEl(coinObj, tagNameStr, idStr, apiValueStr, formatType, labelName) {
  const element = createCoinStructure(tagNameStr, idStr);
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
  if (labelName) {
    addLabel(element, labelName)
  }
  return element;
}
      
// Formats how prices are displayed in the DOM
function formatPrice(coinObj, apiValueStr, elName) {
  let price = coinObj[apiValueStr];
  console.log(price);
  if (price > 1000000) {
    const bigPrice = parseInt(price / 1000000);
    price = `$${bigPrice.toLocaleString()} million`;
  } else if (price >= 1) {
    price = convertToPrice(price);
  } else {
    price = `$${price}`;
  }
  
  elName.textContent = price; 
}

function convertToPrice(price) {
  return price.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

// Formats large numbers that aren't currency
function formatLargeNumber(coinObj, apiValueStr, elName) {
  let bigNum = coinObj[apiValueStr];
  bigNum = Math.floor(bigNum / 1000000);
  bigNum = bigNum.toLocaleString();
  elName.textContent = `${bigNum} million`;
}

// Formats timestamp received from the API to a readable local date & time
function formatDate(coinObj, apiValueStr, elName) {
  const timestamp = new Date(coinObj[apiValueStr]);
  elName.textContent = timestamp;
}

// Add a label to information in the Coin Container
function addLabel(elNameToPrepend, labelName) {
  const labelEl = document.createElement('label');
  Object.assign(labelEl, {
    className: 'label',
    htmlFor: elNameToPrepend.id,
    textContent: labelName,
  })
  elNameToPrepend.prepend(labelEl);
}


/*------------------------ HELPER FUNCTIONS --------------------*/
// API docs: https://www.coingecko.com/en/api/documentation
function fetchFunction(dataHandler, apiURL) {
  const URL = apiURL;
  fetch(URL)
  .then(response => response.json())
  .then(data => dataHandler(data))
  .catch(error => {
    console.log(error);
    displayErrorMessage();
  });
}

function displayErrorMessage() {
  const section = document.getElementById('dropdown-container');
  removeAllChildNodes(section);
  const h2 = document.createElement('h2');
  h2.id = 'dom-error';
  h2.textContent = "Sorry, the system isn't working right now. Please try again later.";
  section.append(h2);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
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