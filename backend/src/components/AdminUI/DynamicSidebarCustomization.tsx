'use client';

import dynamic from 'next/dynamic';

// DynamicSidebarCustomization for avoiding React hydration errors
const DynamicSidebarCustomization = dynamic(
  () => import('./SidebarCustomization').then(mod => mod.default),
  { ssr: false }
);

export default DynamicSidebarCustomization;
