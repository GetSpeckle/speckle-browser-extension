import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IAppState } from '../background/store/all'
import { LayoutContainer } from '../components/basic-components'
import TopMenu from '../components/dashboard/TopMenu'
import BottomMenu from '../components/dashboard/BottomMenu'
import '../../assets/app.css'

interface IExtrinsicProps extends StateProps {}

class ExtrinsicLayout extends Component<IExtrinsicProps> {

  render () {

    const layoutStyle = {
      backgroundImage: `url(/assets/background/color-bg-ext-${this.props.settings.color}.svg)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 375
    }

    return (
      <LayoutContainer style={layoutStyle}>
        <TopMenu />
        {this.props.children}
        <BottomMenu />
      </LayoutContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(ExtrinsicLayout)
