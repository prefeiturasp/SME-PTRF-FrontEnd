import api from '../../api';
import { tabelaValoresPendentes } from '../TabelaValoresPendentesPorAcao.service.js';
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
const periodo_uuid = '1234';

describe('Testes para funções de análise', () => {
    
    beforeEach(() => {
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


    test('tabelaValoresPendentes deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const conta_uuid = '1234'
        const result = await tabelaValoresPendentes(periodo_uuid, conta_uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/conciliacoes/tabela-valores-pendentes/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}`,
            getAuthHeader()
        )
        expect(result).toEqual(mockData);
    });


});
