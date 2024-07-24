import React from "react";
import ReactDOM from "react-dom";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  zIndex = 10,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center px-4"
      style={{ zIndex }}
    >
      <div className="bg-white px-4 rounded shadow-lg relative max-h-96 overflow-auto">
        <div className="sticky top-0 w-full h-16 bg-white">
          <button
            className="absolute top-0 right-0 mt-2 mr-2 text-5xl text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Dialog;
