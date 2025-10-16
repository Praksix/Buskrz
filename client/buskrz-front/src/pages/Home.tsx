import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ConnectionTest from '../components/ConnectionTest'
import LocationDetector from '../components/LocationDetector'

function Home() {
  // 🎯 ÉTAPE 1 : Créer un état pour stocker la ville détectée
  const [detectedCity, setDetectedCity] = useState<string | null>(null)
  
  // 🎯 ÉTAPE 2 : Hook pour naviguer vers une autre page
  const navigate = useNavigate()

  // 🎯 ÉTAPE 3 : Fonction callback appelée quand LocationDetector détecte la ville
  const handleLocationDetected = (city: string) => {
    console.log('Ville détectée dans Home:', city)
    setDetectedCity(city)
  }

  // 🎯 ÉTAPE 4 : Fonction pour naviguer vers les concerts de la ville détectée
  const goToConcertsInMyCity = () => {
    if (detectedCity) {
      navigate(`/concerts/${detectedCity}`)
    }
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full  m-auto">

        <div className="flex flex-col items-center justify-center w-full mt-20">
<h2 className="text-white text-6xl font-thin text-left m-0 pl-20 ">Vas là où les basses <br></br> 
   parlent plus fort
que les pensées.</h2>
</div>

<div className="flex flex-col items-center justify-left w-96 gap-4">
      {/* 🆕 Passer le callback au LocationDetector */}
      <LocationDetector onLocationDetected={handleLocationDetected} />
      
      {/* 🆕 Bouton pour voir les concerts de ma ville */}
      {detectedCity && (
        <button
          onClick={goToConcertsInMyCity}
          className="w-full bg-[#CE5526] hover:text-[#A84320] bg-white text-[#CE5526]font-bold py-4 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <span>Voir les concerts à {detectedCity}</span>
          <span>→</span>
        </button>
      )}
      
      <ConnectionTest />
        

        <p className="text-white text-center text-sm font-medium mt-10">
            Site en construction, on arrive bientôt !
          </p>
      </div>
      </div>
    </>
  )
}

export default Home

