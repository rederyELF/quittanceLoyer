import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';

const SignatureSection = ({ onSignatureChange }) => {
  const signaturePadRef = useRef(null);
  const [signatureStatus, setSignatureStatus] = useState('empty');
  const [sign, setSign] = useState('');

  useEffect(() => {
    if (signaturePadRef.current) {
      const canvas = signaturePadRef.current;
      const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
      });

      // Configuration du ratio pour une meilleure qualité sur les écrans haute résolution
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);

      // Charger la signature sauvegardée si elle existe
      const savedSign = localStorage.getItem('savedSignature');
      if (savedSign) {
        signaturePad.fromDataURL(savedSign);
        setSign(savedSign);
        setSignatureStatus('saved');
        onSignatureChange(savedSign);
      }

      // Gestionnaires d'événements pour la signature
      signaturePad.addEventListener("beginStroke", () => {
        setSignatureStatus('drawing');
      });

      signaturePad.addEventListener("endStroke", () => {
        const signatureData = signaturePad.toDataURL();
        setSign(signatureData);
        localStorage.setItem('savedSignature', signatureData);
        setSignatureStatus('saved');
        onSignatureChange(signatureData);
      });

      signaturePadRef.current.signaturePad = signaturePad;

      // Nettoyage lors du démontage du composant
      return () => {
        if (signaturePad) {
          signaturePad.off();
        }
      };
    }
  }, [onSignatureChange]);

  const clearSignature = () => {
    if (signaturePadRef.current?.signaturePad) {
      signaturePadRef.current.signaturePad.clear();
      setSign('');
      setSignatureStatus('empty');
      localStorage.removeItem('savedSignature');
      onSignatureChange('');
    }
  };

  const getStatusText = () => {
    switch (signatureStatus) {
      case 'empty':
        return 'Signez ici';
      case 'drawing':
        return 'En train de signer...';
      case 'saved':
        return 'Signature sauvegardée ✓';
      default:
        return '';
    }
  };

  return (
    <div className="border-t pt-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Signature
          </label>
          {sign && (
            <button
              type="button"
              onClick={clearSignature}
              className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Effacer la signature
            </button>
          )}
        </div>

        <div className="relative">
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors duration-200">
            <canvas
              ref={signaturePadRef}
              className="w-full h-64 touch-none cursor-crosshair"
              style={{
                touchAction: 'none',
                backgroundColor: '#fff'
              }}
            />
          </div>
          
          <div className="absolute bottom-2 left-2">
            <span className="text-sm text-gray-500 bg-white/80 px-2 py-1 rounded">
              {getStatusText()}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          Utilisez votre souris ou votre doigt pour signer dans la zone ci-dessus
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;
