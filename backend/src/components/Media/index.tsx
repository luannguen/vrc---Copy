import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

/**
 * Hàm này chuyển đổi đối tượng Media phức tạp thành đối tượng đơn giản
 * để tránh lỗi "Only plain objects can be passed to Client Components from Server Components"
 */
const sanitizeMediaResource = (resource: any) => {
  if (!resource || typeof resource !== 'object') return resource

  // Chỉ giữ lại các thuộc tính cần thiết, loại bỏ Buffer và các đối tượng phức tạp
  return {
    id: resource.id,
    alt: resource.alt || '',
    caption: resource.caption,
    filename: resource.filename,
    mimeType: resource.mimeType,
    filesize: resource.filesize,
    width: resource.width,
    height: resource.height,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
    url: resource.url,
    focalX: resource.focalX,
    focalY: resource.focalY,
    // Xử lý sizes nếu có
    ...(resource.sizes
      ? {
          sizes: Object.fromEntries(
            Object.entries(resource.sizes).map(([key, size]: [string, any]) => [
              key,
              size
                ? {
                    url: size.url,
                    width: size.width,
                    height: size.height,
                    mimeType: size.mimeType,
                    filesize: size.filesize,
                    filename: size.filename,
                  }
                : null,
            ])
          ),
        }
      : {}),
  }
}

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  // Xử lý resource để loại bỏ các thuộc tính không thể serialize
  const sanitizedResource = sanitizeMediaResource(resource)
  const propsWithSanitizedResource = { ...props, resource: sanitizedResource }

  const isVideo =
    typeof sanitizedResource === 'object' &&
    sanitizedResource?.mimeType?.includes('video')
  const Tag = htmlElement || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? (
        <VideoMedia {...propsWithSanitizedResource} />
      ) : (
        <ImageMedia {...propsWithSanitizedResource} />
      )}
    </Tag>
  )
}
