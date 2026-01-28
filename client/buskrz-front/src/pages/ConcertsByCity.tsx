import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import illusImage from '../assets/illus.jpg'
import CitySearch from '../components/CitySearch'
import LikeButton from '../components/LikeButton'
import { useAuth } from '../contexts/AuthContext'

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

// Les fonctions de récupération sont définies en dehors du composant car elles ne dépendent pas
// de l'état du composant (sauf si on leur passe les arguments nécessaires)

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

/**
 * 🖼️ GET IMAGE URL - Construire l'URL de l'image
 * 
 * Cette fonction détermine si l'image est :
 * - Un ID GridFS (ex: "507f1f77bcf86cd799439011") → Construit l'URL vers /api/v1/files/{id}
 * - Une URL externe (ex: "https://example.com/image.jpg") → Retourne l'URL telle quelle
 * - Vide/null → Retourne l'image par défaut
 * 
 * @param imageField - Le champ image du concert (ID GridFS, URL, ou vide)
 * @returns L'URL complète de l'image
 */
const getImageUrl = (imageField: string | undefined): string => {
  // Si pas d'image, utiliser l'image par défaut
  if (!imageField || imageField.trim() === '') {
    return illusImage
  }

  // Si c'est déjà une URL complète (commence par http:// ou https://)
  // C'est une image externe, on la retourne telle quelle
  if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
    return imageField
  }

  // Sinon, c'est un ID GridFS
  // On construit l'URL vers notre backend
  return `http://localhost:8080/api/v1/files/${imageField}`
}

function ConcertsByCity() {
  // 🎯 ÉTAPE 1 : Récupérer le paramètre 'ville' depuis l'URL
  // useParams() retourne un objet avec tous les paramètres de l'URL
  // Si l'URL est "/concerts/Paris", alors ville = "Paris"
  const { ville } = useParams<{ ville: string }>()
  const navigate = useNavigate()

  // 🎯 ÉTAPE 2 : Créer les états pour gérer les données
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [lieux, setLieux] = useState<Map<string, Lieu>>(new Map())
  const [artistes, setArtistes] = useState<Map<string, Artiste>>(new Map())
  const [likedConcertIds, setLikedConcertIds] = useState<Set<string>>(new Set()) // New state for likes
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { user, isAuthenticated } = useAuth() // Get auth context

  const openCityModal = () => setIsCityModalOpen(true)
  const closeCityModal = () => setIsCityModalOpen(false)

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

  // Fetch users liked concerts
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const fetchLikedConcerts = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/users/${user.id}/concerts/liked`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure token is sent
            }
          })
          if (response.ok) {
            const data: Concert[] = await response.json()
            setLikedConcertIds(new Set(data.map(c => c.id)))
          }
        } catch (error) {
          console.error("Error fetching liked concerts:", error)
        }
      }
      fetchLikedConcerts()
    } else {
      setLikedConcertIds(new Set())
    }
  }, [isAuthenticated, user?.id])

  const normalizedTerm = searchTerm.trim().toLowerCase()
  const filteredConcerts = concerts.filter((concert) => {
    if (!normalizedTerm) {
      return true
    }

    const concertNameMatch = concert.name.toLowerCase().includes(normalizedTerm)
    const lieuName = lieux.get(concert.lieuId)?.name?.toLowerCase() ?? ''
    const lieuMatch = lieuName.includes(normalizedTerm)

    const artistesMatch = concert.artisteIds.some((artisteId) => {
      const artiste = artistes.get(artisteId)
      if (!artiste) {
        return false
      }

      const artisteNameMatch = artiste.name.toLowerCase().includes(normalizedTerm)
      const genreMatch = artiste.genres?.some((genre) =>
        genre.toLowerCase().includes(normalizedTerm)
      )

      return artisteNameMatch || genreMatch
    })

    return concertNameMatch || lieuMatch || artistesMatch
  })

  // 🎯 ÉTAPE 6 : Affichage conditionnel selon l'état
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full m-auto p-10">

        {/* Titre avec le nom de la ville */}
        <h1 className="text-white text-5xl font-thin mb-5">
          Concerts à {ville}
        </h1>

        <button
          type="button"
          onClick={openCityModal}
          className="text-white text-sm font-medium underline underline-offset-4 hover:text-white/80 transition-colors mb-20"
        >
          Changer de ville
        </button>

        <div className="w-full max-w-4xl mb-12">
          <label htmlFor="concert-search" className="sr-only">
            Rechercher un concert
          </label>
          <div className="relative">
            <input
              id="concert-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher par concert, artiste, genre ou lieu"
              className="w-full rounded-lg border border-white/20 bg-white/10 py-3 pl-4 pr-12 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#CE5526]"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

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
          <div className="text-white text-xl mt-50">
            Aucun concert trouvé à {ville}
          </div>
        )}

        {/* Affichage de la liste des concerts */}
        {!isLoading && !error && concerts.length > 0 && filteredConcerts.length === 0 && (
          <div className="text-white text-xl mt-10">
            Aucun concert ne correspond à votre recherche.
          </div>
        )}

        {!isLoading && !error && filteredConcerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 w-full max-w-6xl">
            {filteredConcerts.map((concert) => (
              <div
                key={concert.id}
                className="bg-white/5 border border-white/40 rounded-xl  shadow-xl hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => navigate(`/concert/${concert.id}`, { state: { fromCity: ville } })}
              >
                {/* Layout avec image à gauche et contenu à droite */}
                <div className="flex gap-4 relative">
                  {/* Image à gauche - utilise getImageUrl pour gérer GridFS ou URL externe */}
                  <div className="flex-shrink-0 relative w-30 sm:w-70">
                    <img
                      src={getImageUrl(concert.image)}
                      alt={concert.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    {/* Like Button on Image */}
                    <div className="absolute top-2 right-2 z-10">
                      <LikeButton
                        concertId={concert.id}
                        initialIsLiked={likedConcertIds.has(concert.id)}
                        onToggle={(isLiked) => {
                          const newSet = new Set(likedConcertIds)
                          if (isLiked) newSet.add(concert.id)
                          else newSet.delete(concert.id)
                          setLikedConcertIds(newSet)
                        }}
                      />
                    </div>
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


                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default ConcertsByCity

