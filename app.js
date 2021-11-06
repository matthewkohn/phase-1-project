/*---------------- LOADING PAGE ------------------*/
// Display the dropdown and default images when DOM Content Loads
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Fetch data from CoinGecko API, passing data to load Dropdown & populate DOM with selected option data
  fetchCoinList();
  loadPage();
}
/*--------------------------- ONCE DOM CONTENT LOADS ------------------------------*/
// Fetch top-100 data from Coingecko and Create the Dropdown Menu
function fetchCoinList() {
  fetchFunction(createDropdown, 
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_rank&per_page100&page=1&sparkline=false');
  } 
// Builds the structure of the rest of the DOM 
function loadPage() {
  const coinContainer = document.getElementById('coin-container');
  loadStartImages(coinContainer);
  buildCoinContainer(coinContainer);
}

/*----------------- CREATE THE DROPDOWN  -------------*/
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

/*-------------------------------- LOAD PAGE ----------------------------------*/
function loadStartImages(container) {
  const coinContainer = container;
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
// Creates the structure of the Coin Container
function buildCoinContainer(container) {
  const coinStructure = createElement('div', 'coin-structure');
  coinStructure.className = 'hidden';
  // Create elements (tagNameStr, idStr, labelName)
  const headerSection = createElement('header', 'coin-header-div');
  const infoSection = createElement('div', 'info-section');
  const footerSection = createElement('footer', 'coin-footer-div');
  const infoLeft = createElement('div', 'info-left');
  const infoRight = createElement('div', 'info-right');
  const olLeft = createElement('ol');
  const olRight = createElement('ol');
  // loadImage param format: (url, assignClass, alt, appendTarget)
  const imageEl   = loadImage( '#', 'coin-image', `Oops! Please try again.`);
  // // // createCoinEl param format: (tagNameStr, idStr, labelName(//OPTIONAL)) 
  const nameEl    = createElement('h3', 'coin-name');
  const priceEl   = createElement('h2', 'price');
  const symbolEl  = createElement('span', 'symbol');
  // // // Info section of CoinContainer
  const changeEl  = createElement('li', 'change');
  const high24El  = createElement('li', 'high-24');
  const low24El   = createElement('li', 'low-24');
  const volumeEl  = createElement('li', 'volume');
  const rankEl    = createElement('li', 'rank');
  const mktCapEl  = createElement('li', 'market-cap');
  const athEl     = createElement('li', 'all-time-high');
  const supplyEl  = createElement('li', 'supply');
  // // // Footer of CoinContainer
  const timeEl    = createElement('span', 'time');
  // // Bring it all together, appending all elements to the DOM
  infoLeft.append(olLeft);
  infoRight.append(olRight);
  infoSection.append(infoLeft, infoRight);
  headerSection.append(imageEl, nameEl, symbolEl, priceEl);
  olLeft.append(changeEl, high24El, low24El, volumeEl);
  olRight.append(rankEl, mktCapEl, athEl, supplyEl);
  footerSection.append(timeEl);
  coinStructure.append(headerSection, infoSection, footerSection);
  container.append(coinStructure);
  return container;
};


/*-------------------------------- DROPDOWN EVENT LISTENER -------------------------------*/
function handleDropdownSelection(event) {
  // Prevent default & capture target value
  event.preventDefault();  
  const targetValue = event.target.value;
  const apiURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${targetValue}&sparkline=false`;
  fetchFunction(formatContent, apiURL);

}


// Formats the API data and returns a usable object  {id: [ textContent, labelContent ] }
function formatContent(targetData) {
  const apiData = targetData[0];
  const formattedContentObj = {
    'coin-image':     [apiData.image],
    'coin-name':      [apiData.name],
    'symbol':         [apiData.symbol],
    'price':          [formatPrice(apiData.current_price)],
    'change':         [formatPercentage(apiData.price_change_percentage_24h), '24-Hour Change'],
    'high-24':        [formatPrice(apiData.high_24h), '24-Hour High:'],
    'low-24':         [formatPrice(apiData.low_24h), '24-Hour Low:'],
    'all-time-high':  [formatPrice(apiData.ath), 'All Time High'],
    'rank':           [formatRank(apiData.market_cap_rank), 'Popularity:'],
    'market-cap':     [formatPrice(apiData.market_cap), 'Market Cap:'],
    'volume':         [formatLargeNumber(apiData.total_volume), '24-Hour Volume:'],
    'supply':         [formatLargeNumber(apiData.circulating_supply), 'Circulating Supply:'],
    'time':           [formatDate(apiData.last_updated), 'Last Updated:'],
  }
  updateTextContent(formattedContentObj);
}

// Takes the API data, formats it to a usable object {id: textContent} and updates the DOM
function updateTextContent(contentObj) {
  const coinStructure = document.getElementById('coin-structure');
  const placeholder = document.getElementById('placeholder-image');
  placeholder.classList.add('hidden');
  const coinObject = contentObj;
  for (const [id, [text, label]] of Object.entries(coinObject)) {
    const element = document.getElementById(id);
    if (id !== 'coin-image') {
      element.textContent = text;
    } else {
      element.src = text;
      element.alt = `${coinObject['coin-name']} logo`;
    }
    if (label) {
      addLabel(element, label);
    }
  }
  // Display data

  coinStructure.classList.remove('hidden');
  // Access all elements that will show up in the DOM on change

  // Update text contents
  // coinObject.map(id => console.log(id));
  console.log(coinObject);
}



/*------------------------------ FORMATTERS --------------------------------*/
function formatPrice(number) {
  if (number > 1000000) {
    number = `$${formatLargeNumber(number)}`;
  } else if (number >= 1) {
    number = number.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  } else {
    number = `$${number}`;
  }
  return number; 
}

// Formats large numbers over a million
function formatLargeNumber(number) {
  const bigNum = Math.floor(number / 1000000);
  return `${bigNum.toLocaleString()} Million`;
}

// Formats timestamp received from the API to a readable local date & time
function formatDate(timestamp) {
  return new Date(timestamp);
}

function formatPercentage(float) {
  return `${float.toFixed(2)} %`
}

function formatRank(rankNumber) {
  return `# ${rankNumber}`;
}









/*
ath: 4674.9
ath_change_percentage: -4.72221
ath_date: "2021-11-03T19:05:08.044Z"
atl: 0.432979
atl_change_percentage: 1028620.83662
atl_date: "2015-10-20T00:00:00.000Z"
circulating_supply: 118234662.5615
current_price: 4456.46
fully_diluted_valuation: null
high_24h: 4524.84
id: "ethereum"
image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880"
last_updated: "2021-11-06T18:41:45.266Z"
low_24h: 4356.66
market_cap: 524538162857
market_cap_change_24h: -9910388624.056152
market_cap_change_percentage_24h: -1.85432
market_cap_rank: 2
max_supply: null
name: "Ethereum"
price_change_24h: -56.158939614225
price_change_percentage_24h: -1.24449
roi: {times: 96.69101162375917, currency: 'btc', percentage: 9669.101162375917}
symbol: "eth"
total_supply: null
total_volume: 15371714997
*/

// Creates elements and displays variable API data
// function displayData(apiData) {
//   const coinContainer = document.getElementById('coin-container');
//   // Clear the DOM for each selection
//   // removeAllChildNodes(coinContainer);
//   const chosenCoinObj = apiData[0];
//   changeTextContent(coinContainer, chosenCoinObj);
// }
// function nameEl() {
//   return {
//     tagName: 'h3',
//     id: 'coin-name',
//     apiValueStr: 'name',
//   }
// }
// coinContainer.addEventListener('click', linkToSite);
// function linkToSite() {
  
  // }
  
/*------------------------ COIN CONTAINER DOM ELEMENTS --------------------*/



      



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

// ELEMENT CREATION
function createElement(tagNameStr, id, labelContent) {
  const element = document.createElement(tagNameStr);
  if (id) {
    element.id = id;
  }
  if (labelContent) {
    addLabel(element, labelContent)
  }
  return element;
}
// Add a label to information in the Coin Container
function addLabel(elNameToPrepend, labelContent) {
  const labelEl = document.createElement('label');
  Object.assign(labelEl, {
    className: 'label',
    htmlFor: elNameToPrepend.id,
    textContent: labelContent,
  })
  elNameToPrepend.prepend(labelEl);
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

// function buildCoinContainer(element, coinObj) {
//   const container = element;


//   // Create the structure for the Coin Container (tagNameStr, id(//OPTIONAL))
//   const headerSection = createCoinStructure('header', 'coin-header-div');
//   const infoSection = createCoinStructure('div', 'info-section');
//   const footerSection = createCoinStructure('footer', 'coin-footer-div');
//   const infoLeft = createCoinStructure('div', 'info-left');
//   const infoRight = createCoinStructure('div', 'info-right');
//   const olLeft = createCoinStructure('ol');
//   const olRight = createCoinStructure('ol');
//   infoLeft.append(olLeft);
//   infoRight.append(olRight);
//   infoSection.append(infoLeft, infoRight);

//  // loadImage param format: (url, assignClass, alt, appendTarget)
//  const imageEl   = loadImage( coinObj.image, 'coin-image', `${coinObj.name} logo`);
//  // // // createCoinEl param format: (coinObj, tagNameStr, idStr, apiValueStr, formatType(//OPTIONAL), labelName(//OPTIONAL)) 
//  const nameEl    = createDynamicCoinEl(coinObj, 'h3', 'coin-name', 'name');
//  const priceEl   = createDynamicCoinEl(coinObj, 'h2', 'price', 'current_price', 'price');
//  const symbolEl  = createDynamicCoinEl(coinObj, 'span', 'symbol', 'symbol');
//  // // // Info section of CoinContainer
//  const high24El  = createDynamicCoinEl(coinObj, 'li', 'high-24', 'high_24h', 'price', '24 Hour High:');
//  const low24El   = createDynamicCoinEl(coinObj, 'li', 'low-24', 'low_24h', 'price', '24 Hour Low:');
//  const volumeEl  = createDynamicCoinEl(coinObj, 'li', 'volume', 'total_volume', 'bigNumber', '24 Hour Volume:');
//  const rankEl    = createDynamicCoinEl(coinObj, 'li', 'rank', 'market_cap_rank', 'rank', 'Popularity:');
//  const mktCapEl  = createDynamicCoinEl(coinObj, 'li', 'market-cap', 'market_cap', 'price', 'Market Cap:');
//  const supplyEl  = createDynamicCoinEl(coinObj, 'li', 'supply', 'circulating_supply', 'bigNumber', 'Circulating Supply:');
//  // // // Footer of CoinContainer
//  const timeEl    = createDynamicCoinEl(coinObj, 'span', 'time', 'last_updated', 'date', 'Last Updated:');
  // // Bring it all together, appending all elements to the DOM
  // headerSection.append(imageEl, nameEl, symbolEl, priceEl);
  // olLeft.append(high24El, low24El, volumeEl);
  // olRight.append(rankEl, mktCapEl, supplyEl);
  // footerSection.append(timeEl);
  // container.append(headerSection, infoSection, footerSection);
  // return container;

//   /*------------------------ COIN CONTAINER DOM ELEMENTS --------------------*/
// // ELEMENT CREATOR FUNCTIONS
// function createCoinStructure(tagNameStr, id) {
//   const element = document.createElement(tagNameStr);
//   element.id = id;
//   return element;
// }

// function createDynamicCoinEl(coinObj, tagNameStr, idStr, apiValueStr, formatType, labelName) {
//   const element = createCoinStructure(tagNameStr, idStr);
//   // Switch handles the optional "formatType" parameter
//   switch(formatType) {
//     case 'price':
//       formatPrice(coinObj, apiValueStr, element);
//       break;
//     case 'bigNumber':
//       formatLargeNumber(coinObj, apiValueStr, element);
//       break;
//     case 'rank':
//       element.textContent = `# ${coinObj[apiValueStr]}`
//       break;
//     case 'date':
//       formatDate(coinObj, apiValueStr, element);
//       break;
//     default:
//       element.textContent = coinObj[apiValueStr];
//   }
//   if (labelName) {
//     addLabel(element, labelName)
//   }
//   return element;
// }