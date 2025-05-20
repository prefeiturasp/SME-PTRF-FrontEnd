import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAcessoEmSuporteInfo } from '../useAcessoEmSuporteInfo';
import { visoesService } from '../../../services/visoes.service';

jest.mock('../../../services/visoes.service');


describe('useAcessoEmSuporteInfo', () => {
    const queryClient = new QueryClient()
    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
                {children}
        </QueryClientProvider>
    );
    afterEach(() => {
        jest.clearAllMocks();
    });

  it('deve retornar unidadeEstaEmSuporte como true quando a unidade selecionada tem acesso_de_suporte', () => {
    const mockDadosUsuario = {
      unidade_selecionada: { uuid: 'uuid-123' },
      unidades: [
        { uuid: 'uuid-123', acesso_de_suporte: true },
        { uuid: 'uuid-456', acesso_de_suporte: false },
      ],
    };

    visoesService.getDadosDoUsuarioLogado.mockReturnValue(mockDadosUsuario);

    const { result } = renderHook(() => useAcessoEmSuporteInfo(), { wrapper });

    expect(result.current.unidadeEstaEmSuporte).toBe(true);
  });

  it('deve retornar unidadeEstaEmSuporte como false quando a unidade selecionada não tem acesso_de_suporte', () => {
    const mockDadosUsuario = {
      unidade_selecionada: { uuid: 'uuid-456' },
      unidades: [
        { uuid: 'uuid-123', acesso_de_suporte: true },
        { uuid: 'uuid-456', acesso_de_suporte: false },
      ],
    };

    visoesService.getDadosDoUsuarioLogado.mockReturnValue(mockDadosUsuario);

    const { result } = renderHook(() => useAcessoEmSuporteInfo(), { wrapper });

    expect(result.current.unidadeEstaEmSuporte).toBe(false);
  });

  it('deve retornar unidadeEstaEmSuporte como false se não houver dados do usuário logado', () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue(null);

    const { result } = renderHook(() => useAcessoEmSuporteInfo(), { wrapper });

    expect(result.current.unidadeEstaEmSuporte).toBe(false);
  });

  it('deve retornar unidadeEstaEmSuporte como false se a unidade selecionada não for encontrada', () => {
    const mockDadosUsuario = {
      unidade_selecionada: { uuid: 'uuid-999' },
      unidades: [
        { uuid: 'uuid-123', acesso_de_suporte: true },
        { uuid: 'uuid-456', acesso_de_suporte: false },
      ],
    };

    visoesService.getDadosDoUsuarioLogado.mockReturnValue(mockDadosUsuario);

    const { result } = renderHook(() => useAcessoEmSuporteInfo(), { wrapper });

    expect(result.current.unidadeEstaEmSuporte).toBe(false);
  });

});