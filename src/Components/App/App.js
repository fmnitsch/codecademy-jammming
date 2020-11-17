import './App.css';
import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {
          name: 'Cool song',
          artist: 'Weird Guy',
          album: 'Weird Cool Things',
          id: 'ID1',
        },
        {
          name: 'Crazy song',
          artist: 'Normal Guy',
          album: 'Normal Lazy Things',
          id: 'ID2',
        }
      ],
      playlistName: 'The Greatest Playlist',
      playlistTracks: [
        {
          name: 'Other song',
          artist: 'Weird Guy',
          album: 'Weird Cool Things',
          id: 'ID1',
        },
        {
          name: 'Other Other song',
          artist: 'Normal Guy',
          album: 'Normal Lazy Things',
          id: 'ID2',
        }
      ]
    }
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar />
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} />
          <Playlist 
            playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks} />
        </div>
      </div>
    </div>
    );
  }
}

export default App;
