import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({
      config: configPromise,
    });

    // Get registration details
    const registration = await payload.findByID({
      collection: 'event-registrations',
      id: id,
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Không tìm thấy đăng ký' },
        { status: 404 }
      );
    }

    // Prepare email content
    const emailContent = `
      Chào ${registration.fullName},

      Cảm ơn bạn đã đăng ký tham gia sự kiện "${registration.eventTitle}".

      Thông tin đăng ký của bạn:
      - Họ tên: ${registration.fullName}
      - Email: ${registration.email}
      - Số điện thoại: ${registration.phone}
      - Loại tham gia: ${registration.participationType === 'in-person' ? 'Trực tiếp' :
                       registration.participationType === 'online' ? 'Online' : 'Cả hai'}
      ${registration.organization ? `- Tổ chức: ${registration.organization}` : ''}

      Chúng tôi sẽ gửi thông tin chi tiết về sự kiện qua email này trong thời gian sớm nhất.

      Trân trọng,
      Đội ngũ VRC
    `;

    // Send email (In a real app, you would use a proper email service)
    console.log(`📧 Sending confirmation email to ${registration.email}`);
    console.log(`Email content:\n${emailContent}`);

    // Update registration to mark confirmation as sent
    await payload.update({
      collection: 'event-registrations',
      id: id,
      data: {
        confirmationSent: true,
        status: 'confirmed',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email xác nhận đã được gửi thành công',
    });

  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi email xác nhận.' },
      { status: 500 }
    );
  }
}
