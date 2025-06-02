import { Payload } from 'payload';
import { progressManager } from './utils/progressUtils';
import { uploadEventImages, getEventImageId } from './utils/uploadEventImages';

export const seedEvents = async (payload: Payload): Promise<void> => {
  try {
    console.log('🗓️ Đang tạo dữ liệu mẫu cho Events...');

    // Get existing categories to use in events
    const categoriesResponse = await payload.find({
      collection: 'event-categories',
      limit: 20,
    });

    if (!categoriesResponse.docs.length) {
      console.log('⚠️  Không tìm thấy danh mục sự kiện. Vui lòng chạy seed cho event-categories trước.');
      return;
    }

    // Create a mapping of category names to IDs
    const categoryMap = new Map();
    categoriesResponse.docs.forEach((cat: { id: string; name: string }) => {
      categoryMap.set(cat.name, cat.id);
    });

    // Upload event images first
    console.log('📸 Upload ảnh sự kiện trước khi seed...');
    const eventMediaIds = await uploadEventImages(payload);

    if (Object.keys(eventMediaIds).length === 0) {
      console.warn('⚠️ Không có ảnh nào được upload thành công, sử dụng ảnh có sẵn...');
    }

    // Get existing media files to use as fallback
    const mediaResponse = await payload.find({
      collection: 'media',
      limit: 10,
    });

    const existingMediaIds = mediaResponse.docs.map((media: { id: string }) => media.id);

    // Sample events data based on frontend hardcoded data
    const events = [
      {
        title: 'Triển lãm Quốc tế về Hệ thống Lạnh và Điều hòa Không khí',
        summary: 'Sự kiện triển lãm quốc tế lớn nhất trong năm về các giải pháp và sản phẩm mới trong lĩnh vực hệ thống làm lạnh và điều hòa không khí.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: 'Triển lãm Quốc tế về Hệ thống Lạnh và Điều hòa Không khí là sự kiện triển lãm quốc tế lớn nhất trong năm về các giải pháp và sản phẩm mới trong lĩnh vực hệ thống làm lạnh và điều hòa không khí.',
                    version: 1
                  }
                ],
                direction: 'ltr'
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 1,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: 'Điểm nổi bật của sự kiện:',
                    version: 1
                  }
                ],
                direction: 'ltr'
              },
              {
                type: 'list',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        format: 0,
                        style: '',
                        mode: 'normal',
                        detail: 0,
                        text: 'Hơn 200 gian hàng từ các nhà sản xuất hàng đầu thế giới',
                        version: 1
                      }
                    ],
                    direction: 'ltr'
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        format: 0,
                        style: '',
                        mode: 'normal',
                        detail: 0,
                        text: 'Công nghệ và thiết bị mới nhất trong ngành',
                        version: 1
                      }
                    ],
                    direction: 'ltr'
                  },
                  {
                    type: 'listitem',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        format: 0,
                        style: '',
                        mode: 'normal',
                        detail: 0,
                        text: 'Hội thảo chuyên đề và workshop thực hành',
                        version: 1
                      }
                    ],
                    direction: 'ltr'
                  }
                ],
                direction: 'ltr',
                listType: 'bullet',
                start: 1,
                tag: 'ul'
              }
            ],
            direction: 'ltr'
          }
        },
        startDate: '2025-05-15T00:00:00.000Z',
        endDate: '2025-05-18T23:59:59.000Z',
        location: 'Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC), Quận 7, TP.HCM',
        organizer: 'Hiệp hội Điện lạnh Việt Nam',
        maxParticipants: 2500,
        currentParticipants: 0,
        registrationDeadline: '2025-05-10T23:59:59.000Z',
        registrationFee: 0,
        featured: true,
        categories: [categoryMap.get('Triển lãm')],
        featuredImage: getEventImageId('vrc-post-trien-lam-quoc-te-he-thong-lanh-dieu-hoa-2025.jpeg', eventMediaIds) || existingMediaIds[0] || null,
        tags: ['Triển lãm', 'Điều hòa', 'Công nghệ làm lạnh'],
        _status: 'published'
      },
      {
        title: 'Hội thảo Công nghệ Tiết kiệm Năng lượng trong Hệ thống Lạnh',
        summary: 'Hội thảo chuyên sâu về các công nghệ tiết kiệm năng lượng mới nhất áp dụng trong hệ thống lạnh công nghiệp và thương mại.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: 'Hội thảo tập trung vào các công nghệ tiết kiệm năng lượng tiên tiến trong hệ thống lạnh, giúp doanh nghiệp giảm chi phí vận hành và bảo vệ môi trường.',
                    version: 1
                  }
                ],
                direction: 'ltr'
              }
            ],
            direction: 'ltr'
          }
        },
        startDate: '2025-04-20T09:00:00.000Z',
        endDate: '2025-04-20T17:00:00.000Z',
        location: 'Khách sạn Melia, 44 Lý Thường Kiệt, Hà Nội',
        organizer: 'VRC',
        maxParticipants: 350,
        currentParticipants: 0,
        registrationDeadline: '2025-04-15T23:59:59.000Z',
        registrationFee: 500000,
        featured: false,
        categories: [categoryMap.get('Hội thảo')],
        featuredImage: getEventImageId('vrc-post-hoi-thao-cong-nghe-tiet-kiem-nang-luong.jpeg', eventMediaIds) || existingMediaIds[1] || null,
        tags: ['Tiết kiệm năng lượng', 'Công nghệ mới', 'Hệ thống lạnh'],
        _status: 'published'
      },
      {
        title: 'Khóa đào tạo Kỹ thuật viên Bảo trì Hệ thống Lạnh Công nghiệp',
        summary: 'Khóa đào tạo chuyên sâu dành cho kỹ thuật viên về quy trình bảo trì, sửa chữa và nâng cấp các hệ thống lạnh công nghiệp quy mô lớn.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: 'Khóa đào tạo 3 ngày với nội dung thực tế, bao gồm lý thuyết và thực hành trực tiếp trên thiết bị.',
                    version: 1
                  }
                ],
                direction: 'ltr'
              }
            ],
            direction: 'ltr'
          }
        },
        startDate: '2025-04-10T08:00:00.000Z',
        endDate: '2025-04-12T17:00:00.000Z',
        location: 'Trung tâm Đào tạo VRC, Biên Hòa, Đồng Nai',
        organizer: 'VRC Academy',
        maxParticipants: 180,
        currentParticipants: 0,
        registrationDeadline: '2025-04-05T23:59:59.000Z',
        registrationFee: 2500000,
        featured: false,
        categories: [categoryMap.get('Đào tạo')],
        featuredImage: getEventImageId('vrc-post-khoa-hoc-dao-tao-ky-thuat-lanh-co-ban.jpeg', eventMediaIds) || existingMediaIds[2] || null,
        tags: ['Đào tạo kỹ thuật', 'Bảo trì', 'Hệ thống lạnh công nghiệp'],
        _status: 'published'
      },
      {
        title: 'Lễ ra mắt dòng sản phẩm Điều hòa Inverter thế hệ mới',
        summary: 'Sự kiện ra mắt dòng sản phẩm điều hòa không khí công nghệ Inverter thế hệ mới với khả năng tiết kiệm năng lượng vượt trội.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: 'VRC vinh dự giới thiệu dòng sản phẩm điều hòa Inverter thế hệ mới với nhiều tính năng vượt trội.',
                    version: 1
                  }
                ],
                direction: 'ltr'
              }
            ],
            direction: 'ltr'
          }
        },
        startDate: '2025-03-25T14:00:00.000Z',
        endDate: '2025-03-25T18:00:00.000Z',
        location: 'Trung tâm Hội nghị Quốc gia, Hà Nội',
        organizer: 'VRC',
        maxParticipants: 420,
        currentParticipants: 0,
        registrationDeadline: '2025-03-20T23:59:59.000Z',
        registrationFee: 0,
        featured: false,
        categories: [categoryMap.get('Ra mắt sản phẩm')],
        featuredImage: getEventImageId('vrc-post-le-ra-mat-dong-san-pham-dieu-hoa-inverter.jpeg', eventMediaIds) || existingMediaIds[3] || null,
        tags: ['Inverter', 'Điều hòa', 'Tiết kiệm năng lượng'],
        _status: 'published'
      },
      {
        title: 'Diễn đàn Doanh nghiệp Điện lạnh Việt - EU',
        summary: 'Diễn đàn kết nối doanh nghiệp trong lĩnh vực điện lạnh giữa Việt Nam và các nước Liên minh Châu Âu, tạo cơ hội hợp tác và phát triển thị trường.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: 'Diễn đàn 2 ngày với sự tham gia của các chuyên gia và doanh nghiệp hàng đầu từ Việt Nam và EU.',
                    version: 1
                  }
                ],
                direction: 'ltr'
              }
            ],
            direction: 'ltr'
          }
        },
        startDate: '2025-04-28T09:00:00.000Z',
        endDate: '2025-04-29T17:00:00.000Z',
        location: 'Pullman Saigon Centre, TP.HCM',
        organizer: 'Bộ Công Thương và Phái đoàn EU tại Việt Nam',
        maxParticipants: 300,
        currentParticipants: 0,
        registrationDeadline: '2025-04-23T23:59:59.000Z',
        registrationFee: 1000000,
        featured: true,
        categories: [categoryMap.get('Diễn đàn')],
        featuredImage: getEventImageId('vrc-post-dien-dan-doanh-nghiep-dien-lanh-viet-eu.jpeg', eventMediaIds) || existingMediaIds[4] || null,
        tags: ['Hợp tác quốc tế', 'EU', 'Thương mại'],
        _status: 'published'
      },
      {
        title: 'Hội nghị khách hàng VRC 2025',
        summary: 'Sự kiện thường niên dành cho khách hàng của VRC, giới thiệu các sản phẩm mới và chiến lược phát triển trong năm tới.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: 'Hội nghị thường niên với nhiều hoạt động networking và giới thiệu sản phẩm mới.',
                    version: 1
                  }
                ],
                direction: 'ltr'
              }
            ],
            direction: 'ltr'
          }
        },
        startDate: '2025-03-15T09:00:00.000Z',
        endDate: '2025-03-15T17:00:00.000Z',
        location: 'Hotel Nikko, Hà Nội',
        organizer: 'VRC',
        maxParticipants: 250,
        currentParticipants: 0,
        registrationDeadline: '2025-03-10T23:59:59.000Z',
        registrationFee: 0,
        featured: false,
        categories: [categoryMap.get('Hội nghị')],
        featuredImage: getEventImageId('vrc-post-hoi-nghi-khach-hang-vrc-2025.jpeg', eventMediaIds) || existingMediaIds[0] || null,
        tags: ['Khách hàng', 'Networking', 'Hội nghị thường niên'],
        _status: 'published'
      },
      // Additional events to reach category counts from frontend
      {
        title: 'Workshop Thiết kế Hệ thống Lạnh hiệu quả',
        summary: 'Workshop thực hành về thiết kế và tối ưu hóa hệ thống lạnh cho các ứng dụng khác nhau.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: 'Workshop 1 ngày về thiết kế hệ thống lạnh với các chuyên gia hàng đầu.',
                    version: 1
                  }
                ],
                direction: 'ltr'
              }
            ],
            direction: 'ltr'
          }
        },
        startDate: '2025-05-05T08:00:00.000Z',
        endDate: '2025-05-05T17:00:00.000Z',
        location: 'Trung tâm Đào tạo VRC, TP.HCM',
        organizer: 'VRC Academy',
        maxParticipants: 120,
        currentParticipants: 0,
        registrationDeadline: '2025-04-30T23:59:59.000Z',
        registrationFee: 1500000,
        featured: false,
        categories: [categoryMap.get('Đào tạo')],
        featuredImage: getEventImageId('vrc-post-workshop-thiet-ke-he-thong-lanh-hieu-qua.jpeg', eventMediaIds) || existingMediaIds[1] || null,
        tags: ['Thiết kế', 'Workshop', 'Hệ thống lạnh'],
        _status: 'published'
      },
      {
        title: 'Hội thảo Xu hướng Công nghệ Điện lạnh 2025',
        summary: 'Hội thảo về các xu hướng công nghệ mới trong ngành điện lạnh và dự báo thị trường năm 2025.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: 'Hội thảo với sự tham gia của các chuyên gia trong nước và quốc tế.',
                    version: 1
                  }
                ],
                direction: 'ltr'
              }
            ],
            direction: 'ltr'
          }
        },
        startDate: '2025-06-10T09:00:00.000Z',
        endDate: '2025-06-10T17:00:00.000Z',
        location: 'Trung tâm Hội nghị Ariyana, Đà Nẵng',
        organizer: 'Hiệp hội Điện lạnh Việt Nam',
        maxParticipants: 400,
        currentParticipants: 0,
        registrationDeadline: '2025-06-05T23:59:59.000Z',
        registrationFee: 800000,
        featured: false,
        categories: [categoryMap.get('Hội thảo')],
        featuredImage: getEventImageId('vrc-post-hoi-thao-xu-huong-cong-nghe-dien-lanh-2025.jpeg', eventMediaIds) || existingMediaIds[2] || null,
        tags: ['Xu hướng', 'Công nghệ', 'Thị trường'],
        _status: 'published'
      }
    ];

    console.log('Đang thêm dữ liệu mẫu cho sự kiện...');
    progressManager.initProgressBar(events.length, 'Creating Events');

    let createdCount = 0;
    let skippedCount = 0;    for (let i = 0; i < events.length; i++) {
      const eventData = events[i];
      if (!eventData) continue;

      try {
        // Check if event already exists
        const existingEvent = await payload.find({
          collection: 'events',
          where: {
            title: { equals: eventData.title }
          },
          limit: 1
        });

        if (existingEvent.docs.length > 0) {
          console.log(`⚠️  Sự kiện "${eventData.title}" đã tồn tại, bỏ qua...`);
          skippedCount++;
          progressManager.increment();
          continue;
        }

        // Filter out invalid category IDs
        const validCategories = eventData.categories.filter((catId: string) => catId);

        const createData = {
          title: eventData.title,
          summary: eventData.summary,
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
                      version: 1,
                      text: eventData.summary || ''
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
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          location: eventData.location,
          organizer: eventData.organizer,
          participants: eventData.maxParticipants,
          featured: eventData.featured,
          categories: validCategories,
          tags: eventData.tags.map(tag => ({ tag })),
          status: 'upcoming' as const,
          publishStatus: 'published' as const,
          _status: 'published' as const,
          featuredImage: eventData.featuredImage || existingMediaIds[0] || ''
        };

        await payload.create({
          collection: 'events',
          data: createData
        });

        createdCount++;
        progressManager.increment();
      } catch (error) {
        console.error(`❌ Lỗi khi tạo sự kiện "${eventData.title}":`, error);
        progressManager.increment();
      }
    }

    progressManager.complete();
    console.log(`✅ Đã tạo thành công ${createdCount} sự kiện mẫu`);
    if (skippedCount > 0) {
      console.log(`⚠️  Đã bỏ qua ${skippedCount} sự kiện đã tồn tại`);
    }

  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu cho Events:', error);
    throw error;
  }
};
