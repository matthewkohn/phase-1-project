/*---------------- LOADING PAGE ------------------*/
// Display the dropdown and default images when DOM Content Loads
document.addEventListener('DOMContentLoaded', init);

// Fetch data from CoinGecko API, passing data to load Dropdown and create the DOM structure of the page
function init() {
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
  // Creates the dropdown options and appends to the dropdown that's being created
  createOptions(dropdown, data);
  dropdownTarget.append(dropdown);
  // dropdown.addEventListener('change', e => handleDropdownSelection(e, data));
  dropdown.addEventListener('change', handleDropdownSelection);
}
// Creates Ranked crypto coin options and attaches to the dropdown element
function createOptions(dropdownEl, apiData) {
  // Create the default disabled option
  createDefaultOptionEl(dropdownEl);
  // Iterate through fetchData, creating an option element out of each object sorted by market rank
  const sortedData = apiData.sort(data => data.market_cap_rank);
  sortedData.map(data => {
    const marketRank = data.market_cap_rank;
    const name = data.name;
    const option = document.createElement('option');
    Object.assign(option, {
      value: data.id,
      className: 'option-item',
      textContent: `${marketRank}) ${name}`,
    })
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
  // createElement(tagNameStr, idStr) 
  const coinStructure = createElement('div', 'coin-structure');
  coinStructure.className = 'hidden';
  const headerSection = createElement('header', 'coin-header-div');
  const dataSection = createElement('div', 'data-section');
  const footerSection = createElement('footer', 'coin-footer-div');
  const dataLeft = createElement('ol', 'data-left');
  const dataRight = createElement('ol', 'data-right');
  const articleEl = createElement('article', 'info-section');
  articleEl.className = 'hidden';  
  // Header of CoinContainer using createImage(url, assignClass, alt)
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
  buttonEl.addEventListener('click', toggleInfoButton);
  // Bring it all together, appending all elements to the DOM
  headerSection.append(imageEl, nameEl, symbolEl, priceEl);
  dataLeft.append(changeEl, high24El, low24El, volumeEl);
  dataRight.append(rankEl, mktCapEl, athEl, supplyEl);
  dataSection.append(dataLeft, dataRight);
  footerSection.append(timeEl, buttonEl);
  coinStructure.append(headerSection, dataSection, articleEl, footerSection);
  container.append(coinStructure);
};

/*-------------------------------- DROPDOWN EVENT LISTENER -------------------------------*/
// When a dropdown option is selected, fetch the current data to display & the info to be loaded/hidden
function handleDropdownSelection(event) {
  // Prevent default & capture target value
  event.preventDefault();  
  const targetValue = event.target.value;
  const dataURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${targetValue}&sparkline=false`;
  const infoURL = `https://api.coingecko.com/api/v3/coins/${targetValue}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;
  fetchFunction(formatDataContent, dataURL);
  fetchFunction(handleInfoContent, infoURL);
}

/*---------------------------- HANDLE DATA SECTION ------------------*/
// Formats the API data and returns a unique object where the key='id', 
// and the value= an array with the domContent to be used and (optional) labelContent
// {id: [ domContent, labelContent ] }
function formatDataContent(targetData) {
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
  updateDataContent(formattedContentObj);
}
// Takes the formatted API data {id: domContent} and updates the DOM
function updateDataContent(contentObj) {
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
  displayData();
}
// Display data using toggleDisplay(idToHide, idToShow)
function displayData() {
  toggleDisplay('placeholder-image', 'coin-structure');
  toggleDisplay('info-section', 'data-section');
}

/*-------------------------- HANDLE INFO SECTION ----------------------*/
function handleInfoContent(targetData) {
  // Clear the article container of any children there previously
  const articleContainer = document.getElementById('info-section');
  removeAllChildNodes(articleContainer);
  // Format the info
  const coinInfo = targetData.description.en;
  if (coinInfo === "") {
    const link = createElement('a', 'blank-info-link');
    link.href = `https://www.coingecko.com/en/coins/${targetData.id}`;
    link.target = '_blank';
    link.textContent = 'Check out CoinGecko to learn more!';
    articleContainer.append(link);
  }
  const paragraphArray = coinInfo.split(/\n\r\n/);
  // The number of paragraph varies, so assign a <p> tag to each regardless of how many
  paragraphArray.map(paragraph => {
    const paragraphEl = createElement('p', 'paragraph');
    paragraphEl.innerHTML = paragraph;
    articleContainer.append(paragraphEl);
  })
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

/*------------------------ HELPER FUNCTIONS --------------------*/
// Fetch API docs: https://www.coingecko.com/en/api/documentation
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
// Clears children from its container
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*------------------------- TOGGLE BETWEEN DATA & INFO -----------------*/
// Info-button triggers on-click event listener
function toggleInfoButton() {
  const button = document.getElementById('info-button');
  const name = document.getElementById('coin-name');
  // const 
  if (isHidden('info-section')) {
    toggleDisplay('data-section', 'info-section');
    button.textContent = 'Go back';
  } else {
    toggleDisplay('info-section', 'data-section');
    button.textContent = `Learn more about ${name.textContent}`;
  }
}
// Generic 'hidden' toggle function
function toggleDisplay(hideId, showId) {
  const hideEl = document.getElementById(hideId);
  const showEl = document.getElementById(showId);
  hideEl.classList.add('hidden');
  showEl.classList.remove('hidden');
}
// Where id is a string and el is the DOM element you'd like to test for visibility
function isHidden(id) {
  const el = document.getElementById(id)
  if (el.childElementCount === null) {
    return;
  }
  // return (el.offsetParent === null)
  return (el.classList.value === 'hidden');
}

/*-------------------- ELEMENT CREATION ----------------*/
function createElement(tagNameStr, id) {
  const element = document.createElement(tagNameStr);
  if (id) {
    element.id = id;
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