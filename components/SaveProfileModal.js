import React, { useState } from 'react';

export default function SaveProfileModal({ isOpen, onClose, formData, onSave }) {
  const [profileName, setProfileName] = useState('');
  const [profileType, setProfileType] = useState('tenant'); // 'tenant' ou 'property'

  const handleSave = () => {
    const profile = {
      id: Date.now(),
      name: profileName,
      type: profileType,
      ...formData
    };
    onSave(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-semibold mb-4">
              Sauvegarder en tant que profil
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du profil
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Ex: Appartement Paris / M. Dupont"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de profil
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="tenant"
                      checked={profileType === 'tenant'}
                      onChange={(e) => setProfileType(e.target.value)}
                      className="mr-2"
                    />
                    Locataire
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="property"
                      checked={profileType === 'property'}
                      onChange={(e) => setProfileType(e.target.value)}
                      className="mr-2"
                    />
                    Bien immobilier
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={!profileName.trim()}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:bg-gray-300"
            >
              Sauvegarder
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
