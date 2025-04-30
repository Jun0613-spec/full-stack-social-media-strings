import { useRef } from "react";

import Button from "@/components/Button";

import { useConfirmModalStore } from "@/stores/modals/confirmModalStore";

const ConfirmModal = () => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { isOpen, title, message, onConfirm, closeModal } =
    useConfirmModalStore();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-neutral-800 rounded-md shadow-xl w-[95vw] max-w-md p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800"
      >
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold ">{title}</h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed">
            {message}
          </p>
        </div>

        <div className="mt-6 flex flex-col justify-end gap-3">
          <Button onClick={handleCancel} variant="danger" size="sm">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="primary" size="sm">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
