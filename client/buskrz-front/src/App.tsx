import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AddConcert from './pages/AddConcert'
import AddLieu from './pages/AddLieu'
import ConcertsByCity from './pages/ConcertsByCity'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-concert" element={<AddConcert />} />
      <Route path="/add-lieu" element={<AddLieu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Route dynamique avec paramètre :ville */}
      <Route path="/concerts/:ville" element={<ConcertsByCity />} />
    </Routes>
  )
}

export default App
