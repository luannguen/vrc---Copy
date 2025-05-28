// filepath: e:\Download\vrc\backend\src\seed\company-info.ts
import { Payload } from 'payload';
import { progressManager } from './utils/progressUtils';

export const seedCompanyInfo = async (payload: Payload) => {
  console.log('🏢 Seeding company info...');
  try {
    // Initialize progress bar
    progressManager.initProgressBar(1, 'Creating company info');
    
    // Check if company info already exists
    const existingGlobal = await payload.findGlobal({
      slug: 'company-info',
    }).catch(() => null);

    // If already exists, skip
    if (existingGlobal) {
      console.log('Company info already exists, skipping seed.');
      progressManager.complete();
      return;
    }

    // Get default media id for logo
    let defaultMediaId = null;
    try {
      const media = await payload.find({
        collection: 'media',
        limit: 1,
      });
      
      if (media?.docs && media.docs.length > 0 && media.docs[0]?.id) {
        defaultMediaId = media.docs[0].id;
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    }

    // Create company info
    await payload.updateGlobal({
      slug: 'company-info',
      data: {
        requireAuth: false,
        companyName: 'VRC Refrigeration',
        companyShortName: 'VRC',
        companyDescription: 'VRC là đơn vị hàng đầu trong lĩnh vực cung cấp và lắp đặt hệ thống điện lạnh công nghiệp tại Việt Nam.',
        contactSection: {
          address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
          phone: '+84 28 1234 5678',
          email: 'contact@vrc.vn',
          hotline: '1900 1234',
          workingHours: 'Thứ Hai - Thứ Sáu: 8:00 - 17:30 | Thứ Bảy: 8:00 - 12:00',
          fax: '+84 28 1234 5679',
        },
        socialMedia: {
          facebook: 'https://facebook.com/vrcrefrigeration',
          zalo: 'https://zalo.me/vrcrefrigeration',
          youtube: 'https://youtube.com/vrcrefrigeration',
          linkedin: 'https://linkedin.com/company/vrcrefrigeration',
          twitter: '',
          instagram: '',
          telegram: ''
        },
        maps: {
          googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197667!2d106.69856857486687!3d10.77994445927126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xe5dfce8a215bd9ab!2zMTIzIMSQLiBMw6ogTOG7o2ksIELhur9uIE5naMOpLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1682316476091!5m2!1svi!2s',
          latitude: '10.779945',
          longitude: '106.698569'
        },
        additionalInfo: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Thành lập năm 2008, VRC đã trở thành đối tác tin cậy của nhiều doanh nghiệp lớn trong ngành thực phẩm, dược phẩm và sản xuất công nghiệp.',
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
        },        logo: defaultMediaId
      },
    });
    
    // Increment progress bar
    progressManager.increment();
    progressManager.complete();
    
    console.log('✅ Successfully seeded company info');
  } catch (error) {
    console.error('Error seeding company info:', error);
    if (progressManager) progressManager.complete();
  }
};
