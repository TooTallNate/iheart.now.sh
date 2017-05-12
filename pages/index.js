import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import debounce from 'debounce'
import createDebug from 'debug'
import * as iheart from 'iheart'

import { FONT_FAMILY_SANS } from '../components/css-config'
import Input from '../components/input'
import Station from '../components/station'

const debug = createDebug('iheart:Search')

export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.audio = null

    this.state = {
      nowPlaying: null,
      streams: null
    }

    this.onPlayClick = this.onPlayClick.bind(this)
    this.onSearchInput = debounce(this.onSearchInput.bind(this), 200)
  }

  static async getInitialProps ({ query }) {
    let { search } = query
    if (!search) {
      search = '107.7'
    }
    const { stations } = await iheart.search(search)
    return { stations, search }
  }

  async loadStream(stationId) {
    const stream = (await iheart.streams(stationId))[0]

    const url = await iheart.streamURL(stream)
    debug('loaded stream URL: %o', url)

    const { streams } = this.state
    streams.set(stationId, url)
    this.setState({ streams })
  }

  componentDidMount() {
    this.audio = new Audio()
    this.setState({
      streams: new Map
    })
    if (this.props.stations) {
      for (const station of this.props.stations) {
        console.log(station)
        this.loadStream(station.id)
      }
    }
  }

  onSearchInput(err, value) {
    Router.replace(`/?search=${encodeURIComponent(value)}`)
  }

  onPlayClick(e) {
    const id = e.currentTarget.getAttribute('data-id') | 0

    this.stop()

    const url = this.state.streams.get(id)
    this.audio.src = url
    this.audio.play()

    this.setState({
      nowPlaying: id
    })
  }

  stop() {
    this.audio.pause()
    this.audio.currentTime = 0
    this.setState({
      nowPlaying: null
    })
  }

  render () {
    const { nowPlaying } = this.state
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Head>
          <title>iHeart Radio Search</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width; height=device-height" />
        </Head>

        <h1>iHeart Radio Search</h1>

        <Input
          className="search"
          autofocus
          centered
          select
          onValue={ this.onSearchInput }
          value={ this.props.search }
          />

        <br />

        {this.props.stations.map(station => (
          <Station
            key={ station.id }
            station={ station }
            nowPlaying={ nowPlaying === station.id }
            onClick={ this.onPlayClick }
            />
        ))}

        <style jsx>{`
          div {
            font-family: ${FONT_FAMILY_SANS};
          }

          .search {
            margin: 1em;
          }
        `}</style>
      </div>
    )
  }
}
