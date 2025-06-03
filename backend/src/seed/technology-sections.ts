import type { Payload } from 'payload'

export const seedTechnologySections = async (payload: Payload): Promise<void> => {
  try {
    console.log('🌱 Starting Technology Sections seed...')

    // Delete existing technology-sections to ensure clean seed
    console.log('🗑️ Clearing existing technology-sections...')
    const existingDocs = await payload.find({
      collection: 'technology-sections',
      limit: 0, // Get all documents
    })

    if (existingDocs.docs.length > 0) {
      for (const doc of existingDocs.docs) {
        await payload.delete({
          collection: 'technology-sections',
          id: doc.id,
        })
      }
      console.log(`🗑️ Deleted ${existingDocs.docs.length} existing documents`)
    }

    console.log('🌱 Seeding Technology Sections...')

    // Hero Section
    await payload.create({
      collection: 'technology-sections',
      data: {
        title: 'Công nghệ & Thiết bị',
        section: 'hero',
        subtitle: 'Ứng dụng công nghệ hiện đại và các thiết bị tiên tiến nhất trong lĩnh vực kỹ thuật lạnh và điều hòa không khí.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'VRC luôn đi đầu trong việc ứng dụng công nghệ hiện đại và thiết bị tiên tiến để mang đến những giải pháp tối ưu cho khách hàng.',
                  },
                ],
              },
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        ctaButtons: [
          {
            text: 'Tư vấn giải pháp công nghệ',
            link: '/contact',
            variant: 'default',
          },
        ],
        backgroundColor: 'primary',
        order: 1,
        _status: 'published',
      },
    })
    console.log('✅ Created Hero section successfully')

    // Technology Overview Section
    console.log('📝 Creating Technology Overview section...')
    await payload.create({
      collection: 'technology-sections',
      data: {
        title: 'Công nghệ tiên tiến',
        section: 'overview',
        subtitle: 'VRC luôn đi đầu trong việc ứng dụng các công nghệ tiên tiến nhất trong lĩnh vực kỹ thuật lạnh và điều hòa không khí.',
        content: {
          root: {
            type: 'root',
            children: [              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Chúng tôi không ngừng nghiên cứu và phát triển để mang đến những giải pháp hiệu quả, tiết kiệm năng lượng và thân thiện với môi trường.',
                  },
                ],
              },
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        features: [
          {
            title: 'Tiết kiệm năng lượng',
            description: 'Công nghệ tiết kiệm năng lượng đạt chuẩn quốc tế',
            icon: 'CheckCircle',
          },
          {
            title: 'IoT & Smart Control',
            description: 'Tích hợp IoT và hệ thống quản lý thông minh',
            icon: 'CheckCircle',
          },
          {
            title: 'Thân thiện môi trường',
            description: 'Giải pháp thân thiện với môi trường, giảm phát thải carbon',
            icon: 'CheckCircle',
          },
          {
            title: 'Giám sát từ xa',
            description: 'Hệ thống giám sát và điều khiển từ xa hiện đại',
            icon: 'CheckCircle',
          },
        ],
        backgroundColor: 'white',
        order: 2,
        _status: 'published',
      },
    })

    // Equipment Categories Section
    await payload.create({
      collection: 'technology-sections',
      data: {
        title: 'Danh mục thiết bị',
        section: 'equipment-categories',
        subtitle: 'Các loại thiết bị chuyên dụng được VRC cung cấp và lắp đặt',
        equipmentItems: [
          {
            category: 'Thiết bị làm lạnh công nghiệp',
            items: [
              { name: 'Hệ thống làm lạnh nước' },
              { name: 'Tháp giải nhiệt' },
              { name: 'Máy làm lạnh Chiller' },
              { name: 'Bộ trao đổi nhiệt' },
            ],
          },
          {
            category: 'Thiết bị điều hòa không khí',
            items: [
              { name: 'Hệ thống VRF/VRV' },
              { name: 'Điều hòa trung tâm' },
              { name: 'AHU và FCU' },
              { name: 'Điều hòa không khí chính xác' },
            ],
          },
          {
            category: 'Thiết bị lạnh thương mại',
            items: [
              { name: 'Tủ đông công nghiệp' },
              { name: 'Tủ mát siêu thị' },
              { name: 'Kho lạnh' },
              { name: 'Quầy trưng bày lạnh' },
            ],
          },
          {
            category: 'Thiết bị phụ trợ',
            items: [
              { name: 'Hệ thống ống đồng' },
              { name: 'Van điều khiển' },
              { name: 'Cảm biến nhiệt độ' },
              { name: 'Thiết bị kiểm soát độ ẩm' },
            ],
          },
        ],
        backgroundColor: 'white',
        order: 3,
        _status: 'published',
      },
    })

    // Partners Section
    await payload.create({
      collection: 'technology-sections',
      data: {
        title: 'Đối tác công nghệ',
        section: 'partners',
        subtitle: 'Chúng tôi hợp tác với các thương hiệu hàng đầu thế giới để mang đến những giải pháp công nghệ tốt nhất.',        partnerLogos: [
          // Logo sẽ được thêm sau khi có media files
          // Tạm thời để trống để tránh lỗi required
        ],
        backgroundColor: 'muted',
        order: 4,
        _status: 'published',
      },
    })

    // CTA Section
    await payload.create({
      collection: 'technology-sections',
      data: {
        title: 'Tìm hiểu giải pháp công nghệ phù hợp',
        section: 'cta',
        subtitle: 'Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn về các giải pháp công nghệ và thiết bị phù hợp với nhu cầu của doanh nghiệp bạn.',
        ctaButtons: [
          {
            text: 'Liên hệ tư vấn',
            link: '/contact',
            variant: 'default',
          },
          {
            text: 'Xem dự án thực tế',
            link: '/projects',
            variant: 'outline',
          },
        ],
        backgroundColor: 'accent',
        order: 5,
        _status: 'published',
      },
    })

    console.log('✅ Technology Sections seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding Technology Sections:', error)
    throw error
  }
}
