import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createCORSHeaders, handleApiError } from '../../_shared/cors'

export async function handlePUT(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })
    
    // Extract service ID from URL first
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    let serviceId = pathParts[pathParts.length - 1]
    
    // Handle both /api/services/[id] and /api/services patterns
    if (serviceId === 'services') {
      serviceId = url.searchParams.get('id') || ''
    }
    
    console.log('PUT request details:', {
      url: req.url,
      pathname: url.pathname,
      pathParts,
      extractedId: serviceId
    })
    
    if (!serviceId || serviceId === 'services') {
      const headers = createCORSHeaders()
      return NextResponse.json(
        {
          success: false,
          message: 'Service ID is required for update',
        },
        {
          status: 400,
          headers,
        }
      )
    }

    // Parse request body based on content type
    let serviceData: any = {}
    const contentType = req.headers.get('content-type') || ''
    
    console.log('PUT request content type:', contentType)

    if (contentType.includes('application/json')) {
      serviceData = await req.json()
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      
      // Handle admin panel form submission with _payload field
      if (formData.has('_payload')) {
        const payloadData = JSON.parse(formData.get('_payload') as string)
        serviceData = payloadData
        console.log('PUT: Parsed _payload field from form data')
      } else {
        // Convert form data to object
        formData.forEach((value, key) => {
          serviceData[key] = value
        })
      }
    } else {
      // Fallback to JSON parsing
      serviceData = await req.json()
    }

    // Check if request is from admin panel
    const isAdminRequest = req.headers.get('referer')?.includes('/admin') ||
                          contentType.includes('multipart/form-data')

    // Process relatedServices field using the same pattern as POST
    if (serviceData.relatedServices !== undefined) {
      console.log('Processing relatedServices for update:', {
        id: serviceId,
        originalValue: serviceData.relatedServices,
        type: typeof serviceData.relatedServices
      })

      // Handle null, undefined, or 0 values
      if (serviceData.relatedServices === null || serviceData.relatedServices === 0) {
        serviceData.relatedServices = []
        console.log('Converted null/0 relatedServices to empty array')
      }
      // Handle empty string
      else if (serviceData.relatedServices === '') {
        serviceData.relatedServices = []
        console.log('Converted empty string relatedServices to empty array')
      }
      // Handle string input (could be JSON or single ID)
      else if (typeof serviceData.relatedServices === 'string') {
        const trimmed = serviceData.relatedServices.trim()
        if (trimmed === '' || trimmed === '[]') {
          serviceData.relatedServices = []
          console.log('Converted empty/bracket string to empty array')
        } else {
          try {
            // Try to parse as JSON first
            const parsed = JSON.parse(trimmed)
            serviceData.relatedServices = Array.isArray(parsed) ? parsed : [parsed]
            console.log('Parsed JSON string relatedServices:', serviceData.relatedServices)
          } catch {
            // If not JSON, treat as single ID
            serviceData.relatedServices = [trimmed]
            console.log('Converted single ID string to array:', serviceData.relatedServices)
          }
        }
      }
      // Handle single object (convert to array)
      else if (typeof serviceData.relatedServices === 'object' && !Array.isArray(serviceData.relatedServices)) {
        serviceData.relatedServices = serviceData.relatedServices ? [serviceData.relatedServices] : []
        console.log('Converted single object to array:', serviceData.relatedServices)
      }
      // Handle array (ensure it's properly formatted)
      else if (Array.isArray(serviceData.relatedServices)) {        serviceData.relatedServices = serviceData.relatedServices.filter((item: any) => 
          item !== null && item !== undefined && item !== ''
        )
        console.log('Filtered array relatedServices:', serviceData.relatedServices)
      }

      console.log('Final processed relatedServices for update:', {
        id: serviceId,
        finalValue: serviceData.relatedServices,
        isArray: Array.isArray(serviceData.relatedServices),
        length: Array.isArray(serviceData.relatedServices) ? serviceData.relatedServices.length : 'N/A'
      })
    }

    // Update the service
    const updatedService = await payload.update({
      collection: 'services',
      id: serviceId,
      data: serviceData,
      depth: 2,
    })

    console.log('Service updated successfully:', {
      id: updatedService.id,
      title: updatedService.title,
      relatedServicesCount: updatedService.relatedServices?.length || 0
    })

    const headers = createCORSHeaders()

    // Return response based on request type
    if (isAdminRequest) {
      // Admin panel format
      return NextResponse.json(
        {
          message: 'Service updated successfully',
          doc: updatedService,
          errors: []
        },
        {
          status: 200,
          headers,
        }
      )
    } else {
      // API format
      return NextResponse.json(
        {
          success: true,
          data: updatedService,
          message: 'Service updated successfully'
        },
        {
          status: 200,
          headers,
        }
      )
    }

  } catch (error: any) {
    console.error('Service PUT Error:', {
      error: error.message,
      stack: error.stack,
      url: req.url
    })

    const headers = createCORSHeaders()
    
    // Check if it's a validation error
    if (error.name === 'ValidationError' || error.message?.includes('validation')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error occurred',
          errors: error.data || [{ message: error.message }]
        },
        {
          status: 422,
          headers,
        }
      )
    }

    return handleApiError(error, 'Failed to update service', 500)
  }
}
