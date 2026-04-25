import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw] max-h-[90vh]",
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = "",
}: ModalProps) {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            className={`
              relative w-full ${sizeStyles[size]} bg-white rounded-2xl shadow-soft-xl
              overflow-hidden ${className}
            `}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-6 pb-0">
                {title && (
                  <div>
                    <h2
                      id="modal-title"
                      className="text-xl font-display font-bold text-stone-900"
                    >
                      {title}
                    </h2>
                    {description && (
                      <p
                        id="modal-description"
                        className="text-sm text-stone-500 mt-1"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Modal Footer component for actions
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={`flex items-center justify-end gap-3 pt-4 border-t border-stone-100 ${className}`}
    >
      {children}
    </div>
  );
}

// Confirmation Modal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
  const confirmVariant: Record<string, "primary" | "danger" | "accent"> = {
    danger: "danger",
    warning: "accent",
    default: "primary",
  };

  const icons = {
    danger: "⚠️",
    warning: "❓",
    default: "💭",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <span className="text-4xl mb-4 block">{icons[variant]}</span>
        <h3 className="text-lg font-display font-bold text-stone-900 mb-2">
          {title}
        </h3>
        <p className="text-stone-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant[variant]}
            size="md"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default Modal;
