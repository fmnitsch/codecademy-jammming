import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import UserPlaylists from '../UserPlaylists/UserPlaylists';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistId: '',
      playlistTracks: [],
      currentPlaylists: [],
      currentPlaylistLoaded: false,
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
    this.showPlaylist = this.showPlaylist.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.editPlaylistName = this.editPlaylistName.bind(this);
    this.editPlaylistTracks = this.editPlaylistTracks.bind(this);
  }

  addTrack(track) {
    let currentTracks = this.state.playlistTracks;
    if(!currentTracks.find(inPlaylist => inPlaylist.id === track.id)) {
      currentTracks.push(track);
      this.setState({playlistTracks: currentTracks});
    }
  }

  removeTrack(track) {
    let currentTracks = this.state.playlistTracks;
    let newTracks = currentTracks.filter(trackIndex => trackIndex.id !== track.id);
    this.setState({playlistTracks: newTracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  cancelEdit() {
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    })
  }

  async savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    const results = await Spotify.savePlaylist(this.state.playlistName, trackUris);
    
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    })
    return results;
  }

  async getUserPlaylists() {
    const playlists = await Spotify.getUserPlaylists();
    this.setState({
      currentPlaylists: playlists,
    });
  }

  async showPlaylist(id) {
    let trackArray = []
    const playlist = await Spotify.getPlaylistTracks(id);
    const name = await Spotify.getPlaylistName(id);

    for (let i=0; i < playlist.items.length; i++){
      let track = playlist.items[i].track;
      trackArray.push(track);
    }
    const trackDetailsAray = trackArray.map(track => {
      return {
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        id: track.id,
        uri: track.uri
      }
    })

    this.setState({
      playlistTracks: trackDetailsAray,
      playlistName: name,
      currentPlaylistLoaded: true,
      playlistId: id
    })

    
  }

  async editPlaylistName() {
    const id = this.state.playlistId;
    const newName = this.state.playlistName;
    
    const changeName = await Spotify.editPlaylistName(id, newName);

    return changeName;
  }

  async editPlaylistTracks() {
    await this.editPlaylistName();
    
    const id = this.state.playlistId;
    const trackUris = this.state.playlistTracks.map(track => track.uri);

    const changeTracks = await Spotify.editPlaylistTracks(id, trackUris);

    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    })

    return changeTracks;
  }

  async search(term) {
    const results = await Spotify.search(term);
    this.setState({searchResults: results});
  }

  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
    window.addEventListener('load', () => {this.getUserPlaylists()});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar
          onSearch={this.search} />
        <div className="App-playlist">
          <SearchResults 
            searchResults={this.state.searchResults}
            onAdd={this.addTrack} />
            <Playlist 
            playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
            onUpdate={this.editPlaylistTracks}
            onCancel={this.cancelEdit}
            currentLoaded={this.state.currentPlaylistLoaded} />
          <UserPlaylists
            playlists={this.state.currentPlaylists}
            onSelect={this.showPlaylist} />
        </div>
      </div>
    </div>
    );
  }
}

export default App;
