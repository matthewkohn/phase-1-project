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

/*-------------------------- CREATE THE DROPDOWN  --------------------------*/
function createDropdown(data) {
  const dropdownTarget = document.getElementById('dropdown-target');
  const dropdown = document.createElement('select');
  dropdown.id = 'coins-dropdown';
  // Function that appends a disabled default option to the top of the dropdown that's being created
  // createDefaultOptionEl(dropdown);
  // Creates the dropdown options and appends to the dropdown that's being created
  createOptions(dropdown, data);
  dropdownTarget.append(dropdown);
  // dropdown.addEventListener('change', e => handleDropdownSelection(e, data));
  dropdown.addEventListener('change', handleDropdownSelection);
}
// Creates Ranked crypto coin options and attaches to the dropdown element
function createOptions(dropdownEl, apiData) {
  // Iterate through fetchData, creating an option element out of each object
  createDefaultOptionEl(dropdownEl);
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

/*-------------------------------- LOAD PAGE ----------------------------------*/
function loadStartImages(container) {
  const coinContainer = container;
  const coingeckoLink = document.getElementById('coingecko-link');
  // Loads a stock image inside the Coin Container until a coin is chosen from the dropdown.
  const stockImageURL = 
  'https://images.unsplash.com/photo-1515879128292-964efc3ebb25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80';
  const genieImg = createImage(stockImageURL, 'placeholder-image', 'Green bottle on the edge of a sandy beach.');
  coinContainer.append(genieImg);
  // Loads Coingecko logo at the footer inside a link element
  const coingeckoImgURL = 
  'https://static.coingecko.com/s/coingecko-branding-guide-4f5245361f7a47478fa54c2c57808a9e05d31ac7ca498ab189a3827d6000e22b.png';
  const geckoImg = createImage(coingeckoImgURL, 'logo', 'Coingecko logo.');
  coingeckoLink.append(geckoImg);
}
// Creates the structure of the Coin Container
function buildCoinContainer(container) {
  // // // createElement(tagNameStr, idStr) 
  const coinStructure = createElement('div', 'coin-structure');
  coinStructure.className = 'hidden';
  const headerSection = createElement('header', 'coin-header-div');
  const dataSection = createElement('div', 'data-section');
  const footerSection = createElement('footer', 'coin-footer-div');
  const dataLeft = createElement('ol', 'data-left');
  const dataRight = createElement('ol', 'data-right');
  const articleEl = createElement('article', 'info-structure');
  articleEl.className = 'hidden';
  
  // createImage(url, assignClass, alt)
  const imageEl   = createImage( '#', 'coin-image', `Oops! Please try again.`);
  const nameEl    = createElement('h3', 'coin-name');
  const priceEl   = createElement('h2', 'price');
  const symbolEl  = createElement('span', 'symbol');
  // Info section of CoinContainer
  const changeEl  = createElement('li', 'change');
  const high24El  = createElement('li', 'high-24');
  const low24El   = createElement('li', 'low-24');
  const volumeEl  = createElement('li', 'volume');
  const rankEl    = createElement('li', 'rank');
  const mktCapEl  = createElement('li', 'market-cap');
  const athEl     = createElement('li', 'all-time-high');
  const supplyEl  = createElement('li', 'supply');
  // Footer of CoinContainer
  const timeEl    = createElement('span', 'time');
  const buttonEl  = createElement('button', 'info-button');
  // Bring it all together, appending all elements to the DOM
  headerSection.append(imageEl, nameEl, symbolEl, priceEl);
  dataLeft.append(changeEl, high24El, low24El, volumeEl);
  dataRight.append(rankEl, mktCapEl, athEl, supplyEl);
  dataSection.append(dataLeft, dataRight);
  footerSection.append(timeEl, buttonEl);
  coinStructure.append(headerSection, dataSection, articleEl, footerSection);
  container.append(coinStructure);
  return container;
};


// function addLink(element) {
//   const link = createElement('a');
//   link.src = 
//   element.append(link);

//   element.addEventListener('click', createLinkTag);
// }

// function createLinkTag(event) {
//   console.log(event.target);
// }

/*-------------------------------- DROPDOWN EVENT LISTENER -------------------------------*/
function handleDropdownSelection(event) {
  // Prevent default & capture target value
  event.preventDefault();  
  const targetValue = event.target.value;
  const apiURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${targetValue}&sparkline=false`;
  fetchFunction(formatContent, apiURL);
}
// Formats the API data and returns a usable object where the key='id' & the value= both the domContent to be used and an optional labelContent
// {id: [ domContent, labelContent ] }
function formatContent(targetData) {
  const apiData = targetData[0];
  const formattedContentObj = {
    'info-button':    [`Learn More About ${apiData.name}`],
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
  updateDOMContent(formattedContentObj, apiData);
}
// Takes the formatted API data {id: domContent} and updates the DOM
function updateDOMContent(contentObj, apiData) {
  // Interpret data
  const coinObject = contentObj;
  for (const [elementID, [text, label]] of Object.entries(coinObject)) {
    const element = document.getElementById(elementID);
    if (elementID === 'coin-image') {
      element.src = text;
      element.alt = `${coinObject['coin-name']} logo`;
    } else {
      element.textContent = text;
    }
    // If a label exists, prepend a label to the textContent
    if (label) {
      addLabel(element, label);
    }
  }
  // Display data
  displayDom(apiData);
}

function displayDom(apiData) {
  const coinStructure = document.getElementById('coin-structure');
  const placeholder = document.getElementById('placeholder-image');
  placeholder.classList.add('hidden');
  coinStructure.classList.remove('hidden');
  // Using Event Delegation to attach an event handler to the 'info-button' that fetches data to load on click
  // Source: Stack Overflow https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript
  coinStructure.addEventListener('click', function(e) {
    if (e.target && e.target.id == 'info-button') {
      fetchMoreInfo(apiData);
    }
  });
}
// Once the info-button is clicked, the info for that coin is fetched, formatted, and displayed in the DOM
function fetchMoreInfo(apiData) {
  const apiID = apiData.id;
  const apiURL = `https://api.coingecko.com/api/v3/coins/${apiID}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;
  fetchFunction(handleInfo, apiURL);
}
// 
function handleInfo(data) {
  const coinHeader = document.getElementById('coin-header-div');
  const dataSection = document.getElementById('data-section');
  const coinFooter = document.getElementById('coin-footer-div');
  const articleSection = document.getElementById('info-structure');
  
  dataSection.className = 'hidden';
  articleSection.classList.remove('hidden');


  console.log(data.description.en);
}

/*
const coinStructure = createElement('div', 'coin-structure');
  coinStructure.className = 'hidden';
  const headerSection = createElement('header', 'coin-header-div');
  const dataSection = createElement('div', 'data-section');
  const footerSection = createElement('footer', 'coin-footer-div');
  const dataLeft = createElement('ol', 'data-left');
  const dataRight = createElement('ol', 'data-right');
  const articleEl = createElement('article', 'info-structure');
*/










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

/*------------------------ HELPER FUNCTIONS --------------------*/
// FETCH
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
function createImage(url, assignID, alt) {
  const image = document.createElement('img');
  Object.assign(image, {
    id: assignID,
    src: url,
    alt: alt,
  });
  return image;
}