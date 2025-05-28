import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders } from '../../_shared/cors';

/**
 * Handle PUT requests to update technologies
 */
export async function handlePUT(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('PUT /api/technologies: Processing update request');
    console.log('PUT /api/technologies: URL:', req.url);
    
    const headers = createCORSHeaders();
    const payload = await getPayload({ config });
    
    // Extract technology ID from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const technologyId = pathParts[pathParts.length - 1];
    
    if (!technologyId || technologyId === 'technologies') {
      console.error('PUT /api/technologies: No technology ID found in URL');
      return NextResponse.json({
        message: 'Technology ID is required for update',
        errors: ['ID parameter is required in URL']
      }, { 
        status: 400,
        headers: headers
      });
    }
    
    console.log('PUT /api/technologies: Extracted technology ID:', technologyId);
    
    // Parse request body
    let updateData: any = {};
    try {
      const contentType = req.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        updateData = await req.json();
      } else if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData();
        
        // Handle _payload field for admin panel
        if (formData.has('_payload')) {
          const payloadValue = formData.get('_payload');
          if (payloadValue) {
            updateData = JSON.parse(payloadValue.toString());
          }
        } else {
          // Convert formData to object
          for (const [key, value] of formData.entries()) {
            updateData[key] = value.toString();
          }
        }
      }
    } catch (parseError) {
      console.error('PUT /api/technologies: Error parsing request body:', parseError);
      return NextResponse.json({
        message: 'Invalid request body format',
        errors: ['Unable to parse request body']
      }, { 
        status: 400,
        headers: headers
      });
    }
    
    console.log('PUT /api/technologies: Update data:', JSON.stringify(updateData));
    
    // Update the technology
    const updatedTechnology = await payload.update({
      collection: 'technologies',
      id: technologyId,
      data: updateData,
    });
    
    console.log('PUT /api/technologies: Technology updated successfully:', updatedTechnology.id);
    
    return NextResponse.json({
      message: 'Technology updated successfully',
      doc: updatedTechnology,
      errors: [],
    }, { 
      status: 200,
      headers: headers
    });
    
  } catch (error: any) {
    console.error('PUT /api/technologies: Error updating technology:', error);
    
    const headers = createCORSHeaders();
    return NextResponse.json({
      message: 'Failed to update technology',
      errors: [error.message || 'Unknown error occurred'],
    }, { 
      status: 500,
      headers: headers
    });
  }
}
