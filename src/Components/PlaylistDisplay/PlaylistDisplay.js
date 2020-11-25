import React from 'react';
import './PlaylistDisplay.css';

class PlaylistDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
   
    handleClick() {
        this.props.onSelect(this.props.id);
    }

    render() {
        return (
            <div className="Playlists" onClick={this.handleClick}>
            <div className="Playlists-information">
                <h3>{this.props.playlistName}</h3>
            </div>
            </div>
        )
    }
}

export default PlaylistDisplay;
