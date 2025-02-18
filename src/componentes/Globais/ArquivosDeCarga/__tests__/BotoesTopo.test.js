import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BotoesTopo } from '../BotoesTopo';


describe('Componente BotoesTopo', () => {
  jest.mock('../../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
  }));
  const mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes = require('../../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes').RetornaSeTemPermissaoEdicaoPainelParametrizacoes;
  const mockSetShowModalForm = jest.fn();
  const mockSetStateFormModal = jest.fn();
  const mockhandleClickDownloadModeloArquivoDeCarga = jest.fn();
  const mockinitialStateFormModal = {}
  it('deve renderizar os botões com o texto e ícone corretamente', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BotoesTopo
            setShowModalForm={mockSetShowModalForm}
            setStateFormModal={mockSetStateFormModal}
            initialStateFormModal={mockinitialStateFormModal}
            handleClickDownloadModeloArquivoDeCarga={mockhandleClickDownloadModeloArquivoDeCarga}
            temPermissaoEditarCarga={mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes}
        />
    );

    const botao_adicionar_carga = screen.getByRole('button', { name: /Adicionar carga/i });
    const botao_baixar_modelo = screen.getByRole('button', { name: /Baixar modelo de planilha/i });
    expect(botao_adicionar_carga).toBeInTheDocument();
    expect(botao_baixar_modelo).toBeInTheDocument();

  });

  it('deve habilitar o botão quando houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BotoesTopo
          setShowModalForm={mockSetShowModalForm}
          setStateFormModal={mockSetStateFormModal}
          initialStateFormModal={mockinitialStateFormModal}
          handleClickDownloadModeloArquivoDeCarga={mockhandleClickDownloadModeloArquivoDeCarga}
          temPermissaoEditarCarga={mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes}
      />
    );

    const button = screen.getByRole('button', { name: /Adicionar carga/i });
    expect(button).not.toBeDisabled();
  });

  it('deve desabilitar o botão quando não houver permissão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(
      <BotoesTopo
          setShowModalForm={mockSetShowModalForm}
          setStateFormModal={mockSetStateFormModal}
          initialStateFormModal={mockinitialStateFormModal}
          handleClickDownloadModeloArquivoDeCarga={mockhandleClickDownloadModeloArquivoDeCarga}
          temPermissaoEditarCarga={mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes}
      />
    );

    const button = screen.getByRole('button', { name: /Adicionar carga/i });
    expect(button).toBeDisabled();
  });

  it('deve chamar as funções de callback ao clicar no botão', () => {
    mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    render(
      <BotoesTopo
          setShowModalForm={mockSetShowModalForm}
          setStateFormModal={mockSetStateFormModal}
          initialStateFormModal={mockinitialStateFormModal}
          handleClickDownloadModeloArquivoDeCarga={mockhandleClickDownloadModeloArquivoDeCarga}
          temPermissaoEditarCarga={mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes}
      />
    );

    const botao_adicionar_carga = screen.getByRole('button', { name: /Adicionar carga/i });
    const botao_baixar_modelo = screen.getByRole('button', { name: /Baixar modelo de planilha/i });
    fireEvent.click(botao_adicionar_carga);
    fireEvent.click(botao_baixar_modelo);

    expect(mockSetStateFormModal).toHaveBeenCalledWith(mockinitialStateFormModal);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
    expect(mockhandleClickDownloadModeloArquivoDeCarga).toHaveBeenCalled();
  });
});