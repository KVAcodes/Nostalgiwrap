// function to create the typing effect
function typeWriter(text, elementClass, speed) {
    const textElement = document.querySelector(elementClass);
    let i = 0;

    function type() {
        if (i < text.length) {
            textElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Typing is complete, so add the button here
            const button = document.createElement('a');
            button.classList.add('btn', 'btn-primary', 'retro-button');
            button.href = '/login';

            button.innerHTML = 'Login to <img src="static/images/Spotify_Logo_CMYK_White.png" alt="Spotify Logo" class="spotify-icon">';

            textElement.parentElement.appendChild(button);
            button.style.display = 'block';

            // add any additional styling or classes to the button here
            
            // add event listeners or functionality to the button here
        }
    }
    type(); // Start the typing effect
}

document.addEventListener('DOMContentLoaded', function() {
    // Call the function with your desired text, element class, and typing speed
    typeWriter("Welcome to NostalgiWrap, where I turn your musical memories into a delectable journey. Unwrap the past and savor the sweet melodies of your life, as if nostalgia were a stick sweet. Log in to rediscover your Spotify journey through time.", ".welcome-text p", 20);  
});