import React from 'react';

import List from 'src/components/List';

const API_URL_SEARCH = 'api/search';

class App extends React.Component {
    render() {
        const template = item => <li key={item._id}>
            <a href={item.url} target='_blank'>{item.title}</a>
        </li>

        return (
            <div>
                <List
                    url={API_URL_SEARCH}
                    template={template}
                />
            </div>
        )
    }
}

export default App;