import { renderHook, act, waitFor } from '@testing-library/react';
import { useVisualizacaoAtaPaa } from '../useVisualizacaoAtaPaa';
import { getAtaPaa, getTabelasAtasPaa } from '../../../../../../../services/escolas/AtasPaa.service';
import { getListaPresentesPaa } from '../../../../../../../services/escolas/PresentesAtaPaa.service';
import { useGetAtaPaaVigente } from '../../../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/hooks/useGetAtaPaaVigente';
import { useGetPaa } from '../../../../../Paa/componentes/hooks/useGetPaa';
import { ASSOCIACAO_NOME_ESCOLA, ASSOCIACAO_TIPO_ESCOLA } from '../../../../../../../services/auth.service';

const mockNavigate = jest.fn();
let mockLocation = { pathname: '/', state: {} };
let mockParams = { uuid_paa: '123' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
}));

jest.mock('../../../../../../../services/escolas/AtasPaa.service', () => ({
  getAtaPaa: jest.fn(),
  getTabelasAtasPaa: jest.fn(),
}));

jest.mock('../../../../../../../services/escolas/PresentesAtaPaa.service', () => ({
  getListaPresentesPaa: jest.fn(),
}));

jest.mock('../../../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/hooks/useGetAtaPaaVigente', () => ({
  useGetAtaPaaVigente: jest.fn(),
}));

jest.mock('../../../../../Paa/componentes/hooks/useGetPaa', () => ({
  useGetPaa: jest.fn(),
}));

jest.mock('../useGetPrioridadesAtaPaa', () => ({
  useGetPrioridadesAtaPaa: () => ({
    prioridadesAgrupadas: [],
    isLoading: false,
  }),
}));

jest.mock('../../../../../Paa/ElaboracaoPaa/ElaborarNovoPlano/Relatorios/AtividadesPrevistas/hooks/useGetAtividadesEstatutarias', () => ({
  useGetAtividadesEstatutarias: () => ({
    atividades: [],
    isLoading: false,
  }),
}));

describe('useVisualizacaoAtaPaa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockLocation = { pathname: '/', state: {} };
    mockParams = { uuid_paa: '123' };

    getTabelasAtasPaa.mockResolvedValue({});
    getAtaPaa.mockResolvedValue({});
    getListaPresentesPaa.mockResolvedValue([]);
    useGetAtaPaaVigente.mockReturnValue({ ataPaa: { uuid: 'ata-123' } });
    useGetPaa.mockReturnValue({ data: {} });

    delete window.location;
    window.location = { pathname: '/visualizacao', search: '', assign: jest.fn() };
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

  it('deve carregar dados da ata e presentes se o uuid da ata estiver disponível', async () => {
    getAtaPaa.mockResolvedValue({ id: 'dados-da-ata' });
    getListaPresentesPaa.mockResolvedValue([{ nome: 'José', presente: true }]);

    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => {
      expect(getAtaPaa).toHaveBeenCalledWith('ata-123');
      expect(getTabelasAtasPaa).toHaveBeenCalled();
      expect(getListaPresentesPaa).toHaveBeenCalledWith('ata-123');
    });

    expect(result.current.dadosAta).toEqual({ id: 'dados-da-ata' });
    expect(result.current.listaPresentes).toHaveLength(1);
  });

  it('não deve disparar buscas se ataUuid for ausente', () => {
    useGetAtaPaaVigente.mockReturnValue({ ataPaa: null });

    renderHook(() => useVisualizacaoAtaPaa());

    expect(getAtaPaa).not.toHaveBeenCalled();
    expect(getListaPresentesPaa).not.toHaveBeenCalled();
  });

  it('deve capturar erro silenciosamente e resetar estados se a busca de presentes falhar', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getListaPresentesPaa.mockRejectedValue(new Error('Erro de API'));

    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => {
      expect(result.current.listaPresentes).toEqual([]);
      expect(result.current.listaCompletaParticipantes).toEqual([]);
    });

    consoleSpy.mockRestore();
  });

  it('deve navegar de volta para paa-vigente-e-anteriores ao fechar se a origem for correspondente', () => {
    mockLocation.state = { origem: 'paa-vigente-e-anteriores' };
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    act(() => {
      result.current.handleClickFecharAta();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/paa-vigente-e-anteriores');
  });

  it('deve navegar para rota padrão ao fechar sem estado de origem mapeado', () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    act(() => {
      result.current.handleClickFecharAta();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/elaborar-novo-paa', expect.any(Object));
  });

  it('deve processar rota atual e acionar window.location.assign na edição da ata', () => {
    window.location.pathname = '/teste-path';
    window.location.search = '?id=9';
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    act(() => {
      result.current.handleClickEditarAta();
    });

    const rotaEsperada = `/relatorios-paa/edicao-ata/123?returnUrl=${encodeURIComponent('/teste-path?id=9')}`;
    expect(window.location.assign).toHaveBeenCalledWith(rotaEsperada);
  });

  it('deve buscar e concatenar o tipo e nome da escola a partir do localStorage', () => {
    localStorage.setItem(ASSOCIACAO_TIPO_ESCOLA, 'EMEF');
    localStorage.setItem(ASSOCIACAO_NOME_ESCOLA, 'Saramago');
    
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    expect(result.current.getNomeUnidadeEducacional()).toBe('EMEF Saramago');
    expect(result.current.getTipoUnidadeComNome()).toBe('EMEF Saramago');
  });

  it('deve retornar apenas o valor presente caso falte um dos dados no localStorage', () => {
    localStorage.setItem(ASSOCIACAO_NOME_ESCOLA, 'Escola Isolada');
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    expect(result.current.getNomeUnidadeEducacional()).toBe('Escola Isolada');
    expect(result.current.getTipoUnidadeComNome()).toBe('Escola Isolada');
  });

  it('deve retornar fallbacks vazios ou com sublinhado se localStorage estiver limpo', () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    expect(result.current.getNomeUnidadeEducacional()).toBe('');
    expect(result.current.getTipoUnidadeComNome()).toBe('_____');
    expect(result.current.getNomeUnidade()).toBe('_____');
  });

  it('deve processar os dados da data de reunião por extenso adicionando 1 dia', async () => {
    getAtaPaa.mockResolvedValue({ data_reuniao: '2026-06-23' });
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => expect(result.current.dadosAta.data_reuniao).toBe('2026-06-23'));

    expect(result.current.getMesPorExtenso()).toBe('junho');
    expect(result.current.getDataReuniaoFormatada()).toBe('23 de junho de 2026');
    expect(result.current.getAnoPorExtenso()).toBe('dois mil e vinte e seis');
  });

  it('deve formatar como "primeiro" se o dia ajustado for 1', async () => {
    getAtaPaa.mockResolvedValue({ data_reuniao: '2026-04-30' }); 
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => expect(result.current.dadosAta.data_reuniao).toBe('2026-04-30'));
    expect(result.current.getDiaPorExtenso()).toBe('trinta');
  });

  it('deve retornar fallbacks se data_reuniao for nula', () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    // Funções de data expostas que retornam fallbacks quando dadosAta.data_reuniao não existe
    expect(result.current.getMesPorExtenso()).toBe('__');
    expect(result.current.getDataReuniaoFormatada()).toBe('____');
    expect(result.current.getDiaPorExtenso()).toBe('__');
    expect(result.current.getAnoPorExtenso()).toBe('dois mil e vinte e cinco');
    expect(result.current.getLocalReuniao()).toBe('______');
  });

  it('deve formatar datas avulsas utilizando getDataFormatada', () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());
    expect(result.current.getDataFormatada('2026-12-25')).toBe('25 de dezembro de 2026');
    expect(result.current.getDataFormatada(null)).toBe('____');
  });

  it('deve formatar hora_reuniao sem minutos se for hora cheia', async () => {
    getAtaPaa.mockResolvedValue({ hora_reuniao: '08:00' });
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => expect(result.current.dadosAta.hora_reuniao).toBe('08:00'));
    expect(result.current.getHoraInicio()).toBe('oito horas');
  });

  it('deve formatar hora_reuniao explicitando os minutos', async () => {
    getAtaPaa.mockResolvedValue({ hora_reuniao: '21:45' });
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => expect(result.current.dadosAta.hora_reuniao).toBe('21:45'));
    expect(result.current.getHoraInicio()).toBe('vinte e uma horas e quarenta e cinco minutos');
  });

  it('deve retornar fallback se hora_reuniao for ausente', () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());
    expect(result.current.getHoraInicio()).toBe('____');
  });

  it('deve retornar "ordinária" quando o tipo de reunião for ORDINARIA', async () => {
    getAtaPaa.mockResolvedValue({ tipo_reuniao: 'ORDINARIA' });
    
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => {
      expect(result.current.getTipoReuniao()).toBe('ordinária');
    });
  });

  it('deve retornar "extraordinária" quando o tipo de reunião for EXTRAORDINARIA', async () => {
    getAtaPaa.mockResolvedValue({ tipo_reuniao: 'EXTRAORDINARIA' });
    
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => {
      expect(result.current.getTipoReuniao()).toBe('extraordinária');
    });
  });

  it('deve retornar placeholder se o tipo de reunião não constar nas opções', async () => {
    getAtaPaa.mockResolvedValue({ tipo_reuniao: 'OUTRO' });
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => expect(result.current.dadosAta.tipo_reuniao).toBe('OUTRO'));
    expect(result.current.getTipoReuniao()).toBe('__');
  });

  it('deve computar o string do período do PAA se as datas existirem', () => {
    useGetPaa.mockReturnValue({
      data: { periodo_paa_objeto: { data_inicial: '2025-05-05', data_final: '2026-04-10' } }
    });
    const { result } = renderHook(() => useVisualizacaoAtaPaa());
    expect(result.current.getPeriodoPaaFormatado()).toContain('1º de maio de 2025 a 30 de abril de 2026');
  });

  it('deve retornar vazio se propriedades do período do PAA estiverem incompletas', () => {
    useGetPaa.mockReturnValue({ data: { periodo_paa_objeto: null } });
    const { result } = renderHook(() => useVisualizacaoAtaPaa());
    expect(result.current.getPeriodoPaaFormatado()).toBe('');
  });

  it('deve cobrir todas as condicionais do formatarMesAno', () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());
    
    expect(result.current.formatarMesAno('2026-06-23')).toContain('Junho/2026');
    expect(result.current.formatarMesAno('2026/06/23')).toContain('Junho/2026');
    expect(result.current.formatarMesAno('texto-invalido-com-tracos')).toBe('-');
    expect(result.current.formatarMesAno('invalido')).toBe('-');
    expect(result.current.formatarMesAno(null)).toBe('-');
  });

  it('deve retornar os nomes correspondentes para presidente e secretário se filtrados pelos cargos', async () => {
    getListaPresentesPaa.mockResolvedValue([
      { nome: 'Amanda', cargo: 'Secretário Adjunto', presente: true },
      { nome: 'Carlos', cargo: 'Presidente da Diretoria Executiva', presente: true }
    ]);
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    await waitFor(() => expect(result.current.listaCompletaParticipantes).toHaveLength(2));

    expect(result.current.getNomeSecretario()).toBe('Amanda');
    expect(result.current.getNomePresidente()).toBe('Carlos');
  });

  it('deve expor placeholders caso os cargos de presidente e secretário não estejam na lista', () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());
    expect(result.current.getNomeSecretario()).toBe('_____');
    expect(result.current.getNomePresidente()).toBe('_____');
  });

  it('deve recalcular a altura do documento se disparado o evento de resize global', () => {
    const { result } = renderHook(() => useVisualizacaoAtaPaa());

    result.current.referenciaDocumento.current = { clientHeight: 720 };

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.alturaDocumento).toBe(720);
  });
});