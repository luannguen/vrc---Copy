'use client';

import React, { useEffect } from 'react';
import useAdminGroupState from '../../hooks/useAdminGroupState';

/**
 * AdminStyleCustomization component
 * This component adds custom CSS to enhance the admin interface with icons and styling.
 */
const AdminStyleCustomization: React.FC = () => {
  // Use the custom hook to manage group states
  useAdminGroupState();
  
  useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Admin Group Styling */
      .nav-group:not(.nav-group--collapsed) .nav-group__toggle:not(.nav-group__toggle--has-custom-icon) {
        background-color: var(--theme-elevation-100);
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .nav-group:not(.nav-group--collapsed) .nav-group__toggle:not(.nav-group__toggle--has-custom-icon):hover {
        background-color: var(--theme-elevation-150);
      }

      /* Group Icons */
      .nav-group__toggle::before {
        margin-right: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
      }

      /* Product Group */
      .nav-group:has([href*="/admin/collections/products"]) .nav-group__toggle::before {
        content: "🛒";
      }

      /* News/Posts Group */
      .nav-group:has([href*="/admin/collections/posts"]) .nav-group__toggle::before {
        content: "📰";
      }

      /* Categories Group */
      .nav-group:has([href*="/admin/collections/categories"]) .nav-group__toggle::before {
        content: "🏷️";
      }

      /* Pages Group */
      .nav-group:has([href*="/admin/collections/pages"]) .nav-group__toggle::before {
        content: "📄";
      }

      /* Services Group */
      .nav-group:has([href*="/admin/collections/services"]) .nav-group__toggle::before {
        content: "🔧";
      }

      /* Projects Group */
      .nav-group:has([href*="/admin/collections/projects"]) .nav-group__toggle::before {
        content: "🏗️";
      }

      /* Events Group */
      .nav-group:has([href*="/admin/collections/events"]) .nav-group__toggle::before {
        content: "📅";
      }

      /* Media Group */
      .nav-group:has([href*="/admin/collections/media"]) .nav-group__toggle::before {
        content: "📸";
      }

      /* Users Group */
      .nav-group:has([href*="/admin/collections/users"]) .nav-group__toggle::before {
        content: "👤";
      }

      /* Active group highlighting */
      .nav-group:has(.nav__link--active) .nav-group__toggle {
        color: var(--theme-success-500);
        font-weight: bold;
      }

      /* Improve contrast for group labels */
      .nav-group__toggle-label {
        font-size: 14px;
        letter-spacing: 0.5px;
      }

      /* Add a subtle divider between groups */
      .nav-group:not(:last-child) {
        border-bottom: 1px solid var(--theme-elevation-100);
        margin-bottom: 4px;
        padding-bottom: 4px;
      }
    `;
    
    // Append style to head
    document.head.appendChild(styleElement);
    
    // Cleanup when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default AdminStyleCustomization;
