import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { importAccountFromJson } from '../../services/keyring-vault-proxy'
import { RouteComponentProps, withRouter } from 'react-router'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { Form, Message } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { isObject, u8aToString, isHex } from '@polkadot/util'
import {
  Button,
  ContentContainer,
  WhiteTitle,
  SecondaryText,
  Section
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { HOME_ROUTE } from '../../constants/routes'
import { saveSettings } from '../../background/store/settings'
import { decodeAddress } from '@polkadot/util-crypto'

interface IImportJsonProps extends StateProps, DispatchProps, RouteComponentProps {}

interface IImportJsonState {
  file?: File
  json: KeyringPair$Json,
  password?: string,
  errorMessage?: string
}

class ImportJson extends React.Component<IImportJsonProps, IImportJsonState> {

  state: IImportJsonState = {
    json: {
      address: '',
      encoded: '',
      encoding: { content: ['pkcs8', 'sr25519'], type: 'none', version: '0' },
      meta: {}
    }
  }

  handleImport = () => {
    importAccountFromJson(this.state.json, this.state.password)
      .then((json: KeyringPair$Json) => {
        this.props.saveSettings({ ...this.props.settings, selectedAccount: {
          address: json.address,
          name: json.meta.name
        } })
        this.props.history.push(HOME_ROUTE)
      }).catch(error => {
        this.setState({ ...this.state, errorMessage: error })
      })
  }

  changePassword = (e) => {
    this.setState({ ...this.state, password: e.target.value, errorMessage: '' })
  }

  handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0]
    this.setState({ ...this.state, file: file })
    const reader = new FileReader()
    reader.onloadend = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer)
      let json
      try {
        json = JSON.parse(u8aToString(data))
      } catch (e) {
        this.setState({ ...this.state, errorMessage: e.message })
        return
      }
      try {
        const decodedAddress = decodeAddress(json.address, true)
        if (this.isFileValid(decodedAddress, json)) {
          this.setState({ ...this.state, json: json, errorMessage: '' })
        } else {
          this.setState({ ...this.state, errorMessage: t('error.keystore.invalid') })
        }
      } catch (err) { // decodeAddress throw error
        this.setState({ ...this.state, errorMessage: err.message })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  private isFileValid (decodedAddress, json) {
    return decodedAddress.length === 32
      && isHex(json.encoded) && isObject(json.meta)
      && (Array.isArray(json.encoding.content)
        ? json.encoding.content[0] === 'pkcs8'
        : json.encoding.content === 'pkcs8')
  }

  private readonly isReady = () => {
    return !!this.state.json.address && !this.state.errorMessage
  }

  private readonly shortFileName = () => {
    if (!this.state.file) return ''
    const fileName = this.state.file.name
    if (fileName.length < 20) {
      return fileName
    }
    return fileName.substring(0, 5) + '...' + fileName.substring(fileName.length - 10)
  }

  uploadArea = (getRootProps, getInputProps) => {
    return (
      <UploadArea {...getRootProps()}>
        <input {...getInputProps()} />
        {this.state.file ? this.shortFileName() : t('fileUpload')}
      </UploadArea>
    )
  }

  render () {
    return (
      <ContentContainer>
        <Section>
          <WhiteTitle>{t('importAccount')}</WhiteTitle>
        </Section>

        <SecondaryText className='action-start'>
          {t('keystoreOptionGuide')}
        </SecondaryText>
        <Form>
          <Section>
            <Dropzone onDrop={this.handleFileUpload}>
              {({ getRootProps, getInputProps }) => this.uploadArea(getRootProps, getInputProps)}
            </Dropzone>
          </Section>
          <Form.Input
            type='password'
            value={this.state.password}
            placeholder={t('password')}
            onChange={this.changePassword}
          />
          <Message negative={true} hidden={!this.state.errorMessage}>
            {this.state.errorMessage}
          </Message>
          <Section>
            <Button onClick={this.handleImport} disabled={!this.isReady()}>
              {t('import')}
            </Button>
          </Section>
        </Form>
      </ContentContainer>
    )
  }
}

const UploadArea = styled.div`
  width: 100%
  height: 90px
  border-radius: 5px
  border: 1px dotted #ccc
  padding: 20px
  display: flex
  justify-content: center
  align-items: center
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { saveSettings }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ImportJson))
