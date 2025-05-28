import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import HydrationSafeWrapper from '@/components/HydrationSafeWrapper'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {  const { categories, heroImage, populatedAuthors, publishedAt, title } = post
  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gray-900 -mt-[10.4rem] hero-container">      {/* Background Image - Responsive and contained */}
      <div className="absolute inset-0 w-full h-full hero-image-container">
        {heroImage && typeof heroImage !== 'string' && (
          <div className="absolute inset-0 w-full h-full hero-image-inner">
            <HydrationSafeWrapper>
              <Media 
                fill 
                priority 
                imgClassName="object-cover object-center hero-background" 
                resource={heroImage} 
              />
            </HydrationSafeWrapper>
          </div>
        )}
        {/* Enhanced gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>
      
      {/* Content - Better positioned and responsive */}
      <div 
        className="relative w-full h-full min-h-[80vh] flex items-end py-8 md:py-16 hero-content"
        style={{ zIndex: 20 }}
      >
        <div className="container px-4 md:px-8 text-white w-full hero-content">
          <div className="max-w-4xl mx-auto">
            <div className="uppercase text-sm mb-4 text-gray-200 font-medium tracking-wide">
              {categories?.map((category, index) => {
                if (typeof category === 'object' && category !== null) {
                  const { title: categoryTitle } = category

                  const titleToUse = categoryTitle || 'Untitled category'

                  const isLast = index === categories.length - 1

                  return (
                    <React.Fragment key={index}>
                      {titleToUse}
                      {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                    </React.Fragment>
                  )
                }
                return null
              })}
            </div>            <div className="mb-6">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight hero-text">
                {title}
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-200">
              {hasAuthors && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-wide text-gray-300 font-medium">Author</p>
                  <p className="text-white font-medium">{formatAuthors(populatedAuthors)}</p>
                </div>
              )}
              {publishedAt && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-wide text-gray-300 font-medium">Published</p>
                  <time dateTime={publishedAt} className="text-white font-medium">
                    {formatDateTime(publishedAt)}
                  </time>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
