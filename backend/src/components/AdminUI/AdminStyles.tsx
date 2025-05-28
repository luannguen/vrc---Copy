'use client';

import React, { useEffect } from 'react';

/**
 * AdminStyles component
 * Thêm CSS toàn cục vào admin panel
 */
const AdminStyles: React.FC = () => {
  useEffect(() => {
    // Chỉ thực thi trên client-side
    if (typeof window === 'undefined') return;
    
    // Tạo style element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Cải thiện giao diện Admin */
      
      /* Sidebar enhancements */
      .payload-sidebar {
        border-right: 1px solid var(--theme-elevation-100);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
      }
      
      /* Collection group styles */
      .nav-group {
        margin-bottom: 6px;
      }
      
      .nav-group__toggle {
        padding: 8px 16px;
        border-radius: 6px;
        transition: all 0.2s;
      }
      
      .nav-group__toggle:hover {
        background-color: var(--theme-elevation-50);
      }
      
      .nav-group__toggle-icon {
        color: var(--theme-elevation-500);
      }
      
      .nav-group__toggle-label {
        font-weight: 600;
        color: var(--theme-elevation-800);
        font-size: 14px;
      }
      
      /* Collection items */
      .nav__link {
        padding: 8px 16px;
        margin: 2px 0;
        border-radius: 4px;
        transition: background-color 0.2s;
      }
      
      .nav__link:hover {
        background-color: var(--theme-elevation-50);
      }
      
      .nav__link:active {
        background-color: var(--theme-elevation-100);
      }
      
      .nav__label {
        font-size: 13px;
      }
      
      /* Form styling */
      .field-type {
        margin-bottom: 24px;
      }
      
      .field-type.relationship .chiplist {
        padding: 6px;
      }
      
      /* Button enhancements */
      button.btn {
        border-radius: 4px;
        font-weight: 500;
        transition: all 0.2s;
      }
      
      button.btn.btn--style-primary {
        box-shadow: 0 2px 5px rgba(0, 90, 50, 0.1);
      }
      
      button.btn.btn--style-primary:hover {
        box-shadow: 0 4px 10px rgba(0, 90, 50, 0.15);
        transform: translateY(-1px);
      }
      
      /* Card styling in document list */
      .collection-list__card {
        border-radius: 6px;
        transition: all 0.2s;
        border: 1px solid var(--theme-elevation-100);
      }
      
      .collection-list__card:hover {
        border-color: var(--theme-elevation-150);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transform: translateY(-1px);
      }
      
      /* Table view enhancements */
      .table {
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--theme-elevation-100);
      }
      
      .table__header-cell {
        background-color: var(--theme-elevation-50);
        font-weight: 600;
      }
    `;
    
    // Thêm vào document
    document.head.appendChild(styleElement);
    
    // Cleanup khi component unmount
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);
  
  return null;
};

export default AdminStyles;
