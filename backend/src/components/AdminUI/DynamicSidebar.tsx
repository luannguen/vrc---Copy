'use client';

import dynamic from 'next/dynamic';

// DynamicSidebar for avoiding React hydration errors
const DynamicSidebar = dynamic(
  () => import('./Sidebar').then(mod => mod.default),
  { ssr: false }
);

export default DynamicSidebar;
