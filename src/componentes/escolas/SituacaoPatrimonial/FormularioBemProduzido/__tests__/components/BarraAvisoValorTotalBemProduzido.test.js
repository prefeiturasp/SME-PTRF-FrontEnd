import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarraAvisoValorTotalBemProduzido } from '../../components/BarraAvisoValorTotalBemProduzido';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faExclamationCircle);

describe('BarraAvisoValorTotalBemProduzido', () => {
  it('renderiza o componente corretamente', () => {
    render(<BarraAvisoValorTotalBemProduzido />);
    
    expect(screen.getByText(
      /Ao classificar os itens produzidos, certifique-se de que a soma dos valores corresponda ao valor total do bem produzido/i
    )).toBeInTheDocument();
  });

  it('exibe a mensagem completa de aviso', () => {
    render(<BarraAvisoValorTotalBemProduzido />);
    
    expect(screen.getByText(
      /Isso garante que o cadastro seja concluído corretamente/i
    )).toBeInTheDocument();
  });

  it('renderiza o ícone de aviso', () => {
    const { container } = render(<BarraAvisoValorTotalBemProduzido />);
    
    const iconElement = container.querySelector('.icone-barra-aviso-valor-total-bem-produzido');
    expect(iconElement).toBeInTheDocument();
  });

  it('renderiza a estrutura HTML correta', () => {
    const { container } = render(<BarraAvisoValorTotalBemProduzido />);
    
    const barraElement = container.querySelector('.barra-aviso-valor-total-bem-produzido');
    expect(barraElement).toBeInTheDocument();
  });

  it('renderiza a mensagem dentro de um parágrafo', () => {
    const { container } = render(<BarraAvisoValorTotalBemProduzido />);
    
    const paragrafoElement = container.querySelector('p.pt-1.pb-1.ml-1.mb-0');
    expect(paragrafoElement).toBeInTheDocument();
  });

  it('possui a classe col-12 para ocupar toda a largura', () => {
    const { container } = render(<BarraAvisoValorTotalBemProduzido />);
    
    const colElement = container.querySelector('.col-12');
    expect(colElement).toBeInTheDocument();
  });
});

