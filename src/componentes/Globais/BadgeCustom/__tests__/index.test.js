import React from 'react';
import { render, screen } from '@testing-library/react';
import { BadgeCustom } from '../index';

describe('BadgeCustom', () => {
  it('renderiza botão sem badge quando badge é false', () => {
    render(
      <BadgeCustom
        badge={false}
        buttonlabel="Teste"
        buttoncolor="#000000"
      />
    );
    
    expect(screen.getByText('Teste')).toBeInTheDocument();
  });

  it('renderiza botão com badge quando badge é true', () => {
    render(
      <BadgeCustom
        badge={true}
        buttonlabel="Teste"
        buttoncolor="#000000"
      />
    );
    
    expect(screen.getByText('Teste')).toBeInTheDocument();
  });

  it('chama handleClick quando botão é clicado', () => {
    const handleClick = jest.fn();
    render(
      <BadgeCustom
        badge={false}
        buttonlabel="Teste"
        buttoncolor="#000000"
        handleClick={handleClick}
      />
    );
    
    screen.getByText('Teste').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

