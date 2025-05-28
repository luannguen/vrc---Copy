'use client';

import { useEffect, useState } from 'react';

interface GroupState {
  [key: string]: boolean; // key is the group name, value is whether it's expanded
}

/**
 * Hook to manage admin sidebar group states
 * This hook saves and restores the expanded/collapsed state of sidebar groups
 */
const useAdminGroupState = () => {
  const [groupStates, setGroupStates] = useState<GroupState>({});
  const storageKey = 'vrc-admin-group-states';
  
  // Initialize from localStorage if available
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedStates = localStorage.getItem(storageKey);
      if (savedStates) {
        setGroupStates(JSON.parse(savedStates));
      }
      
      // Add event listeners to track group toggle clicks
      const handleGroupToggle = () => {
        // Use a timeout to allow the DOM to update before we capture the states
        setTimeout(() => {
          const groups = document.querySelectorAll('.nav-group');
          const newStates: GroupState = {};
          
          groups.forEach(group => {
            const labelElement = group.querySelector('.nav-group__toggle-label');
            if (!labelElement) return;
            
            const groupName = labelElement.textContent?.trim() || '';
            const isCollapsed = group.classList.contains('nav-group--collapsed');
            
            if (groupName) {
              newStates[groupName] = !isCollapsed;
            }
          });
          
          // Update state and save to localStorage
          setGroupStates(newStates);
          localStorage.setItem(storageKey, JSON.stringify(newStates));
        }, 100);
      };
      
      // Add event listeners to each group toggle
      document.addEventListener('click', (e) => {
        if (
          (e.target as Element).classList.contains('nav-group__toggle') || 
          (e.target as Element).closest('.nav-group__toggle')
        ) {
          handleGroupToggle();
        }
      });
      
      // Apply saved states on load
      const applyGroupStates = () => {
        setTimeout(() => {
          const groups = document.querySelectorAll('.nav-group');
          
          groups.forEach(group => {
            const labelElement = group.querySelector('.nav-group__toggle-label');
            if (!labelElement) return;
            
            const groupName = labelElement.textContent?.trim() || '';
            
            if (groupName && groupStates[groupName] !== undefined) {
              if (groupStates[groupName]) {
                // Should be expanded
                if (group.classList.contains('nav-group--collapsed')) {
                  const toggle = group.querySelector('.nav-group__toggle');
                  (toggle as HTMLElement)?.click();
                }
              } else {
                // Should be collapsed
                if (!group.classList.contains('nav-group--collapsed')) {
                  const toggle = group.querySelector('.nav-group__toggle');
                  (toggle as HTMLElement)?.click();
                }
              }
            }
          });
        }, 300); // Give time for the UI to render
      };
      
      // Apply states when the component mounts
      applyGroupStates();
      
      // Observer for sidebar changes
      const sidebarObserver = new MutationObserver(() => {
        applyGroupStates();
      });
      
      // Start observing the sidebar once it's in the DOM
      const observeSidebar = () => {
        const sidebar = document.querySelector('.payload-sidebar');
        if (sidebar) {
          sidebarObserver.observe(sidebar, { childList: true, subtree: true });
        } else {
          // If sidebar not found, try again soon
          setTimeout(observeSidebar, 300);
        }
      };
      
      observeSidebar();
      
      // Cleanup
      return () => {
        sidebarObserver.disconnect();
      };
    } catch (error) {
      console.error('Error managing admin group states:', error);
    }
  }, []);

  return groupStates;
};

export default useAdminGroupState;
