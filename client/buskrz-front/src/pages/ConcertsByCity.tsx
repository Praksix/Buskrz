import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'

// Interface qui correspond au modèle Concert.java du backend
interface Concert {
  id: string
  name: string           // 'name' et non 'nom'
  artisteIds: string[]   // Liste d'IDs d'artistes
  lieuId: string
  date: string           // Format: "YYYY-MM-DD"
  time: string           // Format: "HH:MM:SS"
  prix: string
  description: string
  image: string
  lien: string
}

function ConcertsByCity() {
  // 🎯 ÉTAPE 1 : Récupérer le paramètre 'ville' depuis l'URL
  // useParams() retourne un objet avec tous les paramètres de l'URL
  // Si l'URL est "/concerts/Paris", alors ville = "Paris"
  const { ville } = useParams<{ ville: string }>()
  
  // 🎯 ÉTAPE 2 : Créer les états pour gérer les données
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // 🎯 ÉTAPE 3 : Récupérer les concerts quand le composant se charge
  // useEffect se déclenche quand 'ville' change
  useEffect(() => {
    // Si pas de ville dans l'URL, on ne fait rien
    if (!ville) {
      setError('Aucune ville spécifiée dans l\'URL')
      setIsLoading(false)
      return
    }

    // Fonction pour récupérer les concerts de la ville
    const fetchConcertsByCity = async () => {
      try {
        setIsLoading(true)
        setError('')
        
        // 🎯 ÉTAPE 4 : Faire la requête API
        // On utilise le paramètre 'ville' dans l'URL de l'API
        const response = await fetch(`http://localhost:8080/api/v1/concerts/city/${ville}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`)
        }

        // 🎯 ÉTAPE 5 : Convertir la réponse en JSON et mettre à jour l'état
        const data = await response.json()
        setConcerts(data)
        
      } catch (err) {
        console.error('Erreur lors de la récupération des concerts:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }

    // Lancer la récupération des données
    fetchConcertsByCity()
    
  }, [ville]) // ⚠️ IMPORTANT : Le useEffect se relance quand 'ville' change

  // 🎯 ÉTAPE 6 : Affichage conditionnel selon l'état
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full m-auto p-10">
        
        {/* Titre avec le nom de la ville */}
        <h1 className="text-white text-5xl font-thin mb-10">
          Concerts à {ville}
        </h1>

        {/* Affichage pendant le chargement */}
        {isLoading && (
          <div className="text-white text-xl">
            Chargement des concerts...
          </div>
        )}

        {/* Affichage en cas d'erreur */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            Erreur : {error}
          </div>
        )}

        {/* Affichage quand il n'y a pas de concerts */}
        {!isLoading && !error && concerts.length === 0 && (
          <div className="text-white text-xl">
            Aucun concert trouvé à {ville}
          </div>
        )}

        {/* Affichage de la liste des concerts */}
        {!isLoading && !error && concerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {concerts.map((concert) => (
              <div 
                key={concert.id} 
                className="bg-white/5 border border-white/40 rounded-xl p-6 shadow-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                {/* Titre du concert */}
                <h2 className="text-white text-2xl font-bold mb-3">
                  {concert.name}
                </h2>
                
                {/* Date et heure */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📅</span>
                  <p className="text-white/80">
                    {new Date(concert.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                {/* Heure */}
                {concert.time && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">⏰</span>
                    <p className="text-white/80">{concert.time}</p>
                  </div>
                )}
                
                {/* Prix */}
                {concert.prix && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💰</span>
                    <p className="text-white/80">{concert.prix}</p>
                  </div>
                )}
                
                {/* Description */}
                {concert.description && (
                  <p className="text-white/70 text-sm mt-3 mb-3 line-clamp-2">
                    {concert.description}
                  </p>
                )}
                
                {/* Nombre d'artistes */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🎤</span>
                  <p className="text-white/60 text-sm">
                    {concert.artisteIds.length} artiste{concert.artisteIds.length > 1 ? 's' : ''}
                  </p>
                </div>
                
                {/* Lien vers plus d'infos */}
                {concert.lien && (
                  <a 
                    href={concert.lien} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-[#CE5526] hover:bg-[#A84320] text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                  >
                    Plus d'infos →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ConcertsByCity

