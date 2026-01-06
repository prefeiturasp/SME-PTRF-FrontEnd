import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from '../IconButton';
import '@testing-library/jest-dom';

jest.mock('../../Icon', () => ({
  Icon: ({ icon }) => <span data-testid="icon">{icon}</span>
}));

describe('IconButton', () => {
  it('deve renderizar o botão com label', () => {
    render(<IconButton label="Salvar" />);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<IconButton label="Clique" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Clique'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve estar desabilitado quando disabled é true', () => {
    render(<IconButton label="Botão" disabled={true} />);
    expect(screen.getByText('Botão')).toBeDisabled();
  });

  it('deve renderizar ícone à esquerda por padrão', () => {
    render(<IconButton icon="faPlus" label="Adicionar" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
  });

  it('deve aplicar variant corretamente', () => {
    const { container } = render(<IconButton label="Botão" variant="success" />);
    expect(container.querySelector('.btn-success')).toBeInTheDocument();
  });
});

