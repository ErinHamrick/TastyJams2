const CLIENT_ID = 'ab885e883cff4c34991299b843985e8c';
const CLIENT_SECRET = 'e8e7b34ec22b46b5b3c838de82e5315f';
const BASE_URL = 'https://api.spotify.com/v1';

// Function to fetch top 100 tracks from a Spotify playlist
export async function getTopTracks() {
    const url = `${BASE_URL}/playlists/6UeSakyzhiEt4NB3UAd6NQ/tracks`;
    const options = {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.items.map((item) => ({
            name: item.track.name,
            artist: item.track.artists.map((artist) => artist.name).join(', '),
            artistIds: item.track.artists.map((artist) => artist.id),
            id: item.track.id,
            preview_url: item.track.preview_url,
            image_url:
                item.track.album.images.length > 0
                    ? item.track.album.images[0].url
                    : null,
        }));
    } catch (error) {
        console.error('Failed to fetch top tracks:', error);
        return [];
    }
}

export async function getArtistImages(artistIds) {
    const url = `${BASE_URL}/artists?ids=${artistIds.join(',')}`;
    const options = {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.artists.map((artist) => ({
            name: artist.name,
            image_url: artist.images.length > 0 ? artist.images[0].url : null,
        }));
    } catch (error) {
        console.error('Failed to fetch artist images:', error);
        return [];
    }
}

export async function searchWikipedia(searchTerm) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=10&gsrsearch=${encodeURIComponent(
        searchTerm
    )}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to search Wikipedia:', error);
        return [];
    }
}

// Helper function to fetch access token for Spotify API
async function getAccessToken() {
    const url = 'https://accounts.spotify.com/api/token';
    const body = 'grant_type=client_credentials';
    const headers = {
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
        const response = await fetch(url, { method: 'POST', body, headers });
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(
                `Failed to fetch access token: ${
                    errorDetails.error_description || response.status
                }`
            );
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Failed to fetch access token:', error);
        return null;
    }
}
