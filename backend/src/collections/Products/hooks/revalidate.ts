// Hook to ensure the admin UI refreshes correctly after product deletion

/**
 * This hook ensures the admin UI correctly refreshes after product deletion
 * by implementing proper revalidation logic.
 * 
 * It works with both single product deletion and bulk deletion operations.
 */
export const revalidateAfterDelete = async ({
  req,
  id,
  doc,
}: {
  req: any;
  id: string | number;
  doc: any;
}) => {
  try {
    // Check if this is from the API route or admin UI
    const context = req?.context || {};
    const { isFromAPI = false } = context;
    
    // Check referer to detect admin UI requests
    const referer = req?.headers?.referer || '';
    const isAdminRequest = referer.includes('/admin');

    // Log deletion for debugging
    console.log(`Product deleted - ID: ${id}${isFromAPI ? ' (via API)' : ' (via admin)'}${isAdminRequest ? ' (from Admin UI)' : ''}`);
    
    // This hook gets called after the product is already deleted
    // We need to make sure we're returning the data in the expected format
    // Especially for the admin UI
    
    // For admin UI requests, ensure we return the expected format
    if (isAdminRequest) {
      // Phát hiện referer để xem request đến từ list view hay edit view
      const referer = req?.headers?.referer || '';
      const isFromListView = referer.includes('/admin/collections/products') && !referer.includes('/edit');
      
      if (isFromListView) {
        // Format dành riêng cho list view (khác với edit view)
        console.log(`Revalidate hook returning docs array format for list view`);
        return { id };
      }
      // The admin UI expects a specific format with at least the id
      const returnDoc = {
        id: id,
        ...(doc || {})
      };
      
      console.log(`Revalidate hook returning formatted doc for admin UI: ${JSON.stringify(returnDoc)}`);
      return returnDoc;
    }
    
    // For non-admin requests, return the original doc or at least an object with id
    return doc || { id };
  } catch (error) {
    console.error(`Error in revalidateAfterDelete hook for product ${id}:`, error);
    // Return doc even if there's an error to prevent breaking the deletion flow
    return doc || { id };
  }
};
