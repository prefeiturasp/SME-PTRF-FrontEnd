import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TextosPaa } from '../index.js';
import { getTextosPaaUe, patchTextosPaaUe } from '../../../../../../services/escolas/PrestacaoDeContas.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock('tinymce/tinymce', () => ({}));
jest.mock('tinymce/themes/silver', () => ({}));
jest.mock('tinymce/icons/default', () => ({}));
jest.mock('tinymce/models/dom', () => ({}));
jest.mock('tinymce/plugins/advlist', () => ({}));
jest.mock('tinymce/plugins/lists', () => ({}));
jest.mock('tinymce/plugins/link', () => ({}));
jest.mock('tinymce/plugins/autolink', () => ({}));
jest.mock('tinymce/plugins/preview', () => ({}));
jest.mock('tinymce/plugins/anchor', () => ({}));
jest.mock('tinymce/plugins/code', () => ({}));
jest.mock('tinymce/plugins/charmap', () => ({}));
jest.mock('tinymce/plugins/fullscreen', () => ({}));
jest.mock('tinymce/plugins/visualblocks', () => ({}));
jest.mock('tinymce/plugins/searchreplace', () => ({}));
jest.mock('tinymce/plugins/insertdatetime', () => ({}));
jest.mock('tinymce/plugins/table', () => ({}));
jest.mock('tinymce/plugins/wordcount', () => ({}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock('../../../../../../services/escolas/PrestacaoDeContas.service', () => ({
    getTextosPaaUe: jest.fn(),
    patchTextosPaaUe: jest.fn()
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
        window.matchMedia = jest.fn().mockImplementation((query) => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));
    });

    test('deve renderizar o título corretamente', async () => {
        getTextosPaaUe.mockResolvedValue({ 
            texto_pagina_paa_ue: 'Texto de exemplo',
            introducao_do_paa_ue_1: '',
            introducao_do_paa_ue_2: '',
            conclusao_do_paa_ue_1: '',
            conclusao_do_paa_ue_2: ''
        });
        render(
            <MemoryRouter>
                <TextosPaa />
            </MemoryRouter>
        );
        expect(await screen.findByText(/Textos do PAA/i)).toBeInTheDocument();
    });

    test('deve exibir a tabela de textos após o carregamento', async () => {
        getTextosPaaUe.mockResolvedValue({ 
            texto_pagina_paa_ue: 'Texto de exemplo',
            introducao_do_paa_ue_1: '',
            introducao_do_paa_ue_2: '',
            conclusao_do_paa_ue_1: '',
            conclusao_do_paa_ue_2: ''
        });
        render(
            <MemoryRouter>
                <TextosPaa />
            </MemoryRouter>
        );
        expect(await screen.findByText(/Exibindo/i)).toBeInTheDocument();
    });

    test('deve abrir o editor ao clicar no botão de edição', async () => {
        getTextosPaaUe.mockResolvedValue({ 
            texto_pagina_paa_ue: 'Texto de exemplo',
            introducao_do_paa_ue_1: '',
            introducao_do_paa_ue_2: '',
            conclusao_do_paa_ue_1: '',
            conclusao_do_paa_ue_2: ''
        });
        render(
            <MemoryRouter>
                <TextosPaa />
            </MemoryRouter>
        );

        // Clica no primeiro botão de editar (texto_pagina_paa_ue)
        const editButtons = await screen.findAllByRole('button', { name: /editar/i });
        fireEvent.click(editButtons[0]);
        
        expect(await screen.findByText(/Explicação sobre o PAA/i)).toBeInTheDocument();
    });

    test('deve enviar o texto editado com sucesso', async () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

      getTextosPaaUe.mockResolvedValue({ 
          texto_pagina_paa_ue: 'Texto de exemplo',
          introducao_do_paa_ue_1: '',
          introducao_do_paa_ue_2: '',
          conclusao_do_paa_ue_1: '',
          conclusao_do_paa_ue_2: ''
      });
      patchTextosPaaUe.mockResolvedValue({});
      render(
          <MemoryRouter>
              <TextosPaa />
          </MemoryRouter>
      );

      // Clica no primeiro botão de editar (texto_pagina_paa_ue)
      const editButtons = await screen.findAllByRole('button', { name: /editar/i });
      fireEvent.click(editButtons[0]);

      expect(await screen.findByText(/Explicação sobre o PAA/i)).toBeInTheDocument();

      const submitButton = await screen.findByRole('button', { name: /salvar/i });
      fireEvent.click(submitButton);

      await waitFor(() => expect(patchTextosPaaUe).toHaveBeenCalled());
    });

    test('deve exibir mensagem de erro ao falhar ao editar o texto', async () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  
      getTextosPaaUe.mockResolvedValue({ 
          texto_pagina_paa_ue: 'Texto de exemplo',
          introducao_do_paa_ue_1: '',
          introducao_do_paa_ue_2: '',
          conclusao_do_paa_ue_1: '',
          conclusao_do_paa_ue_2: ''
      });
      patchTextosPaaUe.mockRejectedValue(new Error('Erro ao editar'));
      render(
          <MemoryRouter>
              <TextosPaa />
          </MemoryRouter>
      );
  
      // Clica no primeiro botão de editar (texto_pagina_paa_ue)
      const editButtons = await screen.findAllByRole('button', { name: /editar/i });
      fireEvent.click(editButtons[0]);
  
      expect(await screen.findByText(/Explicação sobre o PAA/i)).toBeInTheDocument();
  
      const submitButton = await screen.findByRole('button', { name: /salvar/i });
      fireEvent.click(submitButton);
  
      await waitFor(() => expect(patchTextosPaaUe).toHaveBeenCalled());
    });
});
