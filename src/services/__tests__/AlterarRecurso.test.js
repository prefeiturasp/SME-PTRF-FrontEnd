import api from '../api';
import { getRecursos, getRecursosPorUnidade } from '../AlterarRecurso.service.js';
import { TOKEN_ALIAS } from '../auth.service.js';

jest.mock('../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    registerUnauthorizedHandler: jest.fn()
}));

const mockToken = 'fake-token';
const mockData = [{ id: 1, nome: 'Teste 1', uuid: 'uuid-teste', nome_exibicao: 'Teste 1' }];

describe('Testes para funções de AlterarRecurso', () => {

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

    test('getRecursos deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })

        const result = await getRecursos();
        const url = `/api/recursos`

        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });

    test('getRecursosPorUnidade deve chamar a API corretamente', async () => {
        api.get.mockResolvedValue({ data: mockData })

        const unidade_uuid = '1234'
        const result = await getRecursosPorUnidade(unidade_uuid);

        const url = `/api/recursos/por-unidade/?uuid_unidade=${unidade_uuid}`

        expect(api.get).toHaveBeenCalledWith(url, authHeader())
        expect(result).toEqual(mockData);
    });
});
