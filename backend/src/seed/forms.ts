import { Payload } from 'payload';

export const seedForms = async (payload: Payload): Promise<void> => {
  console.log('Seeding forms...');

  try {
    // Check if Homepage Contact Form already exists
    const existingForms = await payload.find({
      collection: 'forms',
      where: {
        title: {
          equals: 'Homepage Contact Form'
        }
      }
    });

    if (existingForms.docs.length > 0) {
      console.log('Homepage Contact Form already exists, skipping...');
      return;
    }

    // Create Homepage Contact Form
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
      }
    });

    console.log(`✅ Created Homepage Contact Form with ID: ${homepageForm.id}`);

  } catch (error) {
    console.error('❌ Error seeding forms:', error);
    throw error;
  }
};
