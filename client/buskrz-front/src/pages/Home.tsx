import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import LocationDetector from '../components/LocationDetector'
import CitySearch from '../components/CitySearch'
import heroBackground from '../assets/hero.png'
import baguettes from '../assets/baguettes.svg'

function Home() {
  // 🎯 ÉTAPE 1 : Créer un état pour stocker la ville détectée
  const [detectedCity, setDetectedCity] = useState<string | null>(null)
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false)

  // 🎯 ÉTAPE 2 : Hook pour naviguer vers une autre page
  const navigate = useNavigate()

  // 🎯 ÉTAPE 3 : Fonction callback appelée quand LocationDetector détecte la ville
  const handleLocationDetected = useCallback((city: string) => {
    console.log('Ville détectée dans Home:', city)
    setDetectedCity(city)
  }, [])

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

        <section className="w-full px-6 py-12 md:px-16 lg:px-24 xl:px-32 flex flex-col md:flex-row items-center gap-12">
          <div className="w-50 md:w-1/4 flex justify-center">
            <img
              src={baguettes}
              alt="Baguettes de batterie"
              className="w-full max-w-sm md:max-w-md"
            />
          </div>

          <div className="w-full md:w-3/4">
            <h3 className="text-white text-5xl md:text-6xl font-medium leading-tight text-left">Soutiens ta scène locale.</h3>

            <p className="text-white text-lg font-light mt-6 text-left">
              <p>Parce que les meilleurs concerts se jouent souvent là où on ne les attend pas
              Buskrz est né d'un constat : les lieux qui font vraiment vivre une scène locale – ce bar qui programme un concert pour la première fois, ce squat qui ouvre ses portes le temps d'un weekend, cette salle associative de quartier – n'ont jamais de visibilité.
              Pendant que les grandes salles remplissent les agendas culturels, des dizaines de concerts se jouent dans l'ombre. Des premières parties qui cherchent leur public. Des lieux éphémères qui tentent l'aventure. Des scènes émergentes qui n'ont ni budget com' ni réseau.
              C'est là qu'on intervient.</p>
              Buskrz, c'est une plateforme 100% communautaire où chacun peut recenser les concerts de son territoire. Pas de hiérarchie, pas de sélection : du showcase dans un café au set improvisé dans un lieu alternatif, tout mérite d'exister.
              <p>
              Tu connais un lieu qui programme ? Crée-le sur Buskrz.
              Tu tombes sur une affiche de concert ? Ajoute-le.
              Tu joues quelque part ? Partage-le.</p>
              Que tu sois artiste, organisateur, passionné de musique ou simple curieux, tu participes à faire émerger ce qui mérite de l'être. Parce qu'un premier concert dans un bar de quartier, c'est peut-être le début d'une belle histoire. Et que ces histoires-là se construisent collectivement.
              Rejoins la communauté Buskrz
              Gratuit, sans pub, pensé pour les scènes émergentes.
              Parce que la culture, ça se partage.
            </p>
          </div>
        </section>




        {/* <ConnectionTest />
          <p className="text-white text-center text-sm font-medium">
            Site en construction, on arrive bientôt !
          </p>*/}
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

