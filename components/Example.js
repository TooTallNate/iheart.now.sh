import Link from 'next/link';

export default function Example({ children }) {
  const search = React.Children.toArray(children)[0];
  return (
    <Link href={{ pathname: '/', query: { search } }}>
      <a>{search}</a>
    </Link>
  );
}
