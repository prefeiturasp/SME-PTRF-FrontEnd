import React from 'react';
import { render, screen } from '@testing-library/react';
import { TooltipWrapper } from '../index';
import '@testing-library/jest-dom';

jest.mock('react-tooltip', () => ({
  Tooltip: ({ id }) => <div data-testid={`tooltip-${id}`} />
}));

describe('TooltipWrapper', () => {
  it('deve renderizar o componente com children', () => {
    render(
      <TooltipWrapper id="test-tooltip" content="Conteúdo do tooltip">
        <span>Texto</span>
      </TooltipWrapper>
    );
    
    expect(screen.getByText('Texto')).toBeInTheDocument();
  });

  it('deve aplicar atributos corretos ao span', () => {
    const { container } = render(
      <TooltipWrapper id="test-tooltip" content="Conteúdo do tooltip">
        <span>Texto</span>
      </TooltipWrapper>
    );
    
    const span = container.querySelector('span[data-tooltip-id]');
    expect(span).toHaveAttribute('data-tooltip-id', 'test-tooltip');
    expect(span).toHaveAttribute('data-tooltip-html', 'Conteúdo do tooltip');
  });

  it('deve renderizar o Tooltip com o id correto', () => {
    render(
      <TooltipWrapper id="meu-tooltip" content="Conteúdo">
        <span>Texto</span>
      </TooltipWrapper>
    );
    
    expect(screen.getByTestId('tooltip-meu-tooltip')).toBeInTheDocument();
  });
});

