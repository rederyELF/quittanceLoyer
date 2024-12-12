import React from 'react';
import SignatureSection from './SignatureSection';
import SignatureDetails from './SignatureDetails';

const CompleteSignatureSection = ({
  doneAt,
  doneDate,
  setDoneAt,
  setDoneDate,
  onSignatureChange
}) => {
  return (
    <div className="space-y-8">
      <SignatureDetails
        doneAt={doneAt}
        doneDate={doneDate}
        setDoneAt={setDoneAt}
        setDoneDate={setDoneDate}
      />
      <SignatureSection
        onSignatureChange={onSignatureChange}
      />
    </div>
  );
};

export default CompleteSignatureSection;
