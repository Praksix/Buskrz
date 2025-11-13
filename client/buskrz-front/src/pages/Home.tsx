import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ConnectionTest from '../components/ConnectionTest'
import LocationDetector from '../components/LocationDetector'
import CitySearch from '../components/CitySearch'
import heroBackground from '../assets/hero.png'

function Home() {
  // 🎯 ÉTAPE 1 : Créer un état pour stocker la ville détectée
  const [detectedCity, setDetectedCity] = useState<string | null>(null)
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false)
  
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

  const openCityModal = () => setIsCityModalOpen(true)
  const closeCityModal = () => setIsCityModalOpen(false)

  return (
    <>
      <Header />
      <main className="flex flex-col items-center w-full">
        <section className="relative w-full overflow-hidden isolate">
          <img
            src={heroBackground}
            alt="Foule assistant à un concert"
            className="absolute inset-0 h-full w-full object-cover -z-20"
          />
          <div className="absolute inset-0 bg-black/60 -z-10" />
          <div className="relative flex flex-col items-center justify-center gap-6 px-6 py-24 md:px-16 lg:px-24 xl:px-32 z-10">
            <h2 className="text-white text-5xl md:text-6xl font-light leading-tight">
              Va là où les basses<br />
              parlent plus fort que les pensées
            </h2>

            <LocationDetector onLocationDetected={handleLocationDetected} />
            {/* 🆕 Bouton pour voir les concerts de ma ville */}
      {detectedCity && (
        <button
          onClick={goToConcertsInMyCity}
          className="w-1/2 bg-[#CE5526] hover:bg-[#A84320] text-white font-thin py-4 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <span>Voir les concerts à <span className="font-light">{detectedCity}</span> </span>
          <span>→</span>
        </button>
      )}

<button
        type="button"
        onClick={openCityModal}
        className="text-white text-sm font-medium underline underline-offset-4 hover:text-white/80 transition-colors"
      >
        Changer de ville
      </button>
          </div>
        </section>

<section className="flex flex-col items-center w-full max-w-md gap-4 px-6 py-12">
      {/* 🆕 Passer le callback au LocationDetector */}
     
      
      

      
      
      <ConnectionTest />
        
        <p className="text-white text-center text-sm font-medium">
            Site en construction, on arrive bientôt !
          </p>
      </section>
      </main>

      {isCityModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          onClick={closeCityModal}
        >
          <div
            className="relative w-full max-w-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute -top-10 right-0">
              <button
                type="button"
                onClick={closeCityModal}
                className="text-white/80 hover:text-white transition-colors text-2xl"
                aria-label="Fermer la modale"
              >
                x
              </button>
            </div>

            <CitySearch onCitySelected={closeCityModal} />
          </div>
        </div>
      )}
    </>
  )
}

export default Home

