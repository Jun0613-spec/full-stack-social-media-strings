import { useEffect, useRef, useCallback } from "react";

interface UseHandleOutsideClickProps {
  isOpen: boolean;
  onClose: () => void;
}

const useHandleOutsideClick = ({
  isOpen,
  onClose
}: UseHandleOutsideClickProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen, handleOutsideClick]);

  return ref;
};

export default useHandleOutsideClick;
