import './charList.scss';
import { Component, createRef } from 'react';
import MarvelServer from '../../API/server';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

class CharList extends Component {
    state = {
        chars: [],
        offset: 0,
        loading: true,
        error: false,
        end: false
    }

    componentDidMount() {
        this.getSomeChars()
    }

    marvelServer = new MarvelServer()

    onCharsLoaded = (newData) => {
        let ended = false
        if(newData.length < 9){
            ended = true
        } 
        this.setState(({ offset, chars }) => ({
            chars: [...chars, ...newData],
            offset: offset + 9,
            loading: false,
            end: ended
        }));
    }

    setLoading = () => {
        this.setState({ loading: true })
    }

    onCharsError = () => {
        this.setState({ error: true, loading: false })
    }

    getSomeChars = (offset) => {
        this.setLoading()

        this.marvelServer.getAllChar(offset)
            .then(this.onCharsLoaded)
            .catch(this.onCharsError)
    }

    render() {
        const { chars, loading, error, offset, end } = this.state,
            { selectedId, setSelectedId } = this.props,
            spinner = loading ? <Spinner /> : null,
            content = error ? <Error /> : <View {...{ chars, selectedId, setSelectedId }} />;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {content}
                </ul>
                    {spinner}
                <button style={{"display": end ? "none" : "block"}}  onClick={() => this.getSomeChars(offset)} className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

class View extends Component {
    constructor(props) {
        super(props);
        this.activeRef = createRef();
    }

    handleClick = (char, event) => {
        if (this.activeRef.current) {
            this.activeRef.current.classList.remove('char__item_selected');
        }
        this.activeRef.current = event.currentTarget;
        this.activeRef.current.classList.add('char__item_selected');
        this.props.setSelectedId(char.id);
    }

    render() {
        const { chars } = this.props;
        return (
            chars.map((char) => {
                let style = {'objectFit': 'cover'}

                if(char.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                    style = {'objectFit': 'contain'} 
                }

                return (
                    <li onClick={(e) => this.handleClick(char, e)} key={char.id} className="char__item" >
                        <img style={style} src={char.thumbnail} alt="abyss" />
                        <div className="char__name">{char.name}</div>
                    </li>
                )
            })
        )
    }
}

export default CharList;