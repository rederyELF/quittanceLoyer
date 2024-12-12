import PDFPreview from './PDFPreview';

export default function PreviewSection({ formData }) {
    return (
      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Prévisualisation de la quittance
        </h2>
        <div className="border rounded-lg overflow-hidden">
          <PDFPreview data={formData} />
        </div>
      </div>
    );
  }