import { renderHook, waitFor } from '@testing-library/react';
import { useVisualizacaoAtaPaa } from '../useVisualizacaoAtaPaa';
import { getAtaPaa, getTabelasAtasPaa } from '../../../../../../../services/escolas/AtasPaa.service';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    state: {},
  }),
  useParams: () => ({
    uuid_paa: '123',
  }),
}));

jest.mock('../../../../../../../services/escolas/AtasPaa.service', () => ({
  getAtaPaa: jest.fn(),
  getTabelasAtasPaa: jest.fn(),
}));

jest.mock('../../../../../../../services/escolas/PresentesAtaPaa.service', () => ({
  getListaPresentesPaa: jest.fn(() => Promise.resolve([])),
}));

jest.mock(
  '../../../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/hooks/useGetAtaPaaVigente',
  () => ({
    useGetAtaPaaVigente: () => ({
      ataPaa: {
        uuid: 'ata-123',
      },
    }),
  })
);

jest.mock(
  '../../../../../Paa/componentes/hooks/useGetPaa',
  () => ({
    useGetPaa: () => ({
      data: {},
    }),
  })
);

jest.mock('../useGetPrioridadesAtaPaa', () => ({
  useGetPrioridadesAtaPaa: () => ({
    prioridadesAgrupadas: [],
    isLoading: false,
  }),
}));

jest.mock(
  '../../../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/AtividadesPrevistas/hooks/useGetAtividadesEstatutarias',
  () => ({
    useGetAtividadesEstatutarias: () => ({
      atividades: [],
      isLoading: false,
    }),
  })
);

describe('useVisualizacaoAtaPaa', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getTabelasAtasPaa.mockResolvedValue({});
  });

  it('deve retornar o nome do secretário', async () => {
    getAtaPaa.mockResolvedValue({
      secretario_reuniao: 'João da Silva',
    });

    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => {
      expect(
        result.current.getNomeSecretarioReuniao()
      ).toBe('João da Silva');
    });
  });

  it('deve retornar placeholder quando não houver secretário', async () => {
    getAtaPaa.mockResolvedValue({
      secretario_reuniao: null,
    });

    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => {
      expect(
        result.current.getNomeSecretarioReuniao()
      ).toBe('_____');
    });
  });

  it('deve formatar uma data válida corretamente no padrão pt-BR', async () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    const dataFormatada = result.current.formatarData('2026-06-23');

    expect(dataFormatada).toBe('23/06/2026');
  });

  it('deve retornar "-" se o valor fornecido for nulo, indefinido ou vazio', async () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    expect(result.current.formatarData(null)).toBe('-');
    expect(result.current.formatarData(undefined)).toBe('-');
    expect(result.current.formatarData('')).toBe('-');
  });

  it('deve retornar "-" se o valor fornecido for uma data inválida', async () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    const dataFormatada = result.current.formatarData('data-invalida');

    expect(dataFormatada).toBe('-');
  });
});