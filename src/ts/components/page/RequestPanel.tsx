import * as React from 'react'
import { Icon, Grid, Image } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { IAppState } from '../../background/store/all'
import { colorSchemes } from '../styles/themes'

interface IRequestPanelProps extends StateProps {
  origin: string
}

/**
 * The request access panel component
 */
class RequestPanel extends React.Component<IRequestPanelProps> {

  render () {
    const iconStyle = {
      color: colorSchemes[this.props.settings.color].backgroundColor,
      fontSize: '6em',
      lineHeight: 1,
      verticalAlign: 'middle'
    }

    const dotStyle = {
      color: colorSchemes[this.props.settings.color].backgroundColor
    }

    const destStyle = {
      backgroundColor: colorSchemes[this.props.settings.color].backgroundColor,
      color: 'white'
    }

    return (
      <div>
        <Grid verticalAlign='middle'>
          <Grid.Column width='7'>
            <div className='request-box'>
              <div><Icon name='question circle outline' style={iconStyle}/></div>
              <div>{this.props.origin}</div>
            </div>
          </Grid.Column>
          <Grid.Column width='2'>
            <Icon name='ellipsis horizontal' style={dotStyle} />
          </Grid.Column>
          <Grid.Column width='7'>
            <div className='request-box' style={destStyle}>
              <div>
                <Image
                  src='/assets/icon-128.png'
                  style={{ height: '85px', width: 'auto' }}
                  centered={true}
                />
              </div>
              <div>
                Speckle
              </div>
            </div>

          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { }

export default connect(mapStateToProps, mapDispatchToProps)(RequestPanel)
