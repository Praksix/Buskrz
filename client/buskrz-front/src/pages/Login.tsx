import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import heroBackground from '../assets/hero.png';

const Login: React.FC = () => {
  // États pour les champs du formulaire
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Hooks
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer l'URL de redirection depuis les query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';
  
  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Appeler la fonction login du contexte
      await login(email, password);
      
      // La redirection se fera automatiquement grâce au useEffect
    } catch (error) {
      // Afficher l'erreur
      setError(error instanceof Error ? error.message : 'Identifiants incorrects');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center w-full">
        <section className="relative w-full overflow-hidden isolate min-h-screen">
          <img
            src={heroBackground}
            alt="Foule assistant à un concert"
            className="absolute inset-0 h-full w-full object-cover -z-20"
          />
          <div className="absolute inset-0 bg-black/60 -z-10" />
          
          <div className="relative flex flex-col items-center justify-center w-full px-4 py-24 z-10">
            <div className="flex flex-col items-center justify-center w-full mb-10">
              <h2 className="text-white text-5xl md:text-6xl font-light text-center m-0">
                Connexion
              </h2>
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-8 mb-10">
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/20 backdrop-blur-sm text-red-200 border border-red-400/50">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-[#CE5526] focus:border-[#CE5526] outline-none transition-all placeholder:text-white/50"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-[#CE5526] focus:border-[#CE5526] outline-none transition-all placeholder:text-white/50"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#CE5526] hover:bg-[#A84320] text-white py-3 px-6 rounded-lg font-medium text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-white text-sm">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-[#CE5526] hover:text-[#A84320] hover:underline transition-colors">
                      S'inscrire
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;

