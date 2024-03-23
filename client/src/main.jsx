import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// import { store, persistor } from './redux/store.js';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import InitializeAuth from './components/InitializeAuth.jsx';
import ThemeProvider from './components/ThemeProvider.jsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <PersistGate persistor={persistor}> */}
    <Provider store={store}>
      <ThemeProvider>
        <InitializeAuth />
        <Toaster position='top-center' />
        <App />
      </ThemeProvider>
    </Provider>
    {/* </PersistGate> */}
  </React.StrictMode>
);
