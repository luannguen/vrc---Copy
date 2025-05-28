// Index file for AdminUI components
import Sidebar from './Sidebar';
import AdminStyles from './AdminStyles';
import AdminStyleCustomization from './AdminStyleCustomization';
import Logout from './Logout';
import SidebarCustomization from './SidebarCustomization';
import DynamicSidebar from './DynamicSidebar';
import DynamicAdminStyles from './DynamicAdminStyles';
import DynamicAdminStyleCustomization from './DynamicAdminStyleCustomization';
import DynamicLogout from './DynamicLogout';
import DynamicSidebarCustomization from './DynamicSidebarCustomization';

// Export both regular and dynamic versions
export {
  // Regular components
  Sidebar,
  AdminStyles,
  AdminStyleCustomization,
  Logout,
  SidebarCustomization,
  
  // Dynamic (SSR-safe) components
  DynamicSidebar,
  DynamicAdminStyles,
  DynamicAdminStyleCustomization,
  DynamicLogout,
  DynamicSidebarCustomization
};
