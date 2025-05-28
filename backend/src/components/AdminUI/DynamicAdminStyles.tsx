'use client';

import dynamic from 'next/dynamic';

// DynamicAdminStyles for avoiding React hydration errors
const DynamicAdminStyles = dynamic(
  () => import('./AdminStyles').then(mod => mod.default),
  { ssr: false }
);

export default DynamicAdminStyles;
