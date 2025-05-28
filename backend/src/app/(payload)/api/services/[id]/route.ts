import { NextRequest, NextResponse } from 'next/server'
import {
  handleOptionsRequest,
  handleApiError,
  createCORSHeaders
} from '../../_shared/cors'
import { handlePUT } from '../handlers/put'
import { handleDELETE } from '../handlers/delete'

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}

// PUT method handler for updating services by ID
export function PUT(req: NextRequest) {
  return handlePUT(req);
}

// PATCH method handler (alias for PUT)
export function PATCH(req: NextRequest) {
  return handlePUT(req);
}

// DELETE method handler for deleting services by ID
export function DELETE(req: NextRequest) {
  return handleDELETE(req);
}

// GET method for fetching single service by ID
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const serviceId = pathParts[pathParts.length - 1]
    
    if (!serviceId) {
      const headers = createCORSHeaders()
      return NextResponse.json(
        {
          success: false,
          message: 'Service ID is required',
        },
        {
          status: 400,
          headers,
        }
      )
    }

    // Redirect to main services endpoint with slug parameter
    const redirectUrl = new URL('/api/services', req.url)
    redirectUrl.searchParams.set('id', serviceId)
    
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('Service GET by ID Error:', error)
    const headers = createCORSHeaders()
    return handleApiError(error, 'Failed to fetch service', 500)
  }
}
