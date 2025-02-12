export default class MarvelServer {
    _limit = 9

    async getMarvel(url){
        try {
            const res = await fetch(url)
            if(!res.ok){
                throw new Error("Призошла ошибка")
            }
            return await res.json()
        } catch (error) {
            console.log(error)
        }
    }

    async getOneChar(id){
        const data = await this.getMarvel(`https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=05f05a7254c7f47148993eee3927e032`)
        return this.transformChar(data.data.results[0])
    }
    
    async getAllChar(offset){
        const data = await this.getMarvel(`https://gateway.marvel.com:443/v1/public/characters?limit=${this._limit}&offset=${offset}&apikey=05f05a7254c7f47148993eee3927e032`)
        return data.data.results.map((item) => this.transformChar(item))
    }

    transformChar(data){
        return { 
            name: data.name,
            description: data.description,
            thumbnail: data.thumbnail.path + '.' + data.thumbnail.extension,
            detail: data.urls[0].url,
            wiki: data.urls[1].url,
            comics: data.comics.items.length > 10 ? data.comics.items.slice(0, 10) : data.comics.items,
            id: data.id
        }
    }
 
}
