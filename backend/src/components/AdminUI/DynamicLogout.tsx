'use client';

import dynamic from 'next/dynamic';

// DynamicLogout for avoiding React hydration errors
const DynamicLogout = dynamic(
  () => import('./Logout').then(mod => mod.default),
  { ssr: false }
);

export default DynamicLogout;
