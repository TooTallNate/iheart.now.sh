import React from 'react'

export default class Station extends React.Component {
  render () {
    const { station, nowPlaying, onClick } = this.props

    let className = 'station'
    if (nowPlaying) {
      className += ' now-playing'
    }

    let logo = `https://cors.now.sh/${station.newlogo}`

    return (
      <div className={ className } onClick={ onClick } data-id={ station.id }>
        <div className="logo">
          <img src={ logo } />
        </div>
        <div className="info">
          <h2>{ station.name }</h2>
          <h3>{ station.description }</h3>
          <div className="details">{ `${station.callLetters} - ${station.city}, ${station.state}` }</div>
        </div>

        <style jsx>{`
          .station {
            cursor: pointer;
            border: solid 1px #ddd;
            display: inline-block;
            margin: 1em;
            width: 270px;
          }

          .station,
          .station .info {
            transition: border-color 100ms ease-in;
          }

          .station:hover,
          .station:hover .info {
            border-color: #777;
          }

          .info {
            border-top: solid 1px #ddd;
            text-align: left;
            padding: 1em;
          }

          h2, h3 {
            font-weight: normal;
          }

          h2 {
            margin: 0;
            margin-bottom: 0.6em;
          }

          h3 {
            margin: 0;
            margin-bottom: 0.3em;
          }

          .details {
            color: #aaa;
          }

          .station.now-playing {
            border-color: #067DF7;
            border-width: 2px;
          }

          .logo img {
            width: 60%;
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
