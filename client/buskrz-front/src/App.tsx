import './App.css'
import Header from './components/Header'
import ConnectionTest from './components/ConnectionTest'
import LocationDetector from './components/LocationDetector'

function App() {

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-left w-full  m-auto">

        <div className="flex flex-col items-left justify-left w-full">
<h2 className="text-white text-6xl font-thin text-left mt-20 pl-20 ">Vas là où les<br></br> basses
   parlent <br></br>plus fort
que<br></br> les pensées.</h2>
</div>

<div className="flex flex-col items-center justify-left w-96">
      <LocationDetector />
        <ConnectionTest />
        

        <p className="text-white text-center text-sm font-medium mt-10">
            Site en construction
          </p>
      </div>
      </div>
    </>
  )
}

export default App
