import api from '../../api';
import { 
    getUnidadesParaAtribuir,
    filtrosUnidadesParaAtribuir,
    atribuirTecnicos,
    retirarAtribuicoes,
    copiarPeriodo,
    atribuirTecnico    
 } from '../Atribuicoes.service.js';
import { TOKEN_ALIAS } from '../../auth.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
}));


const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1' }];

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
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

    test('getUnidadesParaAtribuir deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const periodo = '1234'
        const result = await getUnidadesParaAtribuir(dreUuid, periodo);
        const url = `api/unidades/para-atribuicao/?dre_uuid=${dreUuid}&periodo=${periodo}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('filtrosUnidadesParaAtribuir deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const dreUuid = '1234'
        const periodo = '1234'
        const tipo_unidade = '1234'
        const termo = '1234'
        const codigo_eol = '1234'
        const tecnico = '1234'
        const result = await filtrosUnidadesParaAtribuir(dreUuid, periodo, tipo_unidade, termo, codigo_eol, tecnico);
        const url = `api/unidades/para-atribuicao/?dre_uuid=${dreUuid}&periodo=${periodo}&tipo_unidade=${tipo_unidade}&search=${termo}&codigo_eol=${codigo_eol}&tecnico=${tecnico}`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('atribuirTecnicos deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes' }
        const result = await atribuirTecnicos(payload);
        const url = 'api/atribuicoes/lote/'
        expect(api.post).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(result).toEqual({ data: mockData });
    });

    test('atribuirTecnicos deve chamar a API com error', async () => {
        api.post.mockRejectedValue(new Error("error"))
        const payload = { teste: 'testes'}
        await atribuirTecnicos(payload);
        const url = 'api/atribuicoes/lote/'
        expect(api.post).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(api.post).rejects.toThrow("error");
    });

    test('retirarAtribuicoes deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes' }
        const result = await retirarAtribuicoes(payload);
        const url = 'api/atribuicoes/desfazer-lote/'
        expect(api.post).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(result).toEqual({ data: mockData });
    });

    test('retirarAtribuicoes deve chamar a API com error', async () => {
        api.post.mockRejectedValue(new Error("error"))
        const payload = { teste: 'testes'}
        await retirarAtribuicoes(payload);
        const url = 'api/atribuicoes/desfazer-lote/'
        expect(api.post).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(api.post).rejects.toThrow("error");
    });

    test('atribuirTecnico deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes' }
        const result = await atribuirTecnico(payload);
        const url = 'api/atribuicoes/'
        expect(api.post).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(result).toEqual({ data: mockData });
    });

    test('atribuirTecnico deve chamar a API com error', async () => {
        api.post.mockRejectedValue(new Error("error"))
        const payload = { teste: 'testes'}
        await atribuirTecnico(payload);
        const url = 'api/atribuicoes/'
        expect(api.post).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(api.post).rejects.toThrow("error");
    });

    test('copiarPeriodo deve chamar a API corretamente', async () => {
        api.post.mockResolvedValue({ data: mockData })
        const payload = { teste: 'testes' }
        const result = await copiarPeriodo(payload);
        const url = 'api/atribuicoes/copia-periodo/'
        expect(api.post).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(result).toEqual({ data: mockData });
    });

    test('copiarPeriodo deve chamar a API com error', async () => {
        api.post.mockRejectedValue(new Error("error"))
        const payload = { teste: 'testes'}
        await copiarPeriodo(payload);
        const url = 'api/atribuicoes/copia-periodo/'
        expect(api.post).toHaveBeenCalledWith( url, payload, authHeader() )
        expect(api.post).rejects.toThrow("error");
    });
    
});
