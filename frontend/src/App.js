import React from 'react'
import 'materialize-css'
import {BrowserRouter} from 'react-router-dom'
import { useRoutes } from './routes'
import { Navbar } from './components/Navbar'

// главное приложение

function App() {
  const routes = useRoutes()
  return (
    <BrowserRouter>
      <Navbar />
      <div>
        {routes}
      </div>
    </BrowserRouter>
  )
}

export default App