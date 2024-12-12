import React from 'react';

const MultipleGenerationForm = ({
  showDateRange,
  setShowDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  paymentDay,
  setPaymentDay,
  getMonthsBetweenDates
}) => {
  return (
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Génération multiple</h2>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showDateRange}
            onChange={() => setShowDateRange(!showDateRange)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-gray-700">Générer plusieurs quittances</span>
        </label>
      </div>

      {showDateRange && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={showDateRange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={showDateRange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jour de paiement
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={paymentDay}
                onChange={(e) => setPaymentDay(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 5"
                required={showDateRange}
              />
            </div>
          </div>

          {startDate && endDate && paymentDay && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                {`${getMonthsBetweenDates(startDate, endDate).length} quittances seront générées`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleGenerationForm;

