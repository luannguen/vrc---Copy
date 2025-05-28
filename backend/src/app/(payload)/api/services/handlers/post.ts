import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { checkAuth } from '../../_shared/cors';
import { isAdminRequest } from '../../products/utils/requests';
import { formatAdminResponse, formatApiResponse, formatAdminErrorResponse, formatApiErrorResponse } from '../../products/utils/responses';

/**
 * Handle POST requests to create new services
 */
export async function handlePOST(req: NextRequest): Promise<NextResponse> {
  console.log('POST /api/services: Request received');
  try {
    // Check for HTTP method override (admin interface uses this for GET requests via POST)
    const methodOverride = req.headers.get('x-http-method-override');
    console.log('POST /api/services: Method override header:', methodOverride);
    
    // If this is actually a GET request disguised as POST, delegate to GET handler
    if (methodOverride === 'GET') {
      console.log('POST /api/services: Delegating to GET handler due to method override');
      
      // Check if this is an admin request before delegating
      const adminRequest = isAdminRequest(req);
      console.log('POST /api/services: Method override from admin request:', adminRequest);
      
      const { handleGET } = await import('./get');
      return handleGET(req);
    }
    
    // Log request details for debugging
    console.log('POST /api/services: Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log('POST /api/services: Is Payload Admin request:', adminRequest);
    
    // Check if this is a save operation from the admin panel
    const url = new URL(req.url);
    const isAdminSaveOperation = adminRequest && url.searchParams.has('depth');
    console.log('POST /api/services: Is admin save operation:', isAdminSaveOperation, 'URL:', req.url);

    // Authentication - skip for admin UI requests which handle auth differently
    // Non-admin requests require auth token
    if (!adminRequest) {
      const isAuthenticated = await checkAuth(req);
      if (!isAuthenticated) {
        return formatApiErrorResponse(
          'Xác thực thất bại. Vui lòng đăng nhập để thực hiện chức năng này.',
          null,
          401
        );
      }
    }
    
    // Parse the request body with special handling for content types
    let serviceData: Record<string, any> = {};
    const contentType = req.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        // Parse JSON body
        serviceData = await req.json();
        console.log('POST /api/services: Parsed JSON data:', JSON.stringify(serviceData));
      } else if (contentType.includes('multipart/form-data')) {
        // Handle multipart/form-data, used in admin forms
        const formData = await req.formData();
        
        // Log all form fields for debugging
        console.log('POST /api/services: FormData fields:', Array.from(formData.keys()));
        
        // Special handling for _payload field which contains the actual data as JSON string
        if (formData.has('_payload')) {
          const payloadValue = formData.get('_payload');
          if (payloadValue) {
            try {
              const payloadString = payloadValue.toString();
              console.log('POST /api/services: _payload content:', payloadString);
              
              const payloadData = JSON.parse(payloadString);
              // Use the parsed payload as the primary data source
              serviceData = { ...payloadData };
              console.log('POST /api/services: Successfully parsed _payload field:', JSON.stringify(serviceData));
            } catch (jsonError) {
              console.error('POST /api/services: Error parsing _payload field:', jsonError);
            }
          }
        }
        
        // Add any other fields from the form (files or fields not in _payload)
        for (const [key, value] of formData.entries()) {
          // Skip _payload since we already processed it
          if (key === '_payload') continue;
          
          // Special handling for file uploads
          if (value instanceof File) {
            serviceData[key] = value;
          } else if (key === 'relatedServices') {
            try {
              // Parse JSON strings for relationship fields
              serviceData[key] = JSON.parse(value.toString());
            } catch (_e) {
              // If it's not JSON, treat as string/ID
              serviceData[key] = value.toString();
            }
          } else {
            // Regular form field
            serviceData[key] = value.toString();
          }
        }
        
        console.log('POST /api/services: Final parsed FormData:', JSON.stringify(serviceData));
        
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Handle URL-encoded data
        const text = await req.text();
        const urlParams = new URLSearchParams(text);
        
        for (const [key, value] of urlParams.entries()) {
          if (key === 'relatedServices') {
            try {
              serviceData[key] = JSON.parse(value);
            } catch (_e) {
              serviceData[key] = value;
            }
          } else {
            serviceData[key] = value;
          }
        }
        
        console.log('POST /api/services: Parsed URL-encoded data:', JSON.stringify(serviceData));
      } else {
        // Default to JSON parsing
        serviceData = await req.json();
      }
    } catch (parseError) {
      console.error('POST /api/services: Error parsing request body:', parseError);
      serviceData = {};
    }

    // Log debug information about the data being processed
    console.log('POST /api/services: Processing service data:', {
      title: serviceData.title,
      type: serviceData.type,
      hasRelatedServices: !!serviceData.relatedServices,
      relatedServicesType: typeof serviceData.relatedServices,
      relatedServicesValue: serviceData.relatedServices
    });

    // Validate and normalize relatedServices field
    if (serviceData.relatedServices !== undefined) {
      if (serviceData.relatedServices === null || serviceData.relatedServices === 0 || serviceData.relatedServices === '0') {
        // Empty or null values should be empty array
        serviceData.relatedServices = [];
        console.log('POST /api/services: Set relatedServices to empty array');
      } else if (!Array.isArray(serviceData.relatedServices)) {
        // Convert single values or objects to arrays
        try {
          if (typeof serviceData.relatedServices === 'string') {
            // Try to parse as JSON first
            if (serviceData.relatedServices.trim() === '') {
              serviceData.relatedServices = [];
            } else if (serviceData.relatedServices.startsWith('[')) {
              serviceData.relatedServices = JSON.parse(serviceData.relatedServices);
            } else {
              // Single ID as string
              serviceData.relatedServices = [serviceData.relatedServices];
            }
          } else if (typeof serviceData.relatedServices === 'object') {
            // Single object
            serviceData.relatedServices = [serviceData.relatedServices];
          } else {
            // Other types, make empty array
            serviceData.relatedServices = [];
          }
        } catch (error) {
          console.error('POST /api/services: Error normalizing relatedServices:', error);
          serviceData.relatedServices = [];
        }
      }
      console.log('POST /api/services: Final relatedServices:', serviceData.relatedServices);
    }

    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    // Create the service through Payload
    const newService = await payload.create({
      collection: 'services',
      data: serviceData as any,
    });

    console.log('POST /api/services: Service created successfully:', newService.id);

    if (adminRequest) {
      return formatAdminResponse(newService, 201);
    } else {
      return formatApiResponse(
        newService,
        'Dịch vụ đã được tạo thành công',
        201
      );
    }

  } catch (error) {
    console.error('POST /api/services: Error creating service:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    const adminRequest = isAdminRequest(req);
    if (adminRequest) {
      return formatAdminErrorResponse(`Error creating service: ${errorMessage}`, 500);
    } else {
      return formatApiErrorResponse(
        `Lỗi khi tạo dịch vụ: ${errorMessage}`,
        null,
        500
      );
    }
  }
}
