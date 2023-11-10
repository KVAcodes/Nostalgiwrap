import { typeWriter } from './main_page.js';

// global variable to store the value of the shouldStop variable terminating the display function
let shouldStop = false;

// global variable to store the audio object
let audio;

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


// MAKE FUNCTIONS( to create the elements to be displayed on the tv screen) STORED IN GLOBAL ARRAYS
function makeTracks() {
    if (response !== null) {
        let track_count = 1;
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
        addControllerEventListeners()
        console.log(tracks);
    }
}

function makeArtists() {
    if (response !== null) {
        let artist_count = 1;
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
        addControllerEventListeners()
        console.log(artists);
    }
}

function makeGenres() {
    if (response !== null) {
        let genre_count = 1;
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


// FUNCTIONS TO SWAP IN AND OUT OF THE TV SCREEN CONTROLS AND FILTERS
// Function addController to add a button of class controller-button to the element with class top-half for a track or artist with the text-content == track_count or artist_count(which would be passed as an argument to the function)
function addController(count) {
    const controllerButton = document.createElement('button');
    controllerButton.classList.add('controller-button');
    controllerButton.classList.add('btn');
    controllerButton.classList.add('btn-primary');
    controllerButton.innerHTML = `<p>${count}</p>`
    document.querySelector('.top-half').appendChild(controllerButton);
}
// Function fadeButtonsAddController to fade out the button-container class div and fade in the controller-section class div
function fadeButtonsAddController() {
    const buttonContainer = document.querySelector('.button-container');
    const controllerContainer = document.querySelector('.controller-section');
    buttonContainer.style.display = 'none';
    controllerContainer.style.display = 'block';
}
// Function fadeControllerAddButtons to fade out the controller-section class div and fade in the button-container class div
function fadeControllerAddButtons() {
    const buttonContainer = document.querySelector('.button-container');
    const controllerContainer = document.querySelector('.controller-section');
    buttonContainer.style.display = 'flex';
    controllerContainer.style.display = 'none';
    // remove the button with id "return"
    document.getElementById('return').style.display = 'none';
}


// EVENT LISTENERS
// AddS event listener to the slider to update the slider value
slider.addEventListener("input", function () {
    updateSliderValue(this.value);
});
// Adds click event listeners to the buttons with the "custom-button" class
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
            // prevent termination of the display functions
            shouldStop = false;
            if (response !== null) {
                if (selectedValues.type === 'Tracks') {
                    makeTracks();
                    displayTracks();
                        // display the button with id "return"
                    document.getElementById('return').style.display = 'block';
                    topTracksPlaylist();
                }
                else if (selectedValues.type === 'Artists') {
                    makeArtists();
                    displayArtists(0);
                    document.getElementById('return').style.display = 'block';
                }
                else {
                    makeGenres();
                    displayGenres();
                    document.getElementById('return').style.display = 'block';
                    genreRecommendPlaylist();
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });    
    });

let controllerButtonStore = null;
// Function to add event listeners to the controller buttons and add the selected class to the button that is clicked, if the controllerButtonStore is not null, remove the selected class from the controllerButtonStore and then add the selected class to the button that is clicked and then update the controllerButtonStore
function addControllerEventListeners() {
    const controllerButtons = document.querySelectorAll('.controller-button');
    controllerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (controllerButtonStore !== null) {
                controllerButtonStore.classList.remove('selected');
            }
            button.classList.add('selected');
            controllerButtonStore = button;
            // if the selectedValues.type is "Tracks" call the displayTracks function with the text content of the button's p element as an argument but if the selectedValues.type is "Artists" call the displayArtists function with the text content of the button's p element as an argument
            if (selectedValues.type === 'Tracks') {
                shouldStop = true;
                stopAudio();
                resetTvScreenAfterArtist();
                flushtvScreen();
                displayTracks(button.querySelector('p').textContent - 1);
            }
            else if (selectedValues.type === 'Artists') {
                shouldStop = true;
                stopAudio();
                resetTvScreenAfterArtist();
                flushtvScreen();
                displayArtists(button.querySelector('p').textContent - 1);
            }
        });
    });
}
// add event listener to the button with id "return" to fade out the controller-section class div and fade in the button-container class div
document.getElementById('return').addEventListener('click', () => {
    shouldStop = true;
    stopAudio();
    resetTvScreen(); // change to reset tv screen general
    flushAll();
});


// FUNCTIONS TO CREATE save_as_playlist AND create_recommendation_playlist BUTTONS AND ADD EVENT LISTENERS TO THEM
// function genreRecommendPlaylist to create a buttton with id "genre-recommend-playlist" in the bottom half and add an event listener to the button to send a GET request to my flask app at route "/create_recommendation_playlist"
function genreRecommendPlaylist() {
    // add event listener to the button with id "genre-recommend-playlist" to send a GET request to my flask app at route "/create_recommendation_playlist"
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
    document.getElementById('genre-recommend-playlist').addEventListener('click', () => {
        fetch('/create_recommendation_playlist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Playlist created successfully!')
                    alert('Playlist created successfully!');
                // change the text content of the button to "Playlist Created"
                document.getElementById('genre-recommend-playlist').textContent = 'Playlist Created!';
                // disable the button
                document.getElementById('genre-recommend-playlist').disabled = true;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}
// Function topTracksPlaylist to create a button with id "top-tracks-playlist" in the bottom half and add an event listener to the button to send a GET request to my flask app at route "/save_as_playlist"
function topTracksPlaylist() {
    // add event listener to the button with id "top-tracks-playlist" to send a GET request to my flask app at route "/save_as_playlist"
    const bottomHalf = document.querySelector('.bottom-half');
    const controllerButton = document.createElement('button');
    controllerButton.classList.add('btn');
    controllerButton.classList.add('btn-primary');
    // add Id to the button
    controllerButton.setAttribute('id', 'top-tracks-playlist');
    controllerButton.textContent = 'Save as Playlist';
    bottomHalf.appendChild(controllerButton);
    let playlistRange = selectedValues.range;
    if (playlistRange === 'short_term') {
        playlistRange = '4 weeks Recapped';
    }
    else if (playlistRange === 'medium_term') {
        playlistRange = '6 months Recapped';
    }
    else {
        playlistRange = 'All time Recapped';
    }
    document.getElementById('top-tracks-playlist').addEventListener('click', () => {
        fetch('/save_as_playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({range: playlistRange}),  
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Playlist created successfully!')
                    alert('Playlist created successfully!');
                // change the text content of the button to "Playlist Created"
                document.getElementById('top-tracks-playlist').textContent = 'Playlist Created!';
                // disable the button
                document.getElementById('top-tracks-playlist').disabled = true;
            }
            )
            .catch((error) => {
                console.error('Error:', error);
            }
            );
    });
}


// FLUSHES (for resetting the state of the app)
// Function flush to flush the global arrays
function flushArrays() {
    tracks.length = 0;
    artists.length = 0;
    genres.length = 0;
}
// Function flushtvScreen to flush the tv-screen element of it's last child if and only if the child has one of the following classes: "track-container", "artist-container" or "genre-container"
function flushtvScreen() {
    const tvScreen = document.querySelector('.tv-screen');
    if (tvScreen.lastChild && tvScreen.lastChild.classList)
        if (tvScreen.lastChild.classList.contains('track-container') || tvScreen.lastChild.classList.contains('artist-container') || tvScreen.lastChild.classList.contains('genre-container')) {
            tvScreen.removeChild(tvScreen.lastChild);
        }
}
// Function flushControllerSection to flush the .top-half and .bottom-half sections of all their children
function flushControllerSection() {
    const topHalf = document.querySelector('.top-half');
    const bottomHalf = document.querySelector('.bottom-half');
    topHalf.innerHTML = '';
    bottomHalf.innerHTML = '';
}
// Function flushAll calling the flush function, flushtvScreen function and flushControllerSection function
function flushAll() {
    fadeControllerAddButtons();
    flushArrays();
    flushtvScreen();
    flushControllerSection();
}
// Function removeSelected to remove the selected class from the .custom-button class elements
function removeSelected() {
    const buttons = document.querySelectorAll('.custom-button');
    buttons.forEach((button) => {
        button.classList.remove('selected');
    });
    updateSliderValue(10);
}
// Function reset to call the removeSelected function and flushAll function
export function reset() {
    shouldStop = true;
    stopAudio();
    removeSelected();
    flushAll();
    resetTvScreen();
}

// Function resetTvScreen to reset the tv-screen element to it's original state
function resetTvScreen() {
    // works with functions resetTvScreenAfterArtist, reserTvScreenAfterTrack and resetTvScreenAfterGenre to reset the tv-screen element to it's original state, uses the selectedValues object to determine which function to call
    if (selectedValues.type === 'Tracks') {
        resetTvScreenAfterTrack();
    }
    else if (selectedValues.type === 'Artists') {
        resetTvScreenAfterArtist();
    }
    else {
        resetTvScreenAfterGenre();
    }
}

// Function resetTvScreenAfterArtist to reset the tv-screen element to it's original state after an artist has been displayed on it
function resetTvScreenAfterArtist() {
    const noise = document.querySelector('.noise');
    const nowDiv = document.querySelector('.now-div');
    const staticTop = document.querySelector('.static-top');
    const staticBottom = document.querySelector('.static-bottom');
    const nostalgicFilter = document.querySelector('.nostalgic-filter');
    const oldFilter = document.querySelector('.old-filter');
    noise.style.opacity = '1';
    // check if the nowDiv still exists before trying to change it's opacity
    if (nowDiv) nowDiv.style.opacity = '0';
    staticTop.style.display = 'none';
    staticBottom.style.display = 'none';
    nostalgicFilter.style.display = 'none';
    oldFilter.style.display = 'none';
    oldFilter.style.opacity = '0';
}

// STOP AND START AUDIO
// Function stopAudio to stop the audio from playing
function stopAudio() {
    if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
}

// Function startAudio to play an audio file
function startAudio(preview) {
    stopAudio();

    audio = new Audio(preview);
    audio.volume = 0.2;
    audio.play();
}

// DISPLAY FUNCTIONS
// Function displayArtists to display the artists on the element with id "tvscreen"
function displayArtists(artist) {
    displayArtist(artist);
}



// stand alone function displayArtist to display a single artist on the element with id "tvscreen" this function is going to be used in the displayArtists function, it takes the index of the artist in the artists array as an argument.
// it follows a sequence of steps to display the artist on the tv screen, first it appends the topDiv to the tv-screen element, fades out the div of class 'noise' over the course of 4s, as it starts fading out, fade in the now-div if the topDiv as been appended if not try again every second until it has been appended
function displayArtist(index) {
    shouldStop = false;
    const tvScreen = document.getElementsByClassName('tv-screen')[0].appendChild(artists[index].topDiv);
    const noise = document.querySelector('.noise');
    const nowDiv = document.querySelector('.now-div');
    if (shouldStop) return;
    noise.style.transition = 'all 4s ease-in-out';
    noise.style.opacity = '0';
    if (shouldStop) return;
    // add display to the "static-top" and "static-bottom" classes
    document.querySelector('.static-top').style.display = 'block';
    document.querySelector('.static-bottom').style.display = 'block';
    let nowDivInterval = setInterval(() => {
        if (shouldStop) {
            clearInterval(nowDivInterval);
            return;
        }
        if (tvScreen.contains(artists[index].topDiv)) {
            nowDiv.style.transition = 'all 1s ease-in-out';
            nowDiv.style.opacity = '1';
            const preview = artists[index].topDiv.getAttribute('data-preview');
            // play the track preview
            startAudio(preview);
            audio.addEventListener('ended', () => {
                if (shouldStop) return;
                resetTvScreenAfterArtist();
                flushtvScreen();    
                if (index + 1 >= artists.length) {
                    displayArtists(0);
                }
                else {
                    displayArtist(index + 1);
                }
            });
            let volume = 0.2;
            let volumeInterval = setInterval(() => {
                if (shouldStop) {
                    clearInterval(volumeInterval);
                    return;
                }
                if (volume < 1 && 1 - volume >= 0.1) {
                    volume += 0.1;
                    audio.volume = volume;
                }
                else {
                    clearInterval(volumeInterval);
                }
            }, 1000);
            document.querySelector('.nostalgic-filter').style.display = 'block';
            document.querySelector('.old-filter').style.display = 'block';
            if (selectedValues.range === 'short_term') {
                document.querySelector('.old-filter').style.opacity = '0.3';
            }
            else if (selectedValues.range === 'medium_term') {
                document.querySelector('.old-filter').style.opacity = '0.6';
            }
            else {
                document.querySelector('.old-filter').style.opacity = '1';
            }
            clearInterval(nowDivInterval);
        }
    }, 1000);
    // use the typeWriter function to type out the "Now Playing: {{ the track-name attribute of the artist container}} by {{ the data-name attribute of the artist container}}" on the nowDiv paragraph element and then 2s seconds after it's over fade out the nowDiv and fade in the track-div
    if (shouldStop) return;
    typeWriter(`Now Playing: ${artists[index].topDiv.getAttribute('track-name')} by ${artists[index].topDiv.getAttribute('data-name')}`, '.now-div p', 100);
    setTimeout(() => {
        if (shouldStop) return;
        nowDiv.style.transition = 'all 1s ease-in-out';
        nowDiv.style.opacity = '0';
        artists[index].topDiv.querySelector('.track-div').style.transition = 'all 1s ease-in-out';
        artists[index].topDiv.querySelector('.track-div').style.opacity = '1';
    }, 6000);
}

// testing Function displayTracks to display the tracks on the element with id "tvscreen"
function displayTracks() {
    const tvScreen = document.getElementsByClassName('tv-screen')[0].appendChild(tracks[2].topDiv);
    // play the track preview
    const preview = document.querySelector('.track-div').getAttribute('data-preview');
    const audio = new Audio(preview);
    audio.play();
}
// // // testing Function displayGenres to display the genres on the element with id "tvscreen"
// function displayGenres() {
//     const tvScreen = document.getElementsByClassName('tv-screen')[0].appendChild(genres[0].topDiv);
// 