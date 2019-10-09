import * as React from 'react'
import { ContentContainer } from '../basic-components'
import { withRouter, RouteComponentProps } from 'react-router'
import { CREATE_PASSWORD_ROUTE, GENERATE_PHRASE_ROUTE } from '../../constants/routes'

import '../../../assets/app.css'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { colorSchemes } from '../styles/themes'

interface IProgressProps extends RouteComponentProps, StateProps {
  step: number
}

/**
 * A component to show the progress/step of wallet creation using given color.
 */
class Progress extends React.Component<IProgressProps> {

  handleClick = route => () => {
    const { step, history, wallet } = this.props
    // only allow to go back if there is no account created
    if (!wallet.created && step > 1 && route === CREATE_PASSWORD_ROUTE) {
      history.push(route)
    }

    if (step >= 2 && route === GENERATE_PHRASE_ROUTE) {
      history.push(route)
    }
  }

  render () {
    const { settings, step } = this.props

    const colorScheme = colorSchemes[settings.color]
    const grayColorScheme = {
      stopColorOne: '#BBBBBB',
      stopColorTwo: '#CCCCCC'
    }

    const one = step === 1 ? colorScheme : grayColorScheme
    const two = step === 2 ? colorScheme : grayColorScheme
    const three = step === 3 ? colorScheme : grayColorScheme

    return (
      <ContentContainer>

        <svg
          width='43'
          height='37'
          viewBox='0 0 43 37'
          onClick={this.handleClick(CREATE_PASSWORD_ROUTE)}
          className='step'
        >
          <defs>
            <radialGradient id='c' cy='22.572%' r='84.639%' fx='50%' fy='22.572%'>
              <stop offset='0%' stopColor={one.stopColorOne}/>
              <stop offset='100%' stopColor={one.stopColorTwo}/>
            </radialGradient>
            <path
              id='b'
              d='M12.34.372l14.37 6.701a3.964 3.964 0 0 1
                1.918 5.268l-6.701 14.37a3.964 3.964 0 0 1-5.268 1.917L2.29 21.927a3.964
                3.964 0 0 1-1.917-5.268L7.073 2.29A3.964 3.964 0 0 1 12.341.373z'
            />
            <filter
              id='a'
              width='141.4%'
              height='141.4%'
              x='-20.7%'
              y='-20.7%'
              filterUnits='objectBoundingBox'
            >
              <feOffset in='SourceAlpha' result='shadowOffsetOuter1'/>
              <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='2'/>
              <feColorMatrix
                in='shadowBlurOuter1'
                values={colorScheme.headerShadow}
              />
            </filter>
            <radialGradient id='f' cy='27.105%' r='72.895%' fx='50%' fy='27.105%'>
              <stop offset='0%' stopColor='#FF7396'/>
              <stop offset='100%' stopColor='#F3536D'/>
            </radialGradient>
            <rect id='e' width='12' height='12' x='21' y='3' rx='6'/>
            <filter
              id='d'
              width='266.7%'
              height='266.7%'
              x='-83.3%'
              y='-66.7%'
              filterUnits='objectBoundingBox'
            >
              <feOffset dy='2' in='SourceAlpha' result='shadowOffsetOuter1'/>
              <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='3'/>
              <feColorMatrix
                in='shadowBlurOuter1'
                values='0 0 0 0 0.956862745 0 0 0 0 0.333333333
                        0 0 0 0 0.435294118 0 0 0 0.119508605 0'
              />
            </filter>
          </defs>
          <g fill='none' fillRule='nonzero'>
            <path d='M4 4h33v29H4z'/>
            <g transform='translate(4 4)'>
              <use fill='#000' filter='url(#a)' href='#b'/>
              <use fill='url(#c)' href='#b'/>
            </g>
            <g transform='translate(4 4)'>
              <use fill='#000' filter='url(#d)' href='#e'/>
              <use fill='url(#f)' href='#e'/>
            </g>
          </g>
          <text x='15' y='22' style={{ fill: 'white' }}>1</text>
        </svg>

        <svg height='40' width='86'>
          <line x1='0' y1='20' x2='86' y2='20' stroke='#cad3d7' />
        </svg>

        <svg
          width='47'
          height='41'
          viewBox='0 0 47 41'
          onClick={this.handleClick(GENERATE_PHRASE_ROUTE)}
          className='step'
        >
          <defs>
            <radialGradient id='c2' cy='19.249%' r='80.751%' fx='50%' fy='19.249%'>
              <stop offset='0%' stopColor='#51DFB0'/>
              <stop offset='100%' stopColor='#52C48D'/>
            </radialGradient>
            <path
              id='b2'
              d='M7.234.218l8.424 3.928a2.324
                 2.324 0 0 1 1.124 3.088l-3.928 8.424a2.324
                 2.324 0 0 1-3.088 1.124l-8.424-3.928A2.324
                 2.324 0 0 1 .218 9.766l3.928-8.424A2.324 2.324 0 0 1 7.234.218z'
            />
            <filter
              id='a2'
              width='288.2%'
              height='288.2%'
              x='-94.1%'
              y='-82.4%'
              filterUnits='objectBoundingBox'
            >
              <feOffset dy='2' in='SourceAlpha' result='shadowOffsetOuter1'/>
              <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='5'/>
              <feColorMatrix
                in='shadowBlurOuter1'
                values='0 0 0 0 0.321568627 0 0 0 0 0.77254902 0 0 0 0 0.560784314 0 0 0 0.5 0'
              />
            </filter>
            <radialGradient id='f2' cy='22.572%' r='84.639%' fx='50%' fy='22.572%'>
              <stop offset='0%' stopColor={two.stopColorTwo}/>
              <stop offset='100%' stopColor={two.stopColorTwo}/>
            </radialGradient>
            <rect id='e2' width='26' height='26' x='7' y='3' rx='13'/>
            <filter
              id='d2'
              width='146.2%'
              height='146.2%'
              x='-23.1%'
              y='-23.1%'
              filterUnits='objectBoundingBox'
            >
              <feOffset in='SourceAlpha' result='shadowOffsetOuter1'/>
              <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='2'/>
              <feColorMatrix
                in='shadowBlurOuter1'
                values={colorScheme.headerShadow}
              />
            </filter>
          </defs>
          <g fill='none' fillRule='nonzero'>
            <path d='M10 8h33v29H10z'/>
            <g transform='translate(10 8)'>
              <use fill='#000' filter='url(#a2)' href='#b2'/>
              <use fill='url(#c2)' href='#b2'/>
            </g>
            <g transform='translate(10 8)'>
              <use fill='#000' filter='url(#d2)' href='#e2'/>
              <use fill='url(#f2)' href='#e2'/>
            </g>
          </g>
          <text x='26' y='27' style={{ fill: 'white' }}>2</text>
        </svg>

        <svg height='40' width='86'>
          <line x1='0' y1='20' x2='86' y2='20' stroke='#cad3d7' />
        </svg>

        <svg width='49' height='42' viewBox='0 0 49 42'>
          <defs>
            <radialGradient id='c3' cy='19.249%' r='80.751%' fx='50%' fy='19.249%'>
              <stop offset='0%' stopColor='#51DFB0'/>
              <stop offset='100%' stopColor='#52C48D'/>
            </radialGradient>
            <path
              id='b3'
              d='M25.532 1.167l6.442 3.004a1.777 1.777 0 0
                 1 .86 2.361l-3.005 6.442a1.777 1.777 0 0
                 1-2.361.86l-6.442-3.005a1.777 1.777 0 0
                 1-.86-2.361l3.005-6.442a1.777 1.777 0 0 1 2.361-.86z'
            />
            <filter
              id='a3'
              width='346.2%'
              height='346.2%'
              x='-123.1%'
              y='-107.7%'
              filterUnits='objectBoundingBox'
            >
              <feOffset dy='2' in='SourceAlpha' result='shadowOffsetOuter1'/>
              <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='5'/>
              <feColorMatrix
                in='shadowBlurOuter1'
                values='0 0 0 0 0.321568627 0 0 0 0 0.77254902 0 0 0 0 0.560784314 0 0 0 0.5 0'
              />
            </filter>
            <radialGradient id='f3' cy='22.572%' r='84.639%' fx='50%' fy='22.572%'>
              <stop offset='0%' stopColor={three.stopColorOne}/>
              <stop offset='100%' stopColor={three.stopColorTwo}/>
            </radialGradient>
            <path
              id='e3'
              d='M18.885.988l11.127 11.127a3.372 3.372 0 0 1 0
                4.77L18.885 28.012a3.372 3.372 0 0 1-4.77 0L2.988
                16.885a3.372 3.372 0 0 1 0-4.77L14.115.988a3.372 3.372 0 0 1 4.77 0z'
            />
            <filter
              id='d3'
              width='141.4%'
              height='141.4%'
              x='-20.7%'
              y='-20.7%'
              filterUnits='objectBoundingBox'
            >
              <feOffset in='SourceAlpha' result='shadowOffsetOuter1'/>
              <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='2'/>
              <feColorMatrix
                in='shadowBlurOuter1'
                values={colorScheme.headerShadow}
              />
            </filter>
            <radialGradient id='i' cy='27.105%' r='72.895%' fx='50%' fy='27.105%'>
              <stop offset='0%' stopColor='#FF7396'/>
              <stop offset='100%' stopColor='#F3536D'/>
            </radialGradient>
            <rect id='h' width='9' height='9' y='18' rx='4.5'/>
            <filter
              id='g'
              width='322.2%'
              height='322.2%'
              x='-111.1%'
              y='-88.9%'
              filterUnits='objectBoundingBox'
            >
              <feOffset dy='2' in='SourceAlpha' result='shadowOffsetOuter1'/>
              <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='3'/>
              <feColorMatrix
                in='shadowBlurOuter1'
                values='0 0 0 0 0.956862745 0 0 0 0 0.333333333
                        0 0 0 0 0.435294118 0 0 0 0.119508605 0'
              />
            </filter>
          </defs>
          <g fill='none' fillRule='nonzero'>
            <path d='M6 7h33v29H6z'/>
            <g transform='translate(6 7)'>
              <use fill='#000' filter='url(#a3)' href='#b3'/>
              <use fill='url(#c3)' href='#b3'/>
            </g>
            <g transform='translate(6 7)'>
              <use fill='#000' filter='url(#d3)' href='#e3'/>
              <use fill='url(#f3)' href='#e3'/>
            </g>
            <g transform='translate(6 7)'>
              <use fill='#000' filter='url(#g)' href='#h'/>
              <use fill='url(#i)' href='#h'/>
            </g>
          </g>
          <text x='20' y='27' style={{ fill: 'white' }}>3</text>
        </svg>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    wallet: state.wallet
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps)(Progress))
