import React from 'react'
import { BrowserRouter,  Route, Routes, Navigate } from 'react-router-dom'
import Signup from './auth/signup'
import Login from './auth/login'
import ProjectDashboard from './components/ProjectDashboard'
import Landing from './components/Landing'
import ProjectManagement from './components/ProjectManagement'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/index' element={<Navigate to="/projects" replace />}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/projects' element={<ProjectManagement/>}/>
          <Route path='/project/:id' element={<ProjectDashboard />}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}



export default App