import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { importAccountFromJson, decodeAddress } from '../../services/keyring-vault-proxy'
import { RouteComponentProps, withRouter } from 'react-router'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { Message } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { isObject, u8aToString, isHex } from '@polkadot/util'
import { Section, Button } from '../basic-components'

interface ImportJsonProp extends RouteComponentProps {}

interface ImportJsonState {
  file?: File
  json: KeyringPair$Json,
  password?: string,
  errorMessage?: string
}

class ImportJson extends React.Component<ImportJsonProp, ImportJsonState> {

  constructor (props) {
    super(props)
    this.handleImport = this.handleImport.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.isReady = this.isReady.bind(this)
    this.shortFileName = this.shortFileName.bind(this)
  }

  state: ImportJsonState = {
    json: {
      address: '',
      encoded: '',
      encoding: { content: ['pkcs8', 'sr25519'], type: 'none', version: '0' },
      meta: {}
    }
  }

  handleImport () {
    importAccountFromJson(this.state.json, this.state.password)
      .then((json: KeyringPair$Json) => {
        console.log(json) // TODO navigate to account screen
      }).catch(error => {
        this.setState({ ...this.state, errorMessage: error })
      })
  }

  handleFileUpload (acceptedFiles) {
    const file = acceptedFiles[0]
    this.setState({ ...this.state, file: file })
    const reader = new FileReader()
    reader.onloadend = () => {
      const data = new Uint8Array(reader.result as ArrayBuffer)
      try {
        const json = JSON.parse(u8aToString(data))
        decodeAddress(json.address, true).then(decodeAddress => {
          if (this.isFileValid(decodeAddress, json)) {
            this.setState({ ...this.state, json: json, errorMessage: '' })
          } else {
            this.setState({ ...this.state, errorMessage: t('error.keystore.invalid') })
          }
        }).catch(err => { // decodeAddress throw error
          this.setState({ ...this.state, errorMessage: err.message })
        })
      } catch (e) { // JSON.parse(u8aToString(data)) throw error
        this.setState({ ...this.state, errorMessage: e.message })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  private isFileValid (decodeAddress, json) {
    return decodeAddress.length === 32
      && isHex(json.encoded) && isObject(json.meta)
      && (Array.isArray(json.encoding.content)
        ? json.encoding.content[0] === 'pkcs8'
        : json.encoding.content === 'pkcs8')
  }

  private isReady () {
    return !!this.state.json.address && !this.state.errorMessage
  }

  private shortFileName () {
    if (!this.state.file) return ''
    if (this.state.file.name.length < 20) {
      return this.state.file.name
    }
    const longName = this.state.file.name
    return longName.substring(0, 5) + '...' + longName.substring(longName.length - 10)
  }

  render () {
    return (
      <div>
        <Dropzone onDrop={this.handleFileUpload}>
          {({ getRootProps, getInputProps }) => (
            <UploadArea {...getRootProps()}>
              <input {...getInputProps()} />
              {this.state.file ? this.shortFileName() : t('fileUpload')}
            </UploadArea>
          )}
        </Dropzone>
        <Section>
          <input
            style={password}
            type='password'
            placeholder={t('password')}
            value={this.state.password}
          />
        </Section>
        <Section>
          <Message negative={true} hidden={!this.state.errorMessage}>
            {this.state.errorMessage}
          </Message>
        </Section>
        <Section>
          <Button onClick={this.handleImport} disabled={!this.isReady()}>
            {t('import')}
          </Button>
        </Section>
      </div>
    )
  }
}

const UploadArea = styled.div`
  width: 311px;
  height: 90px;
  margin:18px auto;
  border-radius: 5px;
  border: 1px dotted;
  display: flex;
  justify-content: space-around;
  align-items: center
`

const password = {
  width: 311,
  height: 42,
  padding: 10,
  boarderWidth: 0.5,
  borderRadius: 3,
  borderStyle: 'solid',
  borderColor: 'gray'
}

export default withRouter(ImportJson)
