import { Component, type ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

interface TooltipState {
  open: boolean;
}

class Tooltip extends Component<TooltipProps, TooltipState> {
  state: TooltipState = {
    open: false,
  };

  show = () => this.setState({ open: true });
  hide = () => this.setState({ open: false });

  render() {
    const { children, text, className = '', side = 'top' } = this.props;
    const { open } = this.state;

    let sideClass = '';
    if (side === 'top')
      sideClass = 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    if (side === 'bottom')
      sideClass = 'top-full mt-2 left-1/2 -translate-x-1/2';
    if (side === 'left') sideClass = 'right-full mr-2 top-1/2 -translate-y-1/2';
    if (side === 'right') sideClass = 'left-full ml-2 top-1/2 -translate-y-1/2';

    return (
      <span className={`relative inline-block ${className}`}>
        <span
          onMouseEnter={this.show}
          onMouseLeave={this.hide}
          onFocus={this.show}
          onBlur={this.hide}
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
  }
}

export default Tooltip;
