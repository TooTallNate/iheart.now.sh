import Link from 'next/link';
import Heart from './icons/Heart';

export default function Logo() {
  return (
    <Link href="/">
      <a className="logo">
        I <Heart /> Radio
        <style jsx>{`
          .logo {
            border: solid 1.2px black;
            color: inherit;
            letter-spacing: 0.1em;
            padding: 8px;
            cursor: pointer;
            text-decoration: none;
            text-transform: uppercase;
            user-select: none;
          }

          .logo :global(.heart) {
            width: 0.85em;
            vertical-align: middle;
          }
        `}</style>
      </a>
    </Link>
  );
}
