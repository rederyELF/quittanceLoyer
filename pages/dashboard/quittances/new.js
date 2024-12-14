// pages/dashboard/quittances/new.js
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { supabase } from '../../../utils/supabase';
import { generatePdf } from '../../../utils/generatePdf';
import SignaturePad from 'signature_pad';

// Importe tes composants existants
import OwnerForm from '../../../components/OwnerForm';
import TenantForm from '../../../components/TenantForm';
import PropertyForm from '../../../components/PropertyForm';
import PaymentForm from '../../../components/PaymentForm';
import SignatureForm from '../../../components/SignatureForm';
import MultipleGenerationForm from '../../../components/MultipleGenerationForm';
import SignaturePadForm from '../../../components/SignaturePadForm';
import Modal from '../../../components/Modal';
import ProgressBar from '../../../components/ProgressBar';
import PreviewSection from '../../../components/PreviewSection';
import SaveProfileModal from '../../../components/SaveProfileModal';
import ProfileManager from '../../../components/ProfileManager';

const NewQuittance = () => {
    const { user } = useAuth();
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: '',
        actions: []
    });

    // Remplacer l'état formData actuel
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        nomLocation: '',
        prenomLocation: '',
        adresse: '',
        codePostal: '',
        ville: '',
        datePayment: '',
        loyerAmount: '',
        chargesAmount: '',
        sign: ''
    });

    // Renommer l'ancien formData en sectionsValidity
    const [sectionsValidity, setSectionsValidity] = useState({
        owner: false,
        tenant: false,
        property: false,
        payment: false,
        signature: false
    });

    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [nomLocation, setNomLocation] = useState('');
    const [prenomLocation, setPrenomLocation] = useState('');
    const [adresse, setAdresse] = useState('');
    const [codePostal, setCodePostal] = useState('');
    const [loyerAmount, setLoyerAmount] = useState('');
    const [chargesAmount, setChargesAmount] = useState('');
    const [datePayment, setDatePayment] = useState('');
    const [sign, setSign] = useState('');
    const [ville, setVille] = useState('');
    const [dateSignature, setDateSignature] = useState('');

    // Nouveaux états pour la prévisualisation
    const [pdfPreview, setPdfPreview] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const signaturePadRef = useRef(null);

    // Ajout des états pour la preview
    const [previewData, setPreviewData] = useState({
        nom: '',
        prenom: '',
        nomLocation: '',
        prenomLocation: '',
        adresse: '',
        codePostal: '',
        ville: '',
        loyerAmount: '',
        chargesAmount: '',
        datePayment: '',
        doneAt: '',
        doneDate: '',
        signature: ''
    });

    // Ajout des états pour la signature
    const [signatureStatus, setSignatureStatus] = useState('empty');

    // Remplacer ces états
    const [doneAt, setDoneAt] = useState('');
    const [doneDate, setDoneDate] = useState('');

    const [profileName, setProfileName] = useState('');

    // Ajoutez cet état
    const [showSaveModal, setShowSaveModal] = useState(false);

    const [savedProfiles, setSavedProfiles] = useState([]);

    const doneAtRef = useRef(null);

    // Charger les profils au montage du composant
    useEffect(() => {
        const loadProfiles = async () => {
            try {
                if (user) {
                    // Charger depuis Supabase si connecté
                    const { data, error } = await supabase
                        .from('profile_saves')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    setSavedProfiles(data);
                } else {
                    // Charger depuis localStorage si non connecté
                    const localProfiles = localStorage.getItem('profiles');
                    if (localProfiles) {
                        setSavedProfiles(JSON.parse(localProfiles));
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement des profils:', error);
            }
        };

        loadProfiles();
    }, [user]);

    // Fonction pour gérer la sélection d'un profil
    const handleSelectProfile = (profile) => {
        setNom(profile.nom);
        setPrenom(profile.prenom);
        setNomLocation(profile.nom_location || profile.nomLocation);
        setPrenomLocation(profile.prenom_location || profile.prenomLocation);
        setAdresse(profile.adresse);
        setCodePostal(profile.code_postal || profile.codePostal);
        setVille(profile.ville);
        setLoyerAmount(profile.loyer_amount?.toString() || profile.loyerAmount);
        setChargesAmount(profile.charges_amount?.toString() || profile.chargesAmount);
        setDatePayment(new Date(profile.date_payment || profile.datePayment).toISOString().split('T')[0]);
        setSign(profile.sign);

        // Ajoutez ces lignes pour charger la signature dans le SignaturePad
        if (signaturePadRef.current?.signaturePad && profile.sign) {
            signaturePadRef.current.signaturePad.clear();
            signaturePadRef.current.signaturePad.fromDataURL(profile.sign);
            setSignatureStatus('saved');
        }

        setTimeout(() => {
            doneAtRef.current?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            doneAtRef.current?.focus();
        }, 100);
    };

    const closeModal = () => {
        setModalConfig({
            isOpen: false,
            title: '',
            message: '',
            type: '',
            actions: []
        });
    };

    // Met à jour formData quand les champs changent
    useEffect(() => {
        setFormData({
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
            sign
        });
    }, [nom, prenom, nomLocation, prenomLocation, adresse, codePostal, ville, loyerAmount, chargesAmount, datePayment, sign]);

    // Mettre à jour la validité des sections
    useEffect(() => {
        setSectionsValidity({
            owner: nom !== '' && prenom !== '',
            tenant: nomLocation !== '' && prenomLocation !== '',
            property: adresse !== '',
            payment: loyerAmount !== '' && chargesAmount !== '' && datePayment !== '',
            signature: sign !== '' && doneAt !== '' && doneDate !== ''
        });
    }, [nom, prenom, nomLocation, prenomLocation, adresse, loyerAmount, chargesAmount, datePayment, sign, doneAt, doneDate]);

    // Mettre à jour la preview quand les champs changent
    useEffect(() => {
        setPreviewData({
            nom,
            prenom,
            nomLocation,
            prenomLocation,
            adresse,
            codePostal,
            ville,
            loyerAmount,
            chargesAmount,
            datePayment,
            doneAt,
            doneDate,
            signature: sign
        });
    }, [nom, prenom, nomLocation, prenomLocation, adresse, codePostal, ville, loyerAmount, chargesAmount, datePayment, doneAt, doneDate, sign]);

    // Ajout de la fonction clearSignature
    const clearSignature = () => {
        if (signaturePadRef.current?.signaturePad) {
            signaturePadRef.current.signaturePad.clear();
            setSign('');
            setSignatureStatus('empty');
            localStorage.removeItem('savedSignature');
        }
    };

    // Ajout de l'effet pour la gestion de la signature
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

    const handlePreview = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const paymentDate = new Date(datePayment);
            const dayMonth = {
                firstDay: new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1).toLocaleDateString('fr-FR'),
                lastDay: new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 0).toLocaleDateString('fr-FR'),
                midDate: paymentDate.toLocaleDateString('fr-FR')
            };

            const signatureData = signaturePadRef.current?.signaturePad?.toDataURL() || sign;

            const quittanceData = {
                nom,
                prenom,
                nomLocation,
                prenomLocation,
                adresse,
                codePostal,
                ville,
                loyerAmount,
                chargesAmount,
                datePayment,
                signature: signatureData,
                doneAt,
                doneDate,
                dayMonth
            };

            const pdfBlob = await generatePdf(quittanceData, true);
            setPdfPreview(URL.createObjectURL(pdfBlob));
            setShowPreview(true);
        } catch (error) {
            console.error('Erreur lors de la prévisualisation:', error);
            setModalConfig({
                isOpen: true,
                title: 'Erreur',
                message: 'Impossible de générer la prévisualisation.',
                type: 'error',
                actions: [
                    {
                        label: 'Fermer',
                        onClick: closeModal,
                        style: 'error'
                    }
                ]
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const paymentDate = new Date(datePayment);
            const dayMonth = {
                firstDay: new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1).toLocaleDateString('fr-FR'),
                lastDay: new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 0).toLocaleDateString('fr-FR'),
                midDate: paymentDate.toLocaleDateString('fr-FR')
            };

            const signatureData = signaturePadRef.current?.signaturePad?.toDataURL() || sign;

            const quittanceData = {
                nom,
                prenom,
                nomLocation,
                prenomLocation,
                adresse,
                codePostal,
                ville,
                loyerAmount: parseFloat(loyerAmount),
                chargesAmount: parseFloat(chargesAmount),
                datePayment: new Date(datePayment).toISOString(),
                sign: signatureData,
                doneAt,
                doneDate,
                dayMonth
            };

            await generatePdf(quittanceData);

            const { error: quittanceError } = await supabase
                .from('quittances')
                .insert([{
                    user_id: user.id,
                    nom,
                    prenom,
                    nom_location: nomLocation,
                    prenom_location: prenomLocation,
                    adresse,
                    code_postal: codePostal,
                    ville,
                    loyer_amount: parseFloat(loyerAmount),
                    charges_amount: parseFloat(chargesAmount),
                    date_payment: new Date(datePayment).toISOString(),
                    sign: signatureData
                }]);

            if (quittanceError) throw quittanceError;

            // Au lieu d'afficher directement la modal, montrez la SaveProfileModal
            setShowSaveModal(true);

            // Afficher la confirmation de génération
            setModalConfig({
                isOpen: true,
                title: 'Succès',
                message: 'Quittance générée avec succès !',
                type: 'success',
                actions: [
                    {
                        label: 'OK',
                        onClick: closeModal,
                        style: 'success'
                    }
                ]
            });

        } catch (error) {
            console.error('Erreur:', error);
            setModalConfig({
                isOpen: true,
                title: 'Erreur',
                message: 'Une erreur est survenue lors de la génération de la quittance.',
                type: 'error',
                actions: [
                    {
                        label: 'Fermer',
                        onClick: closeModal,
                        style: 'error'
                    }
                ]
            });
        }
    };

    // Ajoutez cette fonction pour gérer la sauvegarde du profil
    const handleSaveProfile = async (profileData) => {
        try {
            console.log('handleSaveProfile', profileData);
            const { error: profileError } = await supabase
                .from('profile_saves')
                .insert([{
                    user_id: user.id,
                    name_profile: profileData.name,
                    nom,
                    prenom,
                    nom_location: nomLocation,
                    prenom_location: prenomLocation,
                    adresse,
                    code_postal: codePostal,
                    ville,
                    loyer_amount: parseFloat(loyerAmount),
                    charges_amount: parseFloat(chargesAmount),
                    date_payment: new Date(datePayment).toISOString(),
                    sign
                }]);

            if (profileError) throw profileError;

            setModalConfig({
                isOpen: true,
                title: 'Succès',
                message: 'Profil sauvegardé avec succès !',
                type: 'success',
                actions: [
                    {
                        label: 'OK',
                        onClick: closeModal,
                        style: 'success'
                    }
                ]
            });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du profil:', error);
            setModalConfig({
                isOpen: true,
                title: 'Erreur',
                message: 'Une erreur est survenue lors de la sauvegarde du profil.',
                type: 'error',
                actions: [
                    {
                        label: 'Fermer',
                        onClick: closeModal,
                        style: 'error'
                    }
                ]
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Nouvelle quittance
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Remplissez le formulaire pour générer une nouvelle quittance
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Colonne du formulaire */}
                    <div className="bg-white shadow-xl rounded-lg p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <ProgressBar formData={formData} />

                            <div className="space-y-6">
                                <OwnerForm
                                    nom={nom}
                                    prenom={prenom}
                                    onNomChange={(e) => setNom(e.target.value)}
                                    onPrenomChange={(e) => setPrenom(e.target.value)}
                                />

                                <TenantForm
                                    nomLocation={nomLocation}
                                    prenomLocation={prenomLocation}
                                    setNomLocation={setNomLocation}
                                    setPrenomLocation={setPrenomLocation}
                                />

                                <PropertyForm
                                    adresse={adresse}
                                    codePostal={codePostal}
                                    ville={ville}
                                    setAdresse={setAdresse}
                                    setCodePostal={setCodePostal}
                                    setVille={setVille}
                                />

                                <PaymentForm
                                    datePayment={datePayment}
                                    loyerAmount={loyerAmount}
                                    chargesAmount={chargesAmount}
                                    setDatePayment={setDatePayment}
                                    setLoyerAmount={setLoyerAmount}
                                    setChargesAmount={setChargesAmount}
                                />

                                <SignatureForm
                                    doneAt={doneAt}
                                    doneDate={doneDate}
                                    setDoneAt={setDoneAt}
                                    setDoneDate={setDoneDate}
                                    doneAtRef={doneAtRef}
                                />

                                <SignaturePadForm
                                    signaturePadRef={signaturePadRef}
                                    sign={sign}
                                    signatureStatus={signatureStatus}
                                    clearSignature={clearSignature}
                                />

                                <div className="mt-6 flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={isGenerating}
                                        className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Générer la quittance
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Colonne de prévisualisation */}
                    <div className="lg:block">
                        <div className="sticky top-8 space-y-8">
                            <PreviewSection
                                data={previewData}
                                className="bg-white shadow-xl rounded-lg p-8"
                            />
                        </div>
                    </div>
                </div>

                {/* Modal de prévisualisation */}
                <Modal
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    title="Prévisualisation de la quittance"
                >
                    <div className="w-full h-[80vh]">
                        {pdfPreview && (
                            <iframe
                                src={pdfPreview}
                                className="w-full h-full"
                                title="Prévisualisation de la quittance"
                            />
                        )}
                    </div>
                </Modal>

                {/* Modal de confirmation/erreur */}
                <Modal
                    isOpen={modalConfig.isOpen}
                    onClose={closeModal}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    type={modalConfig.type}
                    actions={modalConfig.actions}
                />

                {/* Ajoutez la SaveProfileModal à la fin, avant la fermeture de DashboardLayout */}
                <SaveProfileModal
                    isOpen={showSaveModal}
                    onClose={() => setShowSaveModal(false)}
                    formData={{
                        nom,
                        prenom,
                        nomLocation,
                        prenomLocation,
                        adresse,
                        codePostal,
                        ville,
                        loyerAmount,
                        chargesAmount,
                        datePayment,
                        sign
                    }}
                    onSave={handleSaveProfile}
                />

                {/* Ajouter le ProfileManager en haut du formulaire */}
                <ProfileManager 
                    profiles={savedProfiles}
                    onSelectProfile={handleSelectProfile}
                    onDeleteProfile={async (profileId) => {
                        try {
                            if (user) {
                                const { error } = await supabase
                                    .from('profile_saves')
                                    .delete()
                                    .eq('id', profileId)
                                    .eq('user_id', user.id);
                                if (error) throw error;
                            } else {
                                const updatedProfiles = savedProfiles.filter(p => p.id !== profileId);
                                localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
                            }
                            setSavedProfiles(savedProfiles.filter(p => p.id !== profileId));
                        } catch (error) {
                            console.error('Erreur lors de la suppression:', error);
                        }
                    }}
                />
            </div>
        </DashboardLayout>
    );
};

export default NewQuittance;