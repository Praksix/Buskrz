import { useState, useEffect } from 'react'

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

function LocationDetector() {
  const [status, setStatus] = useState<LocationStatus>({
    isLoading: false,
    data: null,
    error: null
  })

  const detectLocation = async () => {
    setStatus({
      isLoading: true,
      data: null,
      error: null
    })

    try {
      // Utilisation de l'API ipapi.co qui est gratuite et ne nécessite pas de clé API
      const response = await fetch('https://ipapi.co/json/')
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.reason || 'Erreur lors de la récupération des données')
      }

      setStatus({
        isLoading: false,
        data: {
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          countryCode: data.country_code,
          timezone: data.timezone,
          isp: data.org,
          latitude: data.latitude,
          longitude: data.longitude
        },
        error: null
      })
    } catch (error) {
      let errorMessage = '❌ Erreur lors de la détection de localisation'
      
      if (error instanceof Error) {
        errorMessage = `❌ ${error.message}`
      }

      setStatus({
        isLoading: false,
        data: null,
        error: errorMessage
      })
    }
  }

  // Détection automatique au chargement du composant
  useEffect(() => {
    detectLocation()
  }, [])

  return (
    <div className="height-300 width-600 p-0">
        {status.data && (
      <h3 className="text-white text-xl text-left  font-light mb-4">Vous êtes à <span className="font-medium">{status.data.city}</span></h3>
      )}
      
    </div>
  )
}

export default LocationDetector
