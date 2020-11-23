import './App.css';
import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
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

  async savePlaylist() {
    // console.log(this.state.playlistTracks);
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    const results = await Spotify.savePlaylist(this.state.playlistName, trackUris);
    console.log(results);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    })
    return results;
    // const trackUris = this.state.playlistTracks.map(track => track.uri)
    // return trackUris;
  }

  async search(term) {
    const results = await Spotify.search(term);
    console.log(results);
    this.setState({searchResults: results});
  }

  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
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
            onSave={this.savePlaylist} />
        </div>
      </div>
    </div>
    );
  }
}

export default App;
