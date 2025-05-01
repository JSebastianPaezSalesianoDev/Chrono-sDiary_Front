import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Calendar from './components/calendar/calendar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login/>
      <Register/>
      <div className="container">
      <Calendar/>
      </div>
    </>
  )
}

export default App
