import * as React from 'react'
import t from '../../services/i18n'
import Progress from './Progress'
import { withRouter, RouteComponentProps } from 'react-router'
import {
  Button as StyledButton,
  ContentContainer,
  TopSection
} from '../basic-components'
import { HOME_ROUTE } from '../../constants/routes'
import { Divider, Form, Input } from 'semantic-ui-react'
import styled from 'styled-components'
import ChainList from './ChainList'

interface ISelectChainProps extends RouteComponentProps {}

interface ISelectChainState {
  search: string
}

class SelectChain extends React.Component<ISelectChainProps, ISelectChainState> {

  state = {
    search: ''
  }

  gotoDashboard = () => {
    this.props.history.push(HOME_ROUTE)
  }

  handleChange = (event) => {
    this.setState({ search: event.target.value })
  }

  render () {

    return (
      <ContentContainer>
        <TopSection>
          <Progress step={3}/>
        </TopSection>
        <Form>
          <ChainInput placeholder={t('chainSearch')} onChange={this.handleChange}/>
        </Form>
        <ChainSection>
          <ChainList search={this.state.search}/>
        </ChainSection>
        <ChainQuote>{t('selectChainDesc')}</ChainQuote>
        <Divider />
        <StyledButton type='button' onClick={this.gotoDashboard}>
          {t('selectChain')}
        </StyledButton>
      </ContentContainer>
    )
  }
}

export default withRouter(SelectChain)

const ChainInput = styled(Input)`
  width: 311px;
  height: 42px;
  border-color: #cad3d7;
  color: #cad3d7;
  line-height: 1.43;
  font-size: 14px;
  font-family: Nunito;
`

export const ChainSection = styled.div`
  width: 100%;
  margin: 8px 0 9px;
  text-align: center;
`

export const ChainQuote = styled.h3`
  margin-top: 0px;
  opacity: 0.6;
  color: #3e5860;
  font-size: 14px;
  font-family: Nunito;
  text-align: center;
  > span {
    opacity: 1;
    font-weight: bold;
    color: #000000;
  };
`
