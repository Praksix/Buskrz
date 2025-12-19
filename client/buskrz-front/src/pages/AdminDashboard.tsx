import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

interface Concert {
    id: string;
    name: string;
    date: string;
    ville?: string;
}

interface Lieu {
    id: string;
    name: string;
    city: string;
}

interface UserData {
    id: string;
    email: string;
    role: string;
}

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [pendingConcerts, setPendingConcerts] = React.useState<Concert[]>([]);
    const [pendingLieux, setPendingLieux] = React.useState<Lieu[]>([]);
    const [Concerts, setConcerts] = React.useState<Concert[]>([]);
    const [lieux, setLieux] = React.useState<Lieu[]>([]);
    const [users, setUsers] = React.useState<UserData[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchPendingConcerts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/concerts/status/PENDING');
                if (response.ok) {
                    const data = await response.json();
                    setPendingConcerts(data);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des concerts en attente", error);
            } finally {
                setIsLoading(false);
            }
        };


        const fetchConcerts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/concerts');
                if (response.ok) {
                    const data = await response.json();
                    setConcerts(data);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des concerts", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchPendingLieux = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/lieux/status/PENDING');
                if (response.ok) {
                    const data = await response.json();
                    setPendingLieux(data);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des lieux en attente", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchLieux = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/lieux');
                if (response.ok) {
                    const data = await response.json();
                    setLieux(data);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des lieux", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/v1/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des utilisateurs", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === 'ADMIN') {
            fetchPendingConcerts();
            fetchConcerts();
            fetchPendingLieux();
            fetchLieux();
            fetchUsers();
        }
    }, [user]);

    // Protection basique au niveau du rendu (la protection principale sera via les routes)
    if (!user || user.role !== 'ADMIN') {
        return (
            <>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h1>
                    <p>Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <main className="flex-grow container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center font-['Outfit']">
                        Tableau de Bord Administrateur
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Section Gestion */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <h2 className="text-2xl font-semibold mb-4 text-[#CE5526]">{pendingConcerts.length} concerts en attente</h2>
                            <p className="text-gray-600 mb-4">
                                Liste des concerts nécessitant une validation.
                            </p>

                            {isLoading ? (
                                <p>Chargement...</p>
                            ) : pendingConcerts.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingConcerts.map((concert) => (
                                        <div
                                            key={concert.id}
                                            onClick={() => navigate(`/concert/${concert.id}`, { state: { fromAdmin: true } })}
                                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center group"
                                        >
                                            <div>
                                                <div className="font-semibold text-gray-800 group-hover:text-[#CE5526] transition-colors">{concert.name}</div>
                                                <div className="text-sm text-gray-500">{concert.date} à {concert.ville || 'Ville inconnue'}</div>
                                            </div>
                                            <span className="text-gray-400">→</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                                    <p className="text-sm text-green-700">
                                        Aucun concert en attente.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <h2 className="text-2xl font-semibold mb-4 text-[#CE5526]">{pendingLieux.length} lieux en attente</h2>
                            <p className="text-gray-600 mb-4">
                                Liste des lieux nécessitant une validation.
                            </p>

                            {isLoading ? (
                                <p>Chargement...</p>
                            ) : pendingLieux.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingLieux.map((lieu) => (
                                        <div
                                            key={lieu.id}
                                            onClick={() => navigate(`/lieux/${lieu.id}`, { state: { fromAdmin: true } })}
                                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center group"
                                        >
                                            <div>
                                                <div className="font-semibold text-gray-800 group-hover:text-[#CE5526] transition-colors">{lieu.name}</div>
                                                <div className="text-sm text-gray-500">{lieu.city}</div>
                                            </div>
                                            <span className="text-gray-400">→</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                                    <p className="text-sm text-green-700">
                                        Aucun lieu en attente.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Section Stats (Exemple) */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <h2 className="text-2xl font-semibold mb-4 text-[#CE5526]">Statistiques</h2>
                            <p className="text-gray-600">
                                Vue d'ensemble de l'activité sur Buskrz.
                            </p>
                            <p>Nombre de concerts à venir : {Concerts.length}</p>
                            <p>Nombre de lieux recensés: {lieux.length}</p>
                            <p>Nombre d'utilisateurs: {users.length}</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;
