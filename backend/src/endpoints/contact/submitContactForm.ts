/**
 * @deprecated This file is kept for reference only. The actual contact form submission 
 * functionality has been moved to the Next.js API route at:
 * /src/app/(payload)/api/contact/route.ts
 * 
 * Any changes should be made to the new route handler, not this file.
 */

import type { PayloadRequest } from 'payload';
import type { Response } from 'express';

// Endpoint để nhận form liên hệ từ frontend
export const submitContactFormEndpoint = async (req: PayloadRequest, res: Response): Promise<void> => {
  try {
    // This code is no longer in use - see comment at top of file
    const body = req.body as any;
    const { name, email, phone, subject, message } = body;

    // Validate dữ liệu đầu vào
    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Email và Nội dung',
      });
      return;
    }

    // Tạo contact submission mới trong database
    const submission = await req.payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        phone: phone || '',
        subject: subject || 'general',
        message,
        status: 'new',
      }
    });

    // Có thể thêm logic gửi email thông báo ở đây
    // ...

    res.status(200).json({
      success: true,
      message: 'Yêu cầu liên hệ đã được gửi thành công',
      submission: {
        id: submission.id,
        createdAt: submission.createdAt,
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi gửi yêu cầu liên hệ. Vui lòng thử lại sau.',
    });
  }
};
