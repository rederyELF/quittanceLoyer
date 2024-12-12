import React from 'react';

const OwnerForm = ({ nom, prenom, onNomChange, onPrenomChange }) => {
  return (
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations du Propriétaire</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du propriétaire
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={nom}
            onChange={onNomChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom du propriétaire
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={prenom}
            onChange={onPrenomChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerForm;
