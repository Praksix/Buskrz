import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AddConcert from './pages/AddConcert'
import AddLieu from './pages/AddLieu'
import ConcertsByCity from './pages/ConcertsByCity'
import Concertsliked from './pages/Concertsliked'
import ConcertDetails from './pages/ConcertDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import LieuDetails from './pages/LieuDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-concert" element={<AddConcert />} />
      <Route path="/add-lieu" element={<AddLieu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/concerts/liked" element={<Concertsliked />} />
      {/* Route dynamique avec paramètre :ville */}
      <Route path="/concerts/:ville" element={<ConcertsByCity />} />
      <Route path="/concert/:id" element={<ConcertDetails />} />
      <Route path="/lieux/:id" element={<LieuDetails />} />

      {/* Routes Administration protégées */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
