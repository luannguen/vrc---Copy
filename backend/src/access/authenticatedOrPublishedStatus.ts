import type { Access } from 'payload'

export const authenticatedOrPublishedStatus: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    status: {
      equals: 'published',
    },
    _status: {
      equals: 'published',
    },
  }
}
