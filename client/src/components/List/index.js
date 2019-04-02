import React from 'react';

import './index.scss';

class List extends React.Component {
    state = {
        data: []
    }

    render() {
        const counter = this.state.data.length ? (<div className='search-counter'>
            Total: {this.state.data.length}
        </div>) : null;

        return (
            <div className='search-list'>
                <div className='input-wrapper'>
                    <div className='wrapper'>
                        <input 
                            onChange={this.handleChange} 
                            value={this.state.q} 
                            placeholder='Чему бы вы хотели научиться?'
                        />
                    </div>
                </div>
                <div className={'search-results' + (this.state.isLoading ? ' unloaded' : '')}>
                    <div className='wrapper-wide'>
                        {counter}
                        {this.renderList(this.state.data)}
                    </div>
                </div>
            </div>
        )
    }

    renderList = data => {
        const { template } = this.props;

        if (!data.length) {
            return ('undefined' !== typeof this.state.q) 
                ? 'No results' : null;
        }

        const list = data.map(template);
        
        return (
            <ul>
                {list}
            </ul>
        )
    }

    handleChange = event => this.fetch(event.target.value, 500)

    fetch = (query, timeout = 0) => {
        this.setState({
            q: query || undefined
        });

        clearTimeout(this.fetch.timeout);

        this.fetch.timeout = setTimeout(() => {
            if (this.state.q) {
                this.setState({ isLoading: true });
                fetch(`${this.props.url}?q=${this.state.q}`)
                    .then(data => data.json())
                    .then(({ data }) => this.setState({ data, isLoading: false }))
            }
        }, timeout);
    }
}

export default List;