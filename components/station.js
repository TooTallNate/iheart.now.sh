import React from 'react'

import { COLOR_SUCCESS } from './css-config'

export default class Station extends React.Component {
  render () {
    const { station } = this.props

    let className = 'station'
    if (this.props.nowPlaying) {
      className += ' now-playing'
    }

    let logo = `https://cors.now.sh/${station.newlogo}`

    return (
      <div className={ className } onClick={ this.props.onClick } data-id={ station.id }>
        <img className="logo" src={ logo } />
        <h2>{ station.name }</h2>
        <h3>{ station.description }</h3>
        <div>{ `${station.callLetters} - ${station.city}, ${station.state}` }</div>

        <style jsx>{`
          .station {
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            border: solid 1px transparent;
            display: inline-block;
            margin: 1em;
            padding: 0.5em;
            transition: border-color 100ms ease-in;
            width: 400px;
          }

          .station:hover {
            border-color: #777;
          }

          .station.now-playing {
            border-color: ${COLOR_SUCCESS};
          }

          .logo {
            width: 150px;
          }

          @media only screen and (max-width: 540px) {
            .station {
              width: 90%;
              margin: 0.5em;
            }
          }
        `}</style>
      </div>
    )
  }
}
