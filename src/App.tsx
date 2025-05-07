import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Calendar from './components/calendar/Calendar'
import GroupedEventList from './components/eventList/GroupedEventList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login/>
      <Register/>
      <div className="container">
      <Calendar/>
      <GroupedEventList/>
      </div>
    </>
  )
}

export default App
