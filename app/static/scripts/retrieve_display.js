// Store the tracks, artists and genres in global arrays
const tracks = [];
const artists = [];
const genres = [];

// Define objects to store the selected values
const typeValues = {
    type: '',
    buttonElement: null,
}
const rangeValues = {
    range: '',
    buttonElement: null,
}
const selectedValues = {
    limit: document.getElementById('slider-value').textContent,
    type: '',
    range: '',
};

// Get the retro slider element and it's contained value
const slider = document.getElementById("retro-slider");
const sliderValue = document.getElementById("slider-value");

// Get all the buttons with the "custom-button" class
const buttons = document.querySelectorAll('.custom-button');


// Function to update the slider value
function updateSliderValue(value) {
    sliderValue.textContent = value;
    selectedValues.limit = value;
}

slider.addEventListener("input", function () {
    updateSliderValue(this.value);
});
// Add click event listeners to the buttons
buttons.forEach((button) => {
    button.addEventListener('click', () => {
        // check if the button's parent element contains type, if it does, update the typeValues object, typeValues.type = button.getAttribute('data-type'); if the typeValues.buttonElement is not null, remove the "selected" class from the typeValues.buttonElement else add the "selected" class to the button and then update the typeValues.buttonElement
        if (button.parentElement.classList.contains('type')) {
            typeValues.type = button.getAttribute('data-type');
            if (typeValues.buttonElement !== null) {
                typeValues.buttonElement.classList.remove('selected');
            }
            if (typeValues.type === 'Genres') {
                document.querySelector('.slider').style.visibility = 'hidden';
            }
            else {
                document.querySelector('.slider').style.visibility = 'visible';
            }
            button.classList.add('selected');
            typeValues.buttonElement = button;
        }
        if (button.parentElement.classList.contains('range')) {
            rangeValues.range = button.getAttribute('data-type');
            if (rangeValues.buttonElement !== null) {
                rangeValues.buttonElement.classList.remove('selected');
            }
            button.classList.add('selected');
            rangeValues.buttonElement = button;
        }
        // Update the selectedValues object
        selectedValues.type = typeValues.type;
        selectedValues.range = rangeValues.range;
        // if all the values are selected, change the display of a button with the id "submit-button" to "block"
        if (selectedValues.type !== '' && selectedValues.range !== '') {
            document.getElementById('submit-button').style.display = 'block';
        }
        else {
            document.getElementById('submit-button').style.display = 'none';
        }
        console.log(selectedValues);
    });
});

let response = null;
// listen for a click event on the submit button with id "submit-button" and send a get request to my flask app at route "/top" with the selectedValues object as the headers without the buttonElement property and then retrieve the response for further processing
document.getElementById('submit-button').addEventListener('click', () => {
    fadeButtonsAddController();
    fetch('/top', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedValues),
    })
        .then((response) => response.json())
        .then((data) => {
            // store the response in a global variable
            response = data;
            console.log('Success:', data);
            if (response !== null) {
                if (selectedValues.type === 'Tracks') {
                    makeTracks();
                    displayTracks();
                }
                else if (selectedValues.type === 'Artists') {
                    makeArtists();
                    displayArtists();
                }
                else {
                    makeGenres();
                    displayGenres();
                    genreRecommendPlaylist();
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });    
    });

function makeTracks() {
    if (response !== null) {
        track_count = 1;
        response.items.forEach((track) => {
            const trackContainer = document.createElement('div');
            trackContainer.classList.add('track-container');
            trackContainer.style.backgroundImage = `url(${track.artist_image})`;
            const artistDiv = document.createElement('div');
            artistDiv.classList.add('artist-div');
            artistDiv.style.backgroundImage = `url(${track.artist_image})`;
            const trackDiv = document.createElement('div');
            trackDiv.classList.add('track-div');
            trackDiv.setAttribute('data-preview', track.preview_url);
            trackDiv.innerHTML = `<h1>#${track_count}. ${track.name}</h1><img src="${track.album.images[0].url}" alt="${track.name}"><p>By ${track.artists[0].name}</p>`;
            trackContainer.appendChild(artistDiv);
            trackContainer.appendChild(trackDiv);
            let trackObject = {
                // add the current track_count and the topDiv to the object
                track_count: track_count,
                topDiv: trackContainer,
            };
            tracks.push(trackObject);
            addController(track_count);
            track_count++;
        });
        console.log(tracks);
    }
}

function makeArtists() {
    if (response !== null) {
        artist_count = 1;
        response.items.forEach((artist) => {
            const artistContainer = document.createElement('div');
            artistContainer.classList.add('artist-container');
            artistContainer.setAttribute('data-preview', artist.top_track.preview_url);
            artistContainer.setAttribute('data-name', artist.name);
            artistContainer.setAttribute('track-name', artist.top_track.name);
            const nowPlayingDiv = document.createElement('div');
            nowPlayingDiv.classList.add('now-div');
            nowPlayingDiv.innerHTML = `<p></p>`;
            const artistDiv = document.createElement('div');
            artistDiv.classList.add('track-div');
            artistDiv.innerHTML = `<h1>#${artist_count}. ${artist.name}</h1><img src="${artist.images[0].url}" alt="${artist.name}">`;         
            artistContainer.appendChild(nowPlayingDiv);
            artistContainer.appendChild(artistDiv);

            let artistObject = {
                // add the current artist_count and the topDiv to the object
                artist_count: artist_count,
                topDiv: artistContainer,
            };
            artists.push(artistObject);
            addController(artist_count);
            artist_count++;
        });
        console.log(artists);
    }
}

function makeGenres() {
    if (response !== null) {
        genre_count = 1;
        const genreContainer = document.createElement('div');
        genreContainer.classList.add('genre-container');
        const genreDiv = document.createElement('div');
        genreDiv.classList.add('genre-div');
        response.forEach((genre) => {
            const header = document.createElement('h1');
            const name = document.createElement('p');
            header.textContent = `#${genre_count}`;
            name.textContent = `${genre[0]}`;
            genreDiv.appendChild(header);
            genreDiv.appendChild(name);
            genre_count++;
        });
        genreContainer.appendChild(genreDiv);
        let genreObject = {
            topDiv: genreContainer,
        };
        genres.push(genreObject);
        console.log(genres);
    }
}

// Function addController to add a button of class controller-button to the element with class top-half for a track or artist with the text-content == track_count or artist_count(which would be passed as an argument to the function)
function addController(count) {
    const controllerButton = document.createElement('button');
    controllerButton.classList.add('controller-button');
    controllerButton.textContent = count;
    document.querySelector('.top-half').appendChild(controllerButton);
}

// Function genreRecommendPlaylist to add a <p> element to the element with the class .top-half and a button with the class .controller-button to the element with the class .bottom-half
function genreRecommendPlaylist() {
    const topHalf = document.querySelector('.top-half');
    const bottomHalf = document.querySelector('.bottom-half');
    const genreRecommend = document.createElement('p');
    genreRecommend.textContent = 'We recommend the following playlist based on your selected genre';
    topHalf.appendChild(genreRecommend);
    const controllerButton = document.createElement('button');
    controllerButton.classList.add('btn');
    controllerButton.classList.add('btn-primary');
    // add Id to the button
    controllerButton.setAttribute('id', 'genre-recommend-playlist');
    controllerButton.textContent = 'Save Recommended Playlist';
    bottomHalf.appendChild(controllerButton);
}


// // testing Function displayArtists to display the artists on the element with id "tvscreen"
function displayArtists() {
    const tvScreen = document.getElementsByClassName('tv-screen')[0].appendChild(artists[3].topDiv);
    // play the track preview
    const preview = document.querySelector('.artist-container').getAttribute('data-preview');
    const audio = new Audio(preview);
    audio.volume = 0.3;
    audio.play();
}
// }
// testing Function displayTracks to display the tracks on the element with id "tvscreen"
function displayTracks() {
    const tvScreen = document.getElementsByClassName('tv-screen')[0].appendChild(tracks[2].topDiv);
    // play the track preview
    const preview = document.querySelector('.track-div').getAttribute('data-preview');
    const audio = new Audio(preview);
    audio.play();
}
// // testing Function displayGenres to display the genres on the element with id "tvscreen"
function displayGenres() {
    const tvScreen = document.getElementsByClassName('tv-screen')[0].appendChild(genres[0].topDiv);
}

// Function fadeButtonsAddController to fade out the button-container class div and fade in the controller-section class div
function fadeButtonsAddController() {
    const buttonContainer = document.querySelector('.button-container');
    const controllerContainer = document.querySelector('.controller-section');
    buttonContainer.style.display = 'none';
    controllerContainer.style.display = 'block';
}