import React from 'react'
import t from '../../services/i18n'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  ContentContainer,
  SecondaryText,
  Section,
  WhiteTitle,
  Title
} from '../basic-components'
import styled from 'styled-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { colorSchemes } from '../styles/themes'
import { IMPORT_JSON_ROUTE, IMPORT_MNEMONIC_ROUTE } from '../../constants/routes'

interface IImportOptionsProps extends StateProps, RouteComponentProps {}

class ImportOptions extends React.Component<IImportOptionsProps> {

  choosePhraseOption = () => {
    this.props.history.push(IMPORT_MNEMONIC_ROUTE)
  }

  chooseKeystoreOption = () => {
    this.props.history.push(IMPORT_JSON_ROUTE)
  }

  render () {
    return (
      <ContentContainer>
        <Section>
          <WhiteTitle>{t('importAccount')}</WhiteTitle>
        </Section>
        <Section className='action-start'>
          <Title>{t('howToImport')}</Title>
        </Section>
        <OptionSection onClick={this.choosePhraseOption}>
          <OptionContainer>
            <Icon viewBox='0 0 20 20'>
              <path
                d='M10 15h8c1 0 2-1 2-2V3c0-1-1-2-2-2H2C1 1 0 2 0 3v10c0
                   1 1 2 2 2h4v4l4-4zM5 7h2v2H5V7zm4 0h2v2H9V7zm4 0h2v2h-2V7z'
              />
            </Icon>
            <ImportOption>
              {t('phraseOption')}
            </ImportOption>
          </OptionContainer>
          <SecondaryText style={{ textAlign: 'left' }}>
            {t('phraseOptionDesc')}
          </SecondaryText>
        </OptionSection>
        <OptionSection onClick={this.chooseKeystoreOption}>
          <OptionContainer>
            <Icon viewBox='0 0 32 32'>
              <g>
                <path
                  d='M10 30v-4h12v4h6a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4a4
                     4 0 0 0-4 4v22a4 4 0 0 0 4 4h6zm-6-6V6a2 2 0 0 1
                     2-2h20a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z'
                />
                <path
                  d='M18 17.79l2.194 2.213a1.977 1.977 0 0 0 2.81
                     0l.009-.01a2 2 0 0 0 0-2.815l-4.204-4.242.007-.007-2.809-2.835-2.823
                     2.835.007.007-4.204 4.242a2 2 0 0 0 0 2.816l.01.01a1.977
                     1.977 0 0 0 2.809 0L14 17.788V34a2 2 0 1 0 4 0V17.79z'
                />
              </g>
            </Icon>
            <ImportOption>
              {t('keystoreOption')}
            </ImportOption>
          </OptionContainer>
          <SecondaryText style={{ textAlign: 'left' }}>
            {t('keystoreOptionDesc')}
          </SecondaryText>
        </OptionSection>
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

const Icon = connect(mapStateToProps)(styled.svg`
  width: 24px;
  height: 24px;
  fill: ${(p: StateProps) => colorSchemes[p.settings.color].backgroundColor};
`)

const ImportOption = connect(mapStateToProps)(styled.div`
  font-size: 20px;
  font-weight: 800;
  padding-left: 20px;
  line-height: 1.05;
  color: ${(p: StateProps) => colorSchemes[p.settings.color].backgroundColor};
`)

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
`

const OptionSection = styled(Section)`
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;
  :hover {
    box-shadow: 0 2px 8px 0 rgba(62, 88, 96, 0.1);
  };
`

export default withRouter(connect(mapStateToProps)(ImportOptions))
