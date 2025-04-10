import api from '../../api';
import { 
    getPeriodos,
    getItensDashboard    
 } from '../Dashboard.service.js';
import { ASSOCIACAO_UUID, TOKEN_ALIAS } from '../../auth.service.js';

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
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

    test('getItensDashboard deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const uuid_periodo = '1234'
        const result = await getItensDashboard(uuid_periodo);
        const url = `/api/prestacoes-contas/dashboard/?periodo=${uuid_periodo}&dre_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&add_reprovadas_nao_apresentacao=SIM`
        expect(api.get).toHaveBeenCalledWith( url, authHeader() )
        expect(result).toEqual(mockData);
    });

});
