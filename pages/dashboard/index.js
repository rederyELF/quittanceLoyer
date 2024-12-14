import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { supabase } from '../../utils/supabase';
import { FiFileText, FiUsers, FiCalendar } from 'react-icons/fi';
import ProfileManager from '../../components/ProfileManager';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuittances: 0,
    monthlyQuittances: 0,
    savedProfiles: 0
  });
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [recentQuittances, setRecentQuittances] = useState([]);

  useEffect(() => {
    if (user) {
      loadStats();
      loadProfiles();
      loadRecentQuittances();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      // Charger les statistiques depuis Supabase
      const { data: quittances, error: quittancesError } = await supabase
        .from('quittances')
        .select('created_at')
        .eq('user_id', user.id);

      if (quittancesError) throw quittancesError;

      const currentMonth = new Date().getMonth();
      const monthlyQuittances = quittances.filter(q => 
        new Date(q.created_at).getMonth() === currentMonth
      ).length;

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id);

      if (profilesError) throw profilesError;

      setStats({
        totalQuittances: quittances.length,
        monthlyQuittances,
        savedProfiles: profiles.length
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_saves')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedProfiles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
    }
  };

  const loadRecentQuittances = async () => {
    try {
      const { data, error } = await supabase
        .from('quittances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentQuittances(data);
    } catch (error) {
      console.error('Erreur lors du chargement des quittances récentes:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenue sur votre espace personnel
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiFileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Quittances
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalQuittances}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiCalendar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Quittances ce mois
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.monthlyQuittances}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Profils enregistrés
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.savedProfiles}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des profils enregistrés */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Profils enregistrés
            </h3>
            <ProfileManager 
              profiles={savedProfiles}
              onDeleteProfile={async (profileId) => {
                try {
                  const { error } = await supabase
                    .from('profile_saves')
                    .delete()
                    .eq('id', profileId)
                    .eq('user_id', user.id);
                  
                  if (error) throw error;
                  
                  setSavedProfiles(savedProfiles.filter(p => p.id !== profileId));
                  // Mettre à jour les stats
                  setStats(prev => ({
                    ...prev,
                    savedProfiles: prev.savedProfiles - 1
                  }));
                } catch (error) {
                  console.error('Erreur lors de la suppression:', error);
                }
              }}
              hideSelect={true} // Nouvelle prop pour masquer le bouton de sélection
            />
          </div>
        </div>

        {/* Section des quittances récentes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Dernières quittances générées
              </h3>
              <a
                href="/dashboard/quittances"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Voir toutes les quittances
              </a>
            </div>

            {recentQuittances.length > 0 ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Locataire
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Montant
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Adresse
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentQuittances.map((quittance) => (
                      <tr key={quittance.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {quittance.nom_location} {quittance.prenom_location}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {(quittance.loyer_amount + quittance.charges_amount).toFixed(2)} €
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(quittance.date_payment).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {quittance.adresse}, {quittance.code_postal} {quittance.ville}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Aucune quittance générée pour le moment
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Actions rapides
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <a
                  href="/dashboard/quittances/new"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Nouvelle quittance
                </a>
              </div>
              <div>
                <a
                  href="/profile"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Gérer mon profil
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
