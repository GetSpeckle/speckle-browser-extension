import React from 'react'
import styled from 'styled-components'
import fromMetadata from '@polkadot/extrinsics/fromMetadata'
import { Metadata, Method } from '@polkadot/types'
import { findNetwork } from '../../constants/networks'

type MethodJson = {
  args: { [index: string]: any }
}

type Props = {
  genesisHash: string,
  isDecoded: boolean,
  method: string,
  nonce: string,
  url: string
}

function renderMethod (data: string, meta?: Metadata | null) {
  if (!meta) {
    return (
      <tr>
        <td className='label'>method data</td>
        <td className='data'>{data}</td>
      </tr>
    )
  }

  Method.injectMethods(fromMetadata(meta))

  const method = new Method(data)
  const json = method.toJSON() as unknown as MethodJson
  const methodData = `${method.sectionName}.${method.methodName}`
  const methodMeta = method.meta && (
      <tr>
        <td className='label'>info</td>
        <td className='data'>
          <details>
            <summary>{method.meta.documentation.join(' ')}</summary>
          </details>
        </td>
      </tr>
    )

  return (
    <>
      <tr>
        <td className='label'>method</td>
        <td className='data'>{methodData}</td>
      </tr>
      <tr>
        <td className='label'>&nbsp</td>
        <td className='data'><pre>{JSON.stringify(json.args, null, 2)}</pre></td>
      </tr>
      {methodMeta}
    </>
  )
}

function Details ({ genesisHash, isDecoded, method, nonce, url }: Props) {
  const network = findNetwork(genesisHash)

  return (
    <table>
      <tbody>
        <tr>
          <td className='label'>from</td>
          <td className='data'>{url}</td>
        </tr>
        <tr>
          <td className='label'>{network ? 'network' : 'genesis'}</td>
          <td className='data'>{network ? network.name : genesisHash}</td>
        </tr>
        <tr>
          <td className='label'>nonce</td>
          <td className='data'>{nonce}</td>
        </tr>
        {renderMethod(method, (network && isDecoded) ? network.meta : null)}
      </tbody>
    </table>
  )
}

export default styled(Details)`
  border: 0
  display: block
  font-size: 0.75rem
  margin-top: 0.75rem

  td.data {
    max-width: 0
    overflow: hidden
    text-align: left
    text-overflow: ellipsis
    vertical-align: middle
    width: 100%

    pre {
      font-family: inherit
      font-size: 0.75rem
      margin: 0
    }
  }

  td.label {
    opacity: 0.5
    padding: 0 0.5rem
    text-align: right
    vertical-align: middle
    white-space: nowrap
  }

  details {
    cursor: pointer
    max-width: 24rem

    &[open] summary {
      white-space: normal
    }

    summary {
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      outline: 0
    }
  }
`
