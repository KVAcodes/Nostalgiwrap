document.addEventListener('DOMContentLoaded', function() {
    const video_dyn = document.getElementById('background-video');

    function setVideoSource() {
        if (window.innerWidth <= 650) {
            // Loads the mobile video source on smaller screens
            video_dyn.src = 'static/videos/Background_Animation_mobile.mp4';
            video_dyn.muted = true;
        } else {
            // Loads the default video source on larger screens
            video_dyn.src = 'static/videos/Background_Animation.mp4';
            video_dyn.muted = true;
        }
    }
    // Sets the initial video source
    setVideoSource();
    // Updates the video source when the window is resized
    window.addEventListener('resize', setVideoSource);   
    
    // Adds an event listener to restart the video when it ends
    const video = document.querySelector('video');
    video.addEventListener('ended', function () {
        if (video.muted !== false) {
            video.currentTime = 0;
            video.play();
        }
    });
});