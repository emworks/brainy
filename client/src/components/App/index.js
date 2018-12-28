import React from 'react';

import List from 'src/components/List';

import './index.scss';

const API_URL_SEARCH = 'api/search';

class App extends React.Component {
    render() {
        const template = item => <li key={item._id}>
            <a href={item.url} target='_blank'>{item.title}</a>
            <span dangerouslySetInnerHTML={{__html: item.description}}></span>
        </li>

        return (
            <React.Fragment>
                <List
                    url={API_URL_SEARCH}
                    template={template}
                />
            </React.Fragment>
        )
    }
}

export default App;