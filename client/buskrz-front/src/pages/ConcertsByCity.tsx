import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import illusImage from '../assets/illus.jpg'

// Interface qui correspond au modèle Concert.java du backend
interface Concert {
  id: string
  name: string  
  artisteIds: string[]   // Liste d'IDs d'artistes
  lieuId: string
  date: string           // Format: "YYYY-MM-DD"
  time: string           // Format: "HH:MM:SS"
  prix: string
  description: string
  image: string
  lien: string
}

// Interface pour les données d'un artiste
interface Artiste {
  id: string
  name: string
  genres: string[]
}

// Interface pour les données d'un artiste
interface Lieu {
  id: string
  name: string
}

function ConcertsByCity() {
  // 🎯 ÉTAPE 1 : Récupérer le paramètre 'ville' depuis l'URL
  // useParams() retourne un objet avec tous les paramètres de l'URL
  // Si l'URL est "/concerts/Paris", alors ville = "Paris"
  const { ville } = useParams<{ ville: string }>()
  
  // 🎯 ÉTAPE 2 : Créer les états pour gérer les données
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [lieux, setLieux] = useState<Map<string, Lieu>>(new Map())
  const [artistes, setArtistes] = useState<Map<string, Artiste>>(new Map())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // Fonction pour récupérer les détails d'un artiste par son ID
  const fetchArtisteById = async (artisteId: string): Promise<Artiste | null> => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/artistes/${artisteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.warn(`Impossible de récupérer l'artiste ${artisteId}: ${response.status}`)
        return null
      }

      return await response.json()
    } catch (err) {
      console.error(`Erreur lors de la récupération de l'artiste ${artisteId}:`, err)
      return null
    }
  }


  // Fonction pour récupérer les détails d'un lieu par son ID
  const fetchLieuById = async (lieuId: string): Promise<Lieu | null> => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/lieux/${lieuId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.warn(`Impossible de récupérer le lieu ${lieuId}: ${response.status}`)
        return null
      }

      return await response.json()
    } catch (err) {
      console.error(`Erreur lors de la récupération du lieu ${lieuId}:`, err)
      return null
    }
  }


  

  // Fonction pour récupérer tous les lieux uniques des concerts
  const fetchAllLieux = async (concerts: Concert[]) => {
    const lieuIds = new Set<string>()
    
    // Collecter tous les IDs de lieux uniques
    concerts.forEach(concert => {
      lieuIds.add(concert.lieuId)
    })

    // Récupérer les détails de chaque lieu
    const lieuPromises = Array.from(lieuIds).map(id => fetchLieuById(id))
    const lieuResults = await Promise.all(lieuPromises)

    // Créer une Map pour un accès rapide par ID
    const lieuxMap = new Map<string, Lieu>()
    lieuResults.forEach(lieu => {
      if (lieu) {
        lieuxMap.set(lieu.id, lieu)
      }
    })

    return lieuxMap
  }

  // Fonction pour récupérer tous les artistes uniques des concerts
  const fetchAllArtistes = async (concerts: Concert[]) => {
    const artisteIds = new Set<string>()
    
    // Collecter tous les IDs d'artistes uniques
    concerts.forEach(concert => {
      concert.artisteIds.forEach(id => artisteIds.add(id))
    })

    // Récupérer les détails de chaque artiste
    const artistePromises = Array.from(artisteIds).map(id => fetchArtisteById(id))
    const artisteResults = await Promise.all(artistePromises)

    // Créer une Map pour un accès rapide par ID
    const artistesMap = new Map<string, Artiste>()
    artisteResults.forEach(artiste => {
      if (artiste) {
        artistesMap.set(artiste.id, artiste)
      }
    })

    return artistesMap
  }

  // Fonction pour formater l'heure sans les secondes (HH:MM)
  const formatTime = (timeString: string): string => {
    if (!timeString) return ''
    // Si le format est "HH:MM:SS", on prend seulement "HH:MM"
    if (timeString.includes(':')) {
      const parts = timeString.split(':')
      return `${parts[0]}:${parts[1]}`
    }
    return timeString
  }

  // Fonction pour formater la date de YYYY-MM-DD vers DD.MM.YYYY
  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    // Si le format est "YYYY-MM-DD", on le convertit en "DD.MM.YYYY"
    if (dateString.includes('-') && dateString.split('-').length === 3) {
      const parts = dateString.split('-')
      return `${parts[2]}.${parts[1]}.${parts[0]}`
    }
    return dateString
  }

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
        
        // 🎯 ÉTAPE 4 : Faire la requête API pour les concerts
        const response = await fetch(`http://localhost:8080/api/v1/concerts/city/${ville}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`)
        }

        // 🎯 ÉTAPE 5 : Convertir la réponse en JSON
        const concertsData = await response.json()
        setConcerts(concertsData)

        // 🎯 ÉTAPE 6 : Récupérer les détails des lieux et artistes
        const lieuxData = await fetchAllLieux(concertsData)
        setLieux(lieuxData)
        
        const artistesData = await fetchAllArtistes(concertsData)
        setArtistes(artistesData)
        
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
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
            {concerts.map((concert) => (
              <div 
                key={concert.id} 
                className="bg-white/5 border border-white/40 rounded-xl  shadow-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                {/* Layout avec image à gauche et contenu à droite */}
                <div className="flex gap-4 h-full">
                  {/* Image à gauche */}
                  <div className="flex-shrink-0 h-full">
                    <img src={illusImage} alt={concert.name} className="w-30 h-full object-cover rounded-lg sm:w-70" />
                  </div>
                  
                  {/* Contenu à droite */}
                  <div className="flex-1">
                    <h2 className="text-white text-2xl pt-3 text-left font-thin pr-2 mb-0">
                      {concert.name}
                    </h2>
                
                {/* Noms des artistes */}
                <div className="mb-0">
                  <div className="flex items-center gap-2 mb-0 px-0">
        
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {concert.artisteIds.map((artisteId, index) => {
                      const artiste = artistes.get(artisteId)
                      return (
                        <span 
                          key={artisteId}
                          className="  text-white text-left md:text-4xl text-lg py-1 text-5xl pr-2 font-medium mt-0 mb-0"
                        >
                          {artiste ? artiste.name : `Artiste ${index + 1}`}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="mb-0">
                  <div className="flex items-center gap-2">
        
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {concert.artisteIds.map((artisteId, index) => {
                      const artiste = artistes.get(artisteId)
                      return (
                        <span 
                          key={artisteId}
                          className="  text-white italic text-xl pr-2font-thin"
                        >
                          {artiste ? artiste.genres : `Artiste ${index + 1}`}
                        </span>
                      )
                    })}
                  </div>
                </div>
                
                
                
                  {/* Date et heure */}
                  <div className="flex items-center gap-2">
                    
                    <p className="text-white/80 text-left"> {concert ? formatDate(concert.date) : `Concert paq trouvé`}</p><p className='text-white'>/</p><p className="text-white/80 pr-2">{formatTime(concert.time)}</p>
                  </div>
                
                {/* Prix 
                {concert.prix && (
                  <div className="flex items-center gap-2 mb-2">
                    
                    <p className="text-white/80">{concert.prix}€</p>
                  </div>
                )}*/}
                
                {/* Description 
                //{concert.description && (
                  <p className="text-white/70 text-sm mt-3 mb-3 line-clamp-2">
                    {concert.description}
                  </p>
                )}*/}
                {/* Lieu du concert */}
                <div className="mb-3">
                 
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const lieu = lieux.get(concert.lieuId)
                      return (
                        <span className="text-white italic  text-sm font-thin">
                          {lieu ? lieu.name : `Lieu ${concert.lieuId}`}
                        </span>
                      )
                    })()}
                  </div>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ConcertsByCity

