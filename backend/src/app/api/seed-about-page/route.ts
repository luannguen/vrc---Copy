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

// Updated data with extended leadership profiles
const UPDATED_ABOUT_DATA = {
  heroSection: {
    title: "Giới thiệu",
    subtitle: "Tổng công ty Kỹ thuật lạnh Việt Nam (VRC) - Đơn vị tiên phong trong lĩnh vực kỹ thuật lạnh với hơn 20 năm kinh nghiệm, cung cấp giải pháp toàn diện trong lĩnh vực điện lạnh cho các công trình dân dụng và công nghiệp."
  },
  companyHistory: {
    title: "Lịch sử phát triển",
    description: createRichText("Được thành lập vào năm 2003, VRC đã trải qua hành trình phát triển dài hơn 20 năm, không ngừng mở rộng quy mô và nâng cao chất lượng dịch vụ. Từ một đơn vị chuyên về lắp đặt và bảo dưỡng hệ thống điều hòa không khí, VRC đã phát triển thành Tổng công ty hàng đầu trong lĩnh vực kỹ thuật lạnh tại Việt Nam với nhiều chi nhánh trên toàn quốc."),
    establishedYear: 2003,
    experienceYears: 20
  },
  vision: {
    title: "Tầm nhìn",
    description: createRichText("Trở thành đơn vị hàng đầu trong lĩnh vực kỹ thuật lạnh tại Việt Nam và khu vực Đông Nam Á, cung cấp những giải pháp tiên tiến, thân thiện với môi trường và hiệu quả năng lượng."),
    icon: "eye"
  },
  mission: {
    title: "Sứ mệnh",
    description: createRichText("Cung cấp các giải pháp điện lạnh toàn diện, hiệu quả và tin cậy cho khách hàng, đồng thời tạo ra môi trường làm việc chuyên nghiệp cho nhân viên và đóng góp tích cực cho xã hội."),
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
      bio: createRichText("Với hơn 25 năm kinh nghiệm trong lĩnh vực kỹ thuật lạnh, ông A đã dẫn dắt VRC phát triển từ một công ty nhỏ thành tập đoàn hàng đầu."),
      detailedBio: createRichText("Ông Nguyễn Văn A tốt nghiệp Đại học Bách khoa Hà Nội chuyên ngành Kỹ thuật Nhiệt lạnh năm 1998. Bắt đầu sự nghiệp với vai trò kỹ sư tại một công ty Nhật Bản, ông đã tích lũy được kinh nghiệm quý báu về công nghệ và quản lý. Năm 2003, ông thành lập VRC với tầm nhìn đưa công nghệ điện lạnh tiên tiến đến Việt Nam. Dưới sự lãnh đạo của ông, VRC đã trở thành tập đoàn hàng đầu với hơn 500 nhân viên và 50+ chi nhánh trên toàn quốc."),
      experience: "25+ năm",
      education: "Thạc sĩ Kỹ thuật Nhiệt lạnh - ĐH Bách khoa Hà Nội",
      expertise: [
        { skill: "Quản trị doanh nghiệp" },
        { skill: "Công nghệ điện lạnh" },
        { skill: "Phát triển chiến lược" }
      ],
      achievements: [
        { achievement: "Sáng lập VRC từ năm 2003" },
        { achievement: "Dẫn dắt công ty từ 5 nhân viên lên 500+" },
        { achievement: "Giải thưởng Doanh nhân tiêu biểu 2020" },
        { achievement: "Chứng chỉ PMP - Project Management Professional" }
      ],
      quote: "Thành công của doanh nghiệp nằm ở việc không ngừng đổi mới và đặt khách hàng làm trung tâm.",
      email: "chairman@vrc.com.vn",
      phone: "+84 24 3999 1234",
      linkedin: "https://linkedin.com/in/nguyen-van-a",
      projects: [
        {
          name: "Hệ thống điều hòa Vincom Center",
          description: "Thiết kế và lắp đặt hệ thống điều hòa cho 50+ tòa nhà Vincom",
          year: "2018-2020"
        },
        {
          name: "Smart Cooling System",
          description: "Phát triển hệ thống điều hòa thông minh tiết kiệm 40% năng lượng",
          year: "2019-2022"
        }
      ]
    },
    {
      name: "Trần Thị B",
      position: "Tổng Giám đốc",
      bio: createRichText("Bà B có bằng Thạc sĩ Quản trị Kinh doanh và hơn 20 năm kinh nghiệm quản lý trong các tập đoàn đa quốc gia."),
      detailedBio: createRichText("Bà Trần Thị B tốt nghiệp MBA tại Singapore Management University và có bằng Cử nhân Kinh tế đối ngoại. Trước khi gia nhập VRC năm 2010, bà đã làm việc 15 năm tại các tập đoàn đa quốc gia như Samsung, LG Electronics ở vị trí quản lý cấp cao. Với kinh nghiệm quản lý và tầm nhìn chiến lược, bà đã giúp VRC mở rộng thị trường quốc tế và thiết lập quan hệ đối tác với nhiều thương hiệu lớn trên thế giới."),
      experience: "20+ năm",
      education: "MBA - Singapore Management University",
      expertise: [
        { skill: "Quản trị chiến lược" },
        { skill: "Phát triển thị trường quốc tế" },
        { skill: "Quản lý nhân sự" }
      ],
      achievements: [
        { achievement: "Mở rộng VRC ra 10+ tỉnh thành mới" },
        { achievement: "Thiết lập quan hệ đối tác với 50+ thương hiệu quốc tế" },
        { achievement: "Tăng doanh thu công ty 300% trong 5 năm" },
        { achievement: "Giải thưởng Nữ lãnh đạo xuất sắc 2021" }
      ],
      quote: "Lãnh đạo không phải là về quyền lực, mà là về trách nhiệm và cảm hứng.",
      email: "ceo@vrc.com.vn",
      phone: "+84 24 3999 1235",
      linkedin: "https://linkedin.com/in/tran-thi-b",
      projects: [
        {
          name: "Mở rộng thị trường Đông Nam Á",
          description: "Thiết lập chi nhánh VRC tại 5 quốc gia ASEAN",
          year: "2020-2023"
        }
      ]
    },
    {
      name: "Lê Văn C",
      position: "Phó Tổng Giám đốc",
      bio: createRichText("Ông C là chuyên gia hàng đầu về công nghệ điện lạnh với nhiều bằng sáng chế và giải pháp kỹ thuật tiên tiến."),
      detailedBio: createRichText("Ông Lê Văn C là Tiến sĩ Kỹ thuật Nhiệt lạnh với hơn 22 năm kinh nghiệm trong lĩnh vực R&D. Ông đã nghiên cứu và phát triển nhiều giải pháp tiết kiệm năng lượng độc quyền cho VRC. Ông cũng là tác giả của 15+ bài báo khoa học quốc tế và sở hữu 8 bằng sáng chế về công nghệ điện lạnh."),
      experience: "22+ năm",
      education: "Tiến sĩ Kỹ thuật Nhiệt lạnh - ĐH Bách khoa TP.HCM",
      expertise: [
        { skill: "R&D" },
        { skill: "Công nghệ tiết kiệm năng lượng" },
        { skill: "IoT và AI" },
        { skill: "Nghiên cứu khoa học" }
      ],
      achievements: [
        { achievement: "8 bằng sáng chế về công nghệ điện lạnh" },
        { achievement: "15+ bài báo khoa học quốc tế" },
        { achievement: "Phát triển hệ thống Smart Cooling tiết kiệm 40% năng lượng" },
        { achievement: "Giải thưởng Sáng tạo Khoa học Công nghệ 2019" }
      ],
      quote: "Đổi mới công nghệ là chìa khóa để tạo ra tương lai bền vững.",
      email: "cto@vrc.com.vn",
      phone: "+84 24 3999 1236",
      linkedin: "https://linkedin.com/in/le-van-c",
      projects: [
        {
          name: "VRC Smart Cooling Platform",
          description: "Nền tảng IoT quản lý hệ thống điều hòa thông minh",
          year: "2019-2023"
        },
        {
          name: "Green Tech Initiative",
          description: "Chương trình phát triển công nghệ xanh cho ngành điện lạnh",
          year: "2021-2024"
        }
      ]
    },
    {
      name: "Phạm Thị D",
      position: "Giám đốc Tài chính",
      bio: createRichText("Bà D có chứng chỉ CPA và hơn 15 năm kinh nghiệm trong lĩnh vực tài chính doanh nghiệp."),
      detailedBio: createRichText("Bà Phạm Thị D là Thạc sĩ Tài chính - Ngân hàng và có chứng chỉ CPA (Certified Public Accountant). Trước khi gia nhập VRC năm 2015, bà đã làm việc 12 năm tại các ngân hàng lớn và công ty kiểm toán Big 4. Với chuyên môn vững vàng về tài chính và kế toán, bà đã xây dựng hệ thống tài chính minh bạch, giúp VRC IPO thành công năm 2020."),
      experience: "15+ năm",
      education: "Thạc sĩ Tài chính - Ngân hàng, CPA",
      expertise: [
        { skill: "Tài chính doanh nghiệp" },
        { skill: "Kiểm toán" },
        { skill: "IPO và M&A" },
        { skill: "Quản lý rủi ro" }
      ],
      achievements: [
        { achievement: "Dẫn dắt IPO thành công của VRC năm 2020" },
        { achievement: "Xây dựng hệ thống ERP tài chính toàn diện" },
        { achievement: "Tăng trưởng lợi nhuận ổn định 25%/năm" },
        { achievement: "Chứng chỉ CPA và CFA" }
      ],
      quote: "Tài chính minh bạch là nền tảng cho sự phát triển bền vững.",
      email: "cfo@vrc.com.vn",
      phone: "+84 24 3999 1237",
      linkedin: "https://linkedin.com/in/pham-thi-d",
      projects: [
        {
          name: "VRC IPO 2020",
          description: "Dẫn dắt quá trình niêm yết cổ phiếu VRC trên sàn HOSE",
          year: "2019-2020"
        },
        {
          name: "Digital Finance Transformation",
          description: "Chuyển đổi số toàn bộ hệ thống tài chính VRC",
          year: "2021-2022"
        }
      ]
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
 * Seed about page settings with updated leadership data
 * POST /api/seed-about-page
 */
export async function POST() {
  try {
    const payload = await getPayload({ config });

    // Update AboutPageSettings Global with updated data
    const result = await payload.updateGlobal({
      slug: 'about-page-settings',
      data: UPDATED_ABOUT_DATA,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'About page seeded successfully with extended leadership profiles',
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
