import React from 'react';
import PlaylistDisplay from '../PlaylistDisplay/PlaylistDisplay';
import './UserPlaylists.css';


class UserPlaylists extends React.Component { 

    render() {
        return (
            <div className="UserPlaylists">
            <h2>Your Current Playlisits</h2>
            {this.props.playlists.map(playlist => <PlaylistDisplay playlistName={playlist.name} id= {playlist.id} key={playlist.id} onSelect={this.props.onSelect}/>)  
            }
        </div>
        )
    }
}

export default UserPlaylists;