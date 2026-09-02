import { useEffect } from 'react';

export default function AdminPageTitle({ title }) {
  useEffect(() => {
    document.title = `Admin Panel | ${title}`;
  }, [title]);

  return null;
}
