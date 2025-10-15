import { useState, useEffect } from 'react';
import Header from '../components/Header';

interface Artiste {
  id: string;
  name: string;
  genres: string[];
}

interface Lieu {
  id: string;
  name: string;
  city: string;
  adresse: string;
}

interface ConcertFormData {
  name: string;
  artisteNames: string;
  genre: string;          // 🆕 Champ pour le genre musical
  lieuId: string;
  date: string;
  time: string;
  prix: string;
  description: string;
  image: string;
  lien: string;
}

function AddConcert() {
  const [formData, setFormData] = useState<ConcertFormData>({
    name: '',
    artisteNames: '',
    genre: '',              // 🆕 Genre musical initial vide
    lieuId: '',
    date: '',
    time: '',
    prix: '',
    description: '',
    image: '',
    lien: ''
  });

  const [artistes, setArtistes] = useState<Artiste[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Charger les artistes et lieux au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistesRes, lieuxRes] = await Promise.all([
          fetch('http://localhost:8080/api/v1/artistes'),
          fetch('http://localhost:8080/api/v1/lieux')
        ]);

        if (artistesRes.ok && lieuxRes.ok) {
          const artistesData = await artistesRes.json();
          const lieuxData = await lieuxRes.json();
          setArtistes(artistesData);
          setLieux(lieuxData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setMessage({ type: 'error', text: 'Erreur lors du chargement des artistes et lieux.' });
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // 🎯 ÉTAPE 1 : Extraire les noms d'artistes
      const artisteNamesArray = formData.artisteNames
        .split(',')
        .map(name => name.trim())
        .filter(name => name !== '');

      // 🎯 ÉTAPE 2 : Pour chaque artiste, trouver ou créer avec le genre
      const artisteIds: string[] = [];
      const createdArtistes: string[] = [];

      for (const name of artisteNamesArray) {
        try {
          console.log(`🎸 Tentative de création/recherche de l'artiste: ${name}, genre: ${formData.genre}`);
          
          // Appeler l'endpoint find-or-create
          const response = await fetch('http://localhost:8080/api/v1/artist-find-or-create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name,
              genre: formData.genre
            })
          });
          
          console.log(`📡 Response status: ${response.status}`);

          if (response.ok) {
            const artiste = await response.json();
            artisteIds.push(artiste.id);
            
            // Vérifier si c'est un nouvel artiste (pas dans la liste actuelle)
            if (!artistes.find(a => a.id === artiste.id)) {
              createdArtistes.push(name);
            }
          } else {
            throw new Error(`Erreur lors de la création de l'artiste ${name}`);
          }
        } catch (error) {
          console.error(`Erreur pour l'artiste ${name}:`, error);
          setMessage({ 
            type: 'error', 
            text: `Erreur lors de la création de l'artiste ${name}` 
          });
          setIsSubmitting(false);
          return;
        }
      }

      const concertData = {
        name: formData.name,
        artisteIds: artisteIds,
        lieuId: formData.lieuId,
        date: formData.date,
        time: formData.time,
        prix: formData.prix,
        description: formData.description,
        image: formData.image,
        lien: formData.lien
      };

      const response = await fetch('http://localhost:8080/api/v1/concerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(concertData)
      });

      if (response.ok) {
        // 🎉 Message de succès avec info sur les artistes créés
        let successMsg = 'Concert ajouté avec succès !';
        if (createdArtistes.length > 0) {
          successMsg += ` Artiste(s) créé(s) : ${createdArtistes.join(', ')}`;
        }
        setMessage({ type: 'success', text: successMsg });
        
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          artisteNames: '',
          genre: '',          // 🆕 Réinitialiser le genre
          lieuId: '',
          date: '',
          time: '',
          prix: '',
          description: '',
          image: '',
          lien: ''
        });

        // Recharger la liste des artistes pour inclure les nouveaux
        const artistesRes = await fetch('http://localhost:8080/api/v1/artistes');
        if (artistesRes.ok) {
          const artistesData = await artistesRes.json();
          setArtistes(artistesData);
        }
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de l\'ajout du concert.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full m-auto px-4">
        <div className="flex flex-col items-center justify-center w-full mt-20 mb-10">
          <h2 className="text-white text-5xl md:text-6xl font-thin text-center m-0">
            Ajouter un concert
          </h2>
        </div>

        <div className="w-full max-w-2xl bg-white/24 rounded-lg border border-gray-300 shadow-lg p-8 mb-10">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 ">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Nom du concert *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/24 px-4 py-2 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="Ex: Festival Rock 2024"
              />
            </div>

            <div>
              <label htmlFor="artisteNames" className="block text-sm font-medium text-white mb-2">
                Noms des artistes (séparés par des virgules)
              </label>
              <input
                type="text"
                id="artisteNames"
                name="artisteNames"
                value={formData.artisteNames}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/24 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="Ex: The Rolling Stones, AC/DC, Metallica"
              />
              <p className="text-white/60 text-xs mt-1">
                💡 Si un artiste n'existe pas, il sera créé automatiquement
              </p>
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-white mb-2">
                Genre musical 🎸
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/24 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
              >
                <option value="">Sélectionnez un genre</option>
                <option value="Rock">Rock</option>
                <option value="Punk">Punk</option>
                <option value="Pop">Pop</option>
                <option value="Jazz">Jazz</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Électro">Électro</option>
                <option value="Techno">Techno</option>
                <option value="Metal">Metal</option>
                <option value="Reggae">Reggae</option>
                <option value="Blues">Blues</option>
                <option value="Classique">Classique</option>
                <option value="Folk">Folk</option>
                <option value="R&B">R&B</option>
                <option value="Soul">Soul</option>
                <option value="Funk">Funk</option>
                <option value="Indie">Indie</option>
                <option value="Alternatif">Alternatif</option>
                <option value="Autre">Autre</option>
              </select>
              <p className="text-white/60 text-xs mt-1">
                💡 Ce genre sera associé aux nouveaux artistes créés
              </p>
            </div>

            <div>
              <label htmlFor="lieuId" className="block text-sm font-medium text-white mb-2">
                Lieu du concert *
              </label>
              <select
                id="lieuId"
                name="lieuId"
                value={formData.lieuId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/24 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
              >
                <option value="">Sélectionnez un lieu</option>
                {lieux.map((lieu) => (
                  <option key={lieu.id} value={lieu.id}>
                    {lieu.name} - {lieu.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-white mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 bg-white/24 py-2 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-white mb-2">
                  Heure
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 bg-white/24 py-2 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="prix" className="block text-sm font-medium text-white mb-2">
                Prix
              </label>
              <input
                type="text"
                id="prix"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                className="w-full px-4 bg-white/24 py-2 rounded-lg text-white focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="Ex: 25€"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-white/24 rounded-lg text-white focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Décrivez le concert..."
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-white mb-2">
                URL de l'image
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/24 rounded-lg text-white focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="https://exemple.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="lien" className="block text-sm font-medium text-white mb-2">
                Lien vers le concert
              </label>
              <input
                type="url"
                id="lien"
                name="lien"
                value={formData.lien}
                onChange={handleChange}
                className="w-full px-4 bg-white/24 py-2 rounded-lg text-white focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="https://exemple.com/concert"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#CE5526] bg-white text-orange-500 py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 hover:bg-[#b54820] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter le concert'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-white text-center text-sm font-medium mb-10">
          * Champs obligatoires
        </p>
      </div>
    </>
  );
}

export default AddConcert;