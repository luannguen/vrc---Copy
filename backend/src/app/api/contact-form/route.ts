import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/**
 * Submit homepage contact form
 * POST /api/contact-form
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });

    const body = await req.json();
    console.log('Homepage form submission:', body);

    // Validate required fields
    const { name, email, message, subject, phone } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng điền đầy đủ họ tên, email và nội dung.',
        },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng nhập địa chỉ email hợp lệ.',
        },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    // Try to find the homepage contact form first
    let formToUse = null;
    try {
      const homepageForm = await payload.find({
        collection: 'forms',
        where: {
          title: { equals: 'Homepage Contact Form' }
        },
        limit: 1,
      });      if (homepageForm.docs.length > 0 && homepageForm.docs[0]) {
        formToUse = homepageForm.docs[0].id;
      }
    } catch (error) {
      console.warn('Could not find homepage form:', error);
    }

    // If no specific form found, use a fallback ID or create one
    if (!formToUse) {
      formToUse = 'homepage-contact-form'; // Fallback string ID
    }

    // Create form submission
    const submissionData = [
      { field: 'name', value: name },
      { field: 'email', value: email },
      { field: 'message', value: message },
      { field: 'subject', value: subject || 'general' },
    ];

    // Add phone if provided
    if (phone) {
      submissionData.push({ field: 'phone', value: phone });
    }

    const formSubmission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: formToUse,
        submissionData,
      },
    });

    // Also create a record in contact-submissions for admin convenience
    try {
      await payload.create({
        collection: 'contact-submissions',
        data: {
          name,
          email,
          phone: phone || '',
          subject: subject || 'general',
          message,
          status: 'new',
        },
      });
    } catch (error) {
      console.warn('Could not create contact submission record:', error);
      // Don't fail the entire request if this fails
    }

    // Get confirmation message from the form template
    let confirmationMessage = 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.';

    if (typeof formToUse === 'string' && formToUse !== 'homepage-contact-form') {
      try {
        const formTemplate = await payload.findByID({
          collection: 'forms',
          id: formToUse,
        });

        if (formTemplate?.confirmationMessage) {
          // Extract text from Lexical editor format
          const lexicalContent = formTemplate.confirmationMessage;          if (lexicalContent?.root?.children) {
            // Extract text from Lexical editor format - simplified
            const textContent = JSON.stringify(lexicalContent).match(/"text":"([^"]+)"/g);
            if (textContent) {
              confirmationMessage = textContent
                .map(match => match.replace(/"text":"/, '').replace(/"$/, ''))
                .join(' ')
                .trim() || confirmationMessage;
            }
          }
        }
      } catch (error) {
        console.warn('Could not get confirmation message from form template:', error);
      }
    }

    console.log('Form submission created successfully:', formSubmission.id);

    return NextResponse.json(
      {
        success: true,
        message: confirmationMessage,
        data: {
          id: formSubmission.id,
          submittedAt: formSubmission.createdAt,
        },
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error('Error submitting form:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi gửi form. Vui lòng thử lại.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
