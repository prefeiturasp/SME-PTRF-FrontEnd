import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { 
  ModalBootstrap, 
  ModalBootstrapAcoesExtras, 
  ModalBootstrapSaldoInsuficiente,
  ModalFormBodyTextCloseButtonCabecalho
} from '../index';

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
it('aplica corretamente o atributo data-qa nos botões do ModalBootstrap se fornecido', () => {
    render(
      <ModalBootstrap
        show={true}
        titulo="Título QA"
        bodyText="Texto"
        dataQa="meu-modal"
        primeiroBotaoTexto="Salvar"
        primeiroBotaoOnclick={() => {}}
        segundoBotaoTexto="Cancelar"
        segundoBotaoOnclick={() => {}}
        onHide={() => {}}
      />
    );

    const btnPrimeiro = screen.getByRole('button', { name: /salvar/i });
    const btnSegundo = screen.getByRole('button', { name: /cancelar/i });

    expect(btnPrimeiro).toHaveAttribute('data-qa', 'meu-modal-btn-Salvar');
    expect(btnSegundo).toHaveAttribute('data-qa', 'meu-modal-btn-Cancelar');
  });

  it('renderiza botões dinâmicos no ModalBootstrapAcoesExtras a partir de bodyActions e dispara o clique', () => {
    const mockCallbackExtra = jest.fn();
    const acoesExtras = [
      { title: 'Ação Extra 1', callback: mockCallbackExtra }
    ];

    render(
      <ModalBootstrapAcoesExtras
        show={true}
        titulo="Modal Ações Extras"
        bodyText="Texto Principal"
        bodyActions={acoesExtras}
        primeiroBotaoTexto="Fechar"
        primeiroBotaoOnclick={() => {}}
        onHide={() => {}}
      />
    );

    const btnExtra = screen.getByRole('button', { name: /ação extra 1/i });
    expect(btnExtra).toBeInTheDocument();
    expect(btnExtra).toHaveClass('btn-success'); // Garante que pegou a classe variant='success' fixa do código

    fireEvent.click(btnExtra);
    expect(mockCallbackExtra).toHaveBeenCalledTimes(1);
  });

  it('oculta o primeiro botão no ModalBootstrapSaldoInsuficiente se aceitarLancamento for falso', () => {
    render(
      <ModalBootstrapSaldoInsuficiente
        show={true}
        titulo="Saldo Insuficiente"
        bodyText="Sem saldo em conta."
        aceitarLancamento={false}
        primeiroBotaoTexto="Avançar"
        primeiroBotaoOnclick={() => {}}
        onHide={() => {}}
      />
    );

    const btnAvancar = screen.queryByRole('button', { name: /avançar/i });
    expect(btnAvancar).not.toBeInTheDocument();
  });

  it('exibe o primeiro botão e data-qa estático no ModalBootstrapSaldoInsuficiente se aceitarLancamento for verdadeiro', () => {
    render(
      <ModalBootstrapSaldoInsuficiente
        show={true}
        titulo="Saldo Insuficiente"
        bodyText="Deseja prosseguir?"
        aceitarLancamento={true}
        primeiroBotaoTexto="Avançar"
        primeiroBotaoOnclick={() => {}}
        onHide={() => {}}
      />
    );

    const btnAvancar = screen.getByRole('button', { name: /avançar/i });
    expect(btnAvancar).toBeInTheDocument();
    expect(btnAvancar).toHaveAttribute('data-qa', 'modal-saldo-insuficiente-btn-Avançar');
  });

  it('renderiza o botão X customizado no ModalFormBodyTextCloseButtonCabecalho e aciona o onHide', () => {
    const mockOnHide = jest.fn();
    render(
      <ModalFormBodyTextCloseButtonCabecalho
        show={true}
        titulo="Modal com Fechar"
        bodyText="Conteúdo do Form"
        onHide={mockOnHide}
      />
    );

    const btnFecharX = screen.getByRole('button', { name: /fechar/i });
    expect(btnFecharX).toBeInTheDocument();

    fireEvent.click(btnFecharX);
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });
});

