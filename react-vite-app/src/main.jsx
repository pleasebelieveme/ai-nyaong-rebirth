import React from 'react'
import ReactDOM from 'react-dom/client'
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TDSMobileAITProvider>
      <App />
    </TDSMobileAITProvider>
  </React.StrictMode>,
)

