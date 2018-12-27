import React from 'react';

class List extends React.Component {
    state = {
        data: []
    }

    render() {
        return (
            <div>
                <input 
                    onChange={this.handleChange} 
                    value={this.state.q} 
                    placeholder='Type query'
                />
                {this.renderList(this.state.data)}
            </div>
        )
    }

    renderList = data => {
        const { template } = this.props;

        if (!data.length) {
            return ('undefined' !== typeof this.state.q) 
                ? <div>No results</div> : null;
        }

        const list = data.map(template);
        
        return (
            <ul>
                {list}
            </ul>
        )
    }

    handleChange = event => this.fetch(event.target.value, 200)

    fetch = (query, timeout = 0) => {
        this.setState({
            q: query || undefined
        });

        clearTimeout(this.fetch.timeout);

        this.fetch.timeout = setTimeout(() => {
            this.state.q && fetch(`${this.props.url}?q=${this.state.q}`)
                .then(data => data.json())
                .then(({ data }) => this.setState({ data }))
        }, timeout);
    }
}

export default List;