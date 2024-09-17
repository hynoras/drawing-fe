import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from '~/components/GlobalStyles';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from './reducers/index';

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

store.subscribe(() => {
    console.log('store.getState()', store.getState());
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        {/* <React.StrictMode> */}
            <GlobalStyles>
                <App />
            </GlobalStyles>
        {/* </React.StrictMode> */}
    </Provider>,
);
