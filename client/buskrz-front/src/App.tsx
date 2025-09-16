import './App.css'
import Header from './components/Header'
import ConnectionTest from './components/ConnectionTest'

function App() {

  return (
    <>
      <Header />
      <div className="main-content">
        <ConnectionTest />

        <p className="text-white text-center text-sm font-medium mt-10">
            Site en construction
          </p>
      </div>
    </>
  )
}

export default App
