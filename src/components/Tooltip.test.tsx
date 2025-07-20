import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from './Tooltip';

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <Tooltip text="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter and hides on mouse leave', () => {
    render(
      <Tooltip text="Tooltip content">
        <button>Trigger</button>
      </Tooltip>
    );
    const trigger = screen.getByText('Trigger');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip content');

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on focus and hides on blur', () => {
    render(
      <Tooltip text="More info">
        <button>Focusable</button>
      </Tooltip>
    );
    const trigger = screen.getByText('Focusable');
    fireEvent.focus(trigger);
    expect(screen.getByRole('tooltip')).toHaveTextContent('More info');
    fireEvent.blur(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('adds custom classes and supports side prop', () => {
    const { container } = render(
      <Tooltip text="Side tip" className="my-extra-class" side="right">
        <span>Hover</span>
      </Tooltip>
    );
    expect(container.firstChild).toHaveClass('my-extra-class');
    const trigger = screen.getByText('Hover');
    fireEvent.mouseEnter(trigger);

    expect(screen.getByRole('tooltip').className).toMatch(/left-full/);
  });
});
