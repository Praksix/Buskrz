import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AddConcert from './pages/AddConcert'
import ConcertsByCity from './pages/ConcertsByCity'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-concert" element={<AddConcert />} />
      {/* Route dynamique avec paramètre :ville */}
      <Route path="/concerts/:ville" element={<ConcertsByCity />} />
    </Routes>
  )
}

export default App
