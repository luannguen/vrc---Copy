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

      /* React Select Styling - Fix for ugly dropdowns */
      .rs__control {
        background-color: var(--theme-input-bg, #ffffff) !important;
        border: 1px solid var(--theme-input-border, #ddd) !important;
        border-radius: 6px !important;
        box-shadow: none !important;
        transition: all 0.2s ease !important;
        min-height: 40px !important;
        font-size: 14px !important;
      }

      .rs__control:hover {
        border-color: var(--theme-elevation-300, #bbb) !important;
      }

      .rs__control--is-focused {
        border-color: var(--theme-success-500, #22c55e) !important;
        box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1) !important;
      }

      .rs__control--is-disabled {
        background-color: var(--theme-elevation-50, #f9f9f9) !important;
        opacity: 0.6 !important;
      }

      .rs__value-container {
        padding: 2px 12px !important;
        cursor: text !important;
      }

      .rs__input-container {
        margin: 2px !important;
        padding: 0 !important;
        color: var(--theme-text, #333) !important;
      }

      .rs__input {
        color: var(--theme-text, #333) !important;
        font-size: 14px !important;
        font-family: inherit !important;
      }

      .rs__placeholder {
        color: var(--theme-elevation-500, #999) !important;
        font-size: 14px !important;
      }

      .rs__single-value {
        color: var(--theme-text, #333) !important;
        font-size: 14px !important;
      }

      .rs__indicator-separator {
        background-color: var(--theme-elevation-200, #ddd) !important;
      }

      .rs__dropdown-indicator {
        color: var(--theme-elevation-500, #999) !important;
        padding: 8px !important;
        cursor: pointer !important;
      }

      .rs__dropdown-indicator:hover {
        color: var(--theme-elevation-700, #666) !important;
      }

      .rs__clear-indicator {
        color: var(--theme-elevation-500, #999) !important;
        padding: 8px !important;
        cursor: pointer !important;
      }

      .rs__clear-indicator:hover {
        color: var(--theme-error-500, #ef4444) !important;
      }

      .rs__menu {
        background-color: var(--theme-input-bg, #ffffff) !important;
        border: 1px solid var(--theme-elevation-200, #ddd) !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        z-index: 9999 !important;
        margin-top: 4px !important;
      }

      .rs__menu-list {
        padding: 4px !important;
        max-height: 200px !important;
      }

      .rs__option {
        background-color: transparent !important;
        color: var(--theme-text, #333) !important;
        cursor: pointer !important;
        padding: 8px 12px !important;
        border-radius: 4px !important;
        font-size: 14px !important;
        transition: all 0.15s ease !important;
      }

      .rs__option:hover,
      .rs__option--is-focused {
        background-color: var(--theme-elevation-50, #f5f5f5) !important;
      }

      .rs__option--is-selected {
        background-color: var(--theme-success-100, #dcfce7) !important;
        color: var(--theme-success-800, #166534) !important;
      }

      .rs__option--is-selected:hover,
      .rs__option--is-selected.rs__option--is-focused {
        background-color: var(--theme-success-200, #bbf7d0) !important;
      }

      .rs__multi-value {
        background-color: var(--theme-elevation-100, #f0f0f0) !important;
        border-radius: 4px !important;
        margin: 2px !important;
      }

      .rs__multi-value__label {
        color: var(--theme-text, #333) !important;
        font-size: 13px !important;
        padding: 4px 6px !important;
      }

      .rs__multi-value__remove {
        color: var(--theme-elevation-500, #999) !important;
        cursor: pointer !important;
        padding: 4px !important;
        border-radius: 0 4px 4px 0 !important;
      }

      .rs__multi-value__remove:hover {
        background-color: var(--theme-error-500, #ef4444) !important;
        color: white !important;
      }

      .rs__loading-indicator {
        color: var(--theme-success-500, #22c55e) !important;
      }

      .rs__no-options-message {
        color: var(--theme-elevation-500, #999) !important;
        font-style: italic !important;
        padding: 12px !important;
      }

      /* Additional styling for specific admin contexts */
      .field-type.relationship .rs__control,
      .field-type.select .rs__control {
        min-height: 38px !important;
      }

      /* Dark mode support if enabled */
      [data-theme="dark"] .rs__control {
        background-color: var(--theme-input-bg, #2a2a2a) !important;
        border-color: var(--theme-input-border, #444) !important;
      }

      [data-theme="dark"] .rs__menu {
        background-color: var(--theme-input-bg, #2a2a2a) !important;
        border-color: var(--theme-elevation-300, #444) !important;
      }

      [data-theme="dark"] .rs__option {
        color: var(--theme-text, #fff) !important;
      }

      [data-theme="dark"] .rs__option:hover,
      [data-theme="dark"] .rs__option--is-focused {
        background-color: var(--theme-elevation-200, #404040) !important;
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
