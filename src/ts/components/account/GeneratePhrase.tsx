import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Message, Container, Grid, Button, Icon } from 'semantic-ui-react'
import { generateMnemonic } from '../../services/keyring-vault-proxy'
import { setNewPhrase } from '../../background/store/account'
import { CONFIRM_PHRASE_ROUTE } from '../../constants/routes'

interface IGeneratePhraseProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IGeneratePhraseState {
  mnemonic: string,
  message?: string,
  color: 'blue' | 'red'
}

class GeneratePhrase extends React.Component<IGeneratePhraseProps, IGeneratePhraseState> {

  state: IGeneratePhraseState = {
    mnemonic: '',
    color: 'blue'
  }

  constructor (props) {
    super(props)

    // generate the mnemonic
    generateMnemonic().then(phrase => {
      this.setState({ mnemonic: phrase })
    })
  }

  handleClick = () => {
    this.setState({ message: '' })
    this.props.setNewPhrase(this.state.mnemonic)
    this.props.history.push(CONFIRM_PHRASE_ROUTE)
  }

  selectAll = (event) => {
    event.target.select()
  }

  copyText = () => {
    const el = document.createElement('textarea')
    el.value = this.state.mnemonic
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)

    this.setState({ message: t('copyTextMessage') })
    setTimeout(() => {
      this.setState({ message: '' })
    }, 3000)
  }

  downloadFile = () => {
    let element = document.createElement('a')
    element.setAttribute('href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.mnemonic))
    element.setAttribute('download', 'secret-phrase.txt')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  render () {
    return (
        <div>
          <Progress color={this.props.settings.color} progress={2} />
          <Text>
            {t('phraseDescription')}
          </Text>

          <Text>
            <div>{t('phraseTitle')}</div>
            <MnemonicPad value={this.state.mnemonic} readOnly={true} onClick={this.selectAll}/>
          </Text>

          <Message color={this.state.color} hidden={!this.state.message} style={alignMiddle}>
            {this.state.message}
          </Message>

          <Container style={alignMiddle}>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Button onClick={this.copyText}>
                    <Icon name='copy' />
                    {t('copyText')}
                  </Button>
                </Grid.Column>

                <Grid.Column>
                  <Button onClick={this.downloadFile}>
                    <Icon name='download' />
                    {t('downloadFile')}</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>

          <Text>
            <StyledButton onClick={this.handleClick}>
              {t('createAccount')}
            </StyledButton>
          </Text>

        </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    accountStatus: state.account
  }
}

const mapDispatchToProps = { setNewPhrase }

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

const Text = styled.div`
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
    color: #3e5860;
`
const MnemonicPad = styled.textarea`
  width: 311px;
  height: 125px;
  font-family: Nunito;
  padding: 10px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.57;
  letter-spacing: normal;
  color: #30383b;
`
const StyledButton = styled.button`
  width: 311px;
  height: 45px;
  border-radius: 4px;
  box-shadow: 0 3px 10px 0 rgba(72, 178, 228, 0.21);
  background-color: #24b6e8;
  font-family: Nunito;
  font-size: 16px;
  font-weight: 800;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.31;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
`
const alignMiddle = {
  width: 311,
  margin: 'auto'
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GeneratePhrase))
