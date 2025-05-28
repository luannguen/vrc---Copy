'use client';

import dynamic from 'next/dynamic';

// Import SidebarCustomization với dynamic import để tránh hydration errors
const DynamicSidebarCustomization = dynamic(
  () => import('./SidebarCustomization').then(mod => mod.default),
  { ssr: false }
);

export default DynamicSidebarCustomization;
