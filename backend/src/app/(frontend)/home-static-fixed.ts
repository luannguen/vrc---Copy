// Static fallback data for the home page when not available in the database
// This is a fixed version with improved type handling

import type { RequiredDataFromCollectionSlug } from 'payload';

// Define a static home page that matches the expected structure
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  id: 'static-home',
  title: 'Welcome to Our Website',
  slug: 'home',
  _status: 'published' as const,
  meta: {
    title: 'Home | Our Website',
    description: 'Welcome to our website. Find products and services tailored to your needs.',
  },
  hero: {
    type: 'mediumImpact' as const,
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'h1',
            children: [
              {
                text: 'Welcome to Our Website',
                type: 'text',
                version: 1
              }
            ],
            format: 'center',
            version: 1
          },
          {
            type: 'p',
            children: [
              {
                text: 'Discover our products and services',
                type: 'text',
                version: 1
              }
            ],
            format: 'center',
            version: 1
          }
        ],
        direction: 'ltr' as const,
        format: 'left' as const,
        indent: 0,
        version: 1
      }
    },
    links: [
      {
        link: {
          type: 'custom' as const,
          url: '/products',
          label: 'Browse Products',
          appearance: 'default' as const,
        }
      },
      {
        link: {
          type: 'custom' as const,
          url: '/contact',
          label: 'Contact Us',
          appearance: 'outline' as const,
        }
      },
    ],
  },
  layout: [
    {
      blockType: 'content' as const,
      columns: [
        {
          size: 'full' as const,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'h2',
                  children: [
                    {
                      text: 'About Us',
                      type: 'text',
                      version: 1
                    }
                  ],
                  version: 1
                },
                {
                  type: 'p',
                  children: [
                    {
                      text: 'We provide high-quality products and excellent customer service.',
                      type: 'text',
                      version: 1
                    }
                  ],
                  version: 1
                }
              ],
              direction: 'ltr' as const,
              format: 'left' as const,
              indent: 0,
              version: 1
            }
          },
        },
      ],
    },  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
