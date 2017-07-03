import Heart from './icons/Heart'

export default function Logo() {
  return (
    <span className="logo">
      I <Heart /> Radio
      <style jsx>{`
        .logo {
          border: solid 1.2px black;
          padding: 6px;
          text-transform: uppercase;
          user-select: none;
        }

        .logo :global(svg) {
          width: 0.85em;
          vertical-align: middle;
        }
      `}</style>
    </span>
  )
}
