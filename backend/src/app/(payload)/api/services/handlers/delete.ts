import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders } from '../../_shared/cors';

// Direct utility functions to avoid import issues
function isAdminRequest(req: NextRequest): boolean {
  const referer = req.headers.get('referer') || '';
  return referer.includes('/admin');
}

// Enhanced ID extraction to support both regular and admin panel bulk delete formats
function extractServiceIds(req: NextRequest): string[] {
  const url = new URL(req.url);
  const ids = new Set<string>();
  
  // Method 1: Simple comma-separated ?ids=id1,id2,id3
  const idsParam = url.searchParams.get('ids');
  if (idsParam) {
    idsParam.split(',').forEach(id => ids.add(id.trim()));
  }
  
  // Method 2: Admin panel bulk delete format where[id][in][0]=id1&where[id][in][1]=id2
  for (const [key, value] of url.searchParams.entries()) {
    if (key.match(/where\[id\]\[in\]\[\d+\]/) && value) {
      ids.add(value);
    }
  }
  
  return Array.from(ids);
}

// Extract single service ID for single delete operations
async function extractServiceId(req: NextRequest): Promise<string | null> {
  const url = new URL(req.url);
  
  // Check query parameter first
  const idParam = url.searchParams.get('id');
  if (idParam) return idParam;
  
  // Check for JSON body with id
  try {
    const body = await req.clone().json();
    if (body?.id) return body.id;
  } catch {
    // Not JSON or no body
  }
  
  return null;
}

/**
 * Delete a service or multiple services
 * 
 * DELETE /api/services?id=123456
 * DELETE /api/services?ids=123456,789012
 * DELETE /api/services (with bulk delete admin format)
 * 
 * Requires authentication
 */
export async function handleDELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config });
    
    // Extract IDs with priority: bulk first, then single
    const serviceIds = extractServiceIds(req);
    const serviceId = await extractServiceId(req);
    
    console.log('Delete request - Bulk IDs:', serviceIds, 'Single ID:', serviceId);
    
    // Check if this is from admin panel for proper response format
    const adminReq = isAdminRequest(req);
    
    // Process bulk delete FIRST (admin panel bulk operations)
    if (serviceIds && serviceIds.length > 0) {
      console.log(`Processing bulk delete for ${serviceIds.length} services`);
      
      const results = [];
      const errors = [];
      
      // Process each service deletion
      for (const id of serviceIds) {
        try {
          const deletedService = await payload.delete({
            collection: 'services',
            id: id,
          });
          
          results.push(deletedService);
          console.log(`Successfully deleted service: ${id}`);
        } catch (err: any) {
          console.error(`Failed to delete service ${id}:`, err.message);
          errors.push({
            id,
            error: err.message
          });
        }
      }
      
      console.log(`Bulk delete completed: ${results.length} successful, ${errors.length} failed`);
      
      // Check if this is from admin panel
      if (adminReq) {
        const headers = createCORSHeaders();
        headers.append('X-Payload-Admin', 'true');
        headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.append('X-Payload-Refresh', 'services');
        
        // Admin panel expects specific format for bulk operations
        const adminResponse = {
          docs: results.map(service => ({ id: service.id })),
          errors: errors.map(err => ({
            message: err.error,
            field: 'id'
          })),
          message: errors.length === 0 ? null : `Đã xóa ${results.length}/${serviceIds.length} dịch vụ`
        };
        
        return NextResponse.json(adminResponse, { headers });
      }
      
      // API response for bulk delete
      const headers = createCORSHeaders();
      return NextResponse.json({
        success: true,
        message: `Đã xóa ${results.length}/${serviceIds.length} dịch vụ`,
        data: {
          deleted: results,
          errors: errors
        }
      }, { headers });
    }
    
    // Process single delete
    if (serviceId) {
      console.log(`Processing single delete for service: ${serviceId}`);
      
      const deletedService = await payload.delete({
        collection: 'services',
        id: serviceId,
      });
      
      console.log(`Successfully deleted service: ${serviceId}`);

      // Check if this is from admin panel
      if (adminReq) {
        // Payload CMS Admin Panel format
        const headers = createCORSHeaders();
        headers.append('X-Payload-Admin', 'true');
        headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.append('Pragma', 'no-cache');
        headers.append('Expires', '0');
        
        // Header đặc biệt để kích hoạt việc làm mới danh sách
        headers.append('X-Payload-Refresh', 'services');
        
        return NextResponse.json({
          docs: [{ id: serviceId }],
          errors: [],
          message: null
        }, { headers });
      }
      
      // API response for single delete
      const headers = createCORSHeaders();
      return NextResponse.json({
        success: true,
        message: 'Xóa dịch vụ thành công',
        data: deletedService
      }, { headers });
    }
    
    // No valid ID provided
    console.log('No valid service ID provided for deletion');
    const headers = createCORSHeaders();
    return NextResponse.json({
      success: false,
      error: 'Không có ID dịch vụ hợp lệ được cung cấp'
    }, { 
      status: 400,
      headers 
    });
    
  } catch (error: any) {
    console.error('Service deletion error:', error);
    
    const headers = createCORSHeaders();
    return NextResponse.json({
      success: false,
      error: 'Lỗi nội bộ máy chủ',
      details: error.message
    }, { 
      status: 500,
      headers 
    });
  }
}
