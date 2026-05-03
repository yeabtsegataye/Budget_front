import { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

const Modal = ({ isOpen, onClose, children, className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-background rounded-lg shadow-lg max-h-[90vh] overflow-auto",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

const ModalHeader = ({ children, className }) => (
  <div className={cn("flex items-center justify-between p-6 border-b", className)}>
    {children}
  </div>
);

const ModalTitle = ({ children, className }) => (
  <h2 className={cn("text-lg font-semibold", className)}>
    {children}
  </h2>
);

const ModalCloseButton = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "p-1 rounded-md hover:bg-accent transition-colors",
      className
    )}
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);

const ModalContent = ({ children, className }) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
);

const ModalFooter = ({ children, className }) => (
  <div className={cn("flex justify-end gap-2 p-6 border-t", className)}>
    {children}
  </div>
);

export { Modal, ModalHeader, ModalTitle, ModalCloseButton, ModalContent, ModalFooter };