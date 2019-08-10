import React from 'react'
import styled from 'styled-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { networks } from '../../constants/networks'
import { Grid } from 'semantic-ui-react'

class SignMessage extends React.Component<StateProps> {

  state: ISignByState = {
    name: undefined
  }

  // componentDidMount () {
  // }

  render () {
    const { settings } = this.props
    const icon = networks[settings.network].chain.iconUrl
    return (
      <SignMessageContainer>
        <Grid centered={true} textAlign='center'>
          <Grid.Row>
            <Grid.Column width='10'>
              <Icon><Caption>Message</Caption></Icon>
            </Grid.Column>
            <Grid.Column width='3'>
              <NetworkIcon src={icon} alt='Chain logo'/>
            </Grid.Column>
            <Grid.Column width='3'>
              <Network>{settings.network}</Network>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
              <Message>
                Sign this message to prove ownership of your account!
              </Message>
          </Grid.Row>
        </Grid>
      </SignMessageContainer>
    )
  }
}

const NetworkIcon = styled.img`
  width: 19px;
  height: 20px;
  object-fit: contain;
`

const Message = styled.span`
  width: 301px;
  height: 36px;
  font-family: Nunito;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #556267;
`

const Network = styled.span`
  width: 62px;
  height: 18px;
  font-family: Nunito;
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
`

const Caption = styled.span`
  width: 53px;
  height: 18px;
  font-family: Nunito;
  font-size: 13px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fcfeff;
`

const Icon = styled.div`
  width: 68px;
  height: 41px;
  background-image: linear-gradient(to bottom, #928bf5, #42b8e9);
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  textAlign：center
`

const SignMessageContainer = styled.div`
  height: 133px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
  background-color: #ffffff;
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

interface ISignByState {
  name?: string
}

type StateProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(SignMessage)
