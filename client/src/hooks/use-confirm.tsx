import { JSX, useEffect, useRef, useState } from "react";

import Button from "@/components/Button";

import { cn } from "@/lib/utils";

export const useConfirmModal = (
  title: string,
  message: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
  }, []);

  const ConfirmModal = () => (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50  transition-all duration-300",
        promise ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-white dark:bg-neutral-800 rounded-md shadow-xl w-[95vw] max-w-md p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800",
          promise ? "scale-100" : "scale-95"
        )}
      >
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {title}
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed">
            {message}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <Button
            onClick={handleCancel}
            variant="danger"
            size="sm"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            size="sm"
            className="w-full sm:w-auto"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );

  return [ConfirmModal, confirm];
};
