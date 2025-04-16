import api from '../api';
import {
    getValoresReprogramados,
    patchSalvarValoresReprogramados,
    patchConcluirValoresReprogramados,
    getStatusValoresReprogramados,
    getTextoExplicativoUe,
    getTextoExplicativoDre
} from '../ValoresReprogramados.service.js';
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

    test('getValoresReprogramados deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getValoresReprogramados(associacao_uuid);
        const url = `/api/valores-reprogramados/get-valores-reprogramados/?associacao_uuid=${associacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('patchSalvarValoresReprogramados deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchSalvarValoresReprogramados(payload);
        const url = `/api/valores-reprogramados/salvar-valores-reprogramados/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('patchConcluirValoresReprogramados deve chamar a API corretamente', async () => {
        api.patch.mockResolvedValue({ data: mockData })
        const result = await patchConcluirValoresReprogramados(payload);
        const url = `/api/valores-reprogramados/concluir-valores-reprogramados/`
        expect(api.patch).toHaveBeenCalledWith(url, payload, authHeader())
        expect(result).toEqual(result);
    });

    test('getStatusValoresReprogramados deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getStatusValoresReprogramados(associacao_uuid);
        const url = `/api/valores-reprogramados/get-status-valores-reprogramados/?associacao_uuid=${associacao_uuid}`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getTextoExplicativoUe deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTextoExplicativoUe();
        const url = `/api/parametros-ue/texto-pagina-valores-reprogramados/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

    test('getTextoExplicativoDre deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getTextoExplicativoDre();
        const url = `/api/parametros-dre/texto-pagina-valores-reprogramados/`
        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(result);
    });

});
