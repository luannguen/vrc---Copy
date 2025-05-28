'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * Simple Logout component
 */
const Logout: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Thực hiện logout
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
        if (res.ok) {
        // Redirect to homepage
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      className="logout-button"
      onClick={handleLogout}
    >
      Đăng xuất
    </button>
  );
};

export default Logout;
