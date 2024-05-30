import { getTopTracks, searchWikipedia, getArtistImages } from "./api.js";

async function loadPage() {
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

        // Store the track preview URL
        const previewUrl = new URL(track.preview_url);
        previewUrl.searchParams.set('autoplay', '1'); // Add autoplay parameter

        // Set play button text to song and artist names
        const playButton = document.getElementById("play-button");
        playButton.textContent = `${track.name} by ${track.artist}`;
        
        // Set play button click event to show iframe and set src
        playButton.addEventListener("click", function () {
            const iframe = document.querySelector("#track-embed");
            if (iframe) {
                iframe.src = previewUrl.toString();
                iframe.style.display = "block";
                playButton.style.display = "none";
            }
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
    } catch (error) {
        console.error('Failed to load page:', error);
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
        }
    } else {
        console.warn(`No Wikipedia page found for ${searchTerm}`);
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

// Close modal on close button click
const closeModalButton = document.getElementById("closeModalButton");
if (closeModalButton) {
    closeModalButton.addEventListener("click", function () {
        const modal = document.getElementById("myModal");
        if (modal) {
            modal.style.display = "none";
        }
    });
}

// async function loadPage() {
//     try {
//         const tracks = await getTopTracks();

//         if (tracks.length === 0) {
//             throw new Error("No tracks available.");
//         }

//         // Select a random track from the top tracks
//         const track = tracks[Math.floor(Math.random() * tracks.length)];

//         // Get artist images
//         const artistImages = await getArtistImages(track.artistIds);

//         // Set background image using the first artist's image
//         if (artistImages.length > 0) {
//             setBackgroundImage(artistImages[0].image_url);
//         }

//         // Store the track preview URL
//         const previewUrl = new URL(track.preview_url);
//         previewUrl.searchParams.set('autoplay', '1'); // Add autoplay parameter

//         // Set play button text to song and artist names
//         const playButton = document.getElementById("play-button");
//         playButton.textContent = `${track.name} by ${track.artist}`;
        
//         // Set play button click event to show iframe and set src
//         playButton.addEventListener("click", function () {
//             const iframe = document.querySelector("#track-embed");
//             if (iframe) {
//                 iframe.src = previewUrl.toString();
//                 iframe.style.display = "block";
//                 playButton.style.display = "none";
//             }
//         });

//         // Display track information (name and artist)
//         displayTrackInfo(track);

//         // Display the track image
//         displayTrackImage(track);

//         // Search Wikipedia for information related to the track
//         const searchTerm = `${track.name} by ${track.artist}`;
//         const wikiData = await searchWikipedia(searchTerm);

//         // Display the first Wikipedia search result
//         displayWikiResult(wikiData, searchTerm);
//     } catch (error) {
//         console.error('Failed to load page:', error);
//     }
// }

// // Function to display track information
// function displayTrackInfo(track) {
//     const trackInfoContainer = document.querySelector("#track-info");
//     if (trackInfoContainer) {
//         trackInfoContainer.innerHTML = `
//             <h3>${track.name}</h3>
//             <p>by ${track.artist}</p>
//         `;
//     }
// }

// // Function to display the track image
// function displayTrackImage(track) {
//     const trackImageContainer = document.querySelector("#track-image");
//     if (trackImageContainer) {
//         const trackImage = document.createElement("img");
//         trackImage.src = track.image_url;
//         trackImage.alt = `${track.name} by ${track.artist}`;
//         trackImage.style.maxWidth = "100%";
//         trackImage.style.borderRadius = "12px";
//         trackImageContainer.appendChild(trackImage);
//     }
// }

// // Function to set the background image
// function setBackgroundImage(imageUrl) {
//     const backgroundImageDiv = document.querySelector("#background-image");
//     if (backgroundImageDiv) {
//         backgroundImageDiv.style.backgroundImage = `url(${imageUrl})`;
//     }
// }

// // Function to display Wikipedia search result
// function displayWikiResult(wikiData, searchTerm) {
//     if (wikiData.query && wikiData.query.pages) {
//         const pages = Object.values(wikiData.query.pages);
//         const wikiPageKey = pages[0].title.replace(/ /g, '_');
//         const wikiUrl = `https://en.wikipedia.org/wiki/${wikiPageKey}`;

//         const wikiButton = document.createElement("button");
//         wikiButton.setAttribute('id', 'wikiBtn');
//         wikiButton.innerHTML = "Learn More";
//         wikiButton.addEventListener("click", () => {
//             window.open(wikiUrl, "_blank");
//         });

//         const wikiButtonContainer = document.querySelector("#wikiButtonContainer");
//         if (wikiButtonContainer) {
//             wikiButtonContainer.appendChild(wikiButton);
//         }
//     } else {
//         console.warn(`No Wikipedia page found for ${searchTerm}`);
//     }
// }

// // Load page content when the script runs
// loadPage();

// // Update current date and time every second
// function updateDateTime() {
//     const currentDate = dayjs().format("MMMM D, YYYY h:mm A");
//     const currentDayElement = document.getElementById("current-day");
//     if (currentDayElement) {
//         currentDayElement.textContent = currentDate;
//     }
// }
// updateDateTime();
// setInterval(updateDateTime, 1000);

// // Display modal on button click
// document.querySelectorAll(".tooltip").forEach(button => {
//     button.addEventListener("click", function () {
//         const modal = document.getElementById("myModal");
//         if (modal) {
//             modal.style.display = "block";
//         }
//     });
// });

// // Close modal on close button click
// const closeModalButton = document.getElementById("closeModalButton");
// if (closeModalButton) {
//     closeModalButton.addEventListener("click", function () {
//         const modal = document.getElementById("myModal");
//         if (modal) {
//             modal.style.display = "none";
//         }
//     });
// }