// Default static content for the home page when no database entry exists
// This serves as a fallback until proper content is seeded

export const homeStatic = {
  id: 'static-home',
  title: 'Welcome to Our Website',
  slug: 'home',
  _status: 'published',
  meta: {
    title: 'Home | Our Website',
    description: 'Welcome to our website. Find products and services tailored to your needs.',
  },
  hero: {
    type: 'basic',
    basic: {
      richText: [
        {
          children: [
            {
              text: 'Welcome to Our Website',
            },
          ],
          type: 'h1',
        },
        {
          children: [
            {
              text: 'Discover our products and services',
            },
          ],
          type: 'p',
        },
      ],      links: [
        {
          link: {
            type: 'custom',
            url: '/products',
            label: 'Browse Products',
          },
          appearance: 'default',
        },
        {
          link: {
            type: 'custom',
            url: '/contact',
            label: 'Contact Us',
          },
          appearance: 'outline',
        },
      ],
    },
  },
  layout: [
    {
      blockType: 'content',
      columns: [
        {
          size: 'full',
          richText: [
            {
              children: [
                {
                  text: 'About Us',
                },
              ],
              type: 'h2',
            },
            {
              children: [
                {
                  text: 'We provide high-quality products and excellent customer service. Our mission is to deliver value and satisfaction to our customers.',
                },
              ],
              type: 'p',
            },
          ],
        },
      ],
    },
    {
      blockType: 'content',
      columns: [
        {
          size: 'half',
          richText: [
            {
              children: [
                {
                  text: 'Our Products',
                },
              ],
              type: 'h3',
            },
            {
              children: [
                {
                  text: 'Explore our wide range of products designed to meet your needs.',
                },
              ],
              type: 'p',
            },
          ],
        },
        {
          size: 'half',
          richText: [
            {
              children: [
                {
                  text: 'Our Services',
                },
              ],
              type: 'h3',
            },
            {
              children: [
                {
                  text: 'We offer professional services to help you achieve your goals.',
                },
              ],
              type: 'p',
            },
          ],
        },
      ],
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
