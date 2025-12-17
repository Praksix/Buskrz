import { useState, useEffect, useCallback } from 'react'

interface LocationData {
  ip: string
  city: string
  region: string
  country: string
  countryCode: string
  timezone: string
  isp: string
  latitude: number
  longitude: number
}

interface LocationStatus {
  isLoading: boolean
  data: LocationData | null
  error: string | null
}

// 🆕 Props pour recevoir le callback du composant parent
interface LocationDetectorProps {
  onLocationDetected?: (city: string) => void  // Fonction appelée quand la ville est détectée
}

interface IpApiCoResponse {
  ip: string
  city: string
  region: string
  country_name: string
  country_code: string
  timezone: string
  org: string
  latitude: number
  longitude: number
}

interface IpApiComResponse {
  query: string
  city: string
  regionName: string
  country: string
  countryCode: string
  timezone: string
  isp: string
  lat: number
  lon: number
}

function LocationDetector({ onLocationDetected }: LocationDetectorProps = {}) {
  const [status, setStatus] = useState<LocationStatus>({
    isLoading: false,
    data: null,
    error: null
  })

  const detectLocation = useCallback(async () => {
    setStatus({
      isLoading: true,
      data: null,
      error: null
    })

    // Liste des APIs de géolocalisation à essayer en cas d'échec
    const apis = [
      {
        name: 'ipapi.co',
        url: 'https://ipapi.co/json/',
        parser: (data: IpApiCoResponse): LocationData => ({
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          countryCode: data.country_code,
          timezone: data.timezone,
          isp: data.org,
          latitude: data.latitude,
          longitude: data.longitude
        })
      },
      {
        name: 'ip-api.com',
        url: 'http://ip-api.com/json/',
        parser: (data: IpApiComResponse): LocationData => ({
          ip: data.query,
          city: data.city,
          region: data.regionName,
          country: data.country,
          countryCode: data.countryCode,
          timezone: data.timezone,
          isp: data.isp,
          latitude: data.lat,
          longitude: data.lon
        })
      }
    ]

    for (const api of apis) {
      try {
        console.log(`Tentative avec ${api.name}...`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // Timeout de 10 secondes

        const response = await fetch(api.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          mode: 'cors'
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status} avec ${api.name}`)
        }

        const data = await response.json()

        if (data.error || data.status === 'fail') {
          throw new Error(data.reason || data.message || `Erreur avec ${api.name}`)
        }

        const locationData = api.parser(data)

        console.log(`✅ Localisation détectée avec ${api.name}:`, locationData.city)

        setStatus({
          isLoading: false,
          data: locationData,
          error: null
        })

        // 🆕 Appeler le callback pour informer le parent de la ville détectée
        if (onLocationDetected && locationData.city) {
          onLocationDetected(locationData.city)
        }

        return // Succès, on sort de la boucle

      } catch (error) {
        console.warn(`❌ Échec avec ${api.name}:`, error)

        // Si c'est la dernière API, on affiche l'erreur
        if (api === apis[apis.length - 1]) {
          let errorMessage = '❌ Impossible de détecter la localisation'

          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              errorMessage = '❌ Timeout - Vérifiez votre connexion réseau'
            } else if (error.message.includes('CORS') || error.message.includes('blocked')) {
              errorMessage = '❌ Erreur CORS - Problème de sécurité réseau'
            } else {
              errorMessage = `❌ ${error.message}`
            }
          }

          setStatus({
            isLoading: false,
            data: null,
            error: errorMessage
          })
        }
      }
    }
  }, [onLocationDetected])

  // Détection automatique au chargement du composant
  useEffect(() => {
    detectLocation()
  }, [detectLocation])

  return (
    <div className="height-300 width-1000 backdrop-blur p-4 pb-2 vertical-align:middle pl-40 pr-40 pt-5 pb-5">
      {status.isLoading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-white text-sm">Détection de votre localisation...</span>
        </div>
      )}

      {status.data && (
        <h3 className="text-white text-lg font-semibold mb-1">
          <span className="font-thin italic">Vous êtes à </span>
          <span className="font-light italic">{status.data.city}</span>
        </h3>
      )}

      {status.error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm mb-2">{status.error}</p>
          <button
            onClick={detectLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            🔄 Réessayer
          </button>
        </div>
      )}
    </div>
  )
}

export default LocationDetector
