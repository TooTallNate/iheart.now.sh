import Heart from './icons/Heart';

export default function Station({
  station,
  nowPlaying,
  favorite,
  onClick,
  onFavorite
}) {
  let className = 'station';
  if (nowPlaying) {
    className += ' now-playing';
  }
  if (favorite) {
    className += ' favorite';
  }

  const logo = `https://cors.now.sh/${station.newlogo}`;

  let call = station.callLetters;
  if (station.frequency && station.band) {
    let freq = station.frequency;
    if (station.band === 'AM') {
      freq = Math.round(freq);
    }
    call = call.replace('-' + station.band, ` - ${freq} ${station.band}`);
  }

  return (
    <div className={className} onClick={onClick} data-id={station.id}>
      <div className="logo">
        <Heart onClick={onFavorite} />
        <img src={logo} />
      </div>
      <div className="info">
        <h2>{station.name}</h2>
        <h3>{station.description}</h3>
        <div className="details">{`${call} - ${station.city}, ${
          station.state
        }`}</div>
      </div>

      <style jsx>{`
        .station {
          cursor: pointer;
          border: solid 1px #ddd;
          display: inline-block;
          margin: 1em;
          width: 250px;
          position: relative;
        }

        .station,
        .station .info {
          transition: border-color 100ms ease-in;
        }

        .info {
          border-top: solid 1px #ddd;
          text-align: left;
          padding: 1em;
        }

        h2,
        h3 {
          font-weight: normal;
        }

        h2 {
          margin: 0;
          margin-bottom: 0.6em;
          font-size: 1em;
        }

        h3 {
          margin: 0;
          margin-bottom: 0.3em;
          font-size: 0.75em;
        }

        .details {
          color: #aaa;
          font-size: 0.75em;
        }

        .logo img {
          width: 60%;
          user-select: none;
        }

        .logo :global(.heart) {
          width: 1em;
          position: absolute;
          top: 1em;
          left: 1em;
          opacity: 0;
          transition: opacity 100ms ease-in, fill 100ms ease-in;
          stroke: black;
          stroke-width: 1px;
          fill: #ddd;
        }

        /* on hover */
        .station:hover,
        .station:hover .info {
          border-color: #777;
        }

        .station:hover :global(.heart) {
          opacity: 1;
        }

        .station :global(.heart):hover {
          fill: #aaa;
        }

        /* now playing */
        .station.now-playing,
        .station.now-playing .info {
          border-color: #067df7;
        }

        /* favorite */
        .station.favorite :global(.heart) {
          opacity: 1;
          fill: red;
        }
      `}</style>
    </div>
  );
}
