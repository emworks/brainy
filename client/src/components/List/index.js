import React from 'react';

import './index.scss';

class List extends React.Component {
    state = {
        data: []
    }

    render() {
        const { q, data, isLoading } = this.state;

        const placeholder = 'Чему бы вы хотели научиться?';

        if (!q) {
            return (
                <div className={'search-landing preload' + (isLoading ? ' unloaded' : '')}>
                    <form onSubmit={this.handleSubmit}>
                        <div className='wrapper'>
                            <input 
                                name='query'
                                className='input' 
                                placeholder={placeholder} 
                            />
                            <button className='button'>Найти</button>
                        </div>
                    </form>
                </div>
            )
        }

        const counter = data.length ? (<div className='search-counter'>
            Найдено: {data.length}
        </div>) : null;

        return (
            <div className='search-list'>
                <div className='input-wrapper'>
                    <div className='wrapper'>
                        <form onSubmit={this.handleSubmit}>
                            <div className='wrapper'>
                                <input 
                                    name='query'
                                    className='input'
                                    value={q} 
                                    placeholder={placeholder}
                                />
                                <button className='button'>Найти</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={'search-results preload' + (isLoading ? ' unloaded' : '')}>
                    <div className='wrapper-wide'>
                        {counter}
                        {this.renderList(data)}
                    </div>
                </div>
            </div>
        )
    }

    renderList = data => {
        const { template } = this.props;

        if (!data.length) {
            return ('undefined' !== typeof this.state.q) 
                ? 'Ничего не найдено' : null;
        }

        const list = data.map(template);
        
        return (
            <ul>
                {list}
            </ul>
        )
    }

    handleSubmit = event => {
        event.preventDefault();
        
        this.setState({ isLoading: true });

        const data = new FormData(event.target);
        this.fetch(data.get('query'));
    }

    handleChange = event => this.fetch(event.target.value, 500)

    fetch = (query, timeout = 0) => {
        if (timeout) {
            this.setState({
                q: query || undefined
            });
        }

        clearTimeout(this.fetch.timeout);

        this.fetch.timeout = setTimeout(() => {
            if (query) {
                this.setState({ isLoading: true });
                fetch(`${this.props.url}?q=${query}`)
                    .then(data => data.json())
                    .then(({ data }) => this.setState({ 
                        data, 
                        isLoading: false,
                        q: query
                    }))
            }
        }, timeout);
    }
}

export default List;