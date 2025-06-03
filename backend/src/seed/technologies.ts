import { getPayload } from 'payload';
import config from '@payload-config';

export const seedTechnologies = async () => {
  try {
    const payload = await getPayload({ config });
    console.log('🔧 Seeding technologies...');

    // Check if technologies already exist
    const _existingTechnologies = await payload.find({
      collection: 'technologies',
      limit: 1,
    });

    if (_existingTechnologies.totalDocs > 0) {
      console.log('⏭️ Technologies already exist, skipping...');
      return;
    }

    // Technologies data from frontend hardcoded data with correct richText format
    const technologiesData = [
      {
        name: 'Hệ thống làm lạnh công nghiệp',
        slug: 'he-thong-lam-lanh-cong-nghiep',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Công nghệ làm lạnh tiên tiến cho nhà máy và cơ sở công nghiệp với các tính năng: Hệ thống làm lạnh công nghiệp quy mô lớn, điều khiển nhiệt độ chính xác đến 0.1°C, tiết kiệm năng lượng lên đến 30%, khả năng giám sát từ xa qua internet.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'technology' as const,
        status: 'published' as const,
        order: 1,
        featured: true,
        website: '/technologies/industrial-cooling'
      },
      {
        name: 'Điều hòa không khí thương mại',
        slug: 'dieu-hoa-khong-khi-thuong-mai',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Giải pháp điều hòa cho văn phòng và không gian thương mại với hệ thống VRV/VRF hiện đại, lọc không khí tiên tiến loại bỏ 99.9% vi khuẩn, công nghệ inverter tiết kiệm điện, kiểm soát độ ẩm chính xác.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'technology' as const,
        status: 'published' as const,
        order: 2,
        featured: true,
        website: '/technologies/commercial-hvac'
      },
      {
        name: 'Hệ thống thông gió và lọc khí',
        slug: 'he-thong-thong-gio-va-loc-khi',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Công nghệ thông gió thông minh và lọc khí sạch với hệ thống ERV/HRV thu hồi nhiệt, lọc HEPA H13 loại bỏ 99.97% bụi mịn PM2.5, cảm biến chất lượng không khí tự động, hệ thống thông gió thông minh theo nhu cầu.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'technology' as const,
        status: 'published' as const,
        order: 3,
        featured: false,
        website: '/technologies/ventilation-air-filtration'
      },
      {
        name: 'Điều hòa gia đình thông minh',
        slug: 'dieu-hoa-gia-dinh-thong-minh',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Giải pháp điều hòa thông minh cho gia đình hiện đại với điều khiển từ xa qua smartphone và voice control, AI học thói quen sử dụng để tối ưu năng lượng, chế độ ngủ thông minh tự điều chỉnh nhiệt độ, cảnh báo bảo trì tự động.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'technology' as const,
        status: 'published' as const,
        order: 4,
        featured: false,
        website: '/technologies/smart-home-hvac'
      },
      {
        name: 'Giải pháp năng lượng xanh',
        slug: 'giai-phap-nang-luong-xanh',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Công nghệ xanh và bền vững cho hệ thống HVAC với heat pump công nghệ cao sử dụng năng lượng tái tạo, hệ thống solar hybrid kết hợp năng lượng mặt trời, công nghệ geothermal tận dụng nhiệt đất, giảm 70% khí thải carbon so với hệ thống truyền thống.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'technology' as const,
        status: 'published' as const,
        order: 5,
        featured: true,
        website: '/technologies/green-energy-solutions'
      },
      // PARTNERS - Đối tác
      {
        name: 'Daikin Vietnam',
        slug: 'daikin-vietnam',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Đối tác chiến lược hàng đầu trong lĩnh vực điều hòa không khí và giải pháp HVAC. Daikin là thương hiệu số 1 thế giới với công nghệ tiên tiến, hiệu suất cao và độ bền vượt trội.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'partner' as const,
        status: 'published' as const,
        order: 1,
        featured: true,
        website: 'https://www.daikin.com.vn',
        logo: '683c0205b71652d43305f808' // 300.jpg
      },
      {
        name: 'Mitsubishi Electric',
        slug: 'mitsubishi-electric',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Đối tác công nghệ cao với hệ thống điều hòa trung tâm VRF, kiểm soát thông minh và giải pháp tự động hóa tòa nhà. Cam kết chất lượng Nhật Bản.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'partner' as const,
        status: 'published' as const,
        order: 2,
        featured: true,
        website: 'https://www.mitsubishielectric.com.vn',
        logo: '683c0240b71652d43305f82e' // 300 (1).jpg
      },
      {
        name: 'Carrier Corporation',
        slug: 'carrier-corporation',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Thương hiệu lịch sử với hơn 120 năm kinh nghiệm trong lĩnh vực làm lạnh và điều hòa không khí. Chuyên về hệ thống chiller và giải pháp công nghiệp quy mô lớn.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'partner' as const,
        status: 'published' as const,
        order: 3,
        featured: false,
        website: 'https://www.carrier.com',
        logo: '683c0272b71652d43305f853' // 300 (2).jpg
      },
      {
        name: 'Johnson Controls',
        slug: 'johnson-controls',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Đối tác trong giải pháp quản lý tòa nhà thông minh và hệ thống HVAC tích hợp. Chuyên về automation, energy management và smart building solutions.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'partner' as const,
        status: 'published' as const,
        order: 4,
        featured: false,
        website: 'https://www.johnsoncontrols.com',
        logo: '683c0293b71652d43305f86e' // 300 (3).jpg
      },
      // SUPPLIERS - Nhà cung cấp
      {
        name: 'Honeywell Vietnam',
        slug: 'honeywell-vietnam',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Nhà cung cấp hệ thống kiểm soát và automation cho HVAC. Cung cấp sensors, controllers, và phần mềm quản lý năng lượng cho các dự án thương mại và công nghiệp.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'supplier' as const,
        status: 'published' as const,
        order: 1,
        featured: true,
        website: 'https://www.honeywell.com.vn',
        logo: '683c0205b71652d43305f808' // 300.jpg (reuse)
      },
      {
        name: 'Danfoss Southeast Asia',
        slug: 'danfoss-southeast-asia',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Nhà cung cấp van điều khiển, frequency drives và giải pháp tiết kiệm năng lượng. Chuyên về components cho hệ thống refrigeration và HVAC efficiency.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'supplier' as const,
        status: 'published' as const,
        order: 2,
        featured: true,
        website: 'https://www.danfoss.com',
        logo: '683c0240b71652d43305f82e' // 300 (1).jpg (reuse)
      },
      {
        name: 'Emerson Climate Technologies',
        slug: 'emerson-climate-technologies',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Nhà cung cấp compressors, condensers và refrigeration components. Chuyên về thiết bị và phụ kiện cho hệ thống làm lạnh commercial và industrial.',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1
          }
        },
        type: 'supplier' as const,
        status: 'published' as const,
        order: 3,
        featured: false,
        website: 'https://www.emerson.com',
        logo: '683c0272b71652d43305f853' // 300 (2).jpg (reuse)
      }
    ];

    // Create technologies
    for (const technologyData of technologiesData) {
      try {
        const technology = await payload.create({
          collection: 'technologies',
          data: technologyData,
        });
        console.log(`✅ Created technology: ${technology.name}`);
      } catch (error) {
        console.error(`❌ Error creating technology ${technologyData.name}:`, error);
      }
    }

    console.log('✅ Technologies seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding technologies:', error);
    throw error;
  }
};
