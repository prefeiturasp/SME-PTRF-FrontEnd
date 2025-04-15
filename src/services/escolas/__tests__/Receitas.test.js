import api from '../../api';
import { 
    getTabelasReceita,
    getTabelasReceitaReceita,
    criarReceita,
    getReceita,
    atualizaReceita,
    deletarReceita,
    getListaReceitas,
    getTotaisReceitas,
    filtroPorPalavraReceitas,
    filtrosAvancadosReceitas,
    getRepasse,
    getRepasses,
    getPeriodoFechadoReceita,
    getListaMotivosEstorno,
    marcarLancamentoExcluido,
    marcarLancamentoAtualizado,
    marcarCreditoIncluido,
    getValidarDataDaReceita,
    getPeriodosValidosAssociacaoEncerrada   
 } from '../Receitas.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];
const associacao_uuid = '1234'

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, associacao_uuid);
        localStorage.setItem(TOKEN_ALIAS, mockToken);
        
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    const getAuthHeader = () => {
        return {
            headers: {
                'Authorization': `JWT ${mockToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    test('getTabelasReceita deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelasReceita();
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/tabelas/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual({ data: mockData});
    });

    test('getTabelasReceita deve chamar a API com Error', async () => {
        api.get.mockRejectedValue(new Error("Erro na API"))
        await getTabelasReceita();
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/tabelas/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(api.get).rejects.toThrow("Erro na API")
    });

    test('getTabelasReceitaReceita deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const associacao = associacao_uuid
        const result = await getTabelasReceitaReceita(associacao);
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/tabelas/?associacao_uuid=${associacao_uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getTabelasReceitaReceita deve chamar a API sem parâmetro', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTabelasReceitaReceita();
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/tabelas/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('criarReceita deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes'}
        const result = await criarReceita(payload);
        expect(api.post).toHaveBeenCalledWith(
            `api/receitas/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual({ data: mockData });
    });

    test('getReceita deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid = '1234';
        const result = await getReceita(uuid, associacao_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/${uuid}/?associacao_uuid=${associacao_uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual({data:mockData});
    });

    test('getReceita deve chamar a API sem parâmetro associacao', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid = '1234';
        const result = await getReceita(uuid);
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual({data:mockData});
    });

    test('getReceita deve chamar a API com error', async () => {
        api.get.mockRejectedValue(new Error("Erro na API"))
        const uuid = '1234';
        await getReceita(uuid, associacao_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/${uuid}/?associacao_uuid=${associacao_uuid}`,
            getAuthHeader()
        )
        expect(api.get).rejects.toThrow("Erro na API");
    });

    test('atualizaReceita deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData })
        const uuid = '1234';
        const payload = { teste: 'testes'}
        const result = await atualizaReceita(uuid, payload);
        expect(api.put).toHaveBeenCalledWith(
            `api/receitas/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual({data: mockData});
    });

    test('deletarReceita deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const uuid = '1234';
        const payload = { teste: 'testes'}
        const result = await deletarReceita(uuid, payload);
        expect(api.delete).toHaveBeenCalledWith(
            `api/receitas/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getListaReceitas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getListaReceitas();
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getRepasses deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getRepasses();
        expect(api.get).toHaveBeenCalledWith(
            `/api/repasses/pendentes/?associacao=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getListaMotivosEstorno deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getListaMotivosEstorno();
        expect(api.get).toHaveBeenCalledWith(
            `/api/motivos-estorno/`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getTotaisReceitas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const tipo_receita = '1234'
        const acao_associacao__uuid = '1234'
        const conta_associacao__uuid = '1234'
        const data_inicio = '2025-04-70'
        const data_fim = '2025-04-70'
        const result = await getTotaisReceitas(tipo_receita, acao_associacao__uuid, conta_associacao__uuid, data_inicio, data_fim);
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/totais/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&tipo_receita=${tipo_receita}&acao_associacao__uuid=${acao_associacao__uuid}&conta_associacao__uuid=${conta_associacao__uuid}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('filtroPorPalavraReceitas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const palavra = 'palavra'
        const result = await filtroPorPalavraReceitas(palavra);
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('filtrosAvancadosReceitas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const palavra = 'palavra'
        const tipo_receita = '1234'
        const acao_associacao__uuid = '1234'
        const conta_associacao__uuid = '1234'
        const data_inicio = '2025-04-07'
        const data_fim = '2025-04-07'
        const result = await filtrosAvancadosReceitas(palavra, tipo_receita, acao_associacao__uuid, conta_associacao__uuid, data_inicio, data_fim);
        expect(api.get).toHaveBeenCalledWith(
            `api/receitas/?search=${palavra}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&tipo_receita=${tipo_receita}&acao_associacao__uuid=${acao_associacao__uuid}&conta_associacao__uuid=${conta_associacao__uuid}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getRepasse deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const acao_associacao_uuid='1234'
        const data_receita='2025-04-07'
        let uuid='1234'
        const result = await getRepasse(acao_associacao_uuid, data_receita, uuid="");
        expect(api.get).toHaveBeenCalledWith(
            `/api/repasses/pendentes/?acao-associacao=${acao_associacao_uuid}&data=${data_receita}&uuid-receita=${uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getPeriodoFechadoReceita deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const palavra='1234'
        const aplicacao_recurso='1234'
        const acao_associacao__uuid='1234'
        const despesa__status='1234'
        const result = await getPeriodoFechadoReceita(palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status);
        expect(api.get).toHaveBeenCalledWith(
            `api/rateios-despesas/totais/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getPeriodoFechadoReceita deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const palavra='1234'
        const aplicacao_recurso='1234'
        const acao_associacao__uuid='1234'
        const despesa__status='1234'
        const result = await getPeriodoFechadoReceita(palavra, aplicacao_recurso, acao_associacao__uuid, despesa__status);
        expect(api.get).toHaveBeenCalledWith(
            `api/rateios-despesas/totais/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&acao_associacao__uuid=${acao_associacao__uuid}&despesa__status=${despesa__status}&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getValidarDataDaReceita deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const data_da_receita = '2025-04-07'
        const result = await getValidarDataDaReceita(associacao_uuid, data_da_receita);
        expect(api.get).toHaveBeenCalledWith(
            `/api/receitas/validar-data-da-receita-associacao-encerrada/?associacao_uuid=${associacao_uuid}&data_da_receita=${data_da_receita}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('getPeriodosValidosAssociacaoEncerrada deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getPeriodosValidosAssociacaoEncerrada(associacao_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/receitas/periodos-validos-associacao-encerrada/?associacao_uuid=${associacao_uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('marcarLancamentoExcluido deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const uuid_analise_lancamento = '1234'
        const payload = {}
        const result = await marcarLancamentoExcluido(uuid_analise_lancamento);
        expect(api.post).toHaveBeenCalledWith(
            `/api/analises-lancamento-prestacao-conta/${uuid_analise_lancamento}/marcar-lancamento-excluido/`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('marcarLancamentoAtualizado deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const uuid_analise_lancamento = '1234'
        const payload = {}
        const result = await marcarLancamentoAtualizado(uuid_analise_lancamento);
        expect(api.post).toHaveBeenCalledWith(
            `/api/analises-lancamento-prestacao-conta/${uuid_analise_lancamento}/marcar-lancamento-atualizado/`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
    test('marcarCreditoIncluido deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = {testes: 'testes'}
        const result = await marcarCreditoIncluido(payload);
        expect(api.post).toHaveBeenCalledWith(
            `/api/analises-documento-prestacao-conta/marcar-como-credito-incluido/`,
            payload,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });
    
});
