import { useState } from 'react'

interface ConnectionStatus {
  isLoading: boolean
  message: string
  isSuccess: boolean
}

function ConnectionTest() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isLoading: false,
    message: '',
    isSuccess: false
  })

  const testConnection = async () => {
    setStatus({
      isLoading: true,
      message: 'Test en cours...',
      isSuccess: false
    })

    try {
      const response = await fetch('http://localhost:8080/api/v1/health/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStatus({
          isLoading: false,
          message: `✅ Connexion réussie ! ${data.message || 'Backend opérationnel'}`,
          isSuccess: true
        })
      } else {
        setStatus({
          isLoading: false,
          message: `❌ Erreur serveur (${response.status}): ${response.statusText}`,
          isSuccess: false
        })
      }
    } catch (error) {
      let errorMessage = '❌ Connexion échouée'
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = '❌ Serveur non accessible - Vérifiez que le backend est démarré sur le port 8080'
      } else if (error instanceof Error) {
        errorMessage = `❌ Erreur: ${error.message}`
      }

      setStatus({
        isLoading: false,
        message: errorMessage,
        isSuccess: false
      })
    }
  }

  return (
    <div className="height-300 width-600 border-1 bg-white/5 shadow-xl border-white-40 rounded-xl p-10">
      <button 
        onClick={testConnection} 
        disabled={status.isLoading}
        className={`bg-white border-1 border-white-40 rounded-lg p-2 text-[#CE5526] shadow-xl p-4 ${
          status.isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
        }`}
      >
        {status.isLoading ? 'Test en cours...' : 'Tester la connexion'}
      </button>
      
      {status.message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          status.isSuccess 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  )
}

export default ConnectionTest
