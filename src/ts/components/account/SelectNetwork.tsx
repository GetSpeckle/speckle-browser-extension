import * as React from 'react'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import {
  Button as StyledButton,
  ContentContainer,
  TopSection
} from '../basic-components'
import { setLocked, setCreated, setNewPhrase } from '../../background/store/wallet'
import { setError } from '../../background/store/error'
import { saveSettings } from '../../background/store/settings'
import { HOME_ROUTE } from '../../constants/routes'
import { Divider, Form, Input } from 'semantic-ui-react'
import styled from 'styled-components'
import NetworkList from './NetworkList'

interface ISelectNetworkProps extends RouteComponentProps, StateProps, DispatchProps {}

class SelectNetwork extends React.Component<ISelectNetworkProps> {

  gotoDashboard = () => {
    this.props.history.push(HOME_ROUTE)
  }

  render () {

    return (
      <ContentContainer>
        <TopSection>
          <Progress step={3}/>
        </TopSection>
        <Form>
          <ChainInput placeholder={'Chain Search'}/>
        </Form>
        <NetworkSection>
          <NetworkList/>
        </NetworkSection>
        <ChainQuote>Start by selecting <span>3 chains</span></ChainQuote>
        <Divider />
        <StyledButton type='button' onClick={this.gotoDashboard}>
          {t('selectNetwork')}
        </StyledButton>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    color: state.settings.color
  }
}

const mapDispatchToProps = { saveSettings, setLocked, setCreated, setError, setNewPhrase }

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SelectNetwork))

const ChainInput = styled(Input)`
  width: 311px
  height: 42px
  border-color: #cad3d7
  color: #cad3d7
  line-height: 1.43
  font-size: 14px
  font-family: Nunito
`

export const NetworkSection = styled.div`
  width: 100%
  margin: 8px 0 9px
  text-align: center
`

export const ChainQuote = styled.h3`
{
margin-top: 10px
opacity: 0.6
color: #3e5860
font-size: 14px
font-family: Nunito
text-align: center
}
> span {
  opacity: 1;
  font-weight: bold;
  color: #000000
}
`
