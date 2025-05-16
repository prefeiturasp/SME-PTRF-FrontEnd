import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { MemoryRouter, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTextoExplicacaoPaa } from '../../../../../services/escolas/PrestacaoDeContas.service';
import { usePostPaa } from "../hooks/usePostPaa";
import { getPaaVigente, getParametroPaa } from "../../../../../services/sme/Parametrizacoes.service";
import { ElaboracaoPaa } from '../index';

jest.mock("../hooks/usePostPaa");

jest.mock("react-router-dom-v5-compat", () => ({
  ...jest.requireActual("react-router-dom-v5-compat"),
  useNavigate: jest.fn()
}));

jest.mock('../../../../../services/sme/Parametrizacoes.service', () => ({
  getPaaVigente: jest.fn(),
  getParametroPaa: jest.fn()
}));

jest.mock('../../../../../services/escolas/PrestacaoDeContas.service', () => ({
  getTextoExplicacaoPaa: jest.fn()
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

let queryClient;
const mockMutatePost = jest.fn();

describe('ElaboracaoPaa Component', () => {
 
  beforeEach(() => {
      queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });

      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));
  
      usePostPaa.mockReturnValue({
        mutationPost: { mutate: mockMutatePost, isLoading: false },
      });
    });

  it('renderiza a página', () => {
    useNavigate.mockReturnValue(mockNavigate);
    getTextoExplicacaoPaa.mockResolvedValue({detail: "Texto ABC"});
    getPaaVigente.mockReturnValue({});
    getParametroPaa.mockReturnValue({detail: new Date().getMonth() + 1});
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ElaboracaoPaa />
        </QueryClientProvider>
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText('Texto ABC')).toBeInTheDocument();
      expect(screen.getByText('Confira a estrutura completa aqui.')).toBeInTheDocument();
      expect(screen.getByTestId('elaborar-paa-button')).toBeInTheDocument();
      expect(screen.getByTestId('elaborar-paa-button')).toBeEnabled();
      expect(getTextoExplicacaoPaa).toHaveBeenCalled();
      expect(getPaaVigente).toHaveBeenCalled();
      expect(getParametroPaa).toHaveBeenCalled();
      fireEvent.click(screen.getByTestId('elaborar-paa-button'));
      expect(mockMutatePost).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/elaborar-novo-paa');
    });
    
  });

  it('renderiza a página com botão desabilitado', () => {
    useNavigate.mockReturnValue(mockNavigate);
    getTextoExplicacaoPaa.mockResolvedValue({detail: "Texto ABC"});
    getPaaVigente.mockReturnValue({});
    getParametroPaa.mockReturnValue({detail: new Date().getMonth() + 2});
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ElaboracaoPaa />
        </QueryClientProvider>
      </MemoryRouter>
    );

    waitFor(() => {
      expect(screen.getByText('Texto ABC')).toBeInTheDocument();
      expect(screen.getByText('Confira a estrutura completa aqui.')).toBeInTheDocument();
      expect(screen.getByTestId('elaborar-paa-button')).toBeInTheDocument();
      expect(screen.getByTestId('elaborar-paa-button')).toBeDisabled();
      expect(getTextoExplicacaoPaa).toHaveBeenCalled();
      expect(getPaaVigente).toHaveBeenCalled();
      expect(getParametroPaa).toHaveBeenCalled();
    });
    
  });

});
