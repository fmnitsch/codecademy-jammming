import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {term: ''}
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term)
    }

    handleTermChange(e) {
        this.setState({term: e.target.value})
    }

    onKeyUp(e) {
        if (e.charCode === 13) {
            this.search();
        }
    }

    render() {
        return (
            <div className="SearchBar">
                <input 
                    onChange={this.handleTermChange} 
                    placeholder="Enter A Song, Album, or Artist"
                    onKeyPress={this.onKeyUp} />
                <button className="SearchButton" onClick={this.search} onKeyPress={this.search}>SEARCH</button>
            </div>
        )
    }
}