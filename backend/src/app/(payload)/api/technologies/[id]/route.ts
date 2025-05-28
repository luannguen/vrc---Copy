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

// PUT method handler for updating technologies by ID
export function PUT(req: NextRequest) {
  return handlePUT(req);
}

// PATCH method handler (alias for PUT)
export function PATCH(req: NextRequest) {
  return handlePUT(req);
}

// DELETE method handler for deleting technologies by ID
export function DELETE(req: NextRequest) {
  return handleDELETE(req);
}

// GET method for fetching single technology by ID
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const technologyId = pathParts[pathParts.length - 1]
    
    if (!technologyId) {
      const headers = createCORSHeaders()
      return NextResponse.json(
        {
          success: false,
          message: 'Technology ID is required',
        },
        {
          status: 400,
          headers,
        }
      )
    }

    // Redirect to main GET handler with ID parameter
    const redirectUrl = new URL(req.url)
    redirectUrl.pathname = '/api/technologies'
    redirectUrl.searchParams.set('id', technologyId)
    
    const { handleGET } = await import('../handlers/get')
    const newRequest = new NextRequest(redirectUrl, {
      method: 'GET',
      headers: req.headers,
    })
    
    return handleGET(newRequest)
    
  } catch (error: any) {
    console.error('GET /api/technologies/[id]: Error:', error)
    return handleApiError(error, 'Failed to fetch technology')
  }
}
