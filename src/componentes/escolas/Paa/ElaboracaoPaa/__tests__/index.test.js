import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTextosPaaUe } from '../../../../../services/escolas/PrestacaoDeContas.service';
import { usePostPaa } from "../hooks/usePostPaa";
import { getPaaVigente, getParametroPaa } from "../../../../../services/sme/Parametrizacoes.service";
import { getStatusGeracaoDocumentoPaa } from "../../../../../services/escolas/Paa.service";
import { ElaboracaoPaa } from '../index';

jest.mock("../hooks/usePostPaa");

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../../../../services/sme/Parametrizacoes.service', () => ({
  getPaaVigente: jest.fn(),
  getParametroPaa: jest.fn(),
}));

jest.mock('../../../../../services/escolas/PrestacaoDeContas.service', () => ({
  getTextosPaaUe: jest.fn(),
}));

jest.mock('../../../../../services/escolas/Paa.service', () => ({
  getStatusGeracaoDocumentoPaa: jest.fn(),
}));

jest.mock('../../../../../paginas/PaginasContainer', () => ({
  PaginasContainer: ({ children }) => <div>{children}</div>,
}));

jest.mock('../EstruturaCompletaModeloPaa', () => ({
  EstruturaCompletaModeloPaa: () => <div data-testid="estrutura-modelo-paa" />,
}));

const mockNavigate = jest.fn();
let queryClient;
const mockMutatePost = jest.fn();

describe('ElaboracaoPaa Component', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    usePostPaa.mockReturnValue({
      mutationPost: { mutate: mockMutatePost, isPending: false },
    });

    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

    jest.clearAllMocks();

    usePostPaa.mockReturnValue({
      mutationPost: { mutate: mockMutatePost, isPending: false },
    });
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  it('renderiza a página com botão habilitado e cria novo PAA ao clicar', async () => {
    getTextosPaaUe.mockResolvedValue({
      texto_pagina_paa_ue: "Texto ABC",
      introducao_do_paa_ue_1: '',
      introducao_do_paa_ue_2: '',
      conclusao_do_paa_ue_1: '',
      conclusao_do_paa_ue_2: '',
    });
    // PAA não existe → catch mantém notValidPaa=true → botão cria novo PAA ao clicar
    getPaaVigente.mockRejectedValue(new Error('PAA não encontrado'));
    getParametroPaa.mockResolvedValue({ detail: new Date().getMonth() + 1 });

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ElaboracaoPaa />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByTestId('elaborar-paa-button')).toBeInTheDocument()
    );

    expect(screen.getByText('Texto ABC')).toBeInTheDocument();
    expect(screen.getByTestId('elaborar-paa-button')).toBeEnabled();
    expect(getTextosPaaUe).toHaveBeenCalled();
    expect(getPaaVigente).toHaveBeenCalled();
    expect(getParametroPaa).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('elaborar-paa-button'));

    expect(mockMutatePost).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/elaborar-novo-paa');
  });

  it('renderiza a página com botão desabilitado fora do mês válido', async () => {
    getTextosPaaUe.mockResolvedValue({
      texto_pagina_paa_ue: "Texto ABC",
      introducao_do_paa_ue_1: '',
      introducao_do_paa_ue_2: '',
      conclusao_do_paa_ue_1: '',
      conclusao_do_paa_ue_2: '',
    });
    getPaaVigente.mockResolvedValue({});
    getStatusGeracaoDocumentoPaa.mockResolvedValue({ status: null, versao: null });
    getParametroPaa.mockResolvedValue({ detail: new Date().getMonth() + 2 });

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ElaboracaoPaa />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByTestId('elaborar-paa-button')).toBeInTheDocument()
    );

    expect(screen.getByText('Texto ABC')).toBeInTheDocument();
    expect(screen.getByTestId('elaborar-paa-button')).toBeDisabled();
    expect(getTextosPaaUe).toHaveBeenCalled();
    expect(getPaaVigente).toHaveBeenCalled();
    expect(getParametroPaa).toHaveBeenCalled();
  });
});
