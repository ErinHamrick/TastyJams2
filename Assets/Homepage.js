import { getTopTracks, searchWikipedia, getArtistImages } from "./api.js";

async function loadPage() {
    const spinner = document.getElementById("loading-spinner");
    const playButton = document.getElementById("play-button");
    try {
        const tracks = await getTopTracks();

        if (tracks.length === 0) {
            throw new Error("No tracks available.");
        }

        let track;
        let attempts = 0;
        const maxAttempts = 10; // Maximum number of attempts to find a track with a valid preview URL

        // Loop to find a track with a valid preview URL
        while (attempts < maxAttempts) {
            track = tracks[Math.floor(Math.random() * tracks.length)];
            if (track.preview_url) {
                break;
            }
            attempts++;
        }

        if (!track.preview_url) {
            throw new Error("No tracks with a valid preview URL found.");
        }

        // Get artist images
        const artistImages = await getArtistImages(track.artistIds);

        // Set background image using the first artist's image
        if (artistImages.length > 0) {
            setBackgroundImage(artistImages[0].image_url);
        }

        // Set play button text to song and artist names
        playButton.textContent = `${track.name} by ${track.artist}`;
        
        // Create an audio element
        const audio = new Audio(track.preview_url);

        // Set play button click event to play the audio
        playButton.addEventListener("click", function () {
            audio.play();
            playButton.style.display = "none";
        });

        // Display track information (name and artist)
        displayTrackInfo(track);

        // Display the track image
        displayTrackImage(track);

        // Search Wikipedia for information related to the artist
        const searchTerm = track.artist;
        const wikiData = await searchWikipedia(searchTerm);

        // Display the first Wikipedia search result
        displayWikiResult(wikiData, searchTerm);

        // Hide spinner and show play button after everything is loaded
        if (spinner) spinner.style.display = "none";
        if (playButton) playButton.style.display = "block";
    } catch (error) {
        console.error('Failed to load page:', error);
        if (spinner) spinner.style.display = "none";
    }
}

// Function to display track information
function displayTrackInfo(track) {
    const trackInfoContainer = document.querySelector("#track-info");
    if (trackInfoContainer) {
        trackInfoContainer.innerHTML = `
            <h3>${track.name}</h3>
            <p>by ${track.artist}</p>
        `;
    }
}

// Function to display the track image
function displayTrackImage(track) {
    const trackImageContainer = document.querySelector("#track-image");
    if (trackImageContainer) {
        const trackImage = document.createElement("img");
        trackImage.src = track.image_url;
        trackImage.alt = `${track.name} by ${track.artist}`;
        trackImage.style.maxWidth = "100%";
        trackImage.style.borderRadius = "12px";
        trackImageContainer.appendChild(trackImage);
    }
}

// Function to set the background image
function setBackgroundImage(imageUrl) {
    const backgroundImageDiv = document.querySelector("#background-image");
    if (backgroundImageDiv) {
        backgroundImageDiv.style.backgroundImage = `url(${imageUrl})`;
    }
}

// Function to display Wikipedia search result
function displayWikiResult(wikiData, searchTerm) {
    console.log("Wikipedia Data:", wikiData); // Debugging

    let wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(searchTerm)}`;
    let buttonText = "Search Wikipedia";

    if (wikiData.query && wikiData.query.pages) {
        const pages = Object.values(wikiData.query.pages);

        // Find the most relevant page based on title matching
        const relevantPage = pages.find(page => 
            page.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        console.log("Relevant Wikipedia Page:", relevantPage); // Debugging

        if (relevantPage) {
            const wikiPageKey = relevantPage.title.replace(/ /g, '_');
            wikiUrl = `https://en.wikipedia.org/wiki/${wikiPageKey}`;
            buttonText = "Learn More";
        } else {
            console.warn(`No relevant Wikipedia page found for ${searchTerm}`);
            return; // Exit the function if no relevant page is found
        }
    } else {
        console.warn(`No Wikipedia page found for ${searchTerm}`);
        return; // Exit the function if no pages are found
    }

    const wikiButton = document.createElement("button");
    wikiButton.setAttribute('id', 'wikiBtn');
    wikiButton.innerHTML = buttonText;
    wikiButton.addEventListener("click", () => {
        window.open(wikiUrl, "_blank");
    });

    const wikiButtonContainer = document.querySelector("#wikiButtonContainer");
    console.log("Wiki Button Container:", wikiButtonContainer); // Debugging

    if (wikiButtonContainer) {
        wikiButtonContainer.appendChild(wikiButton);
        console.log("Wiki Button Appended"); // Debugging
    } else {
        console.warn("Wiki Button Container not found");
    }
}

// Load page content when the script runs
loadPage();

// Update current date and time every second
function updateDateTime() {
    const currentDate = dayjs().format("MMMM D, YYYY h:mm A");
    const currentDayElement = document.getElementById("current-day");
    if (currentDayElement) {
        currentDayElement.textContent = currentDate;
    }
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Display modal on button click
document.querySelectorAll(".tooltip").forEach(button => {
    button.addEventListener("click", function () {
        const modal = document.getElementById("myModal");
        if (modal) {
            modal.style.display = "block";
        }
    });
});

// Close modal on close button click and reload page
const closeModalButton = document.getElementById("closeModalButton");
if (closeModalButton) {
    closeModalButton.addEventListener("click", function () {
        const modal = document.getElementById("myModal");
        if (modal) {
            modal.style.display = "none";
        }
        location.reload(); // Reload the page
    });
}

