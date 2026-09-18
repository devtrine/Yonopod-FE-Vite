import { useState, useRef, useLayoutEffect, useEffect } from "react";

export interface DropdownPosition {
  top?: number;
  bottom?: number;
  left: number;
  maxHeight: number;
}

/**
 * Calculates optimal position for a dropdown menu relative to its trigger button.
 * - Opens downward if there is sufficient space below (or more space below than above).
 * - Opens upward anchoring its bottom directly above the trigger button if space below is insufficient.
 * - Chooses right-alignment or left-alignment relative to trigger button depending on available horizontal space,
 *   preventing it from overflowing or hugging the screen edge.
 * - Enforces minimum viewport padding so menus are never pressed against the viewport edges.
 */
export function calculateDropdownPosition(
  triggerRect: DOMRect,
  menuWidth = 192,
  estimatedMenuHeight = 220,
  viewportPadding = 12
): DropdownPosition {
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  // Prefer opening downwards unless space below is tight AND there's more room above
  const openUpward = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

  let top: number | undefined;
  let bottom: number | undefined;
  let maxHeight: number;

  if (openUpward) {
    // Anchor bottom of menu 6px above trigger button
    bottom = window.innerHeight - triggerRect.top + 6;
    maxHeight = Math.max(100, spaceAbove - viewportPadding - 6);
  } else {
    // Anchor top of menu 6px below trigger button
    top = triggerRect.bottom + 6;
    maxHeight = Math.max(100, spaceBelow - viewportPadding - 6);
  }

  // Horizontal calculation:
  // Preference 1: Right-align with the trigger button
  const rightAlignedLeft = triggerRect.right - menuWidth;
  // Preference 2: Left-align with the trigger button (great for left-column items on mobile)
  const leftAlignedLeft = triggerRect.left;

  let left: number;
  if (rightAlignedLeft >= viewportPadding) {
    left = rightAlignedLeft;
  } else if (leftAlignedLeft + menuWidth <= window.innerWidth - viewportPadding) {
    left = leftAlignedLeft;
  } else {
    left = rightAlignedLeft;
  }

  // Clamp to guarantee safe margins from screen edges
  left = Math.max(
    viewportPadding,
    Math.min(left, window.innerWidth - menuWidth - viewportPadding)
  );

  return { top, bottom, left, maxHeight };
}

export function useDropdownPosition({
  open,
  setOpen,
  menuWidth = 192,
  estimatedMenuHeight = 220,
  viewportPadding = 12,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuWidth?: number;
  estimatedMenuHeight?: number;
  viewportPadding?: number;
}) {
  const [pos, setPos] = useState<DropdownPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }

    const updatePos = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos(
        calculateDropdownPosition(
          rect,
          menuWidth,
          estimatedMenuHeight,
          viewportPadding
        )
      );
    };

    updatePos();

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpenRef.current(false);
    };

    const handleScroll = () => setOpenRef.current(false);
    const handleResize = () => setOpenRef.current(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, menuWidth, estimatedMenuHeight, viewportPadding]);

  return { pos, triggerRef, menuRef };
}
