import { useState } from 'react'
import './App.css'
import { BrowserRouter } from "react-router-dom";
import Login from './components/auth/Login'
import { Route, Routes } from "react-router-dom";
import Register from './components/auth/Register'
import Calendar from './components/calendar/Calendar'
import ProtectedRoute from './components/auth/ProtectedRoute';
import GroupedEventList from './components/eventList/GroupedEventList';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute/>}>
          <Route path="/calendar" element={<Calendar />} /> {/* Ruta protegida */}
          <Route path="/AllEvents" element={<GroupedEventList />} /> {/* Ruta protegida */}
          <Route path="/Register" element={<Register/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
