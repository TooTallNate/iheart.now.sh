import React from 'react'
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
      nowPlaying: null
    }

    this.onPlayClick = this.onPlayClick.bind(this)
    this.onSearchInput = debounce(this.onSearchInput.bind(this), 200)
  }

  static async getInitialProps ({ query }) {
    let { search } = query
    if (!search) {
      search = '107.7'
    }
    return await Search.search(search)
  }

  static async search(value) {
    const { bestMatch, stations } = await iheart.search(value)
    return { bestMatch, stations, search: value }
  }

  componentDidMount() {
    this.audio = new Audio()
  }

  async onSearchInput(err, value) {
    Router.replace(`/?search=${encodeURIComponent(value)}`)
  }

  async onPlayClick(e) {
    const id = e.currentTarget.getAttribute('data-id') | 0

    this.stop()
    this.setState({
      nowPlaying: id
    })

    const streams = await iheart.streams(id)
    const stream = streams[0]

    const url = await iheart.streamURL(stream)
    debug('playing stream URL: %o', url)
    this.audio.src = url
    this.audio.play()
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
