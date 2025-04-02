import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App'
import Comment from './comment/Comment'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
    {/* <Comment /> */}
  </StrictMode>,
)
