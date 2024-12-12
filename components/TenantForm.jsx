import React from 'react';

const TenantForm = ({ nomLocation, prenomLocation, setNomLocation, setPrenomLocation }) => {
  return (
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations du Locataire</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nomLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du Locataire
          </label>
          <input
            type="text"
            id="nomLocation"
            name="nomLocation"
            value={nomLocation}
            onChange={(e) => setNomLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="prenomLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom du Locataire
          </label>
          <input
            type="text"
            id="prenomLocation"
            name="prenomLocation"
            value={prenomLocation}
            onChange={(e) => setPrenomLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default TenantForm;
