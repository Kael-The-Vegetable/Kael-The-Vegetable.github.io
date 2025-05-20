// single page application (spa) functions:
// - fetches html content files
// - displays loading indicator
// - hash changes modify browser history
// - this functionality keeps the game module uninterrupted

const PAGES_PATH = `pages/`

function loadContent(page) {
    // show the active page link only
    const linkCollection = document.querySelectorAll('a[data-active]');
    for (const link of linkCollection) link.setAttribute('data-active', 'false');
    const link = document.querySelector(`a[href="#${page}"]`);
    if (link && page != 'home') link.setAttribute('data-active', 'true'); // non-home links

    const content = document.getElementById('content');
    content.innerHTML = ''; // clear content
    content.style.transition = 'none'; // immediately transition
    content.style.opacity = '0';
    void content.offsetWidth; // (!) force reflow on element
    content.style.transition = 'opacity 0.5s ease'; // prepare for next fade

    // fetch(`${page}.xml`) // fetch xml file
    fetch(`${PAGES_PATH + page}.xml?timestamp=${new Date().getTime()}`, { // (!) unique url request to avoid caching
        headers: { // (!) additional no-caching parameters
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    }) // fetch xml file
        .then(response => {
            if (!response.ok) {
                throw new Error('Content not found!');
            }
            return response.text();
        })
        .then(data => {
            content.innerHTML = data; // inject page content
            content.style.opacity = '1';
        })
        .catch(error => {
            content.innerHTML = `<p style="text-align:center;">Error: <i>${error.message}</i></p>`;
            content.style.opacity = '1';
        });
}

console.log('I enjoy programming games, designing frameworks and building reusable components.');
console.log('You\'re curiousity has been rewarded! Change the hash value to "#egg" and load the URL.');

// triggers with forward/back buttons and url changes, check for hash
window.onpopstate = function(event) { checkURL() }

function checkURL()
{
    if (location.hash) {
        const page = location.hash.replace('#', '');
        loadContent(page); // load content from initial hash
    } else {
        loadContent('home'); // default to "home"
    }
}

// on initial page load check for a url hash
checkURL()

// (*) if you are reading this, i wish i had the time to make an even more secret easter egg, but alas...