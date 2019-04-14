import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { importAccountFromJson, decodeAddress } from '../../services/keyring-vault-proxy'
import { RouteComponentProps, withRouter } from 'react-router'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import { Message } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { isObject, u8aToString, isHex } from '@polkadot/util'

interface ImportJsonProp extends RouteComponentProps {
  history: any
}
interface ImportJsonState {
  file?: File
  json: KeyringPair$Json,
  password?: string,
  errorMessage?: string
}

type LoadEvent = {
  target: {
    result: ArrayBuffer
  }
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

  shortFileName () {
    if (!this.state.file) return ''
    if (this.state.file.name.length < 20) {
      return this.state.file.name
    }
    let longName = this.state.file.name
    return longName.substring(0, 5) + '...' + longName.substring(longName.length - 10)
  }

  handleImport () {
    importAccountFromJson(this.state.json, this.state.password)
      .then((json: KeyringPair$Json) => {
        console.log(json)
      }).catch((reason) => {
        console.log(reason)
        this.setState({ ...this.state, errorMessage: reason })
      })
  }

  handleFileUpload (acceptedFiles) {
    const file = acceptedFiles[0]
    this.setState({ ...this.state, file: file })
    const reader = new FileReader()
    // @ts-ignore
    reader.onload = ({ target: { result } }: LoadEvent) => {
      const data = new Uint8Array(result)
      try {
        const json = JSON.parse(u8aToString(data))
        decodeAddress(json.address, true).then((decodeAddress) => {
          const isFileValid = decodeAddress.length === 32
            && isHex(json.encoded) && isObject(json.meta)
            && (Array.isArray(json.encoding.content)
              ? json.encoding.content[0] === 'pkcs8'
              : json.encoding.content === 'pkcs8')
          if (isFileValid) {
            this.setState({ ...this.state, json: json, errorMessage: '' })
          } else {
            this.setState({ ...this.state, errorMessage: t('error.keystore.invalid') })
          }
        }).catch(err => {
          this.setState({ ...this.state, errorMessage: err.message })
        })
      } catch (error) { // JSON.parse(u8aToString(data)) may throw error here
        this.setState({ ...this.state, errorMessage: error.message })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  isReady () {
    return !!this.state.json.address && !this.state.errorMessage
  }

  render () {
    return (
      <div>
        <Dropzone onDrop={this.handleFileUpload}>
          {({getRootProps, getInputProps}) => (
            <StyledDiv {...getRootProps()}>
              <input {...getInputProps()} />
              {this.state.file ? this.shortFileName() : t('fileUpload')}
            </StyledDiv>
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
        <Message negative={true} hidden={!this.state.errorMessage} style={error}>
          {this.state.errorMessage}
        </Message>
        <Section>
          <ImportButton onClick={this.handleImport} disabled={!this.isReady()}>
            {t('import')}
          </ImportButton>
        </Section>
      </div>
    )
  }
}

const StyledDiv = styled.div`
  width: 311px;
  height: 90px;
  margin:18px auto;
  border-radius: 5px;
  border: 1px dotted;
  display: flex;
  justify-content: space-around;
  align-items: center
`

const Section = styled.p`
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

const ImportButton = styled.button`
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
  color: #ffffff;`

const error = {
  width: 311,
  margin: 'auto'
}

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
