import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    lieuId: '',
    date: '',
    time: '',
    prix: '',
    description: '',
    image: '',
    lien: ''
  });

  // 🆕 État pour la liste dynamique d'artistes
  const [artistList, setArtistList] = useState([{ name: '', genre: '' }]);

  const [artistes, setArtistes] = useState<Artiste[]>([]);
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [selectedCity, setSelectedCity] = useState(''); // 🆕 État pour la ville sélectionnée
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 🆕 Liste des villes uniques extraites des lieux
  const availableCities = Array.from(new Set(lieux.map(l => l.city))).sort();

  // 🆕 Filtrer les lieux en fonction de la ville choisie
  const filteredLieux = selectedCity
    ? lieux.filter(l => l.city.toLowerCase() === selectedCity.toLowerCase())
    : [];

  // 🆕 Effet pour réinitialiser le lieu si la ville change et que le lieu n'y appartient plus
  useEffect(() => {
    if (formData.lieuId) {
      const selectedLieu = lieux.find(l => l.id === formData.lieuId);
      if (selectedLieu && selectedLieu.city.toLowerCase() !== selectedCity.toLowerCase()) {
        setFormData(prev => ({ ...prev, lieuId: '' }));
      }
    }
  }, [selectedCity, lieux]);

  // 🖼️ STATE POUR L'IMAGE
  // imageFile : Le fichier sélectionné par l'utilisateur (objet File)
  // imagePreview : URL temporaire pour afficher un aperçu de l'image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  /**
   * 🎸 Gérer le changement d'un artiste ou de son genre
   */
  const handleArtistChange = (index: number, field: 'name' | 'genre', value: string) => {
    const newList = [...artistList];
    newList[index][field] = value;
    setArtistList(newList);
  };

  /**
   * ➕ Ajouter un nouvel artiste à la liste
   */
  const addArtist = () => {
    setArtistList([...artistList, { name: '', genre: '' }]);
  };

  /**
   * ➖ Supprimer un artiste de la liste
   */
  const removeArtist = (index: number) => {
    if (artistList.length > 1) {
      const newList = artistList.filter((_, i) => i !== index);
      setArtistList(newList);
    }
  };

  /**
   * 🖼️ HANDLE IMAGE CHANGE - Gérer la sélection d'une image
   * 
   * Quand l'utilisateur sélectionne un fichier :
   * 1. On stocke le fichier dans imageFile
   * 2. On crée une URL temporaire pour l'aperçu (URL.createObjectURL)
   * 
   * L'aperçu permet à l'utilisateur de voir l'image avant de soumettre
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target.files contient la liste des fichiers sélectionnés
    // On prend le premier fichier (files[0])
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Vérifier que c'est bien une image
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une image (JPG, PNG, etc.)' });
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 5 Mo' });
        return;
      }

      // Stocker le fichier
      setImageFile(file);

      // Créer un aperçu temporaire
      // URL.createObjectURL crée une URL locale qui pointe vers le fichier
      // Cette URL n'existe que dans le navigateur, elle ne va pas sur le serveur
      setImagePreview(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  /**
   * 🚀 UPLOAD IMAGE - Envoyer l'image au serveur
   * 
   * Cette fonction :
   * 1. Crée un FormData (format spécial pour envoyer des fichiers)
   * 2. Envoie le fichier au serveur via POST /api/v1/files/upload
   * 3. Récupère l'ID du fichier stocké dans MongoDB (GridFS)
   * 4. Retourne cet ID
   * 
   * @param file - Le fichier image à uploader
   * @returns L'ID du fichier stocké dans MongoDB
   */
  const uploadImage = async (file: File): Promise<string> => {
    // FormData est un format spécial qui permet d'envoyer des fichiers
    // C'est comme un formulaire HTML avec enctype="multipart/form-data"
    const formData = new FormData();

    // Ajouter le fichier avec la clé "file"
    // Le backend attend un paramètre nommé "file" (@RequestParam("file"))
    formData.append('file', file);

    // Envoyer la requête POST
    // Note : Pas de 'Content-Type' header, le navigateur l'ajoute automatiquement
    const response = await fetch('http://localhost:8080/api/v1/files/upload', {
      method: 'POST',
      body: formData  // FormData, pas JSON !
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    // Le serveur retourne { fileId: "abc123", message: "..." }
    const data = await response.json();

    // Retourner l'ID du fichier
    // Cet ID sera stocké dans concert.image
    return data.fileId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // 🎯 ÉTAPE 1 & 2 : Pour chaque artiste, trouver ou créer avec son genre
      const artisteIds: string[] = [];
      const createdArtistes: string[] = [];

      for (const artistItem of artistList) {
        if (!artistItem.name.trim()) continue;

        try {
          console.log(`🎸 Tentative de création/recherche de l'artiste: ${artistItem.name}, genre: ${artistItem.genre}`);

          // Appeler l'endpoint find-or-create
          const response = await fetch('http://localhost:8080/api/v1/artist-find-or-create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: artistItem.name.trim(),
              genre: artistItem.genre
            })
          });

          if (response.ok) {
            const artiste = await response.json();
            artisteIds.push(artiste.id);

            // Vérifier si c'est un nouvel artiste
            if (!artistes.find(a => a.id === artiste.id)) {
              createdArtistes.push(artistItem.name);
            }
          } else {
            throw new Error(`Erreur lors de la création de l'artiste ${artistItem.name}`);
          }
        } catch (error) {
          console.error(`Erreur pour l'artiste ${artistItem.name}:`, error);
          setMessage({
            type: 'error',
            text: `Erreur lors de la création de l'artiste ${artistItem.name}`
          });
          setIsSubmitting(false);
          return;
        }
      }

      if (artisteIds.length === 0) {
        setMessage({ type: 'error', text: 'Veuillez ajouter au moins un artiste.' });
        setIsSubmitting(false);
        return;
      }

      // 🖼️ ÉTAPE 3 : Uploader l'image si un fichier a été sélectionné
      let imageId = formData.image; // Par défaut, garder l'URL si pas de fichier

      if (imageFile) {
        try {
          setIsUploadingImage(true);
          console.log('📤 Upload de l\'image en cours...');

          // Appeler la fonction d'upload
          // Elle retourne l'ID du fichier stocké dans MongoDB
          imageId = await uploadImage(imageFile);

          console.log('✅ Image uploadée, ID:', imageId);
        } catch (error) {
          console.error('❌ Erreur upload image:', error);
          setMessage({ type: 'error', text: 'Erreur lors de l\'upload de l\'image' });
          setIsSubmitting(false);
          setIsUploadingImage(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // 🎯 ÉTAPE 4 : Créer l'objet concert avec l'ID de l'image
      const concertData = {
        name: formData.name,
        artisteIds: artisteIds,
        lieuId: formData.lieuId,
        date: formData.date,
        time: formData.time,
        prix: formData.prix,
        description: formData.description,
        image: imageId,  // 🖼️ L'ID du fichier GridFS (ou URL si pas d'upload)
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
          lieuId: '',
          date: '',
          time: '',
          prix: '',
          description: '',
          image: '',
          lien: ''
        });

        // 🆕 Réinitialiser la liste d'artistes et la ville
        setArtistList([{ name: '', genre: '' }]);
        setSelectedCity('');

        // 🖼️ Réinitialiser l'image aussi
        setImageFile(null);
        setImagePreview(null);

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
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
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

            {/* 🆕 GESTION DYNAMIQUE DES ARTISTES */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                Artistes et Genres *
              </label>

              {artistList.map((artist, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-start bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={artist.name}
                      onChange={(e) => handleArtistChange(index, 'name', e.target.value)}
                      placeholder="Nom de l'artiste"
                      required
                      className="w-full bg-white/24 px-4 py-2 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <select
                      value={artist.genre}
                      onChange={(e) => handleArtistChange(index, 'genre', e.target.value)}
                      className="w-full px-4 py-2 bg-white/24 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Genre</option>
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
                  </div>
                  {artistList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArtist(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                      title="Supprimer cet artiste"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addArtist}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors py-2"
              >
                <span className="flex items-center justify-center w-5 h-5 bg-[#CE5526] rounded-full text-white text-xs">+</span>
                Ajouter un autre artiste
              </button>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white mb-2">
                Ville *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                list="city-list"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
                className="w-full bg-white/24 px-4 py-2 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="Ex: Paris"
              />
              <datalist id="city-list">
                {availableCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
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
                disabled={!selectedCity}
                className="w-full px-4 py-2 bg-white/24 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all disabled:opacity-50"
              >
                <option value="">
                  {!selectedCity ? 'Choisissez d\'abord une ville' : 'Sélectionnez un lieu'}
                </option>
                {filteredLieux.map((lieu) => (
                  <option key={lieu.id} value={lieu.id}>
                    {lieu.name} - {lieu.city}
                  </option>
                ))}
              </select>
              <p className="text-white/60 text-xs mt-1">
                Le lieu désiré n'existe pas ? <Link to="/add-lieu" className="text-white hover:underline">Ajoute-le</Link>
              </p>
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

            {/* 🖼️ CHAMP IMAGE - Upload de fichier */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-white mb-2">
                Image du concert
              </label>

              {/* Input file caché + bouton stylisé */}
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex items-center justify-center w-full px-4 py-3 bg-white/24 rounded-lg text-white cursor-pointer hover:bg-white/30 transition-all border-2 border-dashed border-white/40"
                >
                  {isUploadingImage ? (
                    <span>Upload en cours...</span>
                  ) : imageFile ? (
                    <span> {imageFile.name}</span>
                  ) : (
                    <span> Cliquez pour sélectionner une image</span>
                  )}
                </label>
              </div>

              {/* Aperçu de l'image sélectionnée */}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-white/60 text-xs mb-2">Aperçu :</p>
                  <img
                    src={imagePreview}
                    alt="Aperçu de l'image"
                    className="h-32 w-auto object-cover rounded-lg border border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="mt-2 text-red-400 text-sm hover:text-red-300"
                  >
                    ❌ Supprimer l'image
                  </button>
                </div>
              )}

              <p className="text-white/60 text-xs mt-2">
                Formats acceptés : JPG, PNG, GIF (max 5 Mo)
              </p>
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