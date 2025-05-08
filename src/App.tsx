import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter } from "react-router-dom";
import Login from './components/auth/Login'
import { Route, Routes, Router } from "react-router-dom";
import Register from './components/auth/Register'
import Calendar from './components/calendar/Calendar'
import GroupedEventList from './components/eventList/GroupedEventList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
