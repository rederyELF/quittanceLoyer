import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Guide() {
  const steps = [
    {
      title: "1. Informations du propriétaire",
      description: "Remplissez vos coordonnées en tant que propriétaire (nom, prénom).",
      icon: "👤",
      tips: ["Utilisez votre nom légal complet", "Ces informations apparaîtront sur la quittance"]
    },
    {
      title: "2. Informations du locataire",
      description: "Saisissez les coordonnées de votre locataire.",
      icon: "🏠",
      tips: ["Vérifiez l&apos;orthographe du nom", "Utilisez les informations du bail"]
    },
    {
      title: "3. Détails du logement",
      description: "Indiquez l&apos;adresse complète du bien loué.",
      icon: "📍",
      tips: ["L&apos;adresse doit être identique à celle du bail", "N&apos;oubliez pas le code postal"]
    },
    {
      title: "4. Montants et paiement",
      description: "Précisez les montants du loyer et des charges.",
      icon: "💶",
      tips: ["Séparez bien le loyer des charges", "Utilisez des nombres sans espaces"]
    },
    {
      title: "5. Signature",
      description: "Signez la quittance électroniquement ou téléchargez une image de signature.",
      icon: "✍️",
      tips: ["La signature doit être lisible", "Vous pouvez réutiliser une signature sauvegardée"]
    },
    {
      title: "6. Vérification finale",
      description: "Vérifiez toutes les informations avant de générer la quittance.",
      icon: "✅",
      tips: [
        "Relisez attentivement tous les montants",
        "Vérifiez la période concernée",
        "Assurez-vous que toutes les informations correspondent au bail"
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Guide d&apos;utilisation | Générateur de Quittance de Loyer</title>
        <meta name="description" content="Apprenez à utiliser notre générateur de quittances de loyer en quelques étapes simples." />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Guide d&apos;utilisation
            </h1>

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="border-b border-gray-200 pb-8 last:border-0">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{step.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">
                          Conseils :
                        </h3>
                        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Besoin d&apos;aide supplémentaire ?
              </h2>
              <p className="text-gray-600 mb-4">
                Si vous avez des questions ou rencontrez des difficultés, n&apos;hésitez pas à :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Consulter notre FAQ en bas de la page d&apos;accueil</li>
                <li>Me contacter via <a href="https://www.linkedin.com/in/ruben-edery/" target="_blank" rel="noopener noreferrer">LinkedIn</a> ou <a href="mailto:ruben@rln-consulting.com">par Email</a></li>
                <li>Consulter les articles juridiques sur les quittances de loyer</li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Informations importantes
                </h3>
                <p className="text-sm text-gray-600">
                  La quittance de loyer est un document légal important. Elle fait office de preuve de 
                  paiement pour le locataire et doit être conservée pendant au moins 3 ans. Le propriétaire 
                  est tenu de la délivrer gratuitement au locataire qui en fait la demande.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
