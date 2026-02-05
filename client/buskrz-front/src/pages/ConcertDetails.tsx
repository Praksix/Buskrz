import { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import illusImage from '../assets/illus.jpg'
import LikeButton from '../components/LikeButton'
import { useAuth } from '../contexts/AuthContext'
import { API_URL } from '../config'


interface Concert {
  id: string
  name: string
  artisteIds: string[]
  lieuId: string
  date: string
  time: string
  prix: string
  description: string
  image: string
  lien: string
  status: string
}

interface Artiste {
  id: string
  name: string
  genres: string[]
}

interface Lieu {
  id: string
  name: string
  adresse: string
  ville: string
}

const fetchArtisteById = async (artisteId: string): Promise<Artiste | null> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/artistes/${artisteId}`)
    if (!response.ok) return null
    return await response.json()
  } catch (err) {
    console.error(`Erreur artiste ${artisteId}:`, err)
    return null
  }
}

const fetchLieuById = async (lieuId: string): Promise<Lieu | null> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/lieux/${lieuId}`)
    if (!response.ok) return null
    return await response.json()
  } catch (err) {
    console.error(`Erreur lieu ${lieuId}:`, err)
    return null
  }
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
  return `${API_URL}/api/v1/files/${imageField}`
}

function ConcertDetails() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const fromCity = location.state?.fromCity
  const fromAdmin = location.state?.fromAdmin
  const fromLiked = location.state?.fromLiked

  const [concert, setConcert] = useState<Concert | null>(null)
  const [lieu, setLieu] = useState<Lieu | null>(null)
  const [artistes, setArtistes] = useState<Artiste[]>([])
  const [likedConcertIds, setLikedConcertIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!id) return

    const fetchConcertDetails = async () => {
      try {
        setIsLoading(true)
        setError('')

        // 1. Fetch Concert
        const concertResponse = await fetch(`${API_URL}/api/v1/concerts/${id}`)
        if (!concertResponse.ok) {
          throw new Error(`Concert introuvable (Status: ${concertResponse.status})`)
        }
        const concertData: Concert = await concertResponse.json()
        setConcert(concertData)

        // 2. Fetch Lieu
        if (concertData.lieuId) {
          const lieuData = await fetchLieuById(concertData.lieuId)
          setLieu(lieuData)
        }

        // 3. Fetch Artistes
        if (concertData.artisteIds && concertData.artisteIds.length > 0) {
          const artistesPromises = concertData.artisteIds.map(id => fetchArtisteById(id))
          const artistesResults = await Promise.all(artistesPromises)
          setArtistes(artistesResults.filter((a): a is Artiste => a !== null))
        }

      } catch (err) {
        console.error('Erreur chargement détails concert:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }

    fetchConcertDetails()
  }, [id])

  // Fetch users liked concerts to check if current concert is liked
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const fetchLikedConcerts = async () => {
        try {
          const response = await fetch(`${API_URL}/api/v1/users/${user.id}/concerts/liked`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    }
  }, [isAuthenticated, user?.id])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    if (dateString.includes('-') && dateString.split('-').length === 3) {
      const parts = dateString.split('-')
      return `${parts[2]}.${parts[1]}.${parts[0]}`
    }
    return dateString
  }

  const handleValidateConcert = async () => {
    if (!concert) return
    try {
      const response = await fetch(`${API_URL}/api/v1/concerts/${concert.id}/validate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        setConcert({ ...concert, status: 'APPROVED' })
      } else {
        alert('Erreur lors de la validation du concert')
      }
    } catch (error) {
      console.error('Erreur validation:', error)
      alert('Erreur lors de la validation')
    }
  }

  const handleDeleteConcert = async () => {
    if (!concert || !window.confirm('Êtes-vous sûr de vouloir supprimer ce concert ?')) return
    try {
      const response = await fetch(`${API_URL}/api/v1/concerts/${concert.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        navigate(fromAdmin ? '/admin' : '/')
      } else {
        alert('Erreur lors de la suppression du concert')
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return ''
    const parts = timeString.split(':')
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeString
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[50vh] text-white text-xl">
          Chargement...
        </div>
      </>
    )
  }

  if (error || !concert) {
    return (
      <>
        <Header />
        <div className="flex flex-col justify-center items-center min-h-[50vh] text-white gap-4">
          <div className="text-xl bg-red-100/10 p-6 rounded-lg border border-red-500/50">
            {error || 'Concert introuvable'}
          </div>
          <Link to="/" className="text-[#CE5526] hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]/70">

      {/* Full Width Header */}
      <Header />

      <div className="flex relative z-0">

        {/* Left Section: Scrollable Content */}
        <div className="w-full md:w-1/2 lg:w-1/2 relative z-10 flex flex-col">

          <div className="flex-grow p-6 md:p-12 lg:p-8 flex flex-col gap-8">
            {/* Back Link */}
            <div>
              <Link
                to={fromAdmin ? '/admin' : (fromLiked ? '/concerts/liked' : (fromCity ? `/concerts/${fromCity}` : (lieu ? `/concerts/${lieu.ville}` : '/')))}
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-wide font-medium"
              >
                ← Retour {fromAdmin ? 'au tableau de bord' : (fromLiked ? 'aux favoris' : (fromCity ? `à ${fromCity}` : (lieu && `à ${lieu.ville}`)))}
              </Link>
            </div>

            {/* Main Info */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 mt-0 leading-tight">
                  {concert.name}
                </h1>
                <div className="mt-2">
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

              <div className="flex flex-wrap gap-2 text-white/60 text-lg md:text-xl justify-center">
                {artistes.map((artiste, idx) => (
                  <span key={artiste.id}>
                    {idx > 0 && " • "} {artiste.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Info Grid - Re-styled for sidebar feel */}
            <div className="grid grid-cols-1 gap-8 py-8 border-t border-white/10 border-b">

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[#CE5526] text-xs font-bold uppercase tracking-widest mb-2">Date & Heure</h3>
                  <p className="text-white text-xl font-medium">{formatDate(concert.date)}</p>
                  <p className="text-white/70">{formatTime(concert.time)}</p>
                </div>

                <div>
                  <h3 className="text-[#CE5526] text-xs font-bold uppercase tracking-widest mb-2">Prix</h3>
                  <p className="text-white text-xl font-medium">
                    {concert.prix ? `${concert.prix}€` : "Gratuit"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-[#CE5526] text-xs font-bold uppercase tracking-widest mb-2">Lieu</h3>
                {lieu ? (
                  <>
                    <Link to={`/lieux/${lieu.id}`} className="text-[#CE5526] hover:underline">
                      <p className="text-white text-xl font-medium">{lieu.name}</p>
                      <p className="text-white/70">{lieu.adresse}, {lieu.ville}</p>
                    </Link>
                  </>
                ) : (
                  <p className="text-white/60">Lieu inconnu</p>
                )}
              </div>

              <div>
                <h3 className="text-[#CE5526] text-xs font-bold uppercase tracking-widest mb-2">Genres</h3>
                <p className="text-white/80 leading-relaxed">
                  {artistes.flatMap(a => a.genres).join(', ') || 'Non spécifié'}
                </p>
              </div>
            </div>

            {/* Description */}
            {concert.description && (
              <div>
                <h3 className="text-white font-semibold text-xl mb-4">À propos</h3>
                <p className="text-white/70 leading-relaxed text-lg">
                  {concert.description}
                </p>
              </div>
            )}

            {/* CTA Button */}
            {concert.lien && (
              <div className="mt-4">
                <a
                  href={concert.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center bg-[#CE5526] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:border-white hover:border-2"
                >
                  Réserver / Plus d'infos
                </a>
              </div>
            )}

            {/* Admin Actions */}
            {user?.role === 'ADMIN' && (
              <div className="mt-8 pt-8 border-t border-white/10 flex gap-4">
                {concert.status === 'PENDING' && (
                  <button
                    onClick={handleValidateConcert}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    Valider
                  </button>
                )}
                <button
                  onClick={handleDeleteConcert}
                  className="flex-1 bg-grey-600 border border-white-600 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Supprimer
                </button>
              </div>
            )}

            {/* Spacer for bottom scrolling */}
            <div className="h-20"></div>
          </div>
        </div>

        {/* Right Section: Fixed Image */}
        <div className="hidden md:block fixed right-0 top-0 w-1/2 lg:w-1/2 h-screen z-0">
          <img
            src={getImageUrl(concert.image)}
            alt={concert.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1a1a1a] to-transparent"></div>
        </div>

        {/* Mobile Image (Banner style) */}
        <div className="md:hidden absolute top-0 left-0 w-full h-[47vh] z-0">
          <img
            src={getImageUrl(concert.image)}
            alt={concert.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]"></div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .flex-grow.p-6 {
              padding-top: 30vh;
            }
          }
        `}</style>

      </div>
    </div>
  )
}

export default ConcertDetails
