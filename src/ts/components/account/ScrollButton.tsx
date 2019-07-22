import React from 'react'

export const ScrollButton = (props) => {
  return (
      <svg width={30} height={30} {...props}>
        <defs>
          <radialGradient
            id='prefix__c'
            cy='22.572%'
            r='84.639%'
            fx='50%'
            fy='22.572%'
          >
            <stop offset='0%' stopColor={props.colorScheme.stopColorOne} />
            <stop offset='100%' stopColor={props.colorScheme.stopColorTwo} />
          </radialGradient>
          <filter
            id='prefix__a'
            width='154.5%'
            height='154.5%'
            x='-27.3%'
            y='-27.3%'
            filterUnits='objectBoundingBox'
          >
            <feOffset in='SourceAlpha' result='shadowOffsetOuter1' />
            <feGaussianBlur
              in='shadowOffsetOuter1'
              result='shadowBlurOuter1'
              stdDeviation={2}
            />
            <feColorMatrix
              in='shadowBlurOuter1'
              values={props.colorScheme.headerShadow}
            />
          </filter>
          <rect id='prefix__b' width={22} height={22} rx={11} />
        </defs>
        <g fill='none' fillRule='evenodd'>
          <g fillRule='nonzero' transform='translate(4 4)'>
            <use fill='#000' filter='url(#prefix__a)' xlinkHref='#prefix__b' />
            <use fill='url(#prefix__c)' xlinkHref='#prefix__b' />
          </g>
          <path
            fill='#FFF'
            d='M12.285 18.472L16.166 15l-3.88-3.472a.838.838 0 010-1.261 1.068 1.068 0 011.412 0L19 15l-5.302 4.733a1.068 1.068 0 01-1.412 0 .838.838 0 010-1.26z'
          />
        </g>
      </svg>
  )
}

