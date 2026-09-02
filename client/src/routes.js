import { createBrowserRouter } from 'react-router';

import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import PlayerProfile from './pages/PlayerProfile';
import Fixtures from './pages/Fixtures';
import FixtureDetails from './pages/FixtureDetails';
import Results from './pages/Results';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import Gallery from './pages/Gallery';
import Sponsors from './pages/Sponsors';
import Contact from './pages/Contact';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'team', Component: Team },
      { path: 'team/:id', Component: PlayerProfile },
      { path: 'fixtures', Component: Fixtures },
      { path: 'fixtures/:id', Component: FixtureDetails },
      { path: 'results', Component: Results },
      { path: 'news', Component: News },
      { path: 'news/:id', Component: NewsArticle },
      { path: 'gallery', Component: Gallery },
      { path: 'sponsors', Component: Sponsors },
      { path: 'contact', Component: Contact },
    ],
  },
]);
