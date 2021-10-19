const API_URL = 'https://www.coingecko.com/en/api/simple/price';
const options = {
  method: 'GET',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json'
  },
}

//  fetch(API_URL)
//   .then(response => response.json())
//   .then(data => console.log(data))

function getCrypto() {
  fetch(API_URL, options)
    .then(response => console.log(response.json()))
    .then(result => console.log(result));
}
document.addEventListener('DOMContentLoaded', getCrypto);