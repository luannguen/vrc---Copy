/**
 * Script để seed admin guides
 * Chạy: npm run seed:admin-guides
 */

import type { Payload } from 'payload'

export default async function run({ payload }: { payload: Payload }) {
  try {
    console.log('🚀 Starting Admin Guides Seed...')
    console.log('Database connection:', payload.db ? 'Connected' : 'Not connected')

    // Clear existing guides first
    console.log('📋 Checking for existing admin guides...')
    const existingGuides = await payload.find({
      collection: 'admin-guides',
      limit: 1000
    })

    console.log(`Found ${existingGuides.docs.length} existing guides`)

    if (existingGuides.docs.length > 0) {
      console.log(`🧹 Clearing ${existingGuides.docs.length} existing admin guides...`)

      for (const guide of existingGuides.docs) {
        console.log(`Deleting guide: ${guide.id} - ${guide.title}`)
        await payload.delete({
          collection: 'admin-guides',
          id: guide.id
        })
      }

      console.log('✅ Existing admin guides cleared')
    } else {
      console.log('No existing guides found')
    }    // Simple guide data for each locale
      const guideDataVi = {
      title: 'Hướng dẫn đăng nhập Admin Dashboard',
      summary: 'Hướng dẫn chi tiết cách đăng nhập và truy cập vào admin dashboard của hệ thống',
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
                  text: 'Admin Dashboard là trung tâm quản lý của hệ thống. Để truy cập: 1. Truy cập /admin 2. Nhập email và mật khẩu 3. Nhấn nút Đăng nhập',
                  version: 1
                }
              ]
            }
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1
        }
      },
      category: 'getting-started' as const,
      difficulty: 'beginner' as const,
      steps: [],
      tags: [],
      featured: true,
      estimatedTime: 5,
      order: 1,      status: 'published' as const,
      lastReviewed: new Date().toISOString(),
      version: '3.39.1'
    }

    const guideDataEn = {
      title: 'Admin Dashboard Login Guide',
      summary: 'Detailed guide on how to login and access the system admin dashboard',
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
                  text: 'Admin Dashboard is the management center. To access: 1. Go to /admin 2. Enter email and password 3. Click Login button',
                  version: 1
                }
              ]
            }
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1
        }
      },
      category: 'getting-started' as const,
      difficulty: 'beginner' as const,
      steps: [],
      tags: [],
      featured: true,
      estimatedTime: 5,
      order: 1,      status: 'published' as const,
      lastReviewed: new Date().toISOString(),
      version: '3.39.1'
    }

    const guideDataTr = {
      title: 'Admin Paneli Giriş Kılavuzu',
      summary: 'Sistem yönetici paneline nasıl giriş yapılacağına dair detaylı kılavuz',
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
                  text: 'Admin Paneli yönetim merkezidir. Erişim için: 1. /admin\'e gidin 2. E-posta ve şifre girin 3. Giriş düğmesine tıklayın',
                  version: 1
                }
              ]
            }
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1
        }
      },
      category: 'getting-started' as const,
      difficulty: 'beginner' as const,
      steps: [],
      tags: [],
      featured: true,
      estimatedTime: 5,
      order: 1,
      status: 'published' as const,
      lastReviewed: new Date().toISOString(),
      version: '3.39.1'
    }

    // Create guides for each locale
    let totalCreated = 0

    console.log('📝 Starting to create guides...')

    // Vietnamese guide
    console.log('Creating Vietnamese guide...')
    const viGuide = await payload.create({
      collection: 'admin-guides',
      data: guideDataVi,
      locale: 'vi'
    })
    console.log(`✅ Created Vietnamese guide: ${viGuide.id} - ${viGuide.title}`)
    totalCreated++

    // English guide
    console.log('Creating English guide...')
    const enGuide = await payload.create({
      collection: 'admin-guides',
      data: guideDataEn,
      locale: 'en'
    })
    console.log(`✅ Created English guide: ${enGuide.id} - ${enGuide.title}`)
    totalCreated++

    // Turkish guide
    console.log('Creating Turkish guide...')
    const trGuide = await payload.create({
      collection: 'admin-guides',
      data: guideDataTr,
      locale: 'tr'
    })
    console.log(`✅ Created Turkish guide: ${trGuide.id} - ${trGuide.title}`)
    totalCreated++

    console.log(`🎉 Successfully seeded ${totalCreated} multilingual admin guides!`)

    // Verify creation by checking if guides exist
    console.log('🔍 Verifying created guides...')
    const verifyGuides = await payload.find({
      collection: 'admin-guides',
      limit: 10
    })
    console.log(`Found ${verifyGuides.docs.length} guides in database after seeding`)
    verifyGuides.docs.forEach(guide => {
      console.log(`- ${guide.title} (${guide.id})`)
    })

  } catch (error) {
    console.error('❌ Error during Admin Guides Seed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}
