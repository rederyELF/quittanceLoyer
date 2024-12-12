import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Stats from '../components/Stats';
import Footer from '../components/Footer';

export default function Historique() {
  const [quittances, setQuittances] = useState([]);
  const [filteredQuittances, setFilteredQuittances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    // Charger les quittances depuis le localStorage
    const loadQuittances = () => {
      const saved = localStorage.getItem('quittances_history');
      return saved ? JSON.parse(saved) : [];
    };
    setQuittances(loadQuittances());
  }, []);

  // Calculer les statistiques
  const stats = {
    totalQuittances: quittances.length,
    totalAmount: quittances.reduce((sum, q) => sum + (Number(q.loyerAmount) + Number(q.chargesAmount)), 0),
    thisMonth: quittances.filter(q => new Date(q.datePayment).getMonth() === new Date().getMonth()).length,
    uniqueTenants: new Set(quittances.map(q => q.nomLocation + q.prenomLocation)).size
  };

  // Filtrer et trier les quittances
  useEffect(() => {
    let filtered = [...quittances];
    
    // Appliquer la recherche
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.nomLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.prenomLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.adresse.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Appliquer le tri
    filtered.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.datePayment) - new Date(b.datePayment)
          : new Date(b.datePayment) - new Date(a.datePayment);
      }
      return 0;
    });

    setFilteredQuittances(filtered);
  }, [quittances, searchTerm, sortConfig]);

  return (
    <>
      <Head>
        <title>Historique des quittances | Générateur de Quittance de Loyer</title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Historique des quittances
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Consultez et gérez toutes vos quittances générées
            </p>
          </div>

          <Stats data={stats} />

          {/* Barre de recherche et filtres */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par locataire ou adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setSortConfig({
                key: 'date',
                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
              })}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Trier par date
            </button>
          </div>

          {/* Liste des quittances */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Locataire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuittances.map((quittance, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(quittance.datePayment).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {quittance.nomLocation} {quittance.prenomLocation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quittance.adresse}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quittance.codePostal} {quittance.ville}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Number(quittance.loyerAmount) + Number(quittance.chargesAmount)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => window.open(`/api/pdf?id=${index}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Voir PDF
                      </button>
                      <button
                        onClick={() => {/* Logique de suppression */}}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
