import { useState, useRef, useEffect, useCallback } from 'react';

interface InfoTooltipProps {
  content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => setVisible((v) => !v), []);
  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!visible) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible]);

  return (
    <span className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        onMouseEnter={show}
        onMouseLeave={hide}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-500 transition-colors hover:text-gray-300"
        aria-label="Más información"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8 15A7 7 0 108 1a7 7 0 000 14zm.75-10.25a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0v-.01zM8 7a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 7z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-white/[0.08] bg-[#1e2a3d] px-3 py-2.5 text-xs leading-relaxed text-gray-300 shadow-xl"
        >
          {content}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1e2a3d]" />
        </div>
      )}
    </span>
  );
}
