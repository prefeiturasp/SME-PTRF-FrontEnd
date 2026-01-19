import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModalBootstrap } from '../index';

describe('ModalBootstrap', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it('renderiza modal com título e bodyText', () => {
    render(
      <ModalBootstrap
        show={true}
        titulo="Título Teste"
        bodyText="<p>Conteúdo do modal</p>"
        primeiroBotaoTexto="Confirmar"
        primeiroBotaoOnclick={() => {}}
        onHide={() => {}}
      />
    );

    expect(screen.getByText('Título Teste')).toBeInTheDocument();
  });

  it('renderiza modal quando show é true', () => {
    render(
      <ModalBootstrap
        show={true}
        titulo="Título"
        bodyText="Conteúdo"
        primeiroBotaoTexto="Confirmar"
        primeiroBotaoOnclick={() => {}}
        onHide={() => {}}
      />
    );

    expect(screen.getByText('Título')).toBeInTheDocument();
  });
});

