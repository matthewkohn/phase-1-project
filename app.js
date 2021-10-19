const baseURLpre = 'https://api.coingecko.com/api/v3/simple/price?ids=';
const baseURLpost = '&vs_currencies=usd';
const options = {
  method: 'GET',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json'
  },
}
const searchForm = document.getElementById("search-form");
const input = document.getElementById("search-input");

searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  console.log(input.value);
  fetch(baseURLpre + input.value + baseURLpost)
    .then(response => response.json())
    .then(data => console.log(data))
}


// function getCrypto() {
//   fetch(API_URL, options)
//     .then(response => console.log(response.json()))
//     .then(result => console.log(result));
// }

// document.addEventListener('DOMContentLoaded', getCrypto);