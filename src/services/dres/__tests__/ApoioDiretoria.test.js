import api from '../../api';
import { 
    getFaqCategorias,
    getFaqPorCategoria
 } from '../ApoioDiretoria.service.js';
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

    test('getFaqCategorias deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const result = await getFaqCategorias();
        expect(api.get).toHaveBeenCalledWith(
            `/api/faq-categorias/`,
            authHeader()
        )
        expect(result).toEqual(mockData);
    });

    test('getFaqPorCategoria deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })
        const categoria__uuid = '1234';
        const result = await getFaqPorCategoria(categoria__uuid);
        expect(api.get).toHaveBeenCalledWith(
            `/api/faqs/?categoria__uuid=${categoria__uuid}`,
            authHeader()
        )
        expect(result).toEqual(mockData);
    });


});
