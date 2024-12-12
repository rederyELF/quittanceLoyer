import React from 'react';

const SignatureForm = ({ doneAt, doneDate, setDoneAt, setDoneDate }) => {
  return (
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations sur la Signature</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="doneAt" className="block text-sm font-medium text-gray-700 mb-1">
            Fait à
          </label>
          <input
            type="text"
            id="doneAt"
            name="doneAt"
            value={doneAt}
            onChange={(e) => setDoneAt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="doneDate" className="block text-sm font-medium text-gray-700 mb-1">
            Le
          </label>
          <input
            type="date"
            id="doneDate"
            name="doneDate"
            value={doneDate}
            onChange={(e) => setDoneDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureForm;
