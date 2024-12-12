const PDFPreview = ({ data }) => {
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mb-8 max-w-4xl mx-auto border border-gray-200 sticky top-4">
      <div className="text-center mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">QUITTANCE DE LOYER</h2>
        <p className="text-gray-500 text-sm">Prévisualisation du document</p>
      </div>

      {/* En-tête */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">BAILLEUR</h3>
          <p className="text-gray-600">
            {data.nom} {data.prenom}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">LOCATAIRE</h3>
          <p className="text-gray-600">
            {data.nomLocation} {data.prenomLocation}
          </p>
        </div>
      </div>

      {/* Informations sur le logement */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">LOGEMENT</h3>
        <p className="text-gray-600">
          {data.adresse}
          <br />
          {data.codePostal} {data.ville}
        </p>
      </div>

      {/* Date de paiement */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">PÉRIODE</h3>
        <p className="text-gray-600">
          Date de paiement : {formatDate(data.datePayment)}
        </p>
      </div>

      {/* Détails du paiement */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">PAIEMENT</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Loyer</p>
            <p className="font-medium">{data.loyerAmount} €</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Charges</p>
            <p className="font-medium">{data.chargesAmount} €</p>
          </div>
          <div className="col-span-2 border-t pt-2 mt-2">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-bold text-lg">
              {Number(data.loyerAmount || 0) + Number(data.chargesAmount || 0)} €
            </p>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-gray-600">
              Fait à {data.doneAt}, le {formatDate(data.doneDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">Signature du bailleur</p>
            {data.sign && (
              <img 
                src={data.sign} 
                alt="Signature" 
                className="h-16 object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="mt-8 text-center text-xs text-gray-400">
        Document généré via Générateur de Quittance de Loyer
      </div>
    </div>
  );
};

export default PDFPreview;
