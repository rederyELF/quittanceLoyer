import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-5 px-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-left font-medium text-gray-900">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-gray-50 text-gray-600">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  const faqData = [
    {
      question: "Dans quels cas le bailleur doit-il délivrer une quittance ?",
      answer: "Le bailleur doit remettre une quittance uniquement après réception du paiement complet et sur demande explicite du locataire. Cette demande peut être faite à tout moment, même plusieurs mois après le paiement."
    },
    {
      question: "Comment gérer un versement incomplet du loyer ?",
      answer: "En cas de paiement partiel, le propriétaire doit établir un simple reçu détaillant la somme perçue, le montant total dû (loyer + charges) et le solde restant. Il est essentiel de ne jamais délivrer une quittance complète tant que l'intégralité du paiement n'a pas été reçue."
    },
    {
      question: "Un propriétaire peut-il refuser de fournir ce document ?",
      answer: "Non, la remise d'une quittance est un droit pour le locataire. Dès lors que le paiement est complet et qu'une demande est formulée, le propriétaire a l'obligation légale de fournir ce justificatif."
    },
    {
      question: "Existe-t-il des frais pour l'établissement du document ?",
      answer: "La délivrance d'une quittance est totalement gratuite. Aucun frais ne peut être facturé au locataire, que ce soit pour l'édition, l'impression ou l'envoi du document. Cette gratuité est garantie par la loi."
    },
    {
      question: "La transmission électronique est-elle valable juridiquement ?",
      answer: "La transmission par voie électronique (email, PDF) est parfaitement légale selon la législation actuelle. Un accord écrit préalable du locataire est néanmoins requis pour privilégier ce mode d'envoi dématérialisé."
    },
    {
      question: "Quelle distinction entre l'avis d'échéance et la quittance ?",
      answer: "L'avis d'échéance est un document prévisionnel annonçant les sommes à régler, envoyé avant le paiement. La quittance, elle, est un justificatif officiel confirmant la réception du paiement par le bailleur. Ces deux documents ont des fonctions distinctes et complémentaires."
    },
    {
      question: "Quels éléments doivent figurer sur le document ?",
      answer: `Un document valide doit obligatoirement mentionner :
      • Les coordonnées complètes du propriétaire
      • L'identité et l'adresse du locataire
      • Les informations précises sur le bien loué
      • La période concernée par le paiement
      • Le détail des montants (loyer principal et charges)
      • Les dates de règlement et d'établissement
      • La mention "Quittance" ou "Reçu partiel" selon le cas
      
      Ce document a une valeur juridique importante et sert de preuve de paiement.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Questions Fréquentes
      </h2>
      <div className="bg-white rounded-lg shadow-lg">
        {faqData.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
}
