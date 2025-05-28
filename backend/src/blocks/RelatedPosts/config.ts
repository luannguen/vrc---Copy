import type { Block } from 'payload'

// This configuration is used on the server side for Payload CMS
export const relatedPostsBlockConfig: Block = {
  slug: 'relatedPosts',
  interfaceName: 'RelatedPostsBlock',
  labels: {
    singular: 'Related Posts Block',
    plural: 'Related Posts Blocks',
  },
  fields: [
    {
      name: 'sourcePostId',
      label: 'Source Post ID',
      type: 'text',
      required: true,
      admin: {
        description: 'The ID of the post to get related posts for',
      },
    },
    {
      name: 'layout',
      label: 'Layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Compact',
          value: 'compact',
        },
        {
          label: 'Featured',
          value: 'featured',
        },
      ],
      admin: {
        description: 'Select the layout style for related posts',
      },
    },
    {
      name: 'limit',
      label: 'Number of Posts',
      type: 'number',
      defaultValue: 4,
      admin: {
        description: 'Maximum number of related posts to display',
      },
    },
    {
      name: 'title',
      label: 'Block Title',
      type: 'text',
      defaultValue: 'Related Posts',
    },
    {
      name: 'showViewMore',
      label: 'Show "View More" Button',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};

export default relatedPostsBlockConfig;
