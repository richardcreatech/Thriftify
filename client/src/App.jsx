import React from 'react'
import AuthHeader from './components/AuthHeader'
import Auth from './pages/Auth'
import LoginForm from './components/LoginForm'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Auth />} />
    </Routes>
  )
}

export default App