document.addEventListener('DOMContentLoaded', fetchCoinList);

const fetchFunction = function(apiURL, dataHandler) {
  fetch(apiURL)
  .then(response => response.json())
  .then(data => dataHandler(data))
  .catch(error => {
    console.log(error);
    displayErrorMessage();
  });
}
/*-------------------------- CREATE THE DROPDOWN --------------------------*/
// Fetch top-100 data from Coingecko
function fetchCoinList() {
  const marketApiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_rank&per_page100&page=1&sparkline=false';
  fetchFunction(marketApiUrl, createDropdown);
}
// Create the Dropdown Menu with data received from CoinGecko and adds 'change' event listener
function createDropdown(data) {
  const dropdownTarget = document.getElementById('dropdown-target');
  const dropdown = document.createElement('select');
  dropdown.id = 'coins-dropdown';
  createOptions(dropdown, data);
  dropdownTarget.append(dropdown);
  dropdown.addEventListener('change', handleDropdownSelection);
}
// Creates Ranked crypto coin options and attaches to the dropdown element
function createOptions(dropdownEl, apiData) {
  createDefaultOptionEl(dropdownEl);
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
// Creates Default Option element at the top of the dropdown
function createDefaultOptionEl(dropdownEl) {
  const defaultOption = createElement('option', 'default-label');
  Object.assign(defaultOption, {
    textContent: 'CHOOSE A RANKED COIN',
    value: 'default',
    selected: 'true',
    disabled: 'disabled',
  });
  return dropdownEl.appendChild(defaultOption);
}

/*-------------------------------- DROPDOWN EVENT LISTENER -------------------------------*/
// When a dropdown option is selected, fetch the current data to display & the info to be loaded/hidden
function handleDropdownSelection(event) {
  event.preventDefault();  
  const targetValue = event.target.value;
  const dataURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${targetValue}&sparkline=false`;
  const infoURL = `https://api.coingecko.com/api/v3/coins/${targetValue}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;
  fetchFunction(dataURL, formatDataContent);
  fetchFunction(infoURL, handleInfoContent);
}

/*---------------------------- HANDLE DATA SECTION ------------------*/
// Formats the API data and returns a unique object @Param: {id: domContent}
function formatDataContent(targetData) {
  const apiData = targetData[0];
  const formattedContentObj = {
    'info-button':    `Learn More About ${apiData.name}`,
    'coin-image':     apiData.image,
    'coin-name':      apiData.name,
    'symbol':         apiData.symbol,
    'price':          formatPrice(apiData.current_price),
    'change':         formatPercentage(apiData.price_change_percentage_24h),
    'high-24':        formatPrice(apiData.high_24h),
    'low-24':         formatPrice(apiData.low_24h),
    'all-time-high':  formatPrice(apiData.ath),
    'rank':           formatRank(apiData.market_cap_rank),
    'market-cap':     formatPrice(apiData.market_cap),
    'volume':         formatLargeNumber(apiData.total_volume),
    'supply':         formatLargeNumber(apiData.circulating_supply),
    'time':           formatDate(apiData.last_updated),
  }
  showDataContent(formattedContentObj);
}
// Takes the formatted API data {id: domContent} and updates the DOM
function showDataContent(contentObj) {
  for (const [elementID, text] of Object.entries(contentObj)) {
    const element = document.getElementById(elementID);
    if (elementID === 'coin-image') {
      element.src = text;
      element.alt = `${contentObj['coin-name']} logo`;
    } else {
      element.textContent = text;
    }
  }
  const buttonEl = document.getElementById('info-button');
  buttonEl.addEventListener('click', toggleInfoButton);
  // Display data using @Param: toggleDisplay(idToHide, idToShow)
  toggleDisplay('placeholder-image', 'coin-structure');
  toggleDisplay('info-section', 'data-section');
}

/*-------------------------- HANDLE INFO SECTION ----------------------*/
function handleInfoContent(targetData) {
  const articleContainer = document.getElementById('info-section');
  removeAllChildNodes(articleContainer);
  const coinInfo = targetData.description.en;
  if (coinInfo === "") {
    const link = createElement('a', 'blank-info-link');
    link.href = `https://www.coingecko.com/en/coins/${targetData.id}`;
    link.target = '_blank';
    link.textContent = 'Visit CoinGecko.com to learn more!';
    articleContainer.append(link);
  }
  const paragraphArray = coinInfo.split(/\n\r\n/);
  paragraphArray.map(paragraph => {
    const paragraphEl = createElement('p');
    paragraphEl.innerHTML = paragraph;
    articleContainer.append(paragraphEl);
  });
}

/*------------------------ HELPER FUNCTIONS --------------------*/
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

/*------------------------- TOGGLE BETWEEN DATA & INFO -----------------*/
function toggleInfoButton() {
  const button = document.getElementById('info-button');
  const name = document.getElementById('coin-name');
  if (isHidden('info-section')) {
    toggleDisplay('data-section', 'info-section');
    button.textContent = 'Go back';
  } else {
    toggleDisplay('info-section', 'data-section');
    button.textContent = `Learn more about ${name.textContent}`;
  }
}

function toggleDisplay(hideId, showId) {
  const hideEl = document.getElementById(hideId);
  const showEl = document.getElementById(showId);
  hideEl.classList.add('hidden');
  showEl.classList.remove('hidden');
}

function isHidden(id) {
  const el = document.getElementById(id)
  if (el.childElementCount === null) {
    return false;
  }
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
  const fullDate = new Date(timestamp);
  let dateTime = fullDate.toLocaleString();
  dateTimeArr = dateTime.split(' ');
  time = dateTimeArr[1];
  amOrPm = dateTimeArr[2];
  date = dateTimeArr[0].split(',')[0];
  return `${time} ${amOrPm} on ${date}`;
}
function formatPercentage(float) {
  const changeEl = document.getElementById('change');
  if (float > 0) {
    changeEl.style.color = 'green';
    return `+${float.toFixed(2)} %`;
  } else {
    changeEl.style.color = 'red';
    return `${float.toFixed(2)} %`;
  }
}
function formatRank(rankNumber) {
  return `# ${rankNumber}`;
}
