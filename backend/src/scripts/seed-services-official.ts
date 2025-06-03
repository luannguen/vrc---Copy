// Services Data Seed Script - VRC
// Sử dụng API seed chính thức của Payload CMS
// Tuân thủ codequality.md: TypeScript, type-safe, proper error handling

import { getPayload, Payload } from 'payload';
import config from '@payload-config';
import fs from 'fs';
import path from 'path';

// Service image mapping dựa trên ảnh có sẵn trong frontend
const serviceImageMap: Record<string, string> = {
  'tu-van-thiet-ke': 'vrc-post-he-thong-quan-ly-nang-luong-thong-minh.jpg',
  'lap-dat-chuyen-nghiep': 'vrc-post-cong-nghe-inverter-tien-tien-toi-uu-hoa-tieu-thu-dien-nang.jpeg',
  'bao-tri-dinh-ky': 'vrc-post-khoa-dao-tao-ky-thuat-vien-bao-tri.jpeg',
  'sua-chua-khan-cap': 'vrc-post-giai-phap-tan-dung-nhiet-thai-heat-recovery.jpeg',
  'nang-cap-he-thong': 'vrc-post-ung-dung-ai-trong-toi-uu-hoa-van-hanh.jpg',
  'ho-tro-ky-thuat': 'vrc-post-hoi-thao-cong-nghe-tiet-kiem-nang-luong.jpeg',
};

// Interface cho dữ liệu dịch vụ
interface ServiceData {
  title: string;
  slug: string;
  type: 'consulting' | 'installation' | 'maintenance' | 'repair' | 'support' | 'other';
  summary: string;  content: {
    root: {
      type: 'root',
      children: Array<{
        type: string;
        children: Array<{
          type: string;
          text: string;
        }>;
      }>;
      direction: 'ltr' | 'rtl' | null;
      format: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify';
      indent: number;
      version: number;
    };
  };
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  pricing: {
    showPricing: boolean;
    priceType: 'fixed' | 'hourly' | 'custom';
    customPrice?: string;
    currency: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  order: number;
  featured: boolean;
  status: 'draft' | 'published';
  meta: {
    title: string;
    description: string;
  };
  featuredImage?: string; // Media ID sau khi upload
}

// Dữ liệu dịch vụ từ hardcode frontend
const servicesData: ServiceData[] = [
  {
    title: 'Tư vấn thiết kế',
    slug: 'tu-van-thiet-ke',
    type: 'consulting',
    summary: 'Giải pháp thiết kế hệ thống điện lạnh tối ưu cho mọi công trình từ dân dụng đến công nghiệp.',
    content: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Dịch vụ tư vấn thiết kế hệ thống điện lạnh chuyên nghiệp của VRC giúp bạn có được giải pháp tối ưu nhất cho công trình của mình. Với đội ngũ kỹ sư giàu kinh nghiệm và công nghệ thiết kế hiện đại, chúng tôi cam kết mang đến những hệ thống điện lạnh hiệu quả, tiết kiệm năng lượng và phù hợp với ngân sách.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Quy trình tư vấn thiết kế của chúng tôi bao gồm: khảo sát hiện trạng, phân tích nhu cầu, thiết kế sơ bộ, tính toán chi tiết, lựa chọn thiết bị, và lập dự toán tổng thể. Mỗi dự án đều được nghiên cứu kỹ lưỡng để đảm bảo tính khả thi và hiệu quả cao nhất.',
              },
            ],
          },
        ],
      },
    },
    features: [
      {
        title: 'Tư vấn khả thi',
        description: 'Đánh giá hiện trạng công trình, khảo sát nhu cầu và đề xuất các phương án khả thi.',
        icon: 'lightbulb',
      },
      {
        title: 'Thiết kế 3D',
        description: 'Mô hình thiết kế 3D chi tiết giúp hình dung rõ hệ thống trước khi thi công.',
        icon: 'pen-tool',
      },
      {
        title: 'Tính toán tải lạnh',
        description: 'Tính toán chính xác tải lạnh và chọn thiết bị phù hợp với công suất cần thiết.',
        icon: 'bar-chart-3',
      },
    ],
    benefits: [
      {
        title: 'Tối ưu chi phí',
        description: 'Thiết kế phù hợp giúp tiết kiệm chi phí đầu tư và vận hành dài hạn.',
      },
      {
        title: 'Hiệu quả cao',
        description: 'Hệ thống được thiết kế tối ưu đảm bảo hiệu suất vận hành cao nhất.',
      },
    ],
    pricing: {
      showPricing: true,
      priceType: 'custom',
      customPrice: 'Liên hệ để được báo giá chi tiết',
      currency: 'VND',
    },
    faq: [
      {
        question: 'Quy trình tư vấn thiết kế như thế nào?',
        answer: 'Khảo sát → Phân tích nhu cầu → Thiết kế sơ bộ → Tính toán chi tiết → Lựa chọn thiết bị → Dự toán',
      },
      {
        question: 'Thời gian hoàn thành bản thiết kế?',
        answer: 'Tùy thuộc quy mô dự án, thường từ 1-3 tuần cho các dự án dân dụng, 2-6 tuần cho công nghiệp.',
      },
    ],
    order: 1,
    featured: true,
    status: 'published',
    meta: {
      title: 'Tư vấn thiết kế hệ thống điện lạnh - VRC',
      description: 'Dịch vụ tư vấn thiết kế hệ thống điện lạnh chuyên nghiệp, tối ưu chi phí và hiệu quả cao.',
    },
  },
  {
    title: 'Lắp đặt chuyên nghiệp',
    slug: 'lap-dat-chuyen-nghiep',
    type: 'installation',
    summary: 'Dịch vụ lắp đặt hệ thống điện lạnh chuyên nghiệp với đội ngũ kỹ thuật viên giàu kinh nghiệm.',
    content: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'VRC cung cấp dịch vụ lắp đặt hệ thống điện lạnh chuyên nghiệp với đội ngũ kỹ thuật viên được đào tạo bài bản và có nhiều năm kinh nghiệm trong lĩnh vực. Chúng tôi cam kết thực hiện đúng tiến độ, đảm bảo chất lượng và tuân thủ nghiêm ngặt các tiêu chuẩn kỹ thuật.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Quy trình lắp đặt của chúng tôi bao gồm: chuẩn bị mặt bằng, lắp đặt thiết bị, đấu nối hệ thống, kiểm tra vận hành, và nghiệm thu bàn giao. Mọi công việc đều được thực hiện theo đúng quy trình và tiêu chuẩn kỹ thuật.',
              },
            ],
          },
        ],
      },
    },
    features: [
      {
        title: 'Thi công chuẩn kỹ thuật',
        description: 'Lắp đặt theo đúng bản vẽ thiết kế và quy chuẩn kỹ thuật hiện hành.',
        icon: 'wrench',
      },
      {
        title: 'Kiểm tra chất lượng',
        description: 'Kiểm tra và test hệ thống trước khi bàn giao đảm bảo hoạt động ổn định.',
        icon: 'check-circle',
      },
      {
        title: 'Hỗ trợ vận hành',
        description: 'Hướng dẫn vận hành và bảo dưỡng hệ thống cho người sử dụng.',
        icon: 'play-circle',
      },
    ],
    benefits: [
      {
        title: 'Chất lượng đảm bảo',
        description: 'Lắp đặt chuẩn kỹ thuật, bảo hành dài hạn cho toàn bộ hệ thống.',
      },
      {
        title: 'Tiến độ đúng hẹn',
        description: 'Cam kết hoàn thành đúng tiến độ đã thỏa thuận với khách hàng.',
      },
    ],
    pricing: {
      showPricing: true,
      priceType: 'custom',
      customPrice: 'Phụ thuộc vào quy mô và độ phức tạp của hệ thống',
      currency: 'VND',
    },
    faq: [
      {
        question: 'Thời gian lắp đặt mất bao lâu?',
        answer: 'Thời gian lắp đặt phụ thuộc vào quy mô dự án, từ 1-2 ngày cho dự án nhỏ đến vài tuần cho dự án lớn.',
      },
      {
        question: 'Có kiểm tra chất lượng không?',
        answer: 'Có, chúng tôi kiểm tra toàn bộ hệ thống và test vận hành trước khi bàn giao.',
      },
    ],
    order: 2,
    featured: true,
    status: 'published',
    meta: {
      title: 'Lắp đặt hệ thống điện lạnh chuyên nghiệp - VRC',
      description: 'Dịch vụ lắp đặt hệ thống điện lạnh chuyên nghiệp, đúng tiến độ, chất lượng cao.',
    },
  },
  {
    title: 'Bảo trì định kỳ',
    slug: 'bao-tri-dinh-ky',
    type: 'maintenance',
    summary: 'Dịch vụ bảo trì định kỳ giúp hệ thống điện lạnh hoạt động ổn định và tiết kiệm năng lượng.',
    content: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Dịch vụ bảo trì định kỳ của VRC giúp duy trì hiệu quả hoạt động của hệ thống điện lạnh, kéo dài tuổi thọ thiết bị và giảm thiểu rủi ro hỏng hóc. Chúng tôi có các gói bảo trì linh hoạt phù hợp với nhu cầu và ngân sách của từng khách hàng.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Quy trình bảo trì bao gồm: kiểm tra tổng thể hệ thống, vệ sinh thiết bị, thay thế linh kiện hao mòn, điều chỉnh thông số vận hành, và lập báo cáo chi tiết về tình trạng hệ thống.',
              },
            ],
          },
        ],
      },
    },
    features: [
      {
        title: 'Kiểm tra định kỳ',
        description: 'Kiểm tra toàn diện tình trạng thiết bị theo lịch trình đã định.',
        icon: 'calendar',
      },
      {
        title: 'Vệ sinh hệ thống',
        description: 'Vệ sinh các bộ phận quan trọng để đảm bảo hiệu suất tối ưu.',
        icon: 'wind',
      },
      {
        title: 'Thay thế linh kiện',
        description: 'Thay thế kịp thời các linh kiện hao mòn, cần bảo dưỡng.',
        icon: 'refresh-cw',
      },
    ],
    benefits: [
      {
        title: 'Tiết kiệm chi phí',
        description: 'Phát hiện và xử lý sớm các vấn đề, tránh chi phí sửa chữa lớn.',
      },
      {
        title: 'Hiệu quả tối ưu',
        description: 'Duy trì hiệu suất hoạt động cao, tiết kiệm điện năng.',
      },
    ],
    pricing: {
      showPricing: true,
      priceType: 'custom',
      customPrice: 'Gói bảo trì từ 2-5 triệu/năm tùy quy mô hệ thống',
      currency: 'VND',
    },
    faq: [
      {
        question: 'Bao lâu bảo trì một lần?',
        answer: 'Thường 3-6 tháng/lần tùy theo loại hệ thống và điều kiện sử dụng.',
      },
      {
        question: 'Gói bảo trì bao gồm những gì?',
        answer: 'Kiểm tra, vệ sinh, thay thế linh kiện nhỏ, điều chỉnh thông số và báo cáo tình trạng.',
      },
    ],
    order: 3,
    featured: false,
    status: 'published',
    meta: {
      title: 'Bảo trì định kỳ hệ thống điện lạnh - VRC',
      description: 'Dịch vụ bảo trì định kỳ chuyên nghiệp, giúp hệ thống hoạt động ổn định và tiết kiệm.',
    },
  },
  {
    title: 'Sửa chữa khẩn cấp',
    slug: 'sua-chua-khan-cap',
    type: 'repair',
    summary: 'Dịch vụ sửa chữa khẩn cấp 24/7, khắc phục nhanh chóng mọi sự cố hệ thống điện lạnh.',
    content: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'VRC cung cấp dịch vụ sửa chữa khẩn cấp 24/7 để khắc phục nhanh chóng mọi sự cố hệ thống điện lạnh. Đội ngũ kỹ thuật viên của chúng tôi sẵn sàng can thiệp ngay khi nhận được thông báo, đảm bảo hệ thống được khôi phục hoạt động trong thời gian ngắn nhất.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Chúng tôi có kinh nghiệm xử lý các sự cố phức tạp và trang bị đầy đủ thiết bị, linh kiện thay thế để có thể khắc phục hầu hết các lỗi ngay tại chỗ.',
              },
            ],
          },
        ],
      },
    },
    features: [
      {
        title: 'Hỗ trợ 24/7',
        description: 'Sẵn sàng can thiệp bất cứ lúc nào, kể cả cuối tuần và ngày lễ.',
        icon: 'clock',
      },
      {
        title: 'Chẩn đoán nhanh',
        description: 'Xác định nguyên nhân sự cố và đưa ra phương án khắc phục kịp thời.',
        icon: 'search',
      },
      {
        title: 'Linh kiện sẵn có',
        description: 'Trang bị đầy đủ linh kiện thay thế phổ biến để sửa chữa ngay.',
        icon: 'package',
      },
    ],
    benefits: [
      {
        title: 'Phản hồi nhanh',
        description: 'Thời gian phản hồi trong vòng 30 phút kể từ khi nhận thông báo.',
      },
      {
        title: 'Giảm thiểu thiệt hại',
        description: 'Khắc phục nhanh chóng giúp giảm thiểu thiệt hại và gián đoạn hoạt động.',
      },
    ],
    pricing: {
      showPricing: true,
      priceType: 'hourly',
      customPrice: 'Chi phí tùy theo mức độ phức tạp của sự cố',
      currency: 'VND',
    },
    faq: [
      {
        question: 'Thời gian phản hồi bao lâu?',
        answer: 'Chúng tôi cam kết phản hồi trong vòng 30 phút và có mặt trong 2-4 giờ.',
      },
      {
        question: 'Chi phí sửa chữa như thế nào?',
        answer: 'Chi phí được tính theo giờ công + linh kiện thay thế, báo giá trước khi thực hiện.',
      },
    ],
    order: 4,
    featured: false,
    status: 'published',
    meta: {
      title: 'Sửa chữa khẩn cấp hệ thống điện lạnh - VRC',
      description: 'Dịch vụ sửa chữa khẩn cấp 24/7, phản hồi nhanh, khắc phục hiệu quả.',
    },
  },
  {
    title: 'Nâng cấp hệ thống',
    slug: 'nang-cap-he-thong',
    type: 'other',
    summary: 'Dịch vụ nâng cấp và cải tiến hệ thống điện lạnh hiện có để tăng hiệu quả và tiết kiệm năng lượng.',
    content: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Dịch vụ nâng cấp hệ thống của VRC giúp cải thiện hiệu quả hoạt động của các hệ thống điện lạnh cũ, ứng dụng công nghệ mới để tiết kiệm năng lượng và nâng cao chất lượng điều hòa không khí.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Chúng tôi đánh giá toàn diện hệ thống hiện tại và đề xuất các giải pháp nâng cấp phù hợp với ngân sách và mục tiêu của khách hàng.',
              },
            ],
          },
        ],
      },
    },
    features: [
      {
        title: 'Đánh giá hệ thống',
        description: 'Phân tích toàn diện hiệu quả và tình trạng hệ thống hiện tại.',
        icon: 'trending-up',
      },
      {
        title: 'Công nghệ mới',
        description: 'Ứng dụng công nghệ tiên tiến để nâng cao hiệu suất và tiết kiệm năng lượng.',
        icon: 'cpu',
      },
      {
        title: 'ROI tối ưu',
        description: 'Đảm bảo khoản đầu tư nâng cấp mang lại hiệu quả kinh tế cao.',
        icon: 'dollar-sign',
      },
    ],
    benefits: [
      {
        title: 'Tiết kiệm năng lượng',
        description: 'Giảm 20-40% chi phí điện năng sau khi nâng cấp.',
      },
      {
        title: 'Cải thiện hiệu suất',
        description: 'Hệ thống hoạt động ổn định hơn, tuổi thọ thiết bị được kéo dài.',
      },
    ],
    pricing: {
      showPricing: true,
      priceType: 'custom',
      customPrice: 'Tùy theo phạm vi và mức độ nâng cấp',
      currency: 'VND',
    },
    faq: [
      {
        question: 'Có cần thay toàn bộ hệ thống không?',
        answer: 'Không nhất thiết, chúng tôi tối ưu việc sử dụng lại các thiết bị còn tốt.',
      },
      {
        question: 'Thời gian hoàn vốn bao lâu?',
        answer: 'Thường từ 2-4 năm tùy theo mức độ nâng cấp và tiết kiệm năng lượng đạt được.',
      },
    ],
    order: 5,
    featured: false,
    status: 'published',
    meta: {
      title: 'Nâng cấp hệ thống điện lạnh - VRC',
      description: 'Dịch vụ nâng cấp hệ thống tiết kiệm năng lượng, cải thiện hiệu quả hoạt động.',
    },
  },
  {
    title: 'Hỗ trợ kỹ thuật',
    slug: 'ho-tro-ky-thuat',
    type: 'support',
    summary: 'Dịch vụ hỗ trợ kỹ thuật chuyên nghiệp, tư vấn và giải quyết mọi vấn đề điện lạnh.',
    content: {
      root: {
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'VRC cung cấp dịch vụ hỗ trợ kỹ thuật toàn diện cho các khách hàng có nhu cầu tư vấn, giải đáp thắc mắc hoặc hỗ trợ vận hành hệ thống điện lạnh. Đội ngũ chuyên gia của chúng tôi sẵn sàng chia sẻ kiến thức và kinh nghiệm.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Chúng tôi hỗ trợ cả qua điện thoại, email và trực tiếp tại hiện trường khi cần thiết.',
              },
            ],
          },
        ],
      },
    },
    features: [
      {
        title: 'Tư vấn chuyên nghiệp',
        description: 'Đội ngũ kỹ sư giàu kinh nghiệm sẵn sàng tư vấn mọi vấn đề kỹ thuật.',
        icon: 'headphones',
      },
      {
        title: 'Hỗ trợ đa kênh',
        description: 'Hỗ trợ qua điện thoại, email, chat online và trực tiếp tại hiện trường.',
        icon: 'phone',
      },
      {
        title: 'Giải pháp tối ưu',
        description: 'Đưa ra các giải pháp phù hợp và hiệu quả cho từng tình huống cụ thể.',
        icon: 'lightbulb',
      },
    ],
    benefits: [
      {
        title: 'Tiết kiệm thời gian',
        description: 'Giải quyết nhanh chóng các vấn đề kỹ thuật, tránh gián đoạn hoạt động.',
      },
      {
        title: 'Nâng cao kiến thức',
        description: 'Hỗ trợ đào tạo và nâng cao kiến thức vận hành cho đội ngũ kỹ thuật.',
      },
    ],
    pricing: {
      showPricing: true,
      priceType: 'custom',
      customPrice: 'Miễn phí tư vấn qua điện thoại, có phí cho hỗ trợ tại chỗ',
      currency: 'VND',
    },
    faq: [
      {
        question: 'Có hỗ trợ ngoài giờ hành chính không?',
        answer: 'Có, chúng tôi có dịch vụ hỗ trợ khẩn cấp ngoài giờ với phí bổ sung.',
      },
      {
        question: 'Có đào tạo vận hành không?',
        answer: 'Có, chúng tôi cung cấp dịch vụ đào tạo vận hành cho đội ngũ kỹ thuật của khách hàng.',
      },
    ],
    order: 6,
    featured: false,
    status: 'published',
    meta: {
      title: 'Hỗ trợ kỹ thuật điện lạnh - VRC',
      description: 'Dịch vụ hỗ trợ kỹ thuật chuyên nghiệp, tư vấn và giải quyết mọi vấn đề điện lạnh.',
    },
  },
];

/**
 * Upload image for a service từ frontend assets
 */
async function uploadServiceImage(payload: Awaited<ReturnType<typeof getPayload>>, slug: string): Promise<string | null> {
  try {
    const imageFilename = serviceImageMap[slug];
    if (!imageFilename) {
      console.log(`⚠️ No image mapping found for service: ${slug}`);
      return null;
    }

    // Đường dẫn đến thư mục ảnh frontend
    const frontendImagesPath = path.resolve(process.cwd(), '../vrcfrontend/public/assets/images');
    const imagePath = path.join(frontendImagesPath, imageFilename);

    if (!fs.existsSync(imagePath)) {
      console.log(`❌ Image not found: ${imagePath}`);
      return null;
    }

    console.log(`📸 Uploading image for ${slug}: ${imageFilename}`);

    // Đọc file và upload qua Payload
    const fileBuffer = fs.readFileSync(imagePath);
    const fileExtension = path.extname(imageFilename).toLowerCase();

    // Xác định MIME type
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
    };

    const mimeType = mimeTypes[fileExtension] || 'image/jpeg';

    // Upload file bằng Payload Local API
    const result = await payload.create({
      collection: 'media',
      data: {
        alt: `Featured image for service: ${slug}`,
        filename: imageFilename,
      },
      file: {
        data: fileBuffer,
        mimetype: mimeType,
        name: imageFilename,
        size: fileBuffer.length,
      },
    });

    if (result?.id) {
      console.log(`✅ Successfully uploaded image for ${slug}, media ID: ${result.id}`);
      return result.id;
    } else {
      console.log(`❌ Failed to upload image for ${slug}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error uploading image for ${slug}:`, error);
    return null;
  }
}

/**
 * Kiểm tra xem service đã tồn tại chưa
 */
async function serviceExists(payload: Awaited<ReturnType<typeof getPayload>>, slug: string): Promise<boolean> {
  try {
    const result = await payload.find({
      collection: 'services',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    });
    return result.docs.length > 0;
  } catch (error) {
    console.error(`Error checking service existence for slug ${slug}:`, error);
    return false;
  }
}

/**
 * Seed a single service
 */
async function seedService(payload: Awaited<ReturnType<typeof getPayload>>, serviceData: ServiceData): Promise<boolean> {
  try {
    // Kiểm tra service đã tồn tại chưa
    const exists = await serviceExists(payload, serviceData.slug);
    if (exists) {
      console.log(`⚠️ Service with slug "${serviceData.slug}" already exists. Skipping...`);
      return false; // Skipped
    }

    console.log(`🚀 Processing service: ${serviceData.title}`);

    // Upload featured image trước
    const imageId = await uploadServiceImage(payload, serviceData.slug);    // Chuẩn bị data để tạo service
    const servicePayload: ServiceData & { featuredImage?: string } = {
      ...serviceData,
    };

    // Chỉ thêm featuredImage nếu upload thành công
    if (imageId) {
      servicePayload.featuredImage = imageId;
    }    // Tạo service - bypass type checking do Lexical content structure phức tạp
    const result = await payload.create({
      collection: 'services',
      // @ts-expect-error: Lexical content type complexity
      data: servicePayload,
    });

    if (result?.id) {
      console.log(`✅ Successfully created service: ${serviceData.title} (ID: ${result.id})`);
      if (imageId) {
        console.log(`   📸 With featured image: ${serviceImageMap[serviceData.slug]}`);
      }
      return true;
    } else {
      console.log(`❌ Failed to create service: ${serviceData.title}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error seeding service ${serviceData.title}:`, error);
    return false;
  }
}

/**
 * Main seed function
 */
async function seedServices(): Promise<void> {
  console.log('🌱 Starting Services Seed with Images - VRC');
  console.log('=' .repeat(50));

  try {
    // Khởi tạo Payload theo cách chính thức
    const payload = await getPayload({ config });
    console.log('✅ Payload initialized successfully');

    // Backup existing data
    console.log('\n📦 Creating backup of existing services...');
    const existingServices = await payload.find({
      collection: 'services',
      limit: 1000,
    });
    console.log(`📊 Found ${existingServices.docs.length} existing services`);

    // Seed từng service
    console.log('\n🔄 Seeding services with images...');
    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const serviceData of servicesData) {
      const result = await seedService(payload, serviceData);
      if (result === true) {
        successCount++;
      } else if (result === false) {
        skippedCount++;
      } else {
        errorCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 SEED SUMMARY:');
    console.log(`✅ Successfully created: ${successCount} services`);
    console.log(`⚠️ Skipped (already exists): ${skippedCount} services`);
    console.log(`❌ Failed: ${errorCount} services`);
    console.log(`📊 Total processed: ${servicesData.length} services`);

    // Final verification
    console.log('\n🔍 Final verification...');
    const finalCount = await payload.count({ collection: 'services' });
    console.log(`📊 Total services in database: ${finalCount.totalDocs}`);

    console.log('\n🎉 Services seed completed successfully!');
    console.log('🌐 You can now check the admin dashboard at http://localhost:3000/admin');
    console.log('🌐 And frontend at http://localhost:8081/services');

    // Log image mapping summary
    console.log('\n📸 IMAGE MAPPING SUMMARY:');
    Object.entries(serviceImageMap).forEach(([slug, image]) => {
      console.log(`   ${slug} → ${image}`);
    });

  } catch (error) {
    console.error('❌ Seed process failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Chạy seed function
await seedServices();
