'use client';

import dynamic from 'next/dynamic';

// DynamicAdminStyleCustomization for avoiding React hydration errors
const DynamicAdminStyleCustomization = dynamic(
  () => import('./AdminStyleCustomization').then(mod => mod.default),
  { ssr: false }
);

export default DynamicAdminStyleCustomization;
