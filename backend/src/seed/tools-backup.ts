// Helper to convert markdown to richText format
const markdownToRichText = (markdown: string) => {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              text: markdown,
              type: 'text',
              version: 1
            }
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1
        }
      ],
      direction: 'ltr' as 'ltr' | 'rtl' | null,
      format: '',
      indent: 0,
      version: 1
    }
  };
};

export const toolsData = [
  {
    name: 'Tính toán tải lạnh cho không gian',
    slug: 'cooling-load-calculator',
    category: 'cooling-load',
    excerpt: 'Công cụ tính toán tải lạnh giúp xác định công suất điều hòa phù hợp dựa trên kích thước phòng, vị trí địa lý, lượng người sử dụng và các yếu tố khác.',
    description: markdownToRichText(`Công cụ tính toán tải lạnh là một trong những công cụ quan trọng nhất trong thiết kế hệ thống HVAC. Nó giúp kỹ sư và nhà thầu xác định chính xác công suất điều hòa cần thiết cho một không gian cụ thể.

Công cụ này tính toán dựa trên nhiều yếu tố bao gồm:
- Kích thước và hình dạng không gian
- Số lượng người sử dụng
- Thiết bị điện tử và đèn chiếu sáng
- Hướng cửa sổ và độ cách nhiệt
- Vị trí địa lý và điều kiện khí hậu

Với giao diện thân thiện và tính toán chính xác, công cụ này giúp tiết kiệm thời gian và đảm bảo hiệu quả năng lượng tối ưu.`),
    icon: 'calculator',
    toolType: 'calculator',
    url: '/data/tools/cooling-load-calculator',
    features: [
      { feature: 'Tính toán BTU cần thiết theo kích thước phòng' },
      { feature: 'Điều chỉnh theo vị trí địa lý và khí hậu' },
      { feature: 'Tính toán cho không gian thương mại và công nghiệp' },
      { feature: 'Xuất báo cáo chi tiết' },
    ],
    inputs: [
      {
        parameter: 'Diện tích phòng',
        unit: 'm²',
        description: 'Diện tích sàn của không gian cần điều hòa',
        required: true,
      },
      {
        parameter: 'Chiều cao trần',
        unit: 'm',
        description: 'Chiều cao từ sàn đến trần',
        required: true,
      },
      {
        parameter: 'Số người sử dụng',
        unit: 'người',
        description: 'Số lượng người thường xuyên có mặt trong không gian',
        required: true,
      },
      {
        parameter: 'Hướng cửa sổ',
        unit: '',
        description: 'Hướng nhìn chính của cửa sổ (Bắc, Nam, Đông, Tây)',
        required: false,
      },
      {
        parameter: 'Thiết bị điện',
        unit: 'W',
        description: 'Tổng công suất thiết bị điện trong phòng',
        required: false,
      },
    ],
    outputs: [
      {
        result: 'Công suất điều hòa cần thiết',
        unit: 'BTU/h',
        description: 'Công suất điều hòa tối thiểu cần thiết',
      },
      {
        result: 'Kích thước máy đề xuất',
        unit: 'HP',
        description: 'Kích thước máy điều hòa được đề xuất',
      },
      {
        result: 'Chi phí vận hành ước tính',
        unit: 'VNĐ/tháng',
        description: 'Chi phí điện ước tính hàng tháng',
      },
    ],
    difficulty: 'easy',
    estimatedTime: '5-10 phút',
    tutorial: markdownToRichText(`**Hướng dẫn sử dụng:**

1. Nhập diện tích phòng (m²)
2. Nhập chiều cao trần (m)
3. Nhập số người sử dụng thường xuyên
4. Chọn hướng cửa sổ chính (nếu có)
5. Nhập tổng công suất thiết bị điện (tùy chọn)
6. Nhấn "Tính toán" để xem kết quả`),
    examples: [
      {
        title: 'Phòng khách gia đình',
        scenario: 'Phòng khách 25m², 3m cao, 4 người, cửa sổ hướng Nam',
        result: '12,000 BTU/h (1.5 HP)',
      },
      {
        title: 'Văn phòng nhỏ',
        scenario: 'Văn phòng 40m², 2.8m cao, 6 người, thiết bị điện 2000W',
        result: '18,000 BTU/h (2.0 HP)',
      },
    ],
    tags: ['HVAC', 'điều hòa', 'tính toán', 'BTU'],
    featured: true,
    status: 'published',
  },
  {
    name: 'So sánh hiệu suất thiết bị HVAC',
    slug: 'efficiency-comparison',
    category: 'efficiency',
    excerpt: 'Công cụ so sánh hiệu suất năng lượng giữa các thiết bị HVAC khác nhau, giúp lựa chọn giải pháp tối ưu về chi phí và hiệu quả.',
    description: markdownToRichText(`Công cụ so sánh hiệu suất giúp đánh giá và so sánh các thiết bị HVAC khác nhau dựa trên nhiều tiêu chí quan trọng như hiệu suất năng lượng, chi phí vận hành, và tác động môi trường.

Công cụ này hỗ trợ:
- So sánh đồng thời nhiều thiết bị
- Phân tích chi phí vòng đời (LCC)
- Tính toán thời gian hoàn vốn
- Đánh giá tác động môi trường
- Báo cáo chi tiết và biểu đồ trực quan

Giúp người dùng đưa ra quyết định đầu tư thông minh và bền vững.`),
    icon: 'compare',
    toolType: 'comparison',
    url: '/data/tools/efficiency-comparison',
    features: [
      { feature: 'So sánh đồng thời tối đa 5 thiết bị' },
      { feature: 'Phân tích chi phí vòng đời (LCC)' },
      { feature: 'Tính toán CO2 tiết kiệm được' },
      { feature: 'Biểu đồ so sánh trực quan' },
    ],
    inputs: [
      {
        parameter: 'Thiết bị 1 - Tên/Model',
        unit: '',
        description: 'Tên hoặc model của thiết bị thứ nhất',
        required: true,
      },
      {
        parameter: 'Thiết bị 1 - EER/COP',
        unit: '',
        description: 'Hệ số hiệu suất năng lượng',
        required: true,
      },
      {
        parameter: 'Thiết bị 1 - Giá mua',
        unit: 'VNĐ',
        description: 'Chi phí mua ban đầu',
        required: true,
      },
      {
        parameter: 'Thiết bị 2 - Thông tin tương tự',
        unit: '',
        description: 'Thông tin thiết bị thứ hai để so sánh',
        required: true,
      },
    ],
    outputs: [
      {
        result: 'Bảng so sánh chi tiết',
        unit: '',
        description: 'So sánh các thông số kỹ thuật và kinh tế',
      },
      {
        result: 'Thiết bị được khuyến nghị',
        unit: '',
        description: 'Thiết bị tối ưu dựa trên tiêu chí đã chọn',
      },
      {
        result: 'Thời gian hoàn vốn',
        unit: 'năm',
        description: 'Thời gian để thu hồi chi phí đầu tư bổ sung',
      },
    ],
    difficulty: 'medium',
    estimatedTime: '10-15 phút',
    tutorial: markdownToRichText(`**Hướng dẫn sử dụng:**

1. Nhập thông tin thiết bị thứ nhất (tên, EER/COP, giá mua)
2. Nhập thông tin thiết bị thứ hai
3. Thêm thiết bị thứ ba, thứ tư (tùy chọn)
4. Chọn tiêu chí ưu tiên (chi phí, hiệu suất, môi trường)
5. Xem kết quả so sánh và khuyến nghị`),
    examples: [
      {
        title: 'So sánh điều hòa Inverter vs thường',
        scenario: 'Inverter EER 4.2, giá 15 triệu vs Thường EER 2.8, giá 8 triệu',
        result: 'Inverter hoàn vốn sau 3.2 năm, tiết kiệm 40% điện năng',
      },
    ],
    tags: ['so sánh', 'hiệu suất', 'tiết kiệm năng lượng', 'EER', 'COP'],
    featured: true,
    status: 'published',
    language: 'vi',
    targetAudience: ['kỹ sư tư vấn', 'nhà đầu tư', 'facility manager'],
    relatedTools: ['cooling-load-calculator', 'energy-savings-analysis'],
    seoTitle: 'So sánh hiệu suất thiết bị HVAC - Lựa chọn tối ưu',
    seoDescription: 'Công cụ so sánh chi tiết các thiết bị HVAC. Phân tích chi phí, hiệu suất năng lượng và thời gian hoàn vốn.',
    publishedAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    viewCount: 0,
  },
  {
    name: 'Phân tích tiết kiệm năng lượng',
    slug: 'energy-savings-analysis',
    category: 'energy-analysis',
    excerpt: 'Công cụ phân tích và tính toán tiềm năng tiết kiệm năng lượng khi nâng cấp hệ thống HVAC, bao gồm ROI và các chỉ số môi trường.',
    description: markdownToRichText(`Công cụ phân tích tiết kiệm năng lượng giúp đánh giá hiệu quả của các biện pháp cải thiện hệ thống HVAC. Tính toán chính xác lượng năng lượng tiết kiệm được, chi phí tiết kiệm và thời gian hoàn vốn.

Tính năng chính:
- Phân tích trước và sau nâng cấp
- Tính toán ROI chi tiết
- Đánh giá tác động môi trường
- Dự báo tiết kiệm dài hạn
- Báo cáo cho nhà đầu tư

Hỗ trợ quyết định đầu tư thông minh và bền vững cho doanh nghiệp.`),
    icon: 'chart-line',
    toolType: 'analysis',
    url: '/data/tools/energy-savings-analysis',
    features: [
      { feature: 'Phân tích trước/sau nâng cấp' },
      { feature: 'Tính toán ROI và NPV' },
      { feature: 'Đánh giá giảm phát thải CO2' },
      { feature: 'Báo cáo đầu tư chi tiết' },
    ],
    inputs: [
      {
        parameter: 'Tiêu thụ điện hiện tại',
        unit: 'kWh/tháng',
        description: 'Lượng điện tiêu thụ của hệ thống cũ',
        required: true,
      },
      {
        parameter: 'Chi phí điện',
        unit: 'VNĐ/kWh',
        description: 'Giá điện hiện tại',
        required: true,
      },
      {
        parameter: 'Hiệu suất dự kiến',
        unit: '%',
        description: 'Phần trăm cải thiện hiệu suất sau nâng cấp',
        required: true,
      },
      {
        parameter: 'Chi phí nâng cấp',
        unit: 'VNĐ',
        description: 'Tổng chi phí đầu tư nâng cấp hệ thống',
        required: true,
      },
    ],
    outputs: [
      {
        result: 'Tiết kiệm năng lượng',
        unit: 'kWh/năm',
        description: 'Lượng điện tiết kiệm được hàng năm',
      },
      {
        result: 'Tiết kiệm chi phí',
        unit: 'VNĐ/năm',
        description: 'Số tiền tiết kiệm được hàng năm',
      },
      {
        result: 'Thời gian hoàn vốn',
        unit: 'năm',
        description: 'Thời gian để thu hồi vốn đầu tư',
      },
      {
        result: 'Giảm phát thải CO2',
        unit: 'tấn CO2/năm',
        description: 'Lượng CO2 giảm được hàng năm',
      },
    ],
    difficulty: 'medium',
    estimatedTime: '15-20 phút',
    tutorial: markdownToRichText(`**Hướng dẫn sử dụng:**

1. Nhập mức tiêu thụ điện hiện tại (kWh/tháng)
2. Nhập giá điện hiện tại (VNĐ/kWh)
3. Ước tính % cải thiện hiệu suất sau nâng cấp
4. Nhập tổng chi phí nâng cấp dự kiến
5. Xem phân tích chi tiết và báo cáo ROI`),
    examples: [
      {
        title: 'Nâng cấp hệ thống chiller',
        scenario: 'Tiêu thụ 50,000 kWh/tháng, cải thiện 30%, chi phí 2 tỷ',
        result: 'Tiết kiệm 1.08 tỷ/năm, hoàn vốn sau 1.85 năm',
      },
    ],
    tags: ['tiết kiệm năng lượng', 'ROI', 'phân tích tài chính', 'môi trường'],
    featured: false,
    status: 'published',
    language: 'vi',
    targetAudience: ['CFO', 'facility manager', 'kỹ sư năng lượng'],
    relatedTools: ['efficiency-comparison', 'solution-advisor'],
    seoTitle: 'Phân tích tiết kiệm năng lượng HVAC - Tính toán ROI',
    seoDescription: 'Công cụ phân tích tiềm năng tiết kiệm năng lượng và ROI khi nâng cấp hệ thống HVAC. Báo cáo chi tiết cho nhà đầu tư.',
    publishedAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    viewCount: 0,
  },
  {
    name: 'Tư vấn giải pháp HVAC',
    slug: 'solution-advisor',
    category: 'advisory',
    excerpt: 'Hệ thống tư vấn thông minh giúp lựa chọn giải pháp HVAC phù hợp dựa trên yêu cầu cụ thể của dự án và ngân sách.',
    description: markdownToRichText(`Hệ thống tư vấn giải pháp HVAC sử dụng AI để đưa ra khuyến nghị thông minh dựa trên đặc điểm dự án, yêu cầu kỹ thuật và ngân sách.

Hệ thống phân tích:
- Đặc điểm công trình (loại, quy mô, vị trí)
- Yêu cầu kỹ thuật và tiêu chuẩn
- Ngân sách và thời gian thực hiện
- Điều kiện vận hành và bảo trì
- Yêu cầu đặc biệt (tiết kiệm năng lượng, yên tĩnh)

Cung cấp giải pháp tối ưu với lý do rõ ràng và các phương án thay thế.`),
    icon: 'lightbulb',
    toolType: 'advisor',
    url: '/data/tools/solution-advisor',
    features: [
      { feature: 'AI tư vấn thông minh' },
      { feature: 'Phân tích đa tiêu chí' },
      { feature: 'Nhiều phương án lựa chọn' },
      { feature: 'Giải thích chi tiết' },
    ],
    inputs: [
      {
        parameter: 'Loại công trình',
        unit: '',
        description: 'Văn phòng, nhà ở, công nghiệp, thương mại...',
        required: true,
      },
      {
        parameter: 'Diện tích',
        unit: 'm²',
        description: 'Tổng diện tích cần điều hòa',
        required: true,
      },
      {
        parameter: 'Ngân sách',
        unit: 'VNĐ',
        description: 'Ngân sách dự kiến cho hệ thống',
        required: true,
      },
      {
        parameter: 'Yêu cầu đặc biệt',
        unit: '',
        description: 'Tiết kiệm năng lượng, yên tĩnh, không gian hạn chế...',
        required: false,
      },
    ],
    outputs: [
      {
        result: 'Giải pháp được đề xuất',
        unit: '',
        description: 'Hệ thống HVAC phù hợp nhất',
      },
      {
        result: 'Phương án thay thế',
        unit: '',
        description: '2-3 phương án khác để lựa chọn',
      },
      {
        result: 'Ước tính chi phí',
        unit: 'VNĐ',
        description: 'Chi phí dự kiến cho từng phương án',
      },
    ],
    difficulty: 'easy',
    estimatedTime: '10-15 phút',
    tutorial: markdownToRichText(`**Hướng dẫn sử dụng:**

1. Chọn loại công trình từ danh sách
2. Nhập diện tích cần điều hòa
3. Nhập ngân sách dự kiến
4. Mô tả các yêu cầu đặc biệt (nếu có)
5. Nhận khuyến nghị từ hệ thống AI`),
    examples: [
      {
        title: 'Văn phòng 500m² trung tâm TP',
        scenario: 'Văn phòng, 500m², ngân sách 800 triệu, yêu cầu yên tĩnh',
        result: 'Đề xuất: VRV + FCU, ước tính 750 triệu',
      },
    ],
    tags: ['tư vấn', 'AI', 'lựa chọn giải pháp', 'thiết kế HVAC'],
    featured: true,
    status: 'published',
    language: 'vi',
    targetAudience: ['chủ đầu tư', 'kiến trúc sư', 'nhà thầu MEP'],
    relatedTools: ['cooling-load-calculator', 'efficiency-comparison'],
    seoTitle: 'Tư vấn giải pháp HVAC thông minh - AI Advisor',
    seoDescription: 'Hệ thống AI tư vấn giải pháp HVAC tối ưu. Phân tích yêu cầu và đưa ra khuyến nghị phù hợp với ngân sách.',
    publishedAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    viewCount: 0,
  },
  {
    name: 'Tiêu chuẩn và quy định HVAC',
    slug: 'hvac-standards',
    category: 'standards',
    excerpt: 'Tổng hợp các tiêu chuẩn, quy định và hướng dẫn kỹ thuật về HVAC tại Việt Nam và quốc tế, thường xuyên cập nhật.',
    description: markdownToRichText(`Cơ sở dữ liệu toàn diện về các tiêu chuẩn và quy định HVAC, bao gồm:

**Tiêu chuẩn Việt Nam:**
- TCVN về điều hòa không khí
- QCVN về hiệu quả năng lượng
- Thông tư hướng dẫn của Bộ Xây dựng

**Tiêu chuẩn quốc tế:**
- ASHRAE Standards
- ISO về HVAC
- EN Standards châu Âu

Công cụ tìm kiếm thông minh giúp tìm nhanh tiêu chuẩn phù hợp với dự án.`),
    icon: 'book',
    toolType: 'reference',
    url: '/data/tools/hvac-standards',
    features: [
      { feature: 'Cơ sở dữ liệu đầy đủ' },
      { feature: 'Tìm kiếm thông minh' },
      { feature: 'Cập nhật thường xuyên' },
      { feature: 'So sánh tiêu chuẩn' },
    ],
    inputs: [
      {
        parameter: 'Loại tiêu chuẩn',
        unit: '',
        description: 'TCVN, QCVN, ASHRAE, ISO...',
        required: false,
      },
      {
        parameter: 'Lĩnh vực áp dụng',
        unit: '',
        description: 'Điều hòa, thông gió, chất lượng không khí...',
        required: false,
      },
      {
        parameter: 'Từ khóa tìm kiếm',
        unit: '',
        description: 'Tìm kiếm trong nội dung tiêu chuẩn',
        required: false,
      },
    ],
    outputs: [
      {
        result: 'Danh sách tiêu chuẩn',
        unit: '',
        description: 'Các tiêu chuẩn phù hợp với tiêu chí tìm kiếm',
      },
      {
        result: 'Tóm tắt nội dung',
        unit: '',
        description: 'Tóm tắt các điểm chính của tiêu chuẩn',
      },
      {
        result: 'Link tải về',
        unit: '',
        description: 'Liên kết đến file PDF tiêu chuẩn gốc',
      },
    ],
    difficulty: 'easy',
    estimatedTime: '5-10 phút',
    tutorial: markdownToRichText(`**Hướng dẫn sử dụng:**

1. Chọn loại tiêu chuẩn cần tìm
2. Chọn lĩnh vực áp dụng
3. Nhập từ khóa tìm kiếm (tùy chọn)
4. Xem danh sách kết quả
5. Tải về tiêu chuẩn cần thiết`),
    examples: [
      {
        title: 'Tìm tiêu chuẩn về chất lượng không khí',
        scenario: 'Loại: TCVN, Lĩnh vực: Chất lượng không khí',
        result: 'TCVN 5687:2010 - Chất lượng không khí trong nhà',
      },
    ],
    tags: ['tiêu chuẩn', 'quy định', 'TCVN', 'ASHRAE', 'tham khảo'],
    featured: false,
    status: 'published',
    language: 'vi',
    targetAudience: ['kỹ sư thiết kế', 'kiểm định viên', 'quản lý chất lượng'],
    relatedTools: ['guidelines'],
    seoTitle: 'Tiêu chuẩn HVAC Việt Nam và Quốc tế - Tra cứu nhanh',
    seoDescription: 'Cơ sở dữ liệu đầy đủ các tiêu chuẩn HVAC TCVN, ASHRAE, ISO. Tìm kiếm và tải về miễn phí.',
    publishedAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    viewCount: 0,
  },
  {
    name: 'Hướng dẫn thiết kế và thi công',
    slug: 'design-construction-guidelines',
    category: 'guidelines',
    excerpt: 'Bộ hướng dẫn chi tiết về thiết kế và thi công hệ thống HVAC, từ cơ bản đến nâng cao, có hình ảnh minh họa và video.',
    description: markdownToRichText(`Bộ hướng dẫn toàn diện về thiết kế và thi công hệ thống HVAC, được biên soạn bởi đội ngũ chuyên gia có kinh nghiệm.

Nội dung bao gồm:
- Nguyên lý cơ bản HVAC
- Thiết kế hệ thống theo từng loại công trình
- Kỹ thuật thi công và lắp đặt
- Đấu nối điện và điều khiển
- Nghiệm thu và bàn giao
- Vận hành và bảo trì

Với hình ảnh minh họa, sơ đồ kỹ thuật và video hướng dẫn chi tiết.`),
    icon: 'tools',
    toolType: 'guide',
    url: '/data/tools/design-construction-guidelines',
    features: [
      { feature: 'Hướng dẫn từ A-Z' },
      { feature: 'Hình ảnh và video minh họa' },
      { feature: 'Check-list kiểm tra' },
      { feature: 'Tips từ chuyên gia' },
    ],
    inputs: [
      {
        parameter: 'Chủ đề quan tâm',
        unit: '',
        description: 'Thiết kế, thi công, nghiệm thu, vận hành...',
        required: false,
      },
      {
        parameter: 'Loại hệ thống',
        unit: '',
        description: 'Central, VRV, Split, AHU...',
        required: false,
      },
      {
        parameter: 'Mức độ chi tiết',
        unit: '',
        description: 'Cơ bản, trung cấp, nâng cao',
        required: false,
      },
    ],
    outputs: [
      {
        result: 'Hướng dẫn phù hợp',
        unit: '',
        description: 'Tài liệu hướng dẫn theo yêu cầu',
      },
      {
        result: 'Check-list',
        unit: '',
        description: 'Danh sách kiểm tra các bước thực hiện',
      },
      {
        result: 'Video hướng dẫn',
        unit: '',
        description: 'Video minh họa thực tế (nếu có)',
      },
    ],
    difficulty: 'medium',
    estimatedTime: '20-30 phút',
    tutorial: markdownToRichText(`**Hướng dẫn sử dụng:**

1. Chọn chủ đề cần tìm hiểu
2. Chọn loại hệ thống HVAC
3. Chọn mức độ chi tiết phù hợp
4. Đọc hướng dẫn và xem video
5. Tải về check-list để thực hành`),
    examples: [
      {
        title: 'Hướng dẫn lắp đặt VRV',
        scenario: 'Chủ đề: Thi công, Hệ thống: VRV, Mức độ: Nâng cao',
        result: 'Hướng dẫn 50 trang + 10 video + check-list 30 mục',
      },
    ],
    tags: ['hướng dẫn', 'thiết kế', 'thi công', 'video', 'thực hành'],
    featured: false,
    status: 'published',
    language: 'vi',
    targetAudience: ['kỹ sư thiết kế', 'thợ lắp đặt', 'sinh viên'],
    relatedTools: ['hvac-standards'],
    seoTitle: 'Hướng dẫn thiết kế thi công HVAC - Video và hình ảnh',
    seoDescription: 'Bộ hướng dẫn đầy đủ về thiết kế và thi công HVAC. Có video minh họa, check-list và tips từ chuyên gia.',
    publishedAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    viewCount: 0,
  },
];
