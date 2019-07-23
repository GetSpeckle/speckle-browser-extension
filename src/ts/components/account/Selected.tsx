import React from 'react'

export const Selected = (props) => {
  return (
    <svg width={14} height={14} {...props}>
      <title>{'check'}</title>
      <g fillRule='nonzero' fill='none'>
        <circle fill={props.colorScheme.stopColorOne} cx={7} cy={7} r={7} />
        <path
          d='M10.71 5.66L6.733 9.7c-.41.4-1.065.4-1.476 0L3.29 7.71a.968.968 0 010-1.383.981.981 0 011.368 0l1.336 1.348 3.35-3.395a.979.979 0 011.365-.001.97.97 0 01.002 1.383l-.001-.002z'
          fill='#FFF'
        />
      </g>
    </svg>
  )
}
