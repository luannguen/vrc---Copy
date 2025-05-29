export const simpleToolsData = [
  {
    name: 'Công cụ tính tải lạnh cơ bản',
    slug: 'cong-cu-tinh-tai-lanh-co-ban',
    category: 'cooling-load',
    excerpt: 'Tính toán tải lạnh cho không gian nhỏ và vừa một cách nhanh chóng và chính xác.',
    description: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Công cụ tính tải lạnh cơ bản giúp bạn xác định công suất điều hòa cần thiết cho không gian của mình. Công cụ này phù hợp cho các phòng nhỏ đến vừa với diện tích từ 10-100m².',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    icon: 'calculator',
    toolType: 'calculator',
    url: '/data/tools/cong-cu-tinh-tai-lanh-co-ban',
    features: [
      { feature: 'Tính toán nhanh dựa trên diện tích và loại phòng' },
      { feature: 'Tự động điều chỉnh theo điều kiện khí hậu' },
      { feature: 'Hiển thị kết quả chi tiết' },
    ],
    inputs: [
      {
        parameter: 'Diện tích phòng',
        unit: 'm²',
        description: 'Diện tích sàn của phòng cần tính toán',
        required: true,
      },
      {
        parameter: 'Chiều cao trần',
        unit: 'm',
        description: 'Chiều cao từ sàn đến trần',
        required: true,
      },
    ],
    outputs: [
      {
        result: 'Công suất làm lạnh cần thiết',
        unit: 'BTU/h',
        description: 'Công suất điều hòa khuyến nghị',
      },
    ],
    difficulty: 'easy',
    estimatedTime: '2-3 phút',
    tags: [
      { tag: 'HVAC' },
      { tag: 'điều hòa' },
      { tag: 'tính toán' },
    ],
    featured: true,
    status: 'published',
  },
  {
    name: 'Công cụ so sánh hiệu suất máy lạnh',
    slug: 'cong-cu-so-sanh-hieu-suat-may-lanh',
    category: 'efficiency-comparison',
    excerpt: 'So sánh hiệu suất và chi phí vận hành của các loại máy lạnh khác nhau.',
    description: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Công cụ so sánh hiệu suất giúp bạn lựa chọn máy lạnh phù hợp bằng cách so sánh EER, SEER và chi phí vận hành của các mẫu máy khác nhau.',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    icon: 'bar-chart-3',
    toolType: 'comparison',
    url: '/data/tools/cong-cu-so-sanh-hieu-suat-may-lanh',
    features: [
      { feature: 'So sánh EER và SEER của nhiều máy lạnh' },
      { feature: 'Tính toán chi phí điện năng hàng tháng' },
      { feature: 'Hiển thị biểu đồ so sánh trực quan' },
    ],
    inputs: [
      {
        parameter: 'Công suất máy lạnh 1',
        unit: 'BTU/h',
        description: 'Công suất của máy lạnh thứ nhất',
        required: true,
      },
      {
        parameter: 'EER máy lạnh 1',
        unit: '',
        description: 'Chỉ số hiệu suất năng lượng',
        required: true,
      },
    ],
    outputs: [
      {
        result: 'Chi phí vận hành so sánh',
        unit: 'VNĐ/tháng',
        description: 'Chi phí điện ước tính hàng tháng',
      },
    ],
    difficulty: 'medium',
    estimatedTime: '5-7 phút',
    tags: [
      { tag: 'hiệu suất' },
      { tag: 'so sánh' },
      { tag: 'tiết kiệm điện' },
    ],
    featured: false,
    status: 'published',
  },
];
