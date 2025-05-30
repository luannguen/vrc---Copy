import type { Payload } from 'payload'
import path from 'path'
import fs from 'fs'
import { uploadMediaFromFrontend } from './utils/uploadMedia'

// Interface cho VRC posts data
interface VrcPostData {
  title: string
  slug: string
  content: string
  publishedAt: string
  imageUrl: string
  excerpt?: string
  category?: string
  type?: string
  tags?: string[]
  author?: string
  location?: string
  organizer?: string
}

// Utility function to create rich text content
function createRichText(content: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: content,
            },
          ],
          version: 1,
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// All VRC posts data from frontend
const vrcPostsData: VrcPostData[] = [
  // Publications
  {
    title: "Công nghệ Inverter tiên tiến: Tối ưu hóa tiêu thụ điện năng trong hệ thống HVAC",
    slug: "cong-nghe-inverter-tien-tien-toi-uu-hoa-tieu-thu-dien-nang",
    content: "Phân tích chi tiết về công nghệ Inverter thế hệ mới giúp tiết kiệm tới 30% điện năng so với hệ thống truyền thống và cách áp dụng vào các công trình thương mại và dân dụng. Công nghệ Inverter không chỉ giúp tiết kiệm năng lượng mà còn cải thiện đáng kể chất lượng và độ ổn định của hệ thống HVAC.",
    publishedAt: "2025-03-15T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1548872591-c72c3fc1c836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    excerpt: "Phân tích chi tiết về công nghệ Inverter thế hệ mới giúp tiết kiệm tới 30% điện năng so với hệ thống truyền thống và cách áp dụng vào các công trình thương mại và dân dụng.",
    type: "Báo cáo"
  },
  {
    title: "Giải pháp tận dụng nhiệt thải Heat Recovery trong hệ thống công nghiệp",
    slug: "giai-phap-tan-dung-nhiet-thai-heat-recovery",
    content: "Cách tận dụng nhiệt thải từ quá trình làm lạnh để tái sử dụng cho hệ thống nước nóng hoặc không gian cần sưởi ấm, giúp tiết kiệm năng lượng gấp đôi. Hệ thống Heat Recovery không chỉ giúp giảm chi phí vận hành mà còn đóng góp tích cực vào việc bảo vệ môi trường.",
    publishedAt: "2025-02-27T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9a9cd7db6447?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    excerpt: "Cách tận dụng nhiệt thải từ quá trình làm lạnh để tái sử dụng cho hệ thống nước nóng hoặc không gian cần sưởi ấm, giúp tiết kiệm năng lượng gấp đôi.",
    type: "Nghiên cứu"
  },
  {
    title: "Tiêu chuẩn công trình xanh: Lợi ích kinh tế và môi trường trong dài hạn",
    slug: "tieu-chuan-cong-trinh-xanh-loi-ich-kinh-te",
    content: "Hệ thống điều hòa tiết kiệm năng lượng của VRC giúp các công trình đạt được chứng nhận LEED, LOTUS, EDGE và các tiêu chuẩn công trình xanh quốc tế khác. Đầu tư vào công trình xanh không chỉ mang lại lợi ích môi trường mà còn tạo ra giá trị kinh tế bền vững trong dài hạn.",
    publishedAt: "2025-01-10T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1548407260-da850faa41e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    excerpt: "Hệ thống điều hòa tiết kiệm năng lượng của VRC giúp các công trình đạt được chứng nhận LEED, LOTUS, EDGE và các tiêu chuẩn công trình xanh quốc tế khác.",
    type: "Hướng dẫn"
  },
  {
    title: "Báo cáo hiệu quả tiết kiệm năng lượng: Phân tích chi phí-lợi ích các công nghệ mới",
    slug: "bao-cao-hieu-qua-tiet-kiem-nang-luong-2024",
    content: "Phân tích chi tiết về hiệu quả đầu tư của các công nghệ tiết kiệm năng lượng, thời gian hoàn vốn và lợi ích dài hạn cho doanh nghiệp và môi trường. Báo cáo này cung cấp những số liệu cụ thể và phân tích chuyên sâu để hỗ trợ doanh nghiệp đưa ra quyết định đầu tư thông minh.",
    publishedAt: "2024-12-05T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    excerpt: "Phân tích chi tiết về hiệu quả đầu tư của các công nghệ tiết kiệm năng lượng, thời gian hoàn vốn và lợi ích dài hạn cho doanh nghiệp và môi trường.",
    type: "Báo cáo"
  },
  {
    title: "Hệ thống quản lý năng lượng thông minh cho tòa nhà thương mại",
    slug: "he-thong-quan-ly-nang-luong-thong-minh",
    content: "Cách thiết lập và vận hành hệ thống quản lý năng lượng thông minh cho các tòa nhà thương mại, giúp giảm chi phí vận hành và tối ưu hiệu suất thiết bị. Hệ thống IoT và AI được tích hợp để theo dõi và điều khiển tự động các thiết bị HVAC.",
    publishedAt: "2024-10-18T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    excerpt: "Cách thiết lập và vận hành hệ thống quản lý năng lượng thông minh cho các tòa nhà thương mại, giúp giảm chi phí vận hành và tối ưu hiệu suất thiết bị.",
    type: "Hướng dẫn"
  },
  {
    title: "Môi chất lạnh thân thiện với môi trường: Xu hướng và quy định mới",
    slug: "moi-chat-lanh-than-thien-moi-truong",
    content: "Tổng quan về các môi chất lạnh mới có GWP thấp, các quy định quốc tế về hạn chế sử dụng môi chất gây hiệu ứng nhà kính và lộ trình chuyển đổi cho doanh nghiệp. Nghiên cứu này cung cấp hướng dẫn chi tiết về việc chuyển đổi sang môi chất lạnh thân thiện với môi trường.",
    publishedAt: "2024-09-03T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1473876637954-4b493d59fd97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    excerpt: "Tổng quan về các môi chất lạnh mới có GWP thấp, các quy định quốc tế về hạn chế sử dụng môi chất gây hiệu ứng nhà kính và lộ trình chuyển đổi cho doanh nghiệp.",
    type: "Nghiên cứu"
  },
  {
    title: "Ứng dụng AI trong tối ưu hóa vận hành hệ thống điều hòa",
    slug: "ung-dung-ai-trong-toi-uu-hoa-van-hanh",
    content: "Cách trí tuệ nhân tạo và học máy đang cách mạng hóa việc vận hành hệ thống HVAC, với khả năng dự đoán nhu cầu, tối ưu hóa tiêu thụ năng lượng và bảo trì. AI giúp giảm tới 25% chi phí vận hành và tăng tuổi thọ thiết bị lên 40%.",
    publishedAt: "2024-07-25T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    excerpt: "Cách trí tuệ nhân tạo và học máy đang cách mạng hóa việc vận hành hệ thống HVAC, với khả năng dự đoán nhu cầu, tối ưu hóa tiêu thụ năng lượng và bảo trì.",
    type: "Báo cáo"
  },
  {
    title: "Kết hợp năng lượng tái tạo với hệ thống điều hòa không khí",
    slug: "ket-hop-nang-luong-tai-tao-voi-he-thong-dieu-hoa",
    content: "Giải pháp kết hợp điện mặt trời và các nguồn năng lượng tái tạo khác với hệ thống điều hòa không khí để giảm thiểu phát thải carbon và chi phí vận hành. Hệ thống hybrid này có thể giảm tới 70% chi phí điện năng và hoàn vốn sau 3-5 năm.",
    publishedAt: "2024-06-12T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    excerpt: "Giải pháp kết hợp điện mặt trời và các nguồn năng lượng tái tạo khác với hệ thống điều hòa không khí để giảm thiểu phát thải carbon và chi phí vận hành.",
    type: "Hướng dẫn"
  },

  // News Articles
  {
    title: "Triển lãm Quốc tế về Hệ thống Lạnh và Điều hòa Không khí 2025",
    slug: "trien-lam-quoc-te-he-thong-lanh-dieu-hoa-2025",
    content: "Sự kiện triển lãm quốc tế lớn nhất trong năm 2025 về các giải pháp và sản phẩm mới trong lĩnh vực hệ thống làm lạnh và điều hòa không khí. Triển lãm sẽ quy tụ hơn 500 doanh nghiệp từ 30 quốc gia và vùng lãnh thổ, trưng bày những công nghệ tiên tiến nhất.",
    publishedAt: "2025-04-01T00:00:00Z",
    imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Triển lãm",
    author: "Ban Tổ Chức",
    location: "Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC), Quận 7, TP.HCM",
    organizer: "Hiệp hội Điện lạnh Việt Nam",
    tags: ["Triển lãm", "Điều hòa", "Công nghệ làm lạnh"]
  },
  {
    title: "Hội thảo Công nghệ Tiết kiệm Năng lượng trong Hệ thống Lạnh",
    slug: "hoi-thao-cong-nghe-tiet-kiem-nang-luong",
    content: "Hội thảo chuyên sâu về các công nghệ tiết kiệm năng lượng mới nhất áp dụng trong hệ thống lạnh công nghiệp và thương mại. Sự kiện quy tụ các chuyên gia hàng đầu trong ngành để chia sẻ kinh nghiệm và xu hướng công nghệ mới.",
    publishedAt: "2025-03-25T00:00:00Z",
    imageUrl: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Hội thảo",
    author: "VRC",
    location: "Khách sạn Melia, 44 Lý Thường Kiệt, Hà Nội",
    organizer: "VRC",
    tags: ["Tiết kiệm năng lượng", "Công nghệ mới", "Hệ thống lạnh"]
  },
  {
    title: "Khóa đào tạo Kỹ thuật viên Bảo trì Hệ thống Lạnh Công nghiệp",
    slug: "khoa-dao-tao-ky-thuat-vien-bao-tri",
    content: "Khóa đào tạo chuyên sâu dành cho kỹ thuật viên về quy trình bảo trì, sửa chữa và nâng cấp các hệ thống lạnh công nghiệp quy mô lớn. Chương trình đào tạo bao gồm cả lý thuyết và thực hành với thiết bị hiện đại.",
    publishedAt: "2025-03-20T00:00:00Z",
    imageUrl: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Đào tạo",
    author: "VRC Academy",
    location: "Trung tâm Đào tạo VRC, Biên Hòa, Đồng Nai",
    tags: ["Đào tạo kỹ thuật", "Bảo trì", "Hệ thống lạnh công nghiệp"]
  },
  {
    title: "Lễ ra mắt dòng sản phẩm Điều hòa Inverter thế hệ mới",
    slug: "le-ra-mat-dong-san-pham-dieu-hoa-inverter",
    content: "Sự kiện ra mắt dòng sản phẩm điều hòa không khí công nghệ Inverter thế hệ mới với khả năng tiết kiệm năng lượng vượt trội. Sản phẩm mới có hiệu suất cao hơn 35% so với thế hệ trước và được tích hợp công nghệ IoT thông minh.",
    publishedAt: "2025-03-10T00:00:00Z",
    imageUrl: "https://images.pexels.com/photos/4846100/pexels-photo-4846100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Ra mắt sản phẩm",
    author: "VRC",
    location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
    tags: ["Inverter", "Điều hòa", "Tiết kiệm năng lượng"]
  },
  {
    title: "VRC ký kết hợp tác với tập đoàn điện lạnh hàng đầu châu Âu",
    slug: "vrc-ky-ket-hop-tac-voi-tap-doan-chau-au",
    content: "VRC vừa ký kết thỏa thuận hợp tác chiến lược với tập đoàn điện lạnh hàng đầu châu Âu, mở rộng cơ hội phát triển thị trường và chuyển giao công nghệ. Thỏa thuận này sẽ mang lại những công nghệ tiên tiến và cơ hội mở rộng thị trường quốc tế.",
    publishedAt: "2025-03-15T00:00:00Z",
    imageUrl: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Tin công ty",
    author: "Phòng Truyền thông",
    tags: ["Hợp tác quốc tế", "Phát triển", "Công nghệ mới"]
  },
  {
    title: "Thực trạng và giải pháp tiết kiệm năng lượng trong ngành điện lạnh tại Việt Nam",
    slug: "thuc-trang-giai-phap-tiet-kiem-nang-luong-viet-nam",
    content: "Báo cáo phân tích về thực trạng sử dụng năng lượng trong ngành điện lạnh tại Việt Nam và đề xuất các giải pháp tiết kiệm hiệu quả. Nghiên cứu chỉ ra rằng Việt Nam có tiềm năng tiết kiệm tới 30% năng lượng tiêu thụ trong lĩnh vực này.",
    publishedAt: "2025-03-05T00:00:00Z",
    imageUrl: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Nghiên cứu",
    author: "TS. Nguyễn Văn An",
    tags: ["Nghiên cứu", "Tiết kiệm năng lượng", "Thị trường Việt Nam"]
  },
  {
    title: "VRC nhận giải thưởng Doanh nghiệp Xanh 2025",
    slug: "vrc-nhan-giai-thuong-doanh-nghiep-xanh-2025",
    content: "VRC vinh dự nhận giải thưởng Doanh nghiệp Xanh 2025 cho những đóng góp tích cực trong việc phát triển sản phẩm và giải pháp thân thiện với môi trường. Giải thưởng này ghi nhận những nỗ lực không ngừng của VRC trong việc bảo vệ môi trường và phát triển bền vững.",
    publishedAt: "2025-02-28T00:00:00Z",
    imageUrl: "https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Giải thưởng",
    author: "Phòng Truyền thông",
    tags: ["Giải thưởng", "Phát triển bền vững", "Doanh nghiệp xanh"]
  },
  {
    title: "Diễn đàn Doanh nghiệp Điện lạnh Việt - EU",
    slug: "dien-dan-doanh-nghiep-dien-lanh-viet-eu",
    content: "Diễn đàn kết nối doanh nghiệp trong lĩnh vực điện lạnh giữa Việt Nam và các nước Liên minh Châu Âu, tạo cơ hội hợp tác và phát triển thị trường. Sự kiện quy tụ hơn 200 doanh nghiệp và tạo ra nhiều cơ hội hợp tác kinh doanh mới.",
    publishedAt: "2025-04-01T00:00:00Z",
    imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Diễn đàn",
    author: "Bộ Công Thương",
    location: "Pullman Saigon Centre, TP.HCM",
    organizer: "Bộ Công Thương và Phái đoàn EU tại Việt Nam",
    tags: ["Hợp tác quốc tế", "EU", "Thương mại"]
  }
]

// Function to download image from URL and save to frontend assets
async function downloadImageToFrontend(imageUrl: string, fileName: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      console.warn(`Failed to download image from ${imageUrl}:`, response.statusText)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create filename with proper extension
    const url = new URL(imageUrl)
    const extension = path.extname(url.pathname) || '.jpg'
    const fullFileName = `${fileName}${extension}`

    // Save to frontend assets directory
    const frontendAssetsPath = path.join(process.cwd(), '../vrcfrontend/public/assets/images')
    const filePath = path.join(frontendAssetsPath, fullFileName)

    // Ensure directory exists
    if (!fs.existsSync(frontendAssetsPath)) {
      fs.mkdirSync(frontendAssetsPath, { recursive: true })
    }

    fs.writeFileSync(filePath, buffer)
    console.log(`✅ Downloaded image: ${fullFileName}`)

    return filePath
  } catch (error) {
    console.error(`Error downloading image from ${imageUrl}:`, error)
    return null
  }
}

export async function seedAllVrcPosts(payload: Payload): Promise<void> {
  console.log('🌱 Starting to seed all VRC posts...')

  try {
    // Clear existing posts first
    console.log('🗑️ Clearing existing posts...')
    const existingPosts = await payload.find({
      collection: 'posts',
      limit: 1000,
    })

    if (existingPosts.docs.length > 0) {
      for (const post of existingPosts.docs) {
        await payload.delete({
          collection: 'posts',
          id: post.id,
        })
      }
      console.log(`🗑️ Deleted ${existingPosts.docs.length} existing posts`)
    }

    // Get default media for fallback
    const mediaQuery = await payload.find({
      collection: 'media',
      limit: 1,
    })

    const defaultMediaId = mediaQuery.docs[0]?.id

    if (!defaultMediaId) {
      throw new Error('No media found in database. Please run media seed first.')
    }

    console.log(`📸 Using default media ID: ${defaultMediaId}`)

    // Process each post
    for (const postData of vrcPostsData) {
      if (!postData) continue

      console.log(`\n📝 Processing post: ${postData.title}`)

      let heroImageId = defaultMediaId

      // Download and upload image if available
      if (postData.imageUrl) {
        const imageFileName = `vrc-post-${postData.slug}`

        // Download image to frontend assets
        const imagePath = await downloadImageToFrontend(postData.imageUrl, imageFileName)

        if (imagePath) {
          // Upload to Payload using existing upload utility
          const uploadedImageId = await uploadMediaFromFrontend(payload, imagePath, postData.title)
          if (uploadedImageId) {
            heroImageId = uploadedImageId
            console.log(`✅ Uploaded image for post: ${postData.title}`)
          }
        }
      }

      // Create rich content based on excerpt and content
      const fullContent = postData.excerpt ?
        `${postData.excerpt}\n\n${postData.content}` :
        postData.content

      // Create the post
      const postToCreate = {
        title: postData.title,
        slug: postData.slug,
        publishedAt: postData.publishedAt,
        _status: "published" as const,
        heroImage: heroImageId,
        content: createRichText(fullContent),
        meta: {
          title: postData.title,
          description: postData.excerpt || postData.content.substring(0, 160),
          image: heroImageId,
        },
      }

      try {
        const createdPost = await payload.create({
          collection: 'posts',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: postToCreate as any,
        })

        console.log(`✅ Created post: ${createdPost.title} (ID: ${createdPost.id})`)
      } catch (error) {
        console.error(`❌ Error creating post "${postData.title}":`, error)
        // Continue with next post instead of failing completely
      }
    }

    console.log(`\n🎉 Successfully seeded all ${vrcPostsData.length} VRC posts!`)

  } catch (error) {
    console.error('❌ Error seeding VRC posts:', error)
    throw error
  }
}
