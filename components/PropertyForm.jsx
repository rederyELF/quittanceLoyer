import React from 'react';

const PropertyForm = ({ adresse, codePostal, ville, setAdresse, setCodePostal, setVille }) => {
  return (
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations sur le Logement</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse du logement loué
          </label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700 mb-1">
            Code Postal du logement loué
          </label>
          <input
            type="text"
            id="codePostal"
            name="codePostal"
            value={codePostal}
            onChange={(e) => setCodePostal(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
            Ville du logement loué
          </label>
          <input
            type="text"
            id="ville"
            name="ville"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
