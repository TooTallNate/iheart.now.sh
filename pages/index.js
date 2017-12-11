import store from 'store'
import Head from 'next/head'
import Router from 'next/router'
import debounce from 'debounce'
import createDebug from 'debug'
import * as iheart from 'iheart'

import Logo from '../components/Logo'
import Input from '../components/Input'
import Example from '../components/Example'
import Station from '../components/Station'
import SearchIcon from '../components/icons/Search'

const debug = createDebug('iheart:pages:index')

export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.audio = null

    this.state = {
      nowPlaying: null,
      favorites: null
    }

    this.onPlayClick = this.onPlayClick.bind(this)
    this.onFavorite = this.onFavorite.bind(this)
    this.onSearchInput = debounce(this.onSearchInput.bind(this), 200)
  }

  static async getInitialProps({ query: { search } }) {
    let stations
    if (search) {
      ({ stations } = await iheart.search(search))
    }
    return { stations, search }
  }

  componentDidMount() {
    let favorites
    this.audio = new Audio

    const favs = store.get('iheart:favorites')
    if (favs) {
      favorites = new Set(favs.split(',').map(Number))
    } else {
      favorites = new Set
    }

    this.setState({ favorites })
  }

  componentWillUnmount() {
    this.stop()
  }

  onSearchInput(err, value) {
    Router.replace(`/?search=${encodeURIComponent(value)}`)
  }

  onPlayClick(e) {
    const id = e.currentTarget.dataset.id | 0
    this.stop()

    const url = `https://iheart-api.now.sh/?id=${id}&redirect=1`
    this.audio.src = url
    this.audio.play()

    const station = this.props.stations.filter(station => station.id === id)[0]
    this.setState({ nowPlaying: station })
  }

  onFavorite(e) {
    e.stopPropagation()
    const station = e.currentTarget.closest('.station')
    const id = station.dataset.id | 0
    const { favorites } = this.state

    if (favorites.has(id)) {
      favorites.delete(id)
    } else {
      favorites.add(id)
    }

    store.set('iheart:favorites', Array.from(favorites).join(','))
    this.setState({ favorites })
  }

  stop() {
    this.audio.pause()
    this.audio.currentTime = 0
    this.setState({ nowPlaying: null })
  }

  render() {
    let favicon
    let title
    const { favorites, nowPlaying } = this.state
    const { stations = [], search } = this.props

    if (nowPlaying) {
      title = `► ${nowPlaying.name}`
      favicon = <link rel="shortcut icon" href={`https://cors.now.sh/${nowPlaying.newlogo}`} />
    } else {
      title = 'iHeart Radio Search'
    }

    let s
    if (stations.length) {
      s = stations.map(station => (
        <Station
          key={ station.id }
          station={ station }
          favorite={ favorites && favorites.has(station.id) }
          nowPlaying={ nowPlaying && nowPlaying.id === station.id }
          onClick={ this.onPlayClick }
          onFavorite={ this.onFavorite }
        />
      ))
    } else if (search) {
      s = 'No results'
    } else {
      s = <div className="">
        <p>
          Use the search bar!<br />
          For example:
        </p>
        <p>
          <Example>San Francisco</Example><br />
          <Example>New York</Example><br />
          <Example>Rap</Example><br />
          <Example>Rock</Example>
        </p>
      </div>
    }

    return (
      <div className="root">
        <Head>
          <title>{ title }</title>
          <meta charset="UTF-8" />
          { favicon }
          <link href="https://sf.n8.io/_.css" rel="stylesheet" />
          <meta name="viewport" content="width=device-width, height=device-height" />
          <meta name="apple-mobile-web-app-title" content="iHeart Radio Search" />
        </Head>

        <div className="header">
          <Logo />

          <Input
            autofocus
            select
            trim
            className="station-search"
            onValue={ this.onSearchInput }
            prefix={ <SearchIcon /> }
            value={ search }
            width='200px'
          />

        </div>

        <div className="stations">{ s }</div>

        <style jsx>{`
          .root {
            text-align: center;
            padding: 40px;
          }

          .header {
            margin-bottom: 2em;
          }

          .header :global(.station-search) {
            vertical-align: middle;
            position: absolute;
            left: 40px;
          }

          .header :global(.icon.search) {
            width: 0.9em;
            position: relative;
            top: 0.25em;
          }

          .header :global(.has-prefix) {
            margin-left: 0.2em;
          }
        `}</style>

        <style global jsx>{`
          html, body {
            font-family: 'San Francisco', sans-serif;
          }
        `}</style>
      </div>
    )
  }
}
