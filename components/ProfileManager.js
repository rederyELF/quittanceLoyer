import { useState, useEffect } from 'react';

export default function ProfileManager({ onSelectProfile }) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('profiles');
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
    }
  }, []);

  if (profiles.length === 0) {
    return null;
  }

  const handleDeleteProfile = (id) => {
    try {
      const updatedProfiles = profiles.filter((profile) => profile.id !== id);
      setProfiles(updatedProfiles);
      localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    } catch (error) {
      console.error('Erreur lors de la suppression du profil:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Profils sauvegardés</h2>
        <span className="text-sm text-gray-500">{profiles.length} profil(s)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-500">
                  {profile.type === 'tenant' ? 'Locataire' : 'Bien immobilier'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onSelectProfile(profile)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Utiliser ce profil"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfile(profile.id);
                  }}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Supprimer ce profil"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="truncate">
                {profile.nomLocation} {profile.prenomLocation}
              </p>
              <p className="truncate">{profile.adresse}</p>
              <p className="truncate">
                {profile.codePostal} {profile.ville}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
