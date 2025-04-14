import { RefObject, useEffect } from "react";

/**
 * Initializes the dismissal of a element menu when clicking outside of it.
 * @param dialogRef - The reference to the element.
 * @param setIsOpen - The state setter function to control the element's open state.
 * @param isOpen - The current open state of the element.
 */
export function useOutsideClickHandler(
  dialogRef: RefObject<HTMLDivElement | null>,
  setIsOpen: (isOpen: boolean) => void,
  isOpen: boolean
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, dialogRef, setIsOpen]);
}
