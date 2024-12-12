import React from 'react';

const PaymentForm = ({ datePayment, loyerAmount, chargesAmount, setDatePayment, setLoyerAmount, setChargesAmount }) => {
  return (
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations sur le Paiement</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="datePayment" className="block text-sm font-medium text-gray-700 mb-1">
            Date de paiement
          </label>
          <input
            type="date"
            id="datePayment"
            name="datePayment"
            value={datePayment}
            onChange={(e) => setDatePayment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="loyerAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Montant du loyer (Hors charges)
          </label>
          <input
            type="number"
            id="loyerAmount"
            name="loyerAmount"
            value={loyerAmount}
            onChange={(e) => setLoyerAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="chargesAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Montant des charges
          </label>
          <input
            type="number"
            id="chargesAmount"
            name="chargesAmount"
            value={chargesAmount}
            onChange={(e) => setChargesAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
