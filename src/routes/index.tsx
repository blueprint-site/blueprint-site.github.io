// src/routes/index.tsx
import { RouteObject } from 'react-router-dom';

import { addonRoutes } from '@/routes/addonRoutes';
import { authRoutes } from '@/routes/authRoutes';
import { schematicRoutes } from '@/routes/schematicRoutes';
import { settingsRoutes } from '@/routes/settings';

import About from '@/pages/About';
import Design from '@/pages/Design';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Stats from '@/pages/Stats';

import SchematicLayout from '@/layouts/3DViewerLayout';
import BaseLayout from '@/layouts/BaseLayout';
import SidebarLayout from '@/layouts/SidebarLayout';

export const routes: RouteObject[] = [
  {
    element: <BaseLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'design', element: <Design /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'stats', element: <Stats /> },
      ...authRoutes,
      ...settingsRoutes,
      { path: '*', element: <NotFound /> },
    ]
  },
  {
    element: <SidebarLayout />,
    children: [
      ...addonRoutes
    ]
  },
  {
    element: <SchematicLayout />,
    children: [
      ...schematicRoutes
    ]
  },
];