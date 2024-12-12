import React, { useEffect } from 'react';
import SignaturePad from 'signature_pad';

const SignaturePadComponent = ({ signaturePadRef, sign, signatureStatus, clearSignature }) => {
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
      }

      signaturePadRef.current.signaturePad = signaturePad;
    }
  }, []);

  return (
    <div className="border-t pt-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Signature
        </label>
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
          {sign && (
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
    </div>
  );
};

export default SignaturePadComponent;
