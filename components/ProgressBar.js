import { useEffect, useState } from 'react';

const fields = [
  { key: 'nom', label: 'Nom du propriétaire' },
  { key: 'prenom', label: 'Prénom du propriétaire' },
  { key: 'nomLocation', label: 'Nom du locataire' },
  { key: 'prenomLocation', label: 'Prénom du locataire' },
  { key: 'adresse', label: 'Adresse' },
  { key: 'codePostal', label: 'Code postal' },
  { key: 'ville', label: 'Ville' },
  { key: 'datePayment', label: 'Date de paiement' },
  { key: 'loyerAmount', label: 'Montant du loyer' },
  { key: 'chargesAmount', label: 'Montant des charges' },
  { key: 'sign', label: 'Signature' }
];

export default function ProgressBar({ formData }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const filledFields = fields.filter(field => Boolean(formData[field.key]));
    const percentage = Math.round((filledFields.length / fields.length) * 100);
    setProgress(percentage);

    if (percentage === 0) {
      setStatus('Commencez à remplir le formulaire');
    } else if (percentage < 50) {
      setStatus('Continuez, vous avancez bien !');
    } else if (percentage < 100) {
      setStatus('Presque terminé !');
    } else {
      setStatus('Formulaire complet !');
    }
  }, [formData]);

  const getProgressColor = () => {
    if (progress < 33) return 'bg-red-500';
    if (progress < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      {/* En-tête cliquable */}
      <button
        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Progression du formulaire
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${progress === 100 ? 'bg-green-100 text-green-800' :
            progress > 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
            {progress}%
          </span>
        </div>

        {/* Icône de toggle */}
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Barre de progression toujours visible */}
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Détails dépliables */}
      <div className={`mt-4 transition-all duration-300 overflow-hidden ${isDetailsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <p className="text-sm text-gray-600 mb-4">{status}</p>

        {/* Grille responsive des champs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {fields.map((field) => (
            <div
              key={field.key}
              className={`flex items-center space-x-2 p-2 rounded ${formData[field.key] ? 'bg-green-50' : 'bg-gray-50'
                }`}
            >
              <svg
                className={`w-4 h-4 flex-shrink-0 ${formData[field.key] ? 'text-green-500' : 'text-gray-300'
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className={`text-sm ${formData[field.key] ? 'text-gray-700' : 'text-gray-400'
                }`}>
                {field.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
