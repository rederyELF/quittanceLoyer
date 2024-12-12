import HeadMeta from '../components/HeadMeta';
import React, { useState, useRef, useEffect } from 'react';
import { generatePdf } from '../utils/generatePdf';
import SignaturePad from 'signature_pad';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import PDFPreview from '../components/PDFPreview';
import Header from '../components/Header';
import { saveFormData, loadFormData, clearFormData } from '../utils/localStorage';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';
import QuickAccess from '../components/QuickAccess';
import ProfileManager from '../components/ProfileManager';
import SaveProfileModal from '../components/SaveProfileModal';
import Notification from '../components/Notification';
import ShareButtons from '../components/ShareButtons';

export default function Home() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nomLocation, setNomLocation] = useState('');
  const [prenomLocation, setPrenomLocation] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');
  const [image, setImage] = useState(null);
  const [datePayment, setDatePayment] = useState('');
  const [loyerAmount, setLoyerAmount] = useState('');
  const [chargesAmount, setChargesAmount] = useState('');
  const [doneAt, setDoneAt] = useState('');
  const [doneDate, setDoneDate] = useState('');
  const [sign, setSign] = useState('');
  const [source, setSource] = useState('Signature');
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
      const formattedDate = new Date(formData.datePayment).toLocaleDateString('fr-FR');
      const quittanceData = {
        ...formData,
        datePayment: formattedDate
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

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setModalConfig({
        isOpen: true,
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la génération de la quittance.',
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
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

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
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

  // Remplacer les alerts par des modals
  const handleClearData = () => {
    setModalConfig({
      isOpen: true,
      title: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir effacer les données sauvegardées ?',
      type: 'warning',
      actions: [
        {
          label: 'Annuler',
          onClick: closeModal,
          style: 'default'
        },
        {
          label: 'Effacer',
          onClick: () => {
            if (clearFormData()) {
              setNom('');
              setPrenom('');
              // ... réinitialiser autres champs ...
              setModalConfig({
                isOpen: true,
                title: 'Succès',
                message: 'Données effacées avec succès !',
                type: 'success'
              });
            }
          },
          style: 'danger'
        }
      ]
    });
  };

  // Pour la sauvegarde des données
  const handleSaveData = () => {
    // Vérifier si les champs principaux sont vides
    const isDataEmpty = !nom && !prenom && !adresse && !codePostal && !ville;

    if (isDataEmpty) {
      setModalConfig({
        isOpen: true,
        title: 'Aucune information à sauvegarder',
        message: 'Veuillez remplir au moins un champ du formulaire.',
        type: 'warning',
        actions: [
          {
            label: 'Compris',
            onClick: () => closeModal(),
            style: 'primary'
          }
        ]
      });
      return;
    }

    const dataToSave = {
      nom,
      prenom,
      adresse,
      codePostal,
      ville,
      // ... autres champs ...
    };

    if (saveFormData(dataToSave)) {
      setModalConfig({
        isOpen: true,
        title: 'Succès',
        message: 'Informations sauvegardées avec succès !',
        type: 'success',
        actions: [
          {
            label: 'OK',
            onClick: () => closeModal(),
            style: 'success'
          }
        ]
      });
    } else {
      // En cas d'erreur de sauvegarde
      setModalConfig({
        isOpen: true,
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la sauvegarde des informations.',
        type: 'error',
        actions: [
          {
            label: 'Fermer',
            onClick: () => closeModal(),
            style: 'danger'
          }
        ]
      });
    }
  };

  // Fonction pour vérifier si des données sont présentes
  const hasData = () => {
    return Boolean(nom || prenom || adresse || codePostal || ville);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Générateur de Quittance de Loyer
          </h1>
          <p className="mt-2 text-gray-600">
            Générez facilement vos quittances de loyer et suivez votre historique
          </p>
        </div>

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
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations du Propriétaire</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom du propriétaire
                        </label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom du propriétaire
                        </label>
                        <input
                          type="text"
                          id="prenom"
                          name="prenom"
                          value={prenom}
                          onChange={(e) => setPrenom(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations du Locataire</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nomLocation" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom du Locataire
                        </label>
                        <input
                          type="text"
                          id="nomLocation"
                          name="nomLocation"
                          value={nomLocation}
                          onChange={(e) => setNomLocation(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="prenomLocation" className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom du Locataire
                        </label>
                        <input
                          type="text"
                          id="prenomLocation"
                          name="prenomLocation"
                          value={prenomLocation}
                          onChange={(e) => setPrenomLocation(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations sur le Logement</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse du logement loué
                        </label>
                        <input
                          type="text"
                          id="adresse"
                          name="adresse"
                          value={adresse}
                          onChange={(e) => setAdresse(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700 mb-1">
                          Code Postal du logement loué
                        </label>
                        <input
                          type="text"
                          id="codePostal"
                          name="codePostal"
                          value={codePostal}
                          onChange={(e) => setCodePostal(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
                          Ville du logement loué
                        </label>
                        <input
                          type="text"
                          id="ville"
                          name="ville"
                          value={ville}
                          onChange={(e) => setVille(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

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

                  {/* Section Signature */}
                  <div className="border-t pt-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de signature
                      </label>
                      <select
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Signature">Signature manuscrite</option>
                        <option value="Image">Image de signature</option>
                      </select>
                    </div>

                    {source === "Signature" ? (
                      <div className="space-y-4">
                        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                          <canvas
                            ref={signaturePadRef}
                            className="w-full h-64 touch-none"
                            style={{
                              touchAction: 'none',
                              backgroundColor: '#fff'
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">
                            {signatureStatus === 'empty' && 'Signez ici'}
                            {signatureStatus === 'drawing' && 'En train de signer...'}
                            {signatureStatus === 'saved' && 'Signature sauvegardée ✓'}
                          </span>
                          {signatureStatus !== 'empty' && (
                            <button
                              type="button"
                              onClick={clearSignature}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Effacer
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Générer la quittance
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white shadow-xl rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Prévisualisation de la quittance
              </h2>
              <div className="border rounded-lg overflow-hidden">
                <PDFPreview data={formData} />
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Aperçu de vos quittances
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Consultez rapidement vos statistiques et accédez à l'historique complet
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