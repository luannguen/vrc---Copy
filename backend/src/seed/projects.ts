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
      format: '' as const,
      indent: 0,
      version: 1,
    }
  };
};

export const seedProjects = async (payload: Payload) => {
  console.log('🏗️ Seeding projects...');

  try {
    // Fetch existing projects to avoid duplicates
    const existingProjects = await payload.find({
      collection: 'projects',
      limit: 100,
    });

    // Delete existing projects if any exist
    if (existingProjects.docs.length > 0) {
      console.log(`Found ${existingProjects.docs.length} existing projects, deleting them first...`);
      for (const project of existingProjects.docs) {
        await payload.delete({
          collection: 'projects',
          id: project.id,
        });
      }
      console.log('✅ Existing projects deleted');
    }    // Get or create a default media ID for fallback
    const defaultMediaId = await getOrCreateDefaultMediaId(payload);
    console.log('Default media ID for projects fallback:', defaultMediaId);

    // Sample projects based on the frontend data
    const projects = [
      {
        title: "Nhà máy sản xuất ABC",
        client: "Công ty Điện tử ABC",
        summary: "Hệ thống điều hòa công nghiệp VRC-5000 cho nhà máy sản xuất với diện tích 2000m²",
        location: "Bình Dương, Việt Nam",        timeframe: {
          startDate: new Date("2023-01-15").toISOString(),
          endDate: new Date("2023-05-15").toISOString(),
          isOngoing: false        },
        featured: true,
        status: "published",
        _status: "published",
        featuredImage: defaultMediaId, // Required field
        content: createRichText("Dự án lắp đặt hệ thống điều hòa công nghiệp VRC-5000 cho nhà máy sản xuất ABC với diện tích 2000m² tại Bình Dương. Hệ thống được thiết kế để đáp ứng yêu cầu khắt khe về nhiệt độ và độ ẩm trong quy trình sản xuất điện tử, đồng thời tối ưu hóa chi phí vận hành. VRC đã cung cấp giải pháp trọn gói bao gồm thiết kế, cung cấp thiết bị, lắp đặt và bảo trì cho toàn bộ hệ thống điều hòa không khí của nhà máy."),
      },
      {
        title: "Chung Cư Cao Cấp Star Heights",
        client: "Star Heights Investments JSC",
        summary: "Cung cấp và lắp đặt toàn bộ hệ thống điều hòa không khí cho khu chung cư cao cấp 35.000 m²",
        location: "Quận 2, Thành phố Hồ Chí Minh",
        timeframe: {
          startDate: new Date("2022-12-01").toISOString(),
          endDate: new Date("2023-06-30").toISOString(),
          isOngoing: false
        },
        featured: true,
        status: "published",
        _status: "published",
        featuredImage: defaultMediaId, // Required field
        content: createRichText("Cung cấp và lắp đặt toàn bộ hệ thống điều hòa không khí cho khu chung cư cao cấp Star Heights, đảm bảo môi trường sống thoải mái và sang trọng cho cư dân. Dự án có diện tích 35.000 m² bao gồm 2 tòa chung cư 30 tầng với đầy đủ tiện ích hiện đại."),
      },
      {
        title: "Siêu thị Mega Market",
        client: "Mega Market Corporation",
        summary: "Hệ thống lạnh thương mại tổng thể cho chuỗi siêu thị lớn với công nghệ tiết kiệm năng lượng",
        location: "Hà Nội, Việt Nam",        timeframe: {
          startDate: new Date("2023-04-10").toISOString(),
          endDate: new Date("2023-08-20").toISOString(),
          isOngoing: false
        },
        featured: true,
        status: "published",
        _status: "published",
        featuredImage: defaultMediaId, // Required field
        content: createRichText("Thiết kế và lắp đặt hệ thống lạnh thương mại tổng thể cho chuỗi siêu thị Mega Market tại Hà Nội. Hệ thống bao gồm tủ lạnh trưng bày, kho lạnh, và hệ thống điều hòa không gian mua sắm, đảm bảo chất lượng thực phẩm và môi trường mua sắm thoải mái."),
      },
      {
        title: "Nhà máy chế biến thủy sản Minh Phú",
        client: "Minh Phú Seafood Corporation",
        summary: "Hệ thống kho lạnh công nghiệp quy mô lớn cho nhà máy chế biến thủy sản xuất khẩu",
        location: "Cà Mau, Việt Nam",        timeframe: {
          startDate: new Date("2023-06-01").toISOString(),
          endDate: new Date("2023-10-10").toISOString(),
          isOngoing: false
        },
        featured: true,
        status: "published",
        _status: "published",
        featuredImage: defaultMediaId, // Required field
        content: createRichText("Thiết kế và lắp đặt hệ thống kho lạnh công nghiệp quy mô lớn cho nhà máy chế biến thủy sản Minh Phú tại Cà Mau. Hệ thống đáp ứng tiêu chuẩn quốc tế về bảo quản thủy sản xuất khẩu với công suất lạnh lớn và khả năng duy trì nhiệt độ ổn định."),
      },
      {
        title: "Trung tâm thương mại Diamond Plaza",
        client: "Diamond Plaza Development",
        summary: "Hệ thống HVAC tổng thể cho trung tâm thương mại đa chức năng",
        location: "TP. Hồ Chí Minh, Việt Nam",
        timeframe: {
          startDate: new Date("2023-01-15").toISOString(),
          endDate: new Date("2023-07-30").toISOString(),
          isOngoing: false
        },
        featured: false,
        status: "published",
        _status: "published",
        featuredImage: defaultMediaId, // Required field
        content: createRichText("Thiết kế và triển khai hệ thống HVAC hoàn chỉnh cho trung tâm thương mại Diamond Plaza, bao gồm hệ thống điều hòa không khí, thông gió và xử lý không khí cho các khu vực bán lẻ, nhà hàng và giải trí."),
      },
      {
        title: "Khách sạn 5 sao Intercontinental",
        client: "IHG Hotels & Resorts",
        summary: "Hệ thống điều hòa và làm mát cho khách sạn 5 sao tiêu chuẩn quốc tế",
        location: "Đà Nẵng, Việt Nam",
        timeframe: {
          startDate: new Date("2023-03-01").toISOString(),
          endDate: new Date("2023-09-15").toISOString(),
          isOngoing: false
        },
        featured: false,
        status: "published",
        _status: "published",
        featuredImage: defaultMediaId, // Required field
        content: createRichText("Cung cấp và lắp đặt hệ thống điều hòa không khí cao cấp cho khách sạn Intercontinental Đà Nẵng, đảm bảo tiêu chuẩn 5 sao quốc tế với hệ thống kiểm soát nhiệt độ cá nhân cho từng phòng và khu vực công cộng."),
      },
    ];    // Create projects
    // Khởi tạo progress bar cho việc tạo dự án
    progressManager.initProgressBar(projects.length, 'Uploading project images');

    for (const project of projects) {
      try {
        // Get appropriate image for this project
        const mediaId = await getImageForCollectionItem(
          payload,
          'project',
          project.title
        );

        // Create project with the appropriate image
        const data = {
          ...project,
          featuredImage: mediaId || defaultMediaId
        };

        const createdProject = await payload.create({
          collection: 'projects',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: data as any, // Type assertion for seed data compatibility
        });
        console.log(`Created project: ${createdProject.title} with media ID: ${data.featuredImage}`);

        // Cập nhật tiến trình
        progressManager.increment();
      } catch (error) {
        console.error(`Error creating project ${project.title}:`, error);
        progressManager.increment(); // Vẫn cập nhật nếu có lỗi
      }
    }

    // Hoàn thành progress bar
    progressManager.complete();

    console.log(`✅ Successfully seeded projects`);
  } catch (error) {
    console.error('Error seeding projects:', error);
  }
}
