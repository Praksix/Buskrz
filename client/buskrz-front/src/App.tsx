import { useState } from 'react'
import './App.css'
import Header from './components/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="height-300 width-600 border-1 bg-white/5 shadow-xl  border-white-40 rounded-xl p-10">
          <button onClick={() => setCount((count) => count + 1)} className="bg-white border-1 border-white-40 rounded-lg p-2 text-[#CE5526] shadow-xl  p-4">
            Tester la connexion
          </button>
          
        </div>

        <p className="text-white text-center text-sm font-medium mt-10">
            Site en construction
          </p>
      </div>
    </>
  )
}

export default App
