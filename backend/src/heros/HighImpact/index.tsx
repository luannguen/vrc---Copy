'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import clsx from 'clsx'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

import styles from './HighImpact.module.css'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    <section
      className={clsx(styles.hero, 'bg-gray-900')}
      data-theme="dark"
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Image Layer */}
      <div className={styles.heroBackground}>
        {media && typeof media === 'object' && (
          <div className={styles.mediaContainer}>
            <Media 
              fill 
              imgClassName={styles.mediaImage} 
              priority 
              resource={media}
              alt={media.alt || 'Hero background image'}
            />
          </div>
        )}
        
        {/* Enhanced Multi-layer Overlay System for Better Text Readability */}
        <div className={styles.overlayBase} aria-hidden="true" />
        <div className={styles.overlayGradient} aria-hidden="true" />
        <div className={styles.overlayEnhanced} aria-hidden="true" />
      </div>

      {/* Content Layer - Always on top with proper semantic structure */}
      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <div className={styles.contentInner}>
            {/* Rich Text Content */}
            {richText && (
              <div className={styles.richText}>
                <RichText 
                  data={richText} 
                  enableGutter={false} 
                />
              </div>
            )}
            
            {/* Action Links */}
            {Array.isArray(links) && links.length > 0 && (
              <nav aria-label="Hero actions">
                <ul className={styles.linksContainer}>
                  {links.map(({ link }, i) => {
                    return (
                      <li key={i}>
                        <CMSLink {...link} />
                      </li>
                    )
                  })}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
