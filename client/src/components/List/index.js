import React from 'react';
import Clipboard from 'react-clipboard.js';

import './index.scss';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
        this.size = 100;
    }

    state = {
        data: [],
        selected: new Set()
    }

    componentDidMount() {
        if (this.props.q) {
            this.fetch(this.props.q);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.q) {
            const { protocol, host, pathname } = window.location;
            const path = `${protocol}//${host}${pathname}?q=${this.state.q}`;
            window.history.pushState({ path }, '', path);
        }
    }

    render() {
        const { q, data, isLoading, selected } = this.state;

        const placeholder = 'Что вы хотите изучить?';

        if (!q) {
            return (
                <div className={'search-landing preload' + (isLoading ? ' unloaded' : '')}>
                    <form onSubmit={this.handleSubmit} autoComplete='off'>
                        <div className='wrapper'>
                            <a className='logo' href='/' />
                            <input 
                                name='query'
                                className='input' 
                                placeholder={placeholder} 
                                autoFocus={true}
                            />
                            <button className='button button-search' />
                        </div>
                    </form>
                    <div className='contact-link'>
                        <a href='mailto:hello@mybrainy.ru' title='Brainy'>
                            brainy
                        </a>
                    </div>
                </div>
            )
        }

        const counter = data.length ? (<div className='tip'>
            Найдено{data.length === this.size ? ` более ${this.size}` : `: ${data.length}`}
        </div>) : null;

        return (
            <div className='search-list'>
                <div className='input-wrapper fixed'>
                    <form onSubmit={this.handleSubmit} autoComplete='off'>
                        <div className='wrapper'>
                            <input 
                                name='query'
                                className='input'
                                placeholder={placeholder}
                                defaultValue={q}
                            />
                            <button className='button button-search' />
                        </div>
                    </form>
                </div>
                <div ref={this.listRef}
                    className={
                        'search-results preload' + 
                        (isLoading ? ' unloaded' : '') +
                        (selected.size ? ' with-actions' : '')
                    }>
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
        const { q, selected } = this.state;

        if (!data.length) {
            return ('undefined' !== typeof q) 
                ? 'Ничего не найдено' : null;
        }

        const list = data.map(template(this.handleSelect.bind(this), this.state.selected));

        const exportBtn = selected.size > 1 ? <button className='button' type='submit'>
            Сравнить
        </button> : null;
        
        return (
            <form action='export' target='_blank' onReset={this.handleReset}>
                <div className='list-actions fixed'>
                    <div className='wrapper-wide'>
                        <Clipboard className='button' type='reset' data-clipboard-text={this.getSelectedUrls()}>
                            Копировать
                        </Clipboard>
                        {exportBtn}
                        <span className='tip'>
                            {selected.size}
                        </span>
                        <button className='button button-reset' type='reset' title='Сбросить'>
                            &#10006;
                        </button>
                    </div>
                </div>
                <input name='q' type='hidden' value={q} />
                <input name='client' type='hidden' value={this.getClient()} />
                <ul>
                    {list}
                </ul>
            </form>
        )
    }

    handleSelect = event => {
        let { selected } = this.state;

        if (event.target.checked) {
            selected.add(event.target.value);
        } else {
            selected.delete(event.target.value);
        }

        this.setState({ selected });
    }

    handleSubmit = event => {
        event.preventDefault();
        
        const data = new FormData(event.target);

        if (!data.get('query')) {
            return;
        }

        this.setState({ isLoading: true });
        this.fetch(data.get('query'));
    }

    handleChange = event => this.fetch(event.target.value, 500)

    handleReset = event => {
        this.setState({ selected: new Set() });
    }

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
                fetch(`${this.props.url}?q=${query}&client=${this.getClient()}&size=${this.size}`)
                    .then(data => data.json())
                    .then(({ data }) => this.setState({ 
                        data, 
                        isLoading: false,
                        q: query,
                        selected: new Set()
                    }))
                    .then(() => this.listRef.current.scrollTop = 0)
            }
        }, timeout);
    }

    getClient = () => isMobile() ? 'mobile' : 'desktop';

    getSelectedUrls = () => this.state.data.reduce((memo, { _id, title, url }) => {
        if (this.state.selected.has(_id)) {
            memo.push(`${title}\n${url}`);
        }
        return memo;
    }, []).join('\n\n');
}

function isMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

export default List;