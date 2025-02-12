import './charInfo.scss';
import { Component } from 'react';
import Spinner from "../spinner/Spinner"
import Error from '../error/Error';
import MarvelServer from "../../API/server";
import Skeleton from '../skeleton/Skeleton';
import PropTypes from "prop-types";


class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    componentDidMount(){
        this.getChar()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedId !== this.props.selectedId) {
            this.getChar()
        }
    }

    marvelServer = new MarvelServer()
    
    onCharLoaded = (char) => {
        this.setState({ char, loading: false })
    }
    
    onCharError = () => {
        this.setState({ error: true, loading: false })
    }
    
    setLoading = () => {
        this.setState({ loading: true })
    }
    
    getChar = () => {
        const { selectedId } = this.props
        if(!selectedId){
            return
        }
        this.setLoading()

        this.marvelServer.getOneChar(selectedId)
            .then(this.onCharLoaded)
            .catch(this.onCharError)
    }

    render() {
        const { char, loading, error } = this.state,
            content = !(loading || error || !char) ? <View char={char} /> : null,
            spinner = loading && char ? <Spinner /> : null,
            errorMessage = error ? <Error /> : null,
            skeleton = loading || char || error ? null : <Skeleton/>

        return (
            <div className="char__info">
                {content}
                {skeleton}
                {spinner}
                {errorMessage}
            </div>
        )
    }
}

const View = ({ char }) => {

    let { name, description, detail, thumbnail, wiki, comics } = char

    let style = {'objectFit': 'cover'}

    if(thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        style = {'objectFit': 'contain'} 
    }


    return (
        <>
            <div className="char__basics">
                <img style={style} src={thumbnail} alt="abyss" />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={detail} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? (
                    comics.map((comic, index) => (
                        <li key={index} className="char__comics-item">
                            {comic.name}
                        </li>
                    ))
                ) : (
                    <li className="char__comics-item">Unfortunately, there are no comics</li>
                )}
            </ul>
        </>
    )
}
CharInfo.propTypes={
    selectedId:PropTypes.number
}


export default CharInfo;