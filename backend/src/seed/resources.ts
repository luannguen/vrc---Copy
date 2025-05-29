export const resourcesData = [
  {
    title: 'ASHRAE Standard 90.1 - Energy Standard for Buildings',
    slug: 'ashrae-standard-90-1',
    category: 'standards',
    resourceType: 'pdf',
    excerpt: 'Tiêu chuẩn năng lượng ASHRAE 90.1 cho các tòa nhà, bao gồm các yêu cầu về hiệu suất năng lượng cho hệ thống HVAC.',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'ASHRAE Standard 90.1 là một trong những tiêu chuẩn quan trọng nhất trong ngành HVAC, quy định các yêu cầu tối thiểu về hiệu suất năng lượng cho tòa nhà.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                text: 'Tiêu chuẩn này bao gồm:',
              },
            ],
          },
          {
            type: 'list',
            listType: 'bullet',
            children: [
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ text: 'Yêu cầu về hiệu suất thiết bị HVAC' }],
                  },
                ],
              },
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ text: 'Quy định về điều khiển hệ thống' }],
                  },
                ],
              },
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ text: 'Tiêu chuẩn cách nhiệt tòa nhà' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    icon: 'file-text',
    externalUrl: 'https://www.ashrae.org/technical-resources/standards-and-guidelines',
    language: 'en',
    difficulty: 'advanced',
    targetAudience: [
      { audience: 'hvac-engineers' },
      { audience: 'architects' },
      { audience: 'consultants' },
    ],
    tags: [
      { tag: 'ASHRAE' },
      { tag: 'tiêu chuẩn' },
      { tag: 'năng lượng' },
      { tag: 'hiệu suất' },
    ],
    featured: true,
    status: 'published',
    publishedAt: new Date('2024-01-10'),
    downloadCount: 0,
    viewCount: 0,
  },
  {
    title: 'Hướng dẫn thiết kế hệ thống VRF',
    slug: 'vrf-design-guide',
    category: 'guidelines',
    resourceType: 'pdf',
    excerpt: 'Tài liệu hướng dẫn thiết kế chi tiết cho hệ thống điều hòa VRF (Variable Refrigerant Flow), từ tính toán tải lạnh đến lựa chọn thiết bị.',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Hướng dẫn toàn diện về thiết kế hệ thống VRF, bao gồm các nguyên lý hoạt động, phương pháp tính toán và quy trình thiết kế.',
              },
            ],
          },
        ],
      },
    },
    icon: 'book-open',
    fileSize: '4.2 MB',
    language: 'vi',
    difficulty: 'intermediate',
    targetAudience: [
      { audience: 'hvac-engineers' },
      { audience: 'contractors' },
      { audience: 'consultants' },
    ],
    tags: [
      { tag: 'VRF' },
      { tag: 'thiết kế' },
      { tag: 'hướng dẫn' },
      { tag: 'điều hòa' },
    ],
    featured: true,
    status: 'published',
    publishedAt: new Date('2024-01-15'),
    downloadCount: 0,
    viewCount: 0,
  },
  {
    title: 'Video: Bảo trì hệ thống chiller',
    slug: 'chiller-maintenance-video',
    category: 'video-tutorials',
    resourceType: 'video',
    excerpt: 'Video hướng dẫn chi tiết về quy trình bảo trì hệ thống chiller, từ kiểm tra định kỳ đến xử lý sự cố.',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Video hướng dẫn thực hành về bảo trì hệ thống chiller, giúp kỹ thuật viên nắm vững quy trình và kỹ thuật bảo trì chuyên nghiệp.',
              },
            ],
          },
        ],
      },
    },
    icon: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=example',
    duration: '45 phút',
    language: 'vi',
    difficulty: 'intermediate',
    targetAudience: [
      { audience: 'hvac-engineers' },
      { audience: 'contractors' },
    ],
    tags: [
      { tag: 'chiller' },
      { tag: 'bảo trì' },
      { tag: 'video' },
      { tag: 'hướng dẫn' },
    ],
    featured: false,
    status: 'published',
    publishedAt: new Date('2024-01-20'),
    downloadCount: 0,
    viewCount: 0,
  },
  {
    title: 'Case Study: Tối ưu hóa năng lượng cho tòa nhà văn phòng',
    slug: 'office-energy-optimization-case-study',
    category: 'case-studies',
    resourceType: 'article',
    excerpt: 'Nghiên cứu trường hợp về việc tối ưu hóa hệ thống HVAC cho tòa nhà văn phòng 20 tầng, tiết kiệm 30% năng lượng.',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Case study chi tiết về dự án tối ưu hóa năng lượng cho tòa nhà văn phòng, bao gồm phân tích hiện trạng, giải pháp thực hiện và kết quả đạt được.',
              },
            ],
          },
        ],
      },
    },
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ text: 'Tổng quan dự án' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                text: 'Dự án tối ưu hóa năng lượng cho tòa nhà văn phòng Diamond Plaza tại TP.HCM, với diện tích 15,000 m² và 20 tầng.',
              },
            ],
          },
          {
            type: 'heading',
            tag: 'h3',
            children: [{ text: 'Thách thức ban đầu' }],
          },
          {
            type: 'list',
            listType: 'bullet',
            children: [
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ text: 'Chi phí điện cao (~800 triệu VNĐ/năm)' }],
                  },
                ],
              },
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ text: 'Hệ thống chiller cũ, hiệu suất thấp' }],
                  },
                ],
              },
              {
                type: 'listItem',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ text: 'Điều khiển thủ công, không tối ưu' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    icon: 'file-image',
    duration: '15 phút đọc',
    language: 'vi',
    difficulty: 'intermediate',
    targetAudience: [
      { audience: 'hvac-engineers' },
      { audience: 'owners' },
      { audience: 'consultants' },
    ],
    tags: [
      { tag: 'case study' },
      { tag: 'tiết kiệm năng lượng' },
      { tag: 'tòa nhà văn phòng' },
      { tag: 'tối ưu hóa' },
    ],
    featured: true,
    status: 'published',
    publishedAt: new Date('2024-01-25'),
    downloadCount: 0,
    viewCount: 0,
  },
  {
    title: 'White Paper: Tương lai của công nghệ HVAC thông minh',
    slug: 'smart-hvac-future-whitepaper',
    category: 'white-papers',
    resourceType: 'pdf',
    excerpt: 'Báo cáo phân tích về xu hướng phát triển công nghệ HVAC thông minh và tác động đến ngành trong 10 năm tới.',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'White paper phân tích sâu về các công nghệ HVAC mới nổi và dự báo xu hướng phát triển trong tương lai gần.',
              },
            ],
          },
        ],
      },
    },
    icon: 'file-text',
    fileSize: '2.8 MB',
    language: 'bilingual',
    difficulty: 'advanced',
    targetAudience: [
      { audience: 'hvac-engineers' },
      { audience: 'consultants' },
      { audience: 'distributors' },
    ],
    tags: [
      { tag: 'white paper' },
      { tag: 'công nghệ' },
      { tag: 'thông minh' },
      { tag: 'tương lai' },
    ],
    featured: false,
    status: 'published',
    publishedAt: new Date('2024-02-01'),
    downloadCount: 0,
    viewCount: 0,
  },
  {
    title: 'Spreadsheet: Công cụ tính toán chi phí vận hành',
    slug: 'operating-cost-calculator-spreadsheet',
    category: 'technical-docs',
    resourceType: 'spreadsheet',
    excerpt: 'File Excel với các công thức tính toán chi phí vận hành hệ thống HVAC, bao gồm điện năng, bảo trì và khấu hao.',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Công cụ Excel chuyên nghiệp để tính toán và phân tích chi phí vận hành hệ thống HVAC một cách chi tiết và chính xác.',
              },
            ],
          },
        ],
      },
    },
    icon: 'presentation-chart',
    fileSize: '1.2 MB',
    language: 'vi',
    difficulty: 'intermediate',
    targetAudience: [
      { audience: 'hvac-engineers' },
      { audience: 'consultants' },
      { audience: 'owners' },
    ],
    tags: [
      { tag: 'excel' },
      { tag: 'chi phí' },
      { tag: 'vận hành' },
      { tag: 'tính toán' },
    ],
    featured: false,
    status: 'published',
    publishedAt: new Date('2024-02-05'),
    downloadCount: 0,
    viewCount: 0,
  },
];
