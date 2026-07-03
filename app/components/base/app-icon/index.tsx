'use client'
import type { FC } from 'react'
import { useState } from 'react'
import classNames from 'classnames'
import style from './style.module.css'

export interface AppIconProps {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string
  background?: string
  className?: string
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  background,
  className,
}) => {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <span
      className={classNames(
        style.appIcon,
        size !== 'medium' && style[size],
        rounded && style.rounded,
        'overflow-hidden',
        className ?? '',
      )}
      style={{
        background,
      }}
    >
      {/* MR.DIY panda mascot cropped to the head; hammer badge as fallback */}
      <img
        src={imgFailed ? '/mrdiy-hammer.png' : '/mrdiy-panda.png'}
        alt="PandAI"
        className="w-full h-full object-cover object-top"
        onError={() => setImgFailed(true)}
      />
    </span>
  )
}

export default AppIcon
