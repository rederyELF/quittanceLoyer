import { useEffect } from 'react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'warning', 'error'
  actions = [] // [{label: 'OK', onClick: () => {}, style: 'primary'}]
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const icons = {
    info: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const getButtonStyle = (style) => {
    const baseStyle = "inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3";
    switch (style) {
      case 'primary':
        return `${baseStyle} bg-blue-600 text-white hover:bg-blue-500`;
      case 'success':
        return `${baseStyle} bg-green-600 text-white hover:bg-green-500`;
      case 'danger':
        return `${baseStyle} bg-red-600 text-white hover:bg-red-500`;
      default:
        return `${baseStyle} bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-${type}-100 sm:mx-0 sm:h-10 sm:w-10`}>
                {icons[type]}
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={getButtonStyle(action.style)}
              >
                {action.label}
              </button>
            ))}
            {!actions.length && (
              <button
                onClick={onClose}
                className={getButtonStyle('primary')}
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
