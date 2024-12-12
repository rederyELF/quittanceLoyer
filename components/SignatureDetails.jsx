import React from 'react';

const SignatureDetails = ({ doneAt, doneDate, setDoneAt, setDoneDate }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Détails de la signature</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label 
            htmlFor="doneAt" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fait à
          </label>
          <input
            type="text"
            id="doneAt"
            name="doneAt"
            value={doneAt}
            onChange={(e) => setDoneAt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            placeholder="Ex: Paris"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="doneDate" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Le
          </label>
          <input
            type="date"
            id="doneDate"
            name="doneDate"
            value={doneDate}
            onChange={(e) => setDoneDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureDetails;
