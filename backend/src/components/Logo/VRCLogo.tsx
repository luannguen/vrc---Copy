import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

interface Props {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  style?: React.CSSProperties
}

export const VRCLogo = ({ className, size = 'md', style }: Props) => {
  const sizeMap = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 180, height: 180 },
    xl: { width: 240, height: 240 }
  }

  const { width, height } = sizeMap[size]

  return (
    <div style={{ display: 'flex', justifyContent: 'center', ...style }}>
      <Image
        src="/media/logo.svg"
        alt="VRC Logo"
        width={width}
        height={height}
        priority
        style={{ objectFit: 'contain' }}
      />
    </div>
  )
}
