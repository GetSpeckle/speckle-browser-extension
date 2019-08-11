import React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { networks } from '../../constants/networks'
import { Grid } from 'semantic-ui-react'

interface ISignMessageState {
  networkName: string,
  networkIconUrl: string
}

class SignMessage extends React.Component<StateProps, ISignMessageState> {
  constructor (props) {
    super(props)

    const { settings } = this.props
    const iconUrl = networks[settings.network].chain.iconUrl

    this.state = {
      networkName: settings.network,
      networkIconUrl: iconUrl
    }
  }

  render () {
    return (
        <SignMessageGrid centered={true} textAlign='center'>
          <SignMessageGridRow textAlign='left' verticalAlign='top'>
            <SignMessageGridColumn width='12'>
              <Icon><Caption>{t('signingMessageIcon')}</Caption></Icon>
            </SignMessageGridColumn>
            <SignMessageGridColumn width='1'>
              <NetworkIcon src={this.state.networkIconUrl} alt='Chain logo'/>
            </SignMessageGridColumn>
            <SignMessageGridColumn width='3'>
              <Network>{this.state.networkName}</Network>
            </SignMessageGridColumn>
          </SignMessageGridRow>
          <SignMessageGridRow>
              <Message>
                {t('signingContent')}
              </Message>
          </SignMessageGridRow>
        </SignMessageGrid>
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
  text-align: center;
`

const SignMessageGrid = styled(Grid)` && {
  margin-top: 18px;
  height: 133px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
  background-color: #ffffff;
  }
`

const SignMessageGridRow = styled(Grid.Row)` && {
  padding: 0 !important;
}
`

const SignMessageGridColumn = styled(Grid.Column)` && {
  padding: 0 !important;
}
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(SignMessage)
