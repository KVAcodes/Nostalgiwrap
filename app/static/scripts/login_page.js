// function to create the typing effect
function typeWriter(text, elementClass, speed) {
    const textElement = document.querySelector(elementClass);
    let i = 0;
    let isTyping = true;
    const button = document.createElement('a');
    button.classList.add('btn', 'btn-primary', 'retro-button');
    button.href = '/login';
    button.innerHTML = 'Login to <img src="static/images/Spotify_Logo_CMYK_White.png" alt="Spotify Logo" class="spotify-icon">';
    button.style.display = 'none';
    textElement.parentElement.appendChild(button);

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

document.addEventListener('DOMContentLoaded', function() {
    // Call the function with your desired text, element class, and typing speed
    typeWriter("Welcome to NostalgiWrap, where I turn your musical memories into a delectable journey. Unwrap the past and savor the sweet melodies of your life, as if nostalgia were a stick sweet. Log in to rediscover your Spotify journey through time.", ".welcome-text p", 20);  
});