import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import QRCode from 'qrcode.react'
import {
  ContentContainer, Section
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import Balance from '../account/Balance'
import { AccountSection } from '../dashboard/Dashboard'
import 'react-tippy/dist/tippy.css'
import styled from 'styled-components'
import AccountDropdown from '../account/AccountDropdown'
import t from '../../services/i18n'
import { HOME_ROUTE } from '../../constants/routes'

interface IQRProps extends StateProps, RouteComponentProps {
}

class QR extends React.Component<IQRProps> {

  render () {
    const { selectedAccount } = this.props.settings
    if (!selectedAccount) {
      return null
    }

    const { address } = selectedAccount

    return (
      <ContentContainer>
        <AccountDropdown qrDestination={HOME_ROUTE}/>
        <AccountSection>
          <Balance address={address}/>
        </AccountSection>
        <QRSection>
          <QRContainer>
            <QRCodeContainer>
              <QRCode value={address} size={90}/>
            </QRCodeContainer>
          </QRContainer>
          <QRContainer>
            <PublicKey>
              {address}
            </PublicKey>
          </QRContainer>
          <SecondaryText style={{ textAlign: 'left' }}>
            {t('qrDesc')}
          </SecondaryText>
        </QRSection>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const PublicKey = styled.div`
  font-size: 17px;
  width: 261px;
  font-weight: 800;
  padding-left: 20px;
  line-height: 1.05;
`

const SecondaryText = styled.div`
  font-size: 17px;
  padding: 20px 20px 10px 20px;
  line-height: normal;
  color: #6F797C;
`

const QRContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
`

const QRCodeContainer = styled.div`
  margin: 10px auto;
  width: 90px;
`

const QRSection = styled(Section)`
  padding: 15px;
  margin-top: 25px;
  border-radius: 5px;
  box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
`

export default withRouter(connect(mapStateToProps)(QR))
