import PDFPreview from './PDFPreview';

export default function PreviewSection({ data, formData }) {
  // Normaliser les données pour qu'elles fonctionnent dans les deux cas
  const normalizedData = {
    nom: data?.nom || formData?.nom || '',
    prenom: data?.prenom || formData?.prenom || '',
    nomLocation: data?.nomLocation || formData?.nomLocation || '',
    prenomLocation: data?.prenomLocation || formData?.prenomLocation || '',
    adresse: data?.adresse || formData?.adresse || '',
    codePostal: data?.codePostal || formData?.codePostal || '',
    ville: data?.ville || formData?.ville || '',
    datePayment: data?.datePayment || formData?.datePayment || '',
    loyerAmount: data?.loyerAmount || formData?.loyerAmount || '',
    chargesAmount: data?.chargesAmount || formData?.chargesAmount || '',
    doneAt: data?.doneAt || formData?.doneAt || '',
    doneDate: data?.doneDate || formData?.doneDate || '',
    sign: data?.signature || formData?.sign || ''
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Prévisualisation de la quittance
      </h2>
      <div className="border rounded-lg overflow-hidden">
        <PDFPreview data={normalizedData} />
      </div>
    </div>
  );
}