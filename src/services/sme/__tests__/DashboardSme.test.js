import api from '../../api';
import { 
    getPeriodos,
    getItensDashboard,
    getItensDashboardSme,
    getCardRelatorios,
    getListaRelatoriosConsolidados,
    getComentariosDeAnaliseConsolidadoDre,
    getReordenarComentariosConsolidadoDre,
    editarComentarioDeAnaliseConsolidadoDre,
    deleteComentarioDeAnalise,
    criarComentarioDeAnalise,
    postNotificarComentariosDre
 } from '../DashboardSme.service.js';
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

    test('getPeriodos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getPeriodos();
        const url = `/api/periodos/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getItensDashboard deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_periodo = '1234'
        const result = await getItensDashboard(uuid_periodo);
        const url = `/api/prestacoes-contas/dashboard-sme/?periodo=${uuid_periodo}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getCardRelatorios deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_periodo = '1234'
        const result = await getCardRelatorios(uuid_periodo);
        const url = `/api/consolidados-dre/acompanhamento-de-relatorios-consolidados-sme/?periodo=${uuid_periodo}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getComentariosDeAnaliseConsolidadoDre deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_consolidado_dre = '1234'
        const result = await getComentariosDeAnaliseConsolidadoDre(uuid_consolidado_dre);
        const url = `/api/comentarios-de-analises-consolidados-dre/comentarios/?consolidado_dre=${uuid_consolidado_dre}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getItensDashboardSme deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_periodo = '1234'
        const unificar_apresentados_nao_recebidos = '1234'
        const result = await getItensDashboardSme(uuid_periodo, unificar_apresentados_nao_recebidos);
        const url = `/api/prestacoes-contas/dashboard-sme/?periodo=${uuid_periodo}&unificar_pcs_apresentadas_nao_recebidas=${unificar_apresentados_nao_recebidos}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getListaRelatoriosConsolidados deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_periodo = '1234'
        const status_sme = 'Status'
        const uuid_dre='1234'
        const tipo_relatorio='tipo'
        const result = await getListaRelatoriosConsolidados(uuid_periodo, status_sme, uuid_dre, tipo_relatorio);
        const url = `/api/consolidados-dre/listagem-de-relatorios-consolidados-sme-por-status/?periodo=${uuid_periodo}${uuid_dre ? '&dre='+uuid_dre : ''}${tipo_relatorio ? '&tipo_relatorio='+tipo_relatorio : ''}${status_sme ? '&status_sme='+status_sme : ''}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getReordenarComentariosConsolidadoDre deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await getReordenarComentariosConsolidadoDre(payload);
        const url = `/api/comentarios-de-analises-consolidados-dre/reordenar-comentarios/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('editarComentarioDeAnaliseConsolidadoDre deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const comentario_uuid = '1234'
        const result = await editarComentarioDeAnaliseConsolidadoDre(comentario_uuid, payload);
        const url = `/api/comentarios-de-analises-consolidados-dre/${comentario_uuid}/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('deleteComentarioDeAnalise deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData })
        const comentario_uuid = '1234'
        const result = await deleteComentarioDeAnalise(comentario_uuid);
        const url = `/api/comentarios-de-analises-consolidados-dre/${comentario_uuid}/`
        expect(api.delete).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual({data: mockData});
    });

    test('criarComentarioDeAnalise deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await criarComentarioDeAnalise(payload);
        const url = `/api/comentarios-de-analises-consolidados-dre/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

    test('postNotificarComentariosDre deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const result = await postNotificarComentariosDre(payload);
        const url =`/api/notificacoes/notificar-comentarios-de-analise-consolidado-dre/`
        expect(api.post).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(mockData);
    });

});
