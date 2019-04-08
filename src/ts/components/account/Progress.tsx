import * as React from 'react'
import styled from 'styled-components'

interface IProgressProp {
  color: string,
  progress: number
}

/**
 * A component to show the progress/step of account creation using given color.
 */
class Progress extends React.Component<IProgressProp> {

  render () {
    return (
      <ProgressContainer>
        {/** TODO: improve the UI  */}
        Step: {this.props.progress} - Color: {this.props.color}
      </ProgressContainer>
    )
  }
}

const ProgressContainer = styled.p`
    width: 327px;
    margin:18px auto;
    opacity: 0.6;
    font-family: Nunito;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #3e5860;
`
export default Progress
