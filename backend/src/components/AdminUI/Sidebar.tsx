'use client';

import React, { useEffect } from 'react';

/**
 * Sidebar component (previously SidebarCustomization)
 * This component enhances the sidebar with visual improvements and provides grouping enhancements
 */
const Sidebar: React.FC = () => {
  // Thêm state để đảm bảo chỉ thực thi code sau khi mounted hoàn toàn
  const [isMounted, setIsMounted] = React.useState(false);

  // useEffect đầu tiên chỉ để đánh dấu component đã mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // useEffect thứ hai chỉ chạy sau khi component đã mount
  useEffect(() => {
    // Không thực thi bất cứ logic DOM nào nếu chưa mount
    if (!isMounted) return;
    
    // Function to add group icons and enhance visibility
    const enhanceSidebar = () => {
      const sidebarElement = document.querySelector('.payload-sidebar');
      if (!sidebarElement) return;
      
      // Add custom class for styling
      sidebarElement.classList.add('vrc-enhanced-sidebar');
      
      // Add title tooltips to long collection names that might be truncated
      const collectionLinks = document.querySelectorAll('.nav__link[href*="/admin/collections/"]');
      collectionLinks.forEach(link => {
        const label = link.querySelector('.nav__label');
        if (label && label.textContent) {
          (link as HTMLElement).title = label.textContent.trim();
          
          // Add icons for specific collections
          const href = (link as HTMLAnchorElement).getAttribute('href') || '';
          const iconContainer = document.createElement('span');
          iconContainer.className = 'collection-icon';
          
          if (href.includes('/product-categories')) {
            // Product categories icon
            iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM12 3v18M3 12h18"/></svg>`;
            iconContainer.title = 'Danh mục sản phẩm';
            label.parentNode?.insertBefore(iconContainer, label);
          } else if (href.includes('/products')) {
            // Products icon
            iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3M12 3v18"/></svg>`;
            iconContainer.title = 'Sản phẩm';
            label.parentNode?.insertBefore(iconContainer, label);
          } else if (href.includes('/categories')) {
            // General categories icon
            iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
            iconContainer.title = 'Danh mục & Thẻ';
            label.parentNode?.insertBefore(iconContainer, label);
          }
        }
      });
      
      // Add group counters (number of collections in each group)
      const groups = document.querySelectorAll('.nav-group');
      groups.forEach(group => {
        const collectionList = group.querySelector('.nav-group__content');
        if (!collectionList) return;
        
        const collections = collectionList.querySelectorAll('.nav__link');
        const countBadge = document.createElement('span');
        countBadge.className = 'group-counter';
        countBadge.textContent = String(collections.length);
        
        const groupTitle = group.querySelector('.nav-group__toggle-label');
        if (groupTitle && !groupTitle.querySelector('.group-counter')) {
          groupTitle.appendChild(countBadge);
        }
        
        // Add icons for product-related groups
        const groupTitleText = groupTitle?.textContent?.trim() || '';
        if (groupTitleText === 'Sản phẩm' && !groupTitle?.querySelector('.group-icon')) {
          const groupIcon = document.createElement('span');
          groupIcon.className = 'group-icon';
          groupIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect x="6" y="10" width="12" height="12"/><path d="M12 6v14"/></svg>`;
          groupTitle?.insertBefore(groupIcon, groupTitle.firstChild);
        }
      });
    };
    
    // Run initially - tăng timeout để đảm bảo DOM đã hoàn toàn sẵn sàng
    const initialTimeout = setTimeout(enhanceSidebar, 1000);
      // Set up mutation observer to handle dynamic updates
    const observer = new MutationObserver((_mutations) => {
      enhanceSidebar();
    });
    
    // Start observing the sidebar
    const sidebar = document.querySelector('.payload-sidebar');
    if (sidebar) {
      observer.observe(sidebar, {
        childList: true,
        subtree: true
      });
    }
    
    // Add counter styles - chỉ thêm style khi đã mount
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .group-counter {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        padding: 0 6px;
        height: 18px;
        min-width: 18px;
        border-radius: 9px;
        background-color: var(--theme-elevation-150);
        color: var(--theme-text);
        font-size: 12px;
        font-weight: 500;
      }
      
      .nav-group:has(.nav__link--active) .nav-group__toggle .group-counter {
        background-color: var(--theme-success-500);
        color: white;
      }
      
      /* Collection icons */
      .collection-icon {
        display: inline-flex;
        align-items: center;
        margin-right: 8px;
        color: var(--theme-text);
        opacity: 0.7;
      }
      
      /* Group icons */
      .group-icon {
        display: inline-flex;
        align-items: center;
        margin-right: 8px;
        color: var(--theme-text);
      }
      
      /* Improve link hover states */
      .nav__link:hover {
        background-color: var(--theme-elevation-100);
        border-radius: 4px;
      }
      
      .nav__link:hover .collection-icon {
        opacity: 1;
        color: var(--theme-success-500);
      }
      
      /* Highlight active link */
      .nav__link--active {
        background-color: var(--theme-success-100) !important;
        border-radius: 4px;
        font-weight: 600;
      }
      
      .nav__link--active .collection-icon {
        opacity: 1;
        color: var(--theme-success-500);
      }
    `;
    document.head.appendChild(styleElement);
    
    // Return cleanup function tập trung tại một điểm
    return () => {
      clearTimeout(initialTimeout);
      if (observer) observer.disconnect();
      if (styleElement && styleElement.parentNode) {
        document.head.removeChild(styleElement);
      }
    };
  }, [isMounted]); // Dependency array - chỉ chạy lại khi isMounted thay đổi
  
  return null;
};

export default Sidebar;
