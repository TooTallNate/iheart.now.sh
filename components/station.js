import React from 'react'

export default class Station extends React.Component {
  render () {
    const { station } = this.props
    return (
      <div className="station" onClick={ this.props.onClick } data-id={ station.id }>
        <img className="logo" src={ station.newlogo } />
        <h2>{ station.name }</h2>
        <h3>{ station.description }</h3>
        <div>{ `${station.callLetters} - ${station.city}, ${station.state}` }</div>

        <style jsx>{`
          .station {
            border: solid 1px #eee;
            display: inline-block;
            margin: 1em;
            width: 400px;
          }

          .logo {
            width: 150px;
          }
        `}</style>
      </div>
    )
  }
}
