import { useEffect } from 'react';

export default function PageTitle({ title }) {
  useEffect(() => {
    document.title = `Mphehli All Stars | ${title}`;
  }, [title]);

  return null;
}
