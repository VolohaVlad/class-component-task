import { type PropsWithChildren, useCallback, useState } from 'react';

interface TooltipProps {
  text: string;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({
  text,
  className = '',
  side,
  children,
}: PropsWithChildren<TooltipProps>) => {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), [setOpen]);
  const hide = useCallback(() => setOpen(false), [setOpen]);

  let sideClass = '';
  if (side === 'top') sideClass = 'bottom-full mb-2 left-1/2 -translate-x-1/2';
  if (side === 'bottom') sideClass = 'top-full mt-2 left-1/2 -translate-x-1/2';
  if (side === 'left') sideClass = 'right-full mr-2 top-1/2 -translate-y-1/2';
  if (side === 'right') sideClass = 'left-full ml-2 top-1/2 -translate-y-1/2';

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        className="outline-none cursor-pointer"
      >
        {children}
      </span>
      {open && (
        <span
          className={`
              absolute z-20 px-3 py-2 rounded bg-black text-white text-sm
              whitespace-nowrap pointer-events-none select-none transition-opacity
              opacity-90
              ${sideClass}
            `}
          role="tooltip"
        >
          {text}
        </span>
      )}
    </span>
  );
};
