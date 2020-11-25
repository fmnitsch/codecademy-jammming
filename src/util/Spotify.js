const clientId = '';
const redirectUri = 'http://localhost:3000';

let accessToken;
let userId;

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
                    return tracks;
                } else if (!jsonResponse) {
                    return [];
                }
            }
        } catch(error) {
            console.log(error);
        }
    },

    async getUserId() {
        let headers =  {'Authorization': 'Bearer ' + accessToken};
        try {
            const getUserId = await fetch(`https://api.spotify.com/v1/me`, {headers: headers});
            if (getUserId.ok) {
            const jsonResponse = await getUserId.json();
            userId = jsonResponse.id;
        }
        } catch(error) {
            console.log(error);
        }
    },

    async getUserPlaylists() {
        await Spotify.getUserId()
        let headers =  {'Authorization': 'Bearer ' + accessToken};
        try {
            const userPlaylists = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {headers: headers});
        if (userPlaylists.ok) {
            const jsonResponse = await userPlaylists.json();
            const playlistNames = jsonResponse.items.map(playlist => {
                return {
                  name: playlist.name,
                  id: playlist.id
                }
              });
            return playlistNames;

        }
        } catch(error) {
            console.log(error);
        }    
    },

    async getPlaylistTracks(id) {
        await Spotify.getUserId()
        let headers =  {'Authorization': 'Bearer ' + accessToken};
        try {
            const playlistTracks = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}/tracks`, {headers: headers})
            if (playlistTracks.ok) {
                const jsonResponse = await playlistTracks.json();
                return jsonResponse;
            }
        } catch(error) {
            console.log(error);
        }
    },

    async getPlaylistName(id) {
        await Spotify.getUserId()
        let headers =  {'Authorization': 'Bearer ' + accessToken};
        try {
            const playlist = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {headers: headers});
            
        if (playlist.ok) {
            const jsonResponse = await playlist.json();
            
            return jsonResponse.name;
        }
        } catch(error) {
            console.log(error);
        }    
    },

    async editPlaylistName(id, newPlaylistName) {
        await Spotify.getUserId()
        let headers =  {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        };
        try {
            const renamePlaylist = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({name: newPlaylistName})
            })
            if (renamePlaylist.ok){
                const jsonResponse = await renamePlaylist.json();
                return jsonResponse;
            }
        } catch(error) {
            console.log(error);
        }
    },

    async editPlaylistTracks(id, trackUris) {
        await Spotify.getUserId()
        let headers =  {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        };
        try {
            const replacePlaylistTracks = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({uris: trackUris})
            })
            if (replacePlaylistTracks.ok) {
                const jsonResponse = replacePlaylistTracks.json();
                return jsonResponse;
            }
        } catch(error) {
            console.log(error);
        }
    },

    async savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris) {
            return;
        }
        
        let accessToken = Spotify.getAccessToken();
        let headers =  {'Authorization': 'Bearer ' + accessToken};
        let playlistId;

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
            console.log(error);
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
            console.log(error);
        }

        }
    }



export default Spotify;
