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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      adresse: formData.adresse.trim(),
      website: formData.website.trim(),
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
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
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