import { createBrowserRouter } from 'react-router';

import AdminLogin from './pages/Login';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/Dashboard';
import AdminPlayers from './pages/Players';
import AddEditPlayer from './pages/AddEditPlayer';
import AdminStaff from './pages/Staff';
import AddEditStaff from './pages/AddEditStaff';
import { FixtureList, AddEditFixture } from './pages/FixtureManagement';
import { NewsManagementList, NewsEditor } from './pages/NewsManagement';
import GalleryManagement from './pages/GalleryManagement';
import SponsorManagement from './pages/SponsorManagement';
import AdminProfile from './pages/AdminProfile';
import { PlayerCards, ResultsManagement, WebsiteSettings, AdminUsers } from './pages/OtherAdmin';

const HomepageSettings = () => WebsiteSettings({ section: 'homepage' });
const AboutSettings = () => WebsiteSettings({ section: 'about' });
const ContactSettings = () => WebsiteSettings({ section: 'contact' });
const SocialSettings = () => WebsiteSettings({ section: 'social' });
const GeneralSettings = () => WebsiteSettings({ section: 'settings' });

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, Component: AdminLogin },
      {
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', Component: AdminDashboard },
          { path: 'players', Component: AdminPlayers },
          { path: 'players/new', Component: AddEditPlayer },
          { path: 'players/edit/:id', Component: AddEditPlayer },
          { path: 'staff', Component: AdminStaff },
          { path: 'staff/new', Component: AddEditStaff },
          { path: 'staff/edit/:id', Component: AddEditStaff },
          { path: 'player-cards', Component: PlayerCards },
          { path: 'fixtures', Component: FixtureList },
          { path: 'fixtures/new', Component: AddEditFixture },
          { path: 'fixtures/edit/:id', Component: AddEditFixture },
          { path: 'results', Component: ResultsManagement },
          { path: 'news', Component: NewsManagementList },
          { path: 'news/new', Component: NewsEditor },
          { path: 'news/edit/:id', Component: NewsEditor },
          { path: 'gallery', Component: GalleryManagement },
          { path: 'sponsors', Component: SponsorManagement },
          { path: 'profile', Component: AdminProfile },
          { path: 'users', Component: AdminUsers },
          { path: 'settings', Component: GeneralSettings },
          { path: 'settings/homepage', Component: HomepageSettings },
          { path: 'settings/about', Component: AboutSettings },
          { path: 'settings/contact', Component: ContactSettings },
          { path: 'settings/social', Component: SocialSettings },
        ],
      },
    ],
  },
]);
