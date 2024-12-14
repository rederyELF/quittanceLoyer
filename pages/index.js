import HeadMeta from '../components/HeadMeta';
import React, { useState, useRef, useEffect } from 'react';
import { generatePdf } from '../utils/generatePdf';
import SignaturePad from 'signature_pad';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { saveFormData, loadFormData, clearFormData } from '../utils/localStorage';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';
import QuickAccess from '../components/QuickAccess';
import ProfileManager from '../components/ProfileManager';
import SaveProfileModal from '../components/SaveProfileModal';
import Notification from '../components/Notification';
import ShareButtons from '../components/ShareButtons';
import OwnerForm from '../components/OwnerForm';
import TenantForm from '../components/TenantForm';
import PageTitle from '../components/PageTitle';
import PropertyForm from '../components/PropertyForm';
import PaymentForm from '../components/PaymentForm';
import SignatureForm from '../components/SignatureForm';
import MultipleGenerationForm from '../components/MultipleGenerationForm';
import SignaturePadForm from '../components/SignaturePadForm';
import PreviewSection from '../components/PreviewSection';
import SubmitButton from '../components/SubmitButton';

export default function Home() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nomLocation, setNomLocation] = useState('');
  const [prenomLocation, setPrenomLocation] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');
  const [datePayment, setDatePayment] = useState('');
  const [loyerAmount, setLoyerAmount] = useState('');
  const [chargesAmount, setChargesAmount] = useState('');
  const [doneAt, setDoneAt] = useState('');
  const [doneDate, setDoneDate] = useState('');
  const [sign, setSign] = useState('');
  const signaturePadRef = useRef(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentDay, setPaymentDay] = useState('');
  const [showDateRange, setShowDateRange] = useState(false);
  const [signatureStatus, setSignatureStatus] = useState('empty');
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    actions: []
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [profiles, setProfiles] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profiles');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [dataSource, setDataSource] = useState('manual');

  /**
   * 
   * @param {*} startDate 
   * @param {*} endDate 
   * @returns 
   */
  const getMonthsBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    const current = new Date(start);
    current.setDate(parseInt(paymentDay));

    while (current <= end) {
      dates.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (showDateRange && startDate && endDate && paymentDay) {
        // Génération multiple
        const dates = getMonthsBetweenDates(startDate, endDate);

        // Créer un tableau de plages de dates
        const dateRangeArray = dates.map(date => {
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          return {
            firstDay: monthStart.toLocaleDateString('fr-FR'),
            lastDay: monthEnd.toLocaleDateString('fr-FR'),
            midDate: new Date(date.getFullYear(), date.getMonth(), parseInt(paymentDay)).toLocaleDateString('fr-FR')
          };
        });

        // Ajouter dateRangeArray aux données
        const quittanceData = {
          ...formData,
          dateRangeArray // Ajout du tableau de dates
        };

        await generatePdf(quittanceData);

        // Sauvegarder dans l'historique
        const savedQuittances = JSON.parse(localStorage.getItem('quittances_history') || '[]');
        dates.forEach(date => {
          savedQuittances.push({
            ...formData,
            datePayment: date.toLocaleDateString('fr-FR'),
            id: Date.now() + Math.random(),
            createdAt: new Date().toISOString()
          });
        });
        localStorage.setItem('quittances_history', JSON.stringify(savedQuittances));

        setModalConfig({
          isOpen: true,
          title: 'Succès',
          message: `${dates.length} quittances ont été générées avec succès !`,
          type: 'success',
          actions: [
            {
              label: 'OK',
              onClick: closeModal,
              style: 'success'
            }
          ]
        });
      } else {
        // Génération unique
        const paymentDate = new Date(datePayment);
        const dayMonth = {
          firstDay: new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1).toLocaleDateString('fr-FR'),
          lastDay: new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 0).toLocaleDateString('fr-FR'),
          midDate: paymentDate.toLocaleDateString('fr-FR')
        };
        const quittanceData = {
          ...formData,
          datePayment: paymentDate.toLocaleDateString('fr-FR'),
          dayMonth
        };
        await generatePdf(quittanceData);

        // Sauvegarder dans l'historique
        const savedQuittances = JSON.parse(localStorage.getItem('quittances_history') || '[]');
        savedQuittances.push({
          ...quittanceData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('quittances_history', JSON.stringify(savedQuittances));

        // Afficher le modal de sauvegarde uniquement si les données sont saisies manuellement
        if (dataSource === 'manual') {
          setShowSaveModal(true);
        }

        // Afficher la modal de confirmation
        setModalConfig({
          isOpen: true,
          title: 'Succès',
          message: 'Quittance générée avec succès !',
          type: 'success',
          actions: [
            {
              label: 'OK',
              onClick: () => {
                closeModal();
                // Réinitialiser le formulaire
                setNom('');
                setPrenom('');
                setNomLocation('');
                setPrenomLocation('');
                setAdresse('');
                setCodePostal('');
                setVille('');
                setDatePayment('');
                setLoyerAmount('');
                setChargesAmount('');
                setDoneAt('');
                setDoneDate('');
                setSign('');
                setDataSource('manual');
                if (signaturePadRef.current?.signaturePad) {
                  signaturePadRef.current.signaturePad.clear();
                }
              },
              style: 'success'
            }
          ]
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setModalConfig({
        isOpen: true,
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la génération des quittances.',
        type: 'error',
        actions: [
          {
            label: 'Fermer',
            onClick: closeModal,
            style: 'danger'
          }
        ]
      });
    }
  };

  useEffect(() => {
    if (signaturePadRef.current) {
      const canvas = signaturePadRef.current;
      const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
      });

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);

      const savedSign = localStorage.getItem('savedSignature');
      if (savedSign) {
        signaturePad.fromDataURL(savedSign);
        setSign(savedSign);
      }

      signaturePad.addEventListener("beginStroke", () => {
        setSignatureStatus('drawing');
      });

      signaturePad.addEventListener("endStroke", () => {
        const signatureData = signaturePad.toDataURL();
        setSign(signatureData);
        localStorage.setItem('savedSignature', signatureData);
        setSignatureStatus('saved');
      });

      signaturePadRef.current.signaturePad = signaturePad;
    }
  }, []);

  const clearSignature = () => {
    if (signaturePadRef.current?.signaturePad) {
      signaturePadRef.current.signaturePad.clear();
      setSign(null);
      localStorage.removeItem('savedSignature');
    }
  };

  // Regroupez toutes les données dans un objet
  const formData = {
    nom,
    prenom,
    nomLocation,
    prenomLocation,
    adresse,
    codePostal,
    ville,
    datePayment,
    loyerAmount,
    chargesAmount,
    doneAt,
    doneDate,
    sign
  };

  // Charger les données au démarrage
  useEffect(() => {
    const savedData = loadFormData();
    if (savedData) {
      setNom(savedData.nom || '');
      setPrenom(savedData.prenom || '');
      setAdresse(savedData.adresse || '');
      setCodePostal(savedData.codePostal || '');
      setVille(savedData.ville || '');
      // ... autres champs ...
    }
  }, []);

  // Fonction pour fermer la modal
  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleSelectProfile = (profile) => {
    setDataSource('profile');
    // Mettre à jour chaque état individuel
    setNom(profile.nom || '');
    setPrenom(profile.prenom || '');
    setNomLocation(profile.nomLocation || '');
    setPrenomLocation(profile.prenomLocation || '');
    setAdresse(profile.adresse || '');
    setCodePostal(profile.codePostal || '');
    setVille(profile.ville || '');
    setDatePayment(profile.datePayment || '');
    setLoyerAmount(profile.loyerAmount || '');
    setChargesAmount(profile.chargesAmount || '');
    setDoneAt(profile.doneAt || '');
    setDoneDate(profile.doneDate || '');
    setSign(profile.sign || '');

    setNotification({
      type: 'success',
      message: 'Profil chargé avec succès !'
    });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSaveProfile = (profile) => {
    const updatedProfiles = [...profiles, profile];
    setProfiles(updatedProfiles);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

    // Afficher une notification de succès
    setNotification({
      type: 'success',
      message: 'Profil sauvegardé avec succès !'
    });

    // Fermer la notification après 3 secondes
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <HeadMeta />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <PageTitle />

        <div className="top-0 z-10 bg-gradient-to-b from-gray-50 to-gray-100 pt-4 pb-4 -mx-4 px-4">
          <div className="max-w-7xl mx-auto">
            <ProgressBar
              formData={formData}
              className="h-2 bg-gray-200 rounded-full overflow-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ProfileManager onSelectProfile={handleSelectProfile} />

            <div className="bg-white shadow-xl rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section Propriétaire */}
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <OwnerForm
                      nom={nom}
                      prenom={prenom}
                      onNomChange={(e) => setNom(e.target.value)}
                      onPrenomChange={(e) => setPrenom(e.target.value)}
                    />
                  </div>

                  <div className="border-b pb-4">
                    <TenantForm
                      nomLocation={nomLocation}
                      prenomLocation={prenomLocation}
                      setNomLocation={setNomLocation}
                      setPrenomLocation={setPrenomLocation}
                    />
                  </div>

                  <div className="border-b pb-4">
                    <PropertyForm
                      adresse={adresse}
                      codePostal={codePostal}
                      ville={ville}
                      setAdresse={setAdresse}
                      setCodePostal={setCodePostal}
                      setVille={setVille}
                    />
                  </div>

                  <div className="border-b pb-4">
                    <PaymentForm
                      datePayment={datePayment}
                      setDatePayment={setDatePayment}
                      loyerAmount={loyerAmount}
                      setLoyerAmount={setLoyerAmount}
                      chargesAmount={chargesAmount}
                      setChargesAmount={setChargesAmount}
                    />
                  </div>

                  <div className="border-b pb-4">
                    <SignatureForm
                      doneAt={doneAt}
                      setDoneAt={setDoneAt}
                      doneDate={doneDate}
                      setDoneDate={setDoneDate}
                    />
                  </div>

                  <div className="border-b pb-4">
                    <MultipleGenerationForm
                      showDateRange={showDateRange}
                      setShowDateRange={setShowDateRange}
                      startDate={startDate}
                      setStartDate={setStartDate}
                      endDate={endDate}
                      setEndDate={setEndDate}
                      paymentDay={paymentDay}
                      setPaymentDay={setPaymentDay}
                    />
                  </div>

                  {/* Section Signature */}
                  <div className="border-t pt-6">
                    <SignaturePadForm
                      signaturePadRef={signaturePadRef}
                      sign={sign}
                      signatureStatus={signatureStatus}
                      clearSignature={clearSignature}
                    />
                  </div>

                  <SubmitButton />
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <PreviewSection formData={formData} />

            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Aperçu de vos quittances
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Consultez rapidement vos statistiques et accédez à l&apos;historique complet
                </p>
              </div>
              <QuickAccess />
            </div>
          </div>
        </div>

        <section className="bg-white py-12 mt-8">
          <div className="max-w-7xl mx-auto px-4">
            <FAQ />
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <ShareButtons />
          </div>
        </section>
      </main>

      <Footer />

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        actions={modalConfig.actions}
      />

      <SaveProfileModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        formData={formData}
        onSave={handleSaveProfile}
      />

      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />
    </div>
  )
}