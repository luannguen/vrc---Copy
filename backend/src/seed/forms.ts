import { Payload } from 'payload';

export const seedForms = async (payload: Payload): Promise<void> => {
  console.log('Seeding forms...');

  try {
    // Check if Homepage Contact Form already exists
    const existingContactForm = await payload.find({
      collection: 'forms',
      where: {
        title: {
          equals: 'Homepage Contact Form'
        }
      }
    });

    const existingEventForm = await payload.find({
      collection: 'forms',
      where: {
        title: {
          equals: 'Event Registration Form'
        }
      }
    });

    // Create Homepage Contact Form if not exists
    if (existingContactForm.docs.length === 0) {
      const homepageForm = await payload.create({
      collection: 'forms',
      data: {
        title: 'Homepage Contact Form',
        fields: [
          {
            blockType: 'text',
            name: 'name',
            label: 'Họ và tên',
            width: 50,
            required: true,
          },
          {
            blockType: 'email',
            name: 'email',
            label: 'Email',
            width: 50,
            required: true,
          },
          {
            blockType: 'text',
            name: 'phone',
            label: 'Số điện thoại',
            width: 50,
            required: false,
          },
          {
            blockType: 'select',
            name: 'subject',
            label: 'Chủ đề',
            width: 50,
            required: true,
            options: [
              {
                label: 'Tư vấn chung',
                value: 'general'
              },
              {
                label: 'Hỗ trợ kỹ thuật',
                value: 'support'
              },
              {
                label: 'Kinh doanh',
                value: 'sales'
              },
              {
                label: 'Đối tác',
                value: 'partnership'
              }
            ]
          },
          {
            blockType: 'textarea',
            name: 'message',
            label: 'Nội dung',
            width: 100,
            required: true,
          }
        ],
        confirmationMessage: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
                    type: 'text',
                    version: 1
                  }
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1
              }
            ],
            direction: 'ltr'
          }
        }
      }      });

      console.log(`✅ Created Homepage Contact Form with ID: ${homepageForm.id}`);
    } else {
      console.log('Homepage Contact Form already exists, skipping...');
    }

    // Create Event Registration Form if not exists
    if (existingEventForm.docs.length === 0) {
      const eventRegistrationForm = await payload.create({
        collection: 'forms',
        data: {
          title: 'Event Registration Form',
          fields: [
            {
              blockType: 'text',
              name: 'fullName',
              label: 'Họ và tên',
              width: 50,
              required: true,
            },
            {
              blockType: 'email',
              name: 'email',
              label: 'Email',
              width: 50,
              required: true,
            },
            {
              blockType: 'text',
              name: 'phone',
              label: 'Số điện thoại',
              width: 50,
              required: true,
            },
            {
              blockType: 'text',
              name: 'company',
              label: 'Công ty/Tổ chức',
              width: 50,
              required: false,
            },
            {
              blockType: 'text',
              name: 'jobTitle',
              label: 'Chức vụ',
              width: 50,
              required: false,
            },
            {
              blockType: 'select',
              name: 'participationType',
              label: 'Hình thức tham gia',
              width: 50,
              required: true,
              options: [
                {
                  label: 'Tham dự trực tiếp',
                  value: 'offline'
                },
                {
                  label: 'Tham gia online',
                  value: 'online'
                }
              ]
            },
            {
              blockType: 'textarea',
              name: 'specialRequirements',
              label: 'Yêu cầu đặc biệt (ăn chay, wheelchair access, v.v.)',
              width: 100,
              required: false,
            },
            {
              blockType: 'textarea',
              name: 'questions',
              label: 'Câu hỏi cho diễn giả (nếu có)',
              width: 100,
              required: false,
            }
          ],
          confirmationMessage: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Cảm ơn bạn đã đăng ký tham gia sự kiện! Chúng tôi sẽ gửi thông tin chi tiết qua email trong thời gian sớm nhất.',
                      type: 'text',
                      version: 1
                    }
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1
                }
              ],
              direction: 'ltr'
            }
          }
        }
      });

      console.log(`✅ Created Event Registration Form with ID: ${eventRegistrationForm.id}`);
    } else {
      console.log('Event Registration Form already exists, skipping...');
    }

  } catch (error) {
    console.error('❌ Error seeding forms:', error);
    throw error;
  }
};
