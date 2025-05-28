import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders, checkAuth } from '../../_shared/cors';

/**
 * PUT /api/project-categories
 * 
 * Updates an existing project category
 * Supports both JSON and form-data submissions
 */
export async function handlePUT(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('PUT /api/project-categories called');
    
    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Authentication check
    const authResult = await checkAuth(req, true); // true = required auth
    if (!authResult) {
      console.log('Authentication failed for project categories update');
      return NextResponse.json(
        { error: 'Authentication required' },
        { 
          status: 401,
          headers: createCORSHeaders(),
        }
      );
    }
    
    // Parse request body
    let body: any;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      body = {};
      
      // Convert FormData to regular object
      for (const [key, value] of formData.entries()) {
        if (key === '_payload' && typeof value === 'string') {
          // Handle Payload admin panel submissions
          try {
            const payloadData = JSON.parse(value);
            body = { ...body, ...payloadData };
          } catch (parseError) {
            console.error('Error parsing _payload field:', parseError);
          }
        } else {
          body[key] = value;
        }
      }
    } else {
      body = await req.json();
    }
    
    // Extract ID from URL query parameters or request body
    const url = new URL(req.url);
    const categoryId = url.searchParams.get('id') || body.id;
    
    if (!categoryId) {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        message: 'Category ID is required',
      }, {
        status: 400,
        headers: createCORSHeaders(),
      });
    }
    
    console.log(`Updating project category with ID: ${categoryId}`);
    console.log('Update data:', JSON.stringify(body, null, 2));
    
    // Remove ID from body to avoid conflicts
    delete body.id;
    
    // Process parent relationship if provided
    if (body.parent && typeof body.parent === 'object') {
      if (body.parent.value) {
        body.parent = body.parent.value;
      } else if (body.parent.relationTo && body.parent.value) {
        body.parent = body.parent.value;
      }
    }
    
    // Process featured image if provided
    if (body.featuredImage && typeof body.featuredImage === 'object') {
      if (body.featuredImage.value) {
        body.featuredImage = body.featuredImage.value;
      }
    }
      // Ensure type is set to project_category
    body.type = 'project_category';
    
    // Update the category
    const result = await payload.update({
      collection: 'categories',
      id: categoryId,
      data: body,
      depth: 2,
    });
    
    console.log(`Successfully updated project category with ID: ${categoryId}`);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Project category updated successfully',
    }, {
      status: 200,
      headers: createCORSHeaders(),
    });
    
  } catch (error) {
    console.error('Error in PUT /api/project-categories:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }, {
      status: 500,
      headers: createCORSHeaders(),
    });
  }
}
