import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from '../index';
import '@testing-library/jest-dom';

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <span data-testid="fontawesome-icon" {...props} />
}));

jest.mock('../icones', () => ({
  __esModule: true,
  default: {
    customIcon: '/path/to/icon.png'
  }
}));

describe('Icon', () => {
  it('deve renderizar ícone FontAwesome quando o ícone existe', () => {
    render(<Icon icon="faPlus" />);
    expect(screen.getByTestId('fontawesome-icon')).toBeInTheDocument();
  });

  it('deve renderizar imagem quando o ícone não é FontAwesome', () => {
    render(<Icon icon="customIcon" />);
    const img = screen.getByAltText('customIcon');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/path/to/icon.png');
  });

  it('deve renderizar tooltip quando tooltipMessage é fornecido', () => {
    const { container } = render(<Icon icon="faPlus" tooltipMessage="Clique aqui" />);
    const tooltip = container.querySelector('[aria-describedby]');
    expect(tooltip).toBeInTheDocument();
  });

  it('não deve renderizar tooltip quando tooltipMessage não é fornecido', () => {
    const { container } = render(<Icon icon="faPlus" />);
    const tooltip = container.querySelector('[aria-describedby]');
    expect(tooltip).not.toBeInTheDocument();
  });
});

