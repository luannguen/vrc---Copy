import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  handleOptionsRequest,
  createCORSResponse,
  handleApiError
} from '../_shared/cors';


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    })

    // Parse the request body
    const body = await req.json()
    const { name, email, phone, subject, message } = body    // Validate required fields
    if (!name || !email || !message) {
      return handleApiError(new Error('Missing required fields'), 'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Email và Nội dung', 400)
    }

    // Create a new contact submission
    const submission = await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        phone: phone || '',
        subject: subject || 'general',
        message,
        status: 'new',
      },
    })    // Return success response
    return createCORSResponse({
      success: true,
      message: 'Yêu cầu liên hệ đã được gửi thành công',
      submission: {
        id: submission.id,
        createdAt: submission.createdAt,
      }
    }, 200)  } catch (error) {
    console.error('Error submitting contact form:', error)
    return handleApiError(error, 'Đã xảy ra lỗi khi gửi yêu cầu liên hệ. Vui lòng thử lại sau.', 500)
  }
}

// Handle CORS preflight requests
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}