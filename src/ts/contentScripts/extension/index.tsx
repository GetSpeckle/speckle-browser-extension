import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import SpeckleApp from './containers/SpeckleApp';

import { createDomAnchor } from '../../scripts/dom';

createDomAnchor('speckle-root');

const store = new Store({
  // Communication port between the background component and views such as browser tabs.
  portName: 'ExPort'
});

store.ready().then(() => {
  ReactDOM.render(
        <Provider store={store}>
            <SpeckleApp />
        </Provider>
        , document.getElementById('speckle-root'));
});
