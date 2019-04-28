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

    const logoUrl = '/assets/logo-s.svg'
    const chainOptions = [
      {
        key: 'Polkadot',
        text: 'Polkadot',
        value: 'Polkadot',
        image: { avatar: true, src: '/assets/icon-48.png' },
      }
    ]

    return (
      <div>
        <Grid columns='equal' centered={true} >
          <Grid.Row centered={true} columns='equal' textAlign='center'>
            <Grid.Column>
              <Image src={logoUrl} />
            </Grid.Column>
            <Grid.Column width={8}>
              <Dropdown
                placeholder='Select Chain'
                fluid
                selection
                options={chainOptions}
              />
              </Grid.Column>
            <Grid.Column>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default withRouter(TopMenu)
