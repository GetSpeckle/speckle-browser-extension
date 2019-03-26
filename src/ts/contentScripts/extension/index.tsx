import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import SpeckleApp from './containers/SpeckleApp';

import { createDomAnchor } from '../../scripts/dom';

createDomAnchor('speckle-root')

const store = new Store({
    portName: 'ExPort' // Communication port between the background component and views such as browser tabs.
})

store.ready().then(() => {
    ReactDOM.render(
        <Provider store={store}>
            <SpeckleApp />
        </Provider>
        , document.getElementById('speckle-root'))
});
