import * as React from 'react'
import styled from 'styled-components'
import t from '../../services/i18n'
import { HOME_ROUTE } from '../../constants/routes'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { saveSettings } from '../../background/store/settings'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button,
  ContentContainer,
  Section,
  TopSection,
  BasicSection,
  SecondaryText,
  Title
} from '../basic-components'

interface ITermProps extends StateProps, DispatchProps, RouteComponentProps {}

class Term extends React.Component<ITermProps> {

  handleClick = () => {
    const { history, settings } = this.props
    this.props.saveSettings({ ...settings, welcome: false }).then(() =>
      history.push(HOME_ROUTE)
    )
  }

  render () {
    return (
      <ContentContainer>
        <TopSection>
          <Title>
            {t('termTitle')}
          </Title>
        </TopSection>

        <BasicSection>
          <TermSection>
            {t('termDescription')}
          </TermSection>
        </BasicSection>

        <Section>
          <Button onClick={this.handleClick}>
            {t('termAcceptButton')}
          </Button>
        </Section>
      </ContentContainer>
    )
  }
}

const TermSection = styled(SecondaryText)`
  height: 280px;
  overflow-y: auto;
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = { saveSettings }

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Term))
