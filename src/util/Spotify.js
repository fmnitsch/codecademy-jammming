const clientId = '45c235e6b69b4bd08fdd78533f6f1841';
const redirectUri = 'http://localhost:3000';

let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = expiresInMatch[1];

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        }

        if (!accessTokenMatch || !expiresInMatch) {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }
    },

    async search(term) {
        Spotify.getAccessToken();
        try {
            const headers = {'Authorization': 'Bearer ' + accessToken}
            const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: headers});
            if (response.ok) {
                const jsonResponse = await response.json();
                if (jsonResponse) {
                    const tracks = jsonResponse.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }))
                    console.log(tracks);
                    return tracks;
                } else if (!jsonResponse) {
                    return [];
                }
            }
        } catch(error) {
            alert(error);
        }
    },

    async savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris) {
            return;
        }
        
        let accessToken = Spotify.getAccessToken();
        let headers =  {'Authorization': 'Bearer ' + accessToken};
        let userId;
        let playlistId;

        try {
            const getUserId = await fetch(`https://api.spotify.com/v1/me`, {headers: headers});
            if (getUserId.ok) {
            const jsonResponse = await getUserId.json();
            userId = jsonResponse.id;
            console.log(userId);
        }
        } catch(error) {
                alert(error);
        }

        try {
            const newPlaylist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({name: playlistName})
            })
            if (newPlaylist.ok) {
                const jsonResponse = await newPlaylist.json();
                playlistId = jsonResponse.id;
                console.log(playlistId);
            }
        } catch(error) {
            alert(error);
        }

        try {
            const addTracks = await fetch (`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({uris: trackUris})
            })
            if (addTracks.ok) {
                const jsonResponse = await addTracks.json();
                console.log(jsonResponse);
                return jsonResponse;
            }
        } catch(error) {
            alert(error);
        }

        }
    }



export default Spotify;
