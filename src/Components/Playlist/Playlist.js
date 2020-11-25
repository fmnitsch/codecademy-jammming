import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';


class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.renderAction = this.renderAction.bind(this);
    }

    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }

    renderAction() {
        if (this.props.currentLoaded) {
            return (
                <div className='button-container'>
                    <button className="Playlist-save" onClick={this.props.onCancel}>CANCEL</button>
                    <button className="Playlist-save" onClick={this.props.onUpdate}>UPDATE ON SPOTIFY</button>
                </div>    
            )
        } else {
            return (
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            )
        }
    }

    render() {
        return (
            <div className="Playlist">
                <input 
                    value={this.props.playlistName}
                    onChange={this.handleNameChange} />
                <TrackList 
                    tracks={this.props.playlistTracks}
                    onRemove={this.props.onRemove}
                    isRemoval={true} />
                {this.renderAction()}
            </div>
        )
    }
}

export default Playlist;