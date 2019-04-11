import * as React from 'react'
import styled from 'styled-components'

interface IDashboardProp {
  history: any
}

class Dashboard extends React.Component<IDashboardProp> {

  render () {
    return (
      <div>
        <Title>
          Dashboard goes here
        </Title>
      </div>
    )
  }
}

const Text = styled.p`
    width: 311px;
    margin:18px auto;
    opacity: 0.6;
    font-family: Nunito;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #3e5860;
`

const Title = styled(Text)`
    width: 311px;
    height: 26px;
    font-size: 19px;
    font-weight: bold;
    color: #30383B;
`
export default Dashboard
