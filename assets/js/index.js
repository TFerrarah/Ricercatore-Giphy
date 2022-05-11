const form = document.querySelector('form');

// Giphy API

const apiKey = 'ZevJj480p50HsWFbnMiLAzHRAdXzXOaN';
const apiUrl = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&q=';

// Copy to clipboard API

const copyToClipboard = (what, str) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText){
        alert(what +' Copied to clipboard!');
        return navigator.clipboard.writeText(str);
    }
    return Promise.reject('The Clipboard API is not available.');
  };

// Card components

function card(data) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.background = `linear-gradient(180deg, #000000 0%, rgba(196, 196, 196, 0) 48.44%, #000000 100%), url("${data.images.downsized.url}")`;

    const date = data.import_datetime.substring(0, 10);
    const day = date.substring(8, 10);
    const month = date.substring(5, 7);
    const year = date.substring(0, 4);

    const name = data.username.substring(0, data.username.indexOf(' by')); // remove everything after by

    card.innerHTML = `<div class="card-info">
        <h2>${data.title}</h2>
        <h3>uploaded by <span class="author">${data.username}</span></h3>
        <h4>on <span class="date">${day + '/' + month + '/' + year}</span></h4>
    </div>
    <div class="card-actions">
        <img onClick="copyToClipboard(${data.url})" src="./assets/svg/url.svg" alt="Copy GIF url">
        <img onClick="copyToClipboard(${data.embed_url})" src="./assets/svg/code.svg" alt="Copy embed code">
    </div>`;

    const buttons = card.querySelectorAll('img');

    for (let i = 0; i < buttons.length; i++) {
        if (i==0) {
            buttons[i].addEventListener('click',()=>copyToClipboard('URL',data.url))
        } else {
            buttons[i].addEventListener('click',()=>copyToClipboard('Embed URL',data.embed_url))
        }
    }



    return card;
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    //Clear previous results
    const input = document.querySelector('input');

    const url = apiUrl + input.value;

    //make a request to the api
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const gifs = data.data;
            const results = document.querySelector('.results');
            results.innerHTML = '';
            gifs.forEach(data => {
                results.appendChild(card(data));
            });
        })
        .catch(err => console.error(err));
});
