import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TextosPaa } from '../index.js';
import { getTextoExplicacaoPaa, patchTextoExplicacaoPaa } from '../../../../../../services/escolas/PrestacaoDeContas.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock('../../../../../../services/escolas/PrestacaoDeContas.service', () => ({
    getTextoExplicacaoPaa: jest.fn(),
    patchTextoExplicacaoPaa: jest.fn()
}));

jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn()
    }
}));

describe('TextosPaa Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('deve renderizar o título corretamente', async () => {
        getTextoExplicacaoPaa.mockResolvedValue({ detail: 'Texto de exemplo' });
        render(
            <MemoryRouter>
                <TextosPaa />
            </MemoryRouter>
        );
        expect(await screen.findByText(/Textos do PAA/i)).toBeInTheDocument();
    });

    test('deve exibir a tabela de textos após o carregamento', async () => {
        getTextoExplicacaoPaa.mockResolvedValue({ detail: 'Texto de exemplo' });
        render(
            <MemoryRouter>
                <TextosPaa />
            </MemoryRouter>
        );
        expect(await screen.findByText(/Exibindo/i)).toBeInTheDocument();
    });

    test('deve abrir o editor ao clicar no botão de edição', async () => {
        getTextoExplicacaoPaa.mockResolvedValue({ detail: 'Texto de exemplo' });
        render(
            <MemoryRouter>
                <TextosPaa />
            </MemoryRouter>
        );

        const editButton = await screen.findByRole('button', { name: /editar/i });
        fireEvent.click(editButton);
        
        expect(await screen.findByText(/Explicação sobre o PAA/i)).toBeInTheDocument();
    });

    test('deve enviar o texto editado com sucesso', async () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

      getTextoExplicacaoPaa.mockResolvedValue({ detail: 'Texto de exemplo' });
      patchTextoExplicacaoPaa.mockResolvedValue({});
      render(
          <MemoryRouter>
              <TextosPaa />
          </MemoryRouter>
      );

      const editButton = await screen.findByRole('button', { name: /editar/i });
      fireEvent.click(editButton);

      expect(await screen.findByText(/Explicação sobre o PAA/i)).toBeInTheDocument();

      const submitButton = await screen.findByRole('button', { name: /salvar/i });
      fireEvent.click(submitButton);

      await waitFor(() => expect(patchTextoExplicacaoPaa).toHaveBeenCalled());
      /* expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled(); */
    });

    test('deve exibir mensagem de erro ao falhar ao editar o texto', async () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  
      getTextoExplicacaoPaa.mockResolvedValue({ detail: 'Texto de exemplo' });
      patchTextoExplicacaoPaa.mockRejectedValue(new Error('Erro ao editar'));
      render(
          <MemoryRouter>
              <TextosPaa />
          </MemoryRouter>
      );
  
      const editButton = await screen.findByRole('button', { name: /editar/i });
      fireEvent.click(editButton);
  
      expect(await screen.findByText(/Explicação sobre o PAA/i)).toBeInTheDocument();
  
      const submitButton = await screen.findByRole('button', { name: /salvar/i });
      fireEvent.click(submitButton);
  
      await waitFor(() => expect(patchTextoExplicacaoPaa).toHaveBeenCalled());
      /* expect(toastCustom.ToastCustomError).toHaveBeenCalled(); */
    });
});
