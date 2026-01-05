import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MenuInterno } from '../index';
import '@testing-library/jest-dom';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MenuInterno', () => {
  const mockCaminhos = [
    { url: 'pagina1', label: 'Página 1', permissao: true },
    { url: 'pagina2', label: 'Página 2', permissao: true },
    { url: 'pagina3', label: 'Página 3', permissao: false }
  ];

  it('deve renderizar os itens do menu com permissão', () => {
    renderWithRouter(<MenuInterno caminhos_menu_interno={mockCaminhos} />);
    
    expect(screen.getByText('Página 1')).toBeInTheDocument();
    expect(screen.getByText('Página 2')).toBeInTheDocument();
    expect(screen.queryByText('Página 3')).not.toBeInTheDocument();
  });

  it('deve renderizar links corretos', () => {
    renderWithRouter(<MenuInterno caminhos_menu_interno={mockCaminhos} />);
    
    const link1 = screen.getByText('Página 1').closest('a');
    expect(link1).toHaveAttribute('href', '/pagina1');
  });

  it('deve incluir origem quando fornecido', () => {
    const caminhosComOrigem = [
      { url: 'pagina', origem: 'teste', label: 'Página', permissao: true }
    ];
    
    renderWithRouter(<MenuInterno caminhos_menu_interno={caminhosComOrigem} />);
    
    const link = screen.getByText('Página').closest('a');
    expect(link).toHaveAttribute('href', '/pagina/teste/');
  });

  it('não deve renderizar nada quando caminhos_menu_interno não é fornecido', () => {
    const { container } = renderWithRouter(<MenuInterno />);
    expect(container.querySelector('.menu-interno')).toBeInTheDocument();
  });
});

