import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Legal() {
  return (
    <>
      <Head>
        <title>Mentions légales | Générateur de Quittance de Loyer</title>
        <meta name="description" content="Mentions légales et conditions d'utilisation du générateur de quittances de loyer." />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Mentions légales
            </h1>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  1. Informations légales
                </h2>
                <p className="text-gray-600">
                  Ce site est édité par Ruben EDERY.<br />
                  Contact : ruben@rln-consulting.com<br />
                  Site hébergé par Vercel Inc.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  2. Propriété intellectuelle
                </h2>
                <p className="text-gray-600">
                  L'ensemble du contenu de ce site est protégé par le droit d'auteur. 
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  3. Protection des données personnelles
                </h2>
                <p className="text-gray-600 mb-4">
                  Ce site ne collecte aucune donnée personnelle. Les informations saisies 
                  pour générer les quittances ne sont pas stockées sur nos serveurs.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-700">
                    Les données saisies sont traitées uniquement dans votre navigateur 
                    et ne sont jamais transmises à nos serveurs.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  4. Cookies
                </h2>
                <p className="text-gray-600">
                  Ce site utilise uniquement des cookies techniques essentiels au 
                  fonctionnement du site. Aucun cookie publicitaire n'est utilisé.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  5. Limitation de responsabilité
                </h2>
                <p className="text-gray-600">
                  Les quittances générées le sont à titre indicatif. L'utilisateur reste 
                  responsable de la conformité des documents générés avec la législation 
                  en vigueur.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  6. Contact
                </h2>
                <p className="text-gray-600">
                  Pour toute question concernant ce site, vous pouvez me contacter via :
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>LinkedIn : <a href="https://www.linkedin.com/in/ruben-edery/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/ruben-edery/</a></li>
                  <li>GitHub : <a href="https://github.com/rubenedery" target="_blank" rel="noopener noreferrer">https://github.com/rubenedery</a></li>
                  <li>Email : <a href="mailto:ruben@rln-consulting.com">ruben@rln-consulting.com</a></li>
                </ul>
              </section>
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 text-center">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
