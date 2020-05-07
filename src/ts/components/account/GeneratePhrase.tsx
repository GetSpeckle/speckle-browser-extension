import * as React from 'react'
import t from '../../services/i18n'
import Progress from './Progress'
import { IAppState } from '../../background/store/all'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { Button, Icon, Form, Divider, Popup, Grid } from 'semantic-ui-react'
import { cancelAccountSetup, getSimpleAccounts, generateMnemonic, setTempAccountName } from '../../services/keyring-vault-proxy'
import { setNewPhrase, setAccountName, setNewPassword } from '../../background/store/wallet'
import { CONFIRM_PHRASE_ROUTE, CREATE_PASSWORD_ROUTE, HOME_ROUTE } from '../../constants/routes'
import {
  Button as StyledButton,
  ContentContainer,
  TopSection,
  SecondaryText,
  TimerText
} from '../basic-components'
import { parseTimeLeft } from '../../constants/utils'

interface IGeneratePhraseProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IGeneratePhraseState {
  accountName: string
  mnemonic: string
  message?: string
  color: 'blue' | 'red'
  msgTimeout?: any
  isCancelled: boolean
}

class GeneratePhrase extends React.Component<IGeneratePhraseProps, IGeneratePhraseState> {

  state: IGeneratePhraseState = {
    accountName: '',
    mnemonic: '',
    color: 'blue',
    isCancelled: false
  }

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const { newAccountName, newPhrase } = this.props.wallet
    // generate the mnemonic or restore it from the store if exists
    if (newPhrase) {
      this.setState({ mnemonic: newPhrase })
    } else {
      generateMnemonic().then(phrase => {
        this.setState({ mnemonic: phrase })
      })
    }

    if (newAccountName) {
      this.setState(
        { accountName: newAccountName },
        () => setTempAccountName(newAccountName)
      )
    } else {
      getSimpleAccounts().then(result => {
        const accountName = 'Account ' + (result.length + 1)
        this.setState(
          { accountName },
          () => {
            this.props.setAccountName(accountName)
            setTempAccountName(accountName)
          }
        )
      })
    }
  }

  componentWillUnmount () {
    if (this.state.msgTimeout) {
      clearTimeout(this.state.msgTimeout)
    }
  }

  componentDidUpdate (prevProps) {
    // Check for timer expiry
    if (prevProps.wallet.accountSetupTimeout !== 0 && this.props.wallet.accountSetupTimeout === 0) {
      // Clear wallet state defaults
      this.props.setNewPassword('')
      this.props.setNewPhrase('')
      this.props.setAccountName('')

      // If wallet is created, redirect to Dashboard. If not, Create Password page
      if (this.props.wallet.created) {
        this.props.history.push(HOME_ROUTE)
      } else {
        this.props.history.push({
          pathname: CREATE_PASSWORD_ROUTE,
          state: { error: this.state.isCancelled ? null : t('timerElapsed') }
        })
      }
    }
  }

  handleChange = event => {
    this.setState({ accountName: event.target.value }, () => {
      const { accountName } = this.state

      // Save the temporary account name in the background
      if (accountName) {
        this.props.setAccountName(accountName)
        setTempAccountName(accountName)
      }
    })
  }

  handleClick = () => {
    this.setState({ message: '' })
    this.props.setNewPhrase(this.state.mnemonic)
    this.props.history.push(CONFIRM_PHRASE_ROUTE)
  }

  handleCancel = () => {
    this.setState({ isCancelled: true }, () => cancelAccountSetup())
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
    const timeout = setTimeout(() => {
      this.setState({ message: '' })
    }, 3000)
    this.setState({ msgTimeout: timeout })
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
    const { accountSetupTimeout } = this.props.wallet

    return (
      <ContentContainer>
        <TopSection>
          <Progress step={2}/>
          <SecondaryText style={{ textAlign: 'left' }}>
            {t('phraseDescription')}
          </SecondaryText>
        </TopSection>

        <Form>
          <Form.Input
            label={t('accountNameTitle')}
            type='input'
            value={this.state.accountName}
            onChange={this.handleChange}
            maxLength={32}
            placeholder={t('accountName')}
          />
          <Form.TextArea
            className='mnemonic'
            label={t('phraseTitle')}
            value={this.state.mnemonic}
            readOnly={true}
            onClick={this.selectAll}
          />

          <div style={{ textAlign: 'center' }}>
            <Popup
              trigger={<Button><Icon name='copy' />{t('copyText')}</Button>}
              content={t('copyTextMessage')}
              on='click'
              open={!!this.state.message}
              onOpen={this.copyText}
              position='top center'
            />
          </div>

          <Divider />

          <Grid columns='equal'>
            <Grid.Column>
              <Button fluid={true} onClick={this.handleCancel}>Cancel</Button>
            </Grid.Column>
            <Grid.Column>
              <StyledButton type='button' onClick={this.handleClick}>
                {t('create')}
              </StyledButton>
            </Grid.Column>
          </Grid>

          {/* tslint:disable-next-line:max-line-length */}
          {accountSetupTimeout > 0 && <TimerText>{parseTimeLeft(accountSetupTimeout)} left</TimerText>}
        </Form>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    wallet: state.wallet
  }
}

const mapDispatchToProps = { setNewPhrase, setAccountName, setNewPassword }

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GeneratePhrase))
