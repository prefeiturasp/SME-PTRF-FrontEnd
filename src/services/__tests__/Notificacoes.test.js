import api from '../api';
import {
    getQuantidadeNaoLidas,
    getNotificacoes,
    getNotificacoesPaginacao,
    getNotificacoesLidasNaoLidas,
    getNotificacoesLidasNaoLidasPaginacao,
    setNotificacaoMarcarDesmarcarLida,
    getNotificacoesTabela,
    getNotificacoesFiltros,
    getNotificacoesFiltrosPaginacao,
    getNotificacoesErroConcluirPc,
    deleteNotificacaoPorUuid,
    getRegistrosFalhaGeracaoPc
} from '../Notificacoes.service.js';
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../auth.service.js';

jest.mock('../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));

const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];
const associacao_uuid = '1234'
const payload = { teste: 'teste' }

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
        localStorage.setItem(ASSOCIACAO_UUID, associacao_uuid);
        localStorage.setItem(TOKEN_ALIAS, mockToken);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    const authHeader = () => {
        return {
            headers: {
                'Authorization': `JWT ${mockToken}`,
                'Content-Type': 'application/json'
            }
        };
    };

    test('getQuantidadeNaoLidas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getQuantidadeNaoLidas();
        const url = `/api/notificacoes/quantidade-nao-lidos/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getNotificacoes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getNotificacoes();
        const url = `/api/notificacoes/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getNotificacoesPaginacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const page = '1'
        const result = await getNotificacoesPaginacao(page);
        const url = `/api/notificacoes/?page=${page}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getNotificacoesLidasNaoLidas deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const lidas = 'teste'
        const result = await getNotificacoesLidasNaoLidas(lidas);
        const url = `/api/notificacoes/?lido=${lidas}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getNotificacoesLidasNaoLidasPaginacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const lidas = 'teste'
        const page = '1'
        const result = await getNotificacoesLidasNaoLidasPaginacao(lidas, page);
        const url = `/api/notificacoes/?lido=${lidas}&page=${page}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('setNotificacaoMarcarDesmarcarLida deve chamar a API corretamente', async () => {
        api.put.mockResolvedValue({ data: mockData })
        const result = await setNotificacaoMarcarDesmarcarLida(payload);
        const url = `/api/notificacoes/marcar-lido/`
        expect(api.put).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('getNotificacoesTabela deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getNotificacoesTabela();
        const url = `/api/notificacoes/tabelas/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getNotificacoesFiltros deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let tipo='teste'
        let remetente='teste'
        let categoria='teste'
        let lido='teste'
        let data_inicio='2025-04-08'
        let data_fim='2025-04-08'
        const result = await getNotificacoesFiltros(tipo, remetente, categoria, lido, data_inicio, data_fim);
        const url = `/api/notificacoes/?${tipo ? 'tipo=' + tipo : ""}${remetente ? '&remetente='+remetente: ""}${categoria ? '&categoria='+categoria : ""}${lido ? '&lido='+lido : ""}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getNotificacoesFiltrosPaginacao deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        let tipo = 'teste'
        let remetente = 'teste'
        let categoria = 'teste'
        let lido = 'teste'
        let page = '1'
        let data_inicio='2025-04-08'
        let data_fim='2025-04-08'
        const result = await getNotificacoesFiltrosPaginacao(tipo, remetente, categoria, lido, data_inicio, data_fim, page);
        const url = `/api/notificacoes/?${tipo ? 'tipo=' + tipo : ""}${remetente ? '&remetente='+remetente: ""}${categoria ? '&categoria='+categoria : ""}${lido ? '&lido='+lido : ""}${data_inicio ? '&data_inicio='+data_inicio : ""}${data_fim ? '&data_fim='+data_fim : ""}&page=${page}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getNotificacoesErroConcluirPc deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getNotificacoesErroConcluirPc();
        const url = `/api/notificacoes/erro-concluir-pc/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('deleteNotificacaoPorUuid deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const notificacao_uuid = '1234'
        const result = await deleteNotificacaoPorUuid(notificacao_uuid);
        const url = `/api/notificacoes/${notificacao_uuid}`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getRegistrosFalhaGeracaoPc deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getRegistrosFalhaGeracaoPc(associacao_uuid);
        const url = `/api/falhas-geracao-pc/info-registro-falha-geracao-pc/?associacao=${associacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

});
