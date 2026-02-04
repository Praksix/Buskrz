import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import illusImage from '../assets/illus.jpg'
import { useAuth } from '../contexts/AuthContext'
import { API_URL } from '../config'


interface Lieu {
  id: string
  name: string
  city: string
  adresse: string
  website: string
  status: string
  image: string
}

function LieuDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [lieu, setLieu] = useState<Lieu | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const { user } = useAuth()

  useEffect(() => {
    if (!id) return

    const fetchLieuDetails = async () => {
      try {
        setIsLoading(true)
        setError('')

        const lieuResponse = await fetch(`${API_URL}/api/v1/lieux/${id}`)
        if (!lieuResponse.ok) {
          throw new Error(`Lieu introuvable (Status: ${lieuResponse.status})`)
        }
        const lieuData: Lieu = await lieuResponse.json()
        setLieu(lieuData)

      } catch (err) {
        console.error('Erreur chargement détails lieu:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLieuDetails()
  }, [id])

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

  const handleValidateLieu = async () => {
    if (!lieu) return
    try {
      const response = await fetch(`${API_URL}/api/v1/lieux/${lieu.id}/validate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        setLieu({ ...lieu, status: 'APPROVED' })
      } else {
        alert('Erreur lors de la validation du lieu')
      }
    } catch (error) {
      console.error('Erreur validation:', error)
      alert('Erreur lors de la validation')
    }
  }

  const handleDeleteLieu = async () => {
    if (!lieu || !window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) return
    try {
      const response = await fetch(`${API_URL}/api/v1/lieux/${lieu.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        navigate('/admin')
      } else {
        alert('Erreur lors de la suppression du lieu')
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
      'APPROVED': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Approuvé' },
      'PENDING': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'En attente' },
      'REJECTED': { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Rejeté' }
    }
    const config = statusConfig[status] || { bg: 'bg-gray-500/20', text: 'text-gray-400', label: status }
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm font-medium`}>
        {config.label}
      </span>
    )
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

  if (error || !lieu) {
    return (
      <>
        <Header />
        <div className="flex flex-col justify-center items-center min-h-[50vh] text-white gap-4">
          <div className="text-xl bg-red-100/10 p-6 rounded-lg border border-red-500/50">
            {error || 'Lieu introuvable'}
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
      <Header />

      <div className="flex relative z-0">
        {/* Left Section: Scrollable Content */}
        <div className="w-full md:w-1/2 lg:w-1/2 relative z-10 flex flex-col">
          <div className="flex-grow p-6 md:p-12 lg:p-8 flex flex-col gap-8">
            {/* Back Link */}
            <div>
              <Link
                to="/admin"
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-wide font-medium"
              >
                ← Retour au tableau de bord
              </Link>
            </div>

            {/* Main Info */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 mt-0 leading-tight">
                  {lieu.name}
                </h1>
              </div>
              <div className="mt-2">
                {getStatusBadge(lieu.status)}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-8 py-8 border-t border-white/10 border-b">
              {/* Ville */}
              <div>
                <h3 className="text-[#CE5526] text-xs font-bold uppercase tracking-widest mb-2">Ville</h3>
                <p className="text-white text-xl font-medium">{lieu.city}</p>
              </div>

              {/* Adresse */}
              <div>
                <h3 className="text-[#CE5526] text-xs font-bold uppercase tracking-widest mb-2">Adresse</h3>
                <p className="text-white text-xl font-medium">{lieu.adresse || 'Non spécifiée'}</p>
              </div>

              {/* Site Web */}
              <div>
                <h3 className="text-[#CE5526] text-xs font-bold uppercase tracking-widest mb-2">Site Web</h3>
                {lieu.website ? (
                  <a
                    href={lieu.website.startsWith('http') ? lieu.website : `https://${lieu.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#CE5526] hover:underline text-xl font-medium"
                  >
                    {lieu.website}
                  </a>
                ) : (
                  <p className="text-white/60">Non spécifié</p>
                )}
              </div>

              {/* ID (pour info) */}
              <div>
                <h3 className="text-[#CE5526] text-xs font-bold uppercase tracking-widest mb-2">ID</h3>
                <p className="text-white/60 text-sm font-mono">{lieu.id}</p>
              </div>
            </div>

            {/* CTA Button - Lien vers le site web */}
            {lieu.website && (
              <div className="mt-4">
                <a
                  href={lieu.website.startsWith('http') ? lieu.website : `https://${lieu.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center bg-[#CE5526] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:border-white hover:border-2"
                >
                  Visiter le site web
                </a>
              </div>
            )}

            {/* Admin Actions */}
            {user?.role === 'ADMIN' && (
              <div className="mt-8 pt-8 border-t border-white/10 flex gap-4">
                {lieu.status === 'PENDING' && (
                  <button
                    onClick={handleValidateLieu}
                    className="flex-1 bg-white hover:bg-[#CE5526] text-[#CE5526] font-bold py-3 px-6 rounded-xl transition-colors hover:text-white"
                  >
                    Valider
                  </button>
                )}
                <button
                  onClick={handleDeleteLieu}
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
            src={getImageUrl(lieu.image) || illusImage}
            alt={lieu.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1a1a1a] to-transparent"></div>
        </div>

        {/* Mobile Image (Banner style) */}
        <div className="md:hidden absolute top-0 left-0 w-full h-[47vh] z-0">
          <img
            src={getImageUrl(lieu.image) || illusImage}
            alt={lieu.name}
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

export default LieuDetails
