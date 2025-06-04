import type { Payload } from 'payload'

export const seedProjectsPageSettings = async (payload: Payload) => {
  try {
    console.log('Seeding ProjectsPageSettings...')

    const defaultSettings = {
      heroSection: {
        title: 'Dự án tiêu biểu',
        subtitle: 'Những công trình thực tế đã được VRC thiết kế, cung cấp thiết bị và thi công lắp đặt trên khắp cả nước.',
        // backgroundImage will be set later when media is available
      },
      categorySection: {
        title: 'Danh mục dự án',
        description: 'VRC tự hào thực hiện các dự án đa dạng với quy mô khác nhau, từ hệ thống điều hòa không khí trung tâm cho tòa nhà thương mại đến các hệ thống làm lạnh công nghiệp phức tạp.',
        enableCategories: true,
      },
      featuredSection: {
        title: 'Dự án nổi bật',
        showFeaturedProjects: true,
        featuredProjectsLimit: 3,
      },
      statsSection: {
        enableStats: true,
        stats: [
          { value: '500+', label: 'Dự án đã hoàn thành' },
          { value: '20+', label: 'Năm kinh nghiệm' },
          { value: '50+', label: 'Đối tác lớn' },
          { value: '100+', label: 'Kỹ sư & nhân viên' },
        ],
      },
      ctaSection: {
        title: 'Bạn có dự án cần tư vấn?',
        description: 'Hãy liên hệ với đội ngũ kỹ sư của chúng tôi để được tư vấn giải pháp tối ưu cho dự án của bạn.',
        primaryButton: {
          text: 'Liên hệ tư vấn',
          link: '/contact',
        },
        secondaryButton: {
          text: 'Xem dịch vụ',
          link: '/services',
        },
      },
    }

    await payload.updateGlobal({
      slug: 'projects-page-settings',
      data: defaultSettings,
    })

    console.log('✅ ProjectsPageSettings seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding ProjectsPageSettings:', error)
    throw error
  }
}
