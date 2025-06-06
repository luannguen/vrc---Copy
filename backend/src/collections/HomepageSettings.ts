import type { CollectionConfig } from 'payload'

const HomepageSettings: CollectionConfig = {
  slug: 'homepage-settings',
  admin: {
    useAsTitle: 'name',
    group: 'Content Management',
    description: 'Manage homepage display settings and configuration'
  },
  access: {
    read: () => true, // Public access for frontend
    create: ({ req }) => !!req.user, // Auth required for create
    update: ({ req }) => !!req.user, // Auth required for update
    delete: ({ req }) => !!req.user, // Auth required for delete
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Homepage Settings',
      admin: {
        readOnly: true,
        description: 'System name for homepage settings'
      }
    },
    {
      name: 'heroSection',
      type: 'group',
      label: 'Hero Section Settings',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Hero Section'
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: true,
          label: 'Autoplay Banner Carousel'
        },
        {
          name: 'autoplayDelay',
          type: 'number',
          defaultValue: 5000,
          label: 'Autoplay Delay (ms)',
          admin: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            condition: (_data: any, siblingData: any) => siblingData?.autoplay
          }
        },
        {
          name: 'maxBanners',
          type: 'number',
          defaultValue: 10,
          label: 'Maximum Banners to Display'
        }
      ]
    },
    {
      name: 'featuredTopics',
      type: 'group',
      label: 'Featured Topics Settings',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Featured Topics Section'
        },
        {
          name: 'maxProducts',
          type: 'number',
          defaultValue: 3,
          label: 'Number of Featured Products to Show'
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Featured Topics',
          label: 'Section Title',
          localized: true
        },
        {
          name: 'sectionSubtitle',
          type: 'textarea',
          defaultValue: 'Explore our most popular research topics',
          label: 'Section Subtitle',
          localized: true
        }
      ]
    },
    {
      name: 'latestPublications',
      type: 'group',
      label: 'Latest Publications Settings',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Latest Publications Section'
        },
        {
          name: 'maxPosts',
          type: 'number',
          defaultValue: 4,
          label: 'Number of Latest Posts to Show'
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Latest Publications',
          label: 'Section Title',
          localized: true
        },
        {
          name: 'showDate',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Publication Date'
        },
        {
          name: 'showAuthor',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Author Name'
        }
      ]
    },
    {
      name: 'dataResources',
      type: 'group',
      label: 'Data & Resources Settings',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Data & Resources Section'
        },
        {
          name: 'maxResources',
          type: 'number',
          defaultValue: 6,
          label: 'Number of Resources to Show'
        },
        {
          name: 'maxTools',
          type: 'number',
          defaultValue: 6,
          label: 'Number of Tools to Show'
        },
        {
          name: 'resourcesTitle',
          type: 'text',
          defaultValue: 'Data Resources',
          label: 'Resources Panel Title',
          localized: true
        },
        {
          name: 'toolsTitle',
          type: 'text',
          defaultValue: 'Tools & Software',
          label: 'Tools Panel Title',
          localized: true
        }
      ]
    },
    {
      name: 'contactForm',
      type: 'group',
      label: 'Contact Form Settings',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Contact Form'
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Get in Touch',
          label: 'Section Title',
          localized: true
        },
        {
          name: 'sectionSubtitle',
          type: 'textarea',
          defaultValue: 'Have questions or need support? Contact our team.',
          label: 'Section Subtitle',
          localized: true
        },
        {
          name: 'successMessage',
          type: 'textarea',
          defaultValue: 'Thank you for your message! We will get back to you soon.',
          label: 'Success Message',
          localized: true
        },
        {
          name: 'enableNotifications',
          type: 'checkbox',
          defaultValue: true,
          label: 'Send Email Notifications for New Submissions'
        }
      ]
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          defaultValue: 'VRC - Vietnam Research Center',
          label: 'Homepage Meta Title',
          localized: true
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          defaultValue: 'Leading research center providing comprehensive analysis and insights on Vietnam',
          label: 'Homepage Meta Description',
          localized: true
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Homepage Open Graph Image'
        }
      ]
    },
    {
      name: 'maintenance',
      type: 'group',
      label: 'Maintenance Mode',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Maintenance Mode'
        },
        {
          name: 'message',
          type: 'richText',
          defaultValue: [
            {
              children: [
                {
                  text: 'We are currently performing scheduled maintenance. Please check back soon.'
                }
              ]
            }
          ],
          label: 'Maintenance Message',
          localized: true
        }
      ]
    }
  ],
  hooks: {
    beforeChange: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ data }: { data: any }) => {
        // Ensure only one homepage settings document exists
        data.name = 'Homepage Settings'
        return data
      }
    ]
  }
}

export default HomepageSettings
