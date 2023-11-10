// import the reset function for the retrieve_display.js module in the same directory
import { reset } from './retrieve_display.js';

// function to create the typing effect
export function typeWriter(text, elementClass, speed) {
    const textElement = document.querySelector(elementClass);
    const button = document.querySelector('#openModalButton');
    let i = 0;
    let isTyping = true;

    function type() {
        if (i < text.length && isTyping) {
            textElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Typing is complete, so add the button here
            button.style.display = 'block';

            // add any additional styling or classes to the button here
            
            // add event listeners or functionality to the button here
        }
    }
    type(); // Start the typing effect
    document.addEventListener('click', function() {
        // Set isTyping to false to stop the typing process
        isTyping = false;
        // To Display the full text immediately
        textElement.innerHTML = text;
        button.style.display = 'block';
      });
}

// JavaScript to control the modal
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModalButton");
const modal = document.getElementById("myModal");
const backgroundVideo = document.getElementById("background-video");

const video = document.getElementById('background-video');

// Function to apply a blur filter
function applyBlur() {
    video.style.filter = 'blur(2px)'; // blur value
    video.style.filter = 'sepia(0.5)';
    video.style.transition = 'all 1s ease-in-out'; // transition
}
// Function to remove the blur filter
function removeBlur() {
    video.style.filter = 'none';
}

// Function to gradually return the video to its original state
function returnVideoToOriginalState() {
    let playback_diff = 0;
    let volume_diff = 0;
    const originalPlaybackRate = 1; //  original playback rate (normal speed)
    const playbackIncrement = 0.6; // increment to adjust the playback rate as needed
    const originalVolume = 0.0; // original volume level
    const volumeIncrement = 0.05; // increment to adjust the volume as needed

    const returnInterval = setInterval(() => {
        playback_diff = backgroundVideo.playbackRate - originalPlaybackRate;
        volume_diff = backgroundVideo.volume - originalVolume;
        // Gradually decrease the playback rate
        if (playback_diff >= 0.6) {
            backgroundVideo.playbackRate -= playbackIncrement;
        }
        // Gradually decrease the volume
        if (volume_diff >= 0.05) {
            backgroundVideo.volume -= volumeIncrement;
        }

        // Check if the video has returned to the original state
        if (playback_diff < 0.6 && volume_diff < 0.05) {
            removeBlur(); // Call this function to remove the blur filter
            clearInterval(returnInterval);
        }
    }, 700); // Interval time in milliseconds
}

// Function to open the modal
function openModal() {
    returnVideoToOriginalState(); // Call this function to return video to the original state
    modal.style.display = "block";
}

// Function to play the video with sound and open the modal
function playVideoWithSound() {
    backgroundVideo.playbackRate = 7; // You can adjust the playback rate as needed
    applyBlur(); // Call this function to apply a blur filter to the video
    backgroundVideo.volume = 0.5; // You can adjust the volume as needed  
    backgroundVideo.muted = false;
    backgroundVideo.play();

    // Open the modal after the video finishes (you can adjust the time accordingly)
    setTimeout(() => {
        openModal();
        typeWriter(`We've arrived! ${user}, let's delve into the history of you`, "#on-arrival", 20)
        setTimeout(() => {
            document.getElementById("on-arrival").style.display = "none";
        }
        , 5000);
    }, backgroundVideo.duration * 150);
}
openModalButton.addEventListener("click", playVideoWithSound);

// Function to close the modal
closeModalButton.addEventListener("click", () => {
    reset(); // Call the reset function to reset the display
    modal.style.display = "none";
    removeBlur(); // Call this function to remove the blur filter
    backgroundVideo.play();
    backgroundVideo.muted = true;
    backgroundVideo.playbackRate = 1;
    backgroundVideo.currentTime = 0;
});

// Close the modal if the user presses the escape key
window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        reset(); // Call the reset function to reset the display
        modal.style.display = "none";
        removeBlur(); // Call this function to remove the blur filter
        backgroundVideo.play();
        backgroundVideo.muted = true;
        backgroundVideo.playbackRate = 1;
        backgroundVideo.currentTime = 0;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // function to create the typing effect
    typeWriter(`Sit back ${user}, relax, and embark on this nostalgic adventure as we revisit the moments that shaped your musical journey. Get ready to relive the magic of the past!`, ".main-text p", 20);
});