import api from '../../api';
import { TOKEN_ALIAS } from '../../auth.service.js';
import { 
    getStatusDelecaoBemProduzido, 
    deleteBemProduzido 
} from '../BensProduzidos.service.js';

jest.mock('../../api', () => ({
    get: jest.fn(),
    delete: jest.fn(),
}));

const mockToken = 'fake-token';
const mockData = { status: 'permitido' };

describe('Testes para funções de Bens Produzidos', () => {
    
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

    test('getStatusDelecaoBemProduzido deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const uuid = '1234';
        const result = await getStatusDelecaoBemProduzido(uuid);

        expect(api.get).toHaveBeenCalledWith(
            `api/bens-produzidos/${uuid}/status-delecao-bem-produzido/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('deleteBemProduzido deve chamar a API corretamente', async () => {
        api.delete.mockResolvedValue({ data: mockData });
        const uuid = '1234';
        const result = await deleteBemProduzido(uuid);

        expect(api.delete).toHaveBeenCalledWith(
            `api/bens-produzidos/${uuid}/`,
            getAuthHeader()
        );
        expect(result).toEqual(mockData);
    });
});