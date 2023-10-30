// JavaScript to control the modal
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModalButton");
const modal = document.getElementById("myModal");
const backgroundVideo = document.getElementById("background-video");

// Function to gradually return the video to its original state
function returnVideoToOriginalState() {
    const originalPlaybackRate = 1; // Your original playback rate (normal speed)
    const playbackIncrement = 0.6; // Adjust the increment as needed
    const originalVolume = 0.0; // Your original volume level
    const volumeIncrement = 0.05; // Adjust the increment as needed

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
    backgroundVideo.volume = 0.5; // You can adjust the volume as needed  
    backgroundVideo.muted = false;
    backgroundVideo.play();

    // Open the modal after the video finishes (you can adjust the time accordingly)
    setTimeout(() => {
        openModal();
    }, backgroundVideo.duration * 100);
}
openModalButton.addEventListener("click", playVideoWithSound);

// Function to close the modal
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
    backgroundVideo.play();
    backgroundVideo.muted = true;
    backgroundVideo.playbackRate = 1;
    backgroundVideo.currentTime = 0;
});

// Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});