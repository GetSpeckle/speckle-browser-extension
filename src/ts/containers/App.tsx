import { IAppState } from '../background/store/all'
import { changeColor } from '../background/store/settings'
import { connect } from 'react-redux'
import App from '../components/App'

const mapStateToProps = (state: IAppState) => {
  return {
    color: state.settings.color
  }
}

const mapDispatchToProps = { changeColor }

export default connect(mapStateToProps, mapDispatchToProps)(App)
