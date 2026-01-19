import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModalAntDesignConfirmacao } from '../index';

describe('ModalAntDesignConfirmacao', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  it('renderiza modal quando handleShow é true', () => {
    render(
      <ModalAntDesignConfirmacao
        titulo="Título Teste"
        handleShow={true}
        handleOk={() => {}}
        handleCancel={() => {}}
        bodyText="Mensagem de teste"
      />
    );

    expect(screen.getByText('Título Teste')).toBeInTheDocument();
    expect(screen.getByText('Mensagem de teste')).toBeInTheDocument();
  });

  it('renderiza modal com textos customizados', () => {
    render(
      <ModalAntDesignConfirmacao
        titulo="Título Customizado"
        handleShow={true}
        handleOk={() => {}}
        handleCancel={() => {}}
        bodyText="Mensagem customizada"
        okText="OK"
        cancelText="Cancelar"
      />
    );

    expect(screen.getByText('Título Customizado')).toBeInTheDocument();
    expect(screen.getByText('Mensagem customizada')).toBeInTheDocument();
  });
});

