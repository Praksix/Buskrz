import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Header from '../components/Header';

interface LieuFormData {
  name: string;
  city: string;
  adresse: string;
  website: string;
}

type Message = { type: 'success' | 'error'; text: string } | null;

const initialForm: LieuFormData = {
  name: '',
  city: '',
  adresse: '',
  website: '',
};

function AddLieu() {
  const [formData, setFormData] = useState<LieuFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🖼️ STATE POUR L'IMAGE
  // imageFile : Le fichier sélectionné par l'utilisateur (objet File)
  // imagePreview : URL temporaire pour afficher un aperçu de l'image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      adresse: formData.adresse.trim(),
      website: formData.website.trim(),
      image: imageFile ? await uploadImage(imageFile) : '',
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/lieux', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Une erreur s'est produite lors de l'ajout du lieu.");
      }

      setMessage({
        type: 'success',
        text: 'Lieu ajouté avec succès !',
      });
      setFormData(initialForm);
      // 🖼️ Réinitialiser l'image aussi
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Erreur lors de l’ajout du lieu :', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erreur de connexion au serveur.',
      });
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
            Ajouter un lieu
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Nom du lieu *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/24 px-4 py-2 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="Ex: Le Zénith"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white mb-2">
                Ville *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full bg-white/24 px-4 py-2 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="Ex: Paris"
              />
            </div>

            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-white mb-2">
                Adresse *
              </label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                required
                className="w-full bg-white/24 px-4 py-2 text-white rounded-lg focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="Ex: 28 Rue du Faubourg"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-white mb-2">
                Site web *
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/24 rounded-lg text-white focus:ring-2 focus:ring-[#CE5526] focus:border-transparent outline-none transition-all"
                placeholder="https://exemple.com"
              />
            </div>

            {/* 🖼️ SECTION IMAGE - Input file stylisé */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-white mb-2">
                Image du lieu (optionnel)
              </label>

              {/* Zone de drop/click stylisée */}
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Affichage conditionnel : aperçu ou placeholder */}
                {imagePreview ? (
                  // Si une image est sélectionnée, afficher l'aperçu
                  <div className="relative rounded-lg overflow-hidden border-2 border-[#CE5526]">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-48 object-cover"
                    />
                    {/* Overlay pour indiquer qu'on peut changer l'image */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">Cliquer pour changer</span>
                    </div>
                    {/* Bouton pour supprimer l'image */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Empêcher l'ouverture du sélecteur de fichier
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-20"
                      title="Supprimer l'image"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  // Sinon, afficher le placeholder
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-[#CE5526] transition-colors">
                    <svg
                      className="mx-auto h-12 w-12 text-white/50"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-white/70">
                      Cliquer pour ajouter une image
                    </p>
                    <p className="text-xs text-white/50">
                      PNG, JPG jusqu'à 5 Mo
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#CE5526] py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 hover:bg-[#b54820] disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter le lieu'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-white text-center text-sm font-medium mb-10">
          * Tous les champs sont obligatoires
        </p>
      </div>
    </>
  );
}

export default AddLieu;