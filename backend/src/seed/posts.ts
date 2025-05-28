import { Payload } from 'payload';

// Import our improved media management utilities
import { 
  getImageForCollectionItem,
  getOrCreateDefaultMediaId 
} from './utils/seedMediaManagement';

// Import progress bar manager
import { progressManager } from './utils/progressUtils';

// Simplified richText structure
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
      format: '',
      indent: 0,
      version: 1,
    }
  };
};

export const seedPosts = async (payload: Payload) => {
  console.log('📝 Seeding blog posts...');

  try {
    // Fetch existing posts to avoid duplicates
    const existingPosts = await payload.find({
      collection: 'posts',
      limit: 100,
    });

    // If we already have posts, skip
    if (existingPosts.docs.length > 0) {
      console.log(`Found ${existingPosts.docs.length} existing posts, skipping seed.`);
      return;
    }    // Get or create a default media ID for fallback
    const defaultMediaId = await getOrCreateDefaultMediaId(payload);
    console.log('Default media ID for posts fallback:', defaultMediaId);

    // Sample posts
    const posts = [
      {
        title: "Tiêu chuẩn mới về hiệu suất năng lượng cho hệ thống lạnh",
        slug: "tieu-chuan-moi-ve-hieu-suat-nang-luong",
        publishedAt: new Date("2025-05-10").toISOString(),
        status: "published",
        heroImage: defaultMediaId,
        content: createRichText("Từ tháng 7/2025, các tiêu chuẩn mới về hiệu suất năng lượng cho hệ thống lạnh công nghiệp và thương mại sẽ chính thức có hiệu lực tại Việt Nam."),
        meta: {
          title: "Tiêu chuẩn mới về hiệu suất năng lượng cho hệ thống lạnh",
          description: "Từ tháng 7/2025, các tiêu chuẩn mới về hiệu suất năng lượng cho hệ thống lạnh công nghiệp và thương mại sẽ chính thức có hiệu lực tại Việt Nam.",
          image: defaultMediaId
        }
      },
      {
        title: "Công nghệ mới trong hệ thống lạnh năm 2025",
        slug: "cong-nghe-moi-trong-he-thong-lanh-2025",
        publishedAt: new Date("2025-04-15").toISOString(),
        status: "published",
        heroImage: defaultMediaId,
        content: createRichText("Năm 2025 chứng kiến nhiều bước tiến đáng kể trong công nghệ hệ thống lạnh, từ việc cải tiến hiệu suất đến các giải pháp thông minh và tự động hóa."),
        meta: {
          title: "Công nghệ mới trong hệ thống lạnh năm 2025",
          description: "Năm 2025 chứng kiến nhiều bước tiến đáng kể trong công nghệ hệ thống lạnh, từ việc cải tiến hiệu suất đến các giải pháp thông minh và tự động hóa.",
          image: defaultMediaId
        }
      },
      {
        title: "VRC hoàn thành dự án lớn tại khu công nghiệp Long Thành",
        slug: "vrc-hoan-thanh-du-an-lon-tai-khu-cong-nghiep-long-thanh",
        publishedAt: new Date("2025-05-01").toISOString(),
        status: "published",
        heroImage: defaultMediaId,
        content: createRichText("VRC vừa chính thức bàn giao dự án hệ thống lạnh công nghiệp quy mô lớn cho Công ty TNHH Chế biến Thực phẩm ABC tại Khu công nghiệp Long Thành, Đồng Nai."),
        meta: {
          title: "VRC hoàn thành dự án lớn tại khu công nghiệp Long Thành",
          description: "VRC vừa chính thức bàn giao dự án hệ thống lạnh công nghiệp quy mô lớn cho Công ty TNHH Chế biến Thực phẩm ABC tại Khu công nghiệp Long Thành, Đồng Nai.",
          image: defaultMediaId
        }
      }
    ];    // Create posts
    // Khởi tạo progress bar cho việc tạo bài viết
    progressManager.initProgressBar(posts.length, 'Uploading post images');
    
    for (const post of posts) {
      try {
        // Get appropriate image for this post
        const mediaId = await getImageForCollectionItem(
          payload, 
          'post', 
          post.title
        );
        
        // Create post with the appropriate image
        const data = {
          ...post,
          heroImage: mediaId || defaultMediaId,
          meta: {
            ...post.meta,
            image: mediaId || defaultMediaId
          }
        };
        
        const createdPost = await payload.create({
          collection: 'posts',
          data: data as any, // Using type assertion as a temporary solution
        });
        console.log(`Created post: ${createdPost.title} with media ID: ${data.heroImage}`);
        
        // Cập nhật tiến trình
        progressManager.increment();
      } catch (error) {
        console.error(`Error creating post ${post.title}:`, error);
        progressManager.increment(); // Vẫn cập nhật nếu có lỗi
      }
    }
    
    // Hoàn thành progress bar
    progressManager.complete();

    console.log(`✅ Successfully seeded posts`);
  } catch (error) {
    console.error('Error seeding posts:', error);
  }
};
