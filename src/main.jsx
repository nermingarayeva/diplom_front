import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import store from '../redux/reducers/store.js'
import Router from '../router/Router.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Provider store={store}>
    <Router/>
   </Provider>
  </React.StrictMode>,
)