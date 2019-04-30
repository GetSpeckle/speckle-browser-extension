import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Image, Dropdown, Grid } from 'semantic-ui-react'

interface ITopMenuProps extends RouteComponentProps {
}

/**
 * The top menu bar on the dashboard
 */
class TopMenu extends React.Component<ITopMenuProps> {

  render () {

    const chainOptions = [
      {
        key: 'Polkadot',
        text: 'Polkadot',
        value: 'Polkadot',
        image: { avatar: true, src: '/assets/icon-48.png' },
      }
    ]

    return (
      <div className='top-menu'>
        <Grid centered={true} textAlign='center'>
            <Grid.Column width={4} verticalAlign='middle'>
              <Image src='/assets/logo-s.svg' centered={true} />
            </Grid.Column>

            <Grid.Column width={8} >
              <Dropdown
                className='chain'
                placeholder='Select Chain'
                fluid={true}
                selection={true}
                value='Polkadot'
                options={chainOptions}
              />
            </Grid.Column>

            <Grid.Column width={2} verticalAlign='middle'>
              <Image src='/assets/icon-dots-s.svg' centered={true} />
            </Grid.Column>

            <Grid.Column width={2} verticalAlign='middle'>
              <Image src='/assets/icon-profile.svg' centered={true} />
            </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default withRouter(TopMenu)
