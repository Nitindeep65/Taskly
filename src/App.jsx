// Removed Express import - not for frontend/browser use
import React from 'react'
import { BrowserRouter,  Route, Routes } from 'react-router-dom'
import Index from './components'
import Signup from './auth/signup'
import Login from './auth/login'
import Dashboard from './components/dashboard'
import Landing from './components/Landing'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/index' element={<Index/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}



export default App