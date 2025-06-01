import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

// Helper function to create proper Rich Text format - exactly like posts.ts
const createRichText = (text: string) => {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              text: text,
              version: 1,
            },
          ],
        },
      ],
      direction: null,
      format: '' as "" | "left" | "start" | "center" | "right" | "end" | "justify" | undefined,
      indent: 0,
      version: 1,
    }
  };
};

// Hardcode data extracted from About.tsx
const HARDCODE_ABOUT_DATA = {
  heroSection: {
    title: "Giới thiệu",
    subtitle: "Tổng công ty Kỹ thuật lạnh Việt Nam (VRC) - Đơn vị tiên phong trong lĩnh vực kỹ thuật lạnh với hơn 20 năm kinh nghiệm, cung cấp giải pháp toàn diện trong lĩnh vực điện lạnh cho các công trình dân dụng và công nghiệp."
  },
  companyHistory: {
    title: "Lịch sử phát triển",
    description: createRichText("Được thành lập vào năm 2003, VRC đã trải qua hành trình phát triển dài hơn 20 năm, không ngừng mở rộng quy mô và nâng cao chất lượng dịch vụ. Từ một đơn vị chuyên về lắp đặt và bảo dưỡng hệ thống điều hòa không khí, VRC đã phát triển thành Tổng công ty hàng đầu trong lĩnh vực kỹ thuật lạnh tại Việt Nam với nhiều chi nhánh trên toàn quốc. Ngày nay, VRC tự hào là đối tác tin cậy của nhiều tập đoàn lớn trong và ngoài nước, cung cấp giải pháp điện lạnh toàn diện cho các công trình quy mô lớn."),
    establishedYear: 2003,
    experienceYears: 20
  },
  vision: {
    title: "Tầm nhìn",
    description: createRichText("Trở thành đơn vị hàng đầu trong lĩnh vực kỹ thuật lạnh tại Việt Nam và khu vực Đông Nam Á, cung cấp những giải pháp tiên tiến, thân thiện với môi trường và hiệu quả năng lượng. Chúng tôi không ngừng đổi mới và ứng dụng công nghệ tiên tiến, hướng tới mục tiêu phát triển bền vững và góp phần vào việc bảo vệ môi trường."),
    icon: "eye"
  },
  mission: {
    title: "Sứ mệnh",
    description: createRichText("Cung cấp các giải pháp điện lạnh toàn diện, hiệu quả và tin cậy cho khách hàng, đồng thời tạo ra môi trường làm việc chuyên nghiệp cho nhân viên và đóng góp tích cực cho xã hội. Mang đến những không gian sống và làm việc thoải mái, an toàn và tiết kiệm năng lượng thông qua các sản phẩm và dịch vụ chất lượng cao."),
    icon: "target"
  },
  coreValues: [
    {
      title: "Chất lượng hàng đầu",
      description: createRichText("Chúng tôi cam kết mang đến sản phẩm và dịch vụ chất lượng cao, đáp ứng và vượt trội so với mong đợi của khách hàng."),
      icon: "award"
    },
    {
      title: "Đổi mới sáng tạo",
      description: createRichText("Không ngừng cải tiến và ứng dụng công nghệ tiên tiến để mang đến những giải pháp hiệu quả và tiết kiệm năng lượng."),
      icon: "innovation"
    },
    {
      title: "Khách hàng là trọng tâm",
      description: createRichText("Luôn đặt nhu cầu và sự hài lòng của khách hàng lên hàng đầu, cung cấp dịch vụ tận tâm và chuyên nghiệp."),
      icon: "heart"
    }
  ],
  leadership: [
    {
      name: "Nguyễn Văn A",
      position: "Chủ tịch Hội đồng Quản trị",
      bio: createRichText("Với hơn 25 năm kinh nghiệm trong lĩnh vực kỹ thuật lạnh, ông A đã dẫn dắt VRC phát triển từ một công ty nhỏ thành tập đoàn hàng đầu.")
    },
    {
      name: "Trần Thị B",
      position: "Tổng Giám đốc",
      bio: createRichText("Bà B có bằng Thạc sĩ Quản trị Kinh doanh và hơn 20 năm kinh nghiệm quản lý trong các tập đoàn đa quốc gia.")
    },
    {
      name: "Lê Văn C",
      position: "Phó Tổng Giám đốc",
      bio: createRichText("Ông C là chuyên gia hàng đầu về công nghệ điện lạnh với nhiều bằng sáng chế và giải pháp kỹ thuật tiên tiến.")
    },
    {
      name: "Phạm Thị D",
      position: "Giám đốc Tài chính",
      bio: createRichText("Bà D có chứng chỉ CPA và hơn 15 năm kinh nghiệm trong lĩnh vực tài chính doanh nghiệp.")
    }
  ],
  achievements: [
    {
      title: "Top 10 Doanh nghiệp Tiêu biểu",
      description: "Ngành Cơ điện lạnh Việt Nam",
      icon: "award"
    },
    {
      title: "Giải thưởng Chất lượng Quốc gia",
      description: "Dịch vụ xuất sắc trong lĩnh vực kỹ thuật lạnh",
      icon: "medal"
    },
    {
      title: "Chứng nhận ISO 9001:2015",
      description: "Hệ thống quản lý chất lượng quốc tế",
      icon: "certificate"
    },
    {
      title: "1000+ Dự án lớn hoàn thành",
      description: "Thực hiện thành công cho các công trình trọng điểm",
      icon: "award"
    },
    {
      title: "Chứng nhận Xanh",
      description: "Giải pháp thân thiện với môi trường",
      icon: "medal"
    },
    {
      title: "500+ Nhân viên chuyên nghiệp",
      description: "Đội ngũ kỹ sư và kỹ thuật viên toàn quốc",
      icon: "team"
    }
  ]
};

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
 * Seed about page settings with hardcoded data
 * POST /api/seed-about-page
 */
export async function POST() {
  try {
    const payload = await getPayload({ config });

    // Update AboutPageSettings Global with hardcode data
    const result = await payload.updateGlobal({
      slug: 'about-page-settings',
      data: HARDCODE_ABOUT_DATA,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'About page seeded successfully',
        data: result
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );
  } catch (error) {
    console.error('Error seeding about page:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed about page',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
