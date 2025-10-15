import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 🎓 COMPOSANT DE RECHERCHE DE CONCERTS PAR VILLE
 * 
 * Ce composant montre comment naviguer vers une route dynamique
 * en utilisant une valeur saisie par l'utilisateur.
 */
function CitySearch() {
  // État pour stocker la ville saisie par l'utilisateur
  const [ville, setVille] = useState<string>('')
  
  // Hook pour naviguer programmatiquement (= changer de page dans le code)
  const navigate = useNavigate()

  /**
   * Fonction qui s'exécute quand l'utilisateur clique sur "Rechercher"
   * Elle navigue vers /concerts/[nom-de-la-ville]
   */
  const handleSearch = () => {
    // Vérifier que la ville n'est pas vide
    if (ville.trim() === '') {
      alert('Veuillez entrer un nom de ville')
      return
    }

    // 🎯 Navigation vers la route dynamique
    // Si ville = "Paris", on navigue vers /concerts/Paris
    navigate(`/concerts/${ville}`)
  }

  /**
   * Fonction pour gérer la touche "Entrée" dans l'input
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-white/5 border border-white/40 rounded-xl p-6 shadow-xl w-full max-w-md">
      <h3 className="text-white text-2xl font-bold mb-4">
        🔍 Rechercher des concerts
      </h3>
      
      <div className="flex flex-col gap-4">
        {/* Input pour saisir la ville */}
        <input
          type="text"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ex: Paris, Lyon, Marseille..."
          className="px-4 py-3 rounded-lg border border-white/40 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#CE5526]"
        />
        
        {/* Bouton de recherche */}
        <button
          onClick={handleSearch}
          className="bg-[#CE5526] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#A84320] transition-all shadow-lg"
        >
          Rechercher les concerts
        </button>
      </div>

      {/* Exemples de liens directs */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-white/70 text-sm mb-3">Ou essayez ces villes :</p>
        <div className="flex flex-wrap gap-2">
          {['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux'].map((cityName) => (
            <button
              key={cityName}
              onClick={() => navigate(`/concerts/${cityName}`)}
              className="text-sm px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              {cityName}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CitySearch

