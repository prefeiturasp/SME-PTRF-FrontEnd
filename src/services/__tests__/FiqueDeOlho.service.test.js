import api from '../api';
import { getFiqueDeOlho } from '../FiqueDeOlho.service.js';
import { TOKEN_ALIAS } from '../auth.service.js';

jest.mock('../api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    registerUnauthorizedHandler: jest.fn(),
}));

const mockToken = 'fake-token';
const mockData = { count: 1, results: [{ texto: '<p>Atenção aos prazos.</p>' }] };

describe('FiqueDeOlho.service', () => {

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

    test('getFiqueDeOlho deve chamar a API com tipo_texto e recurso_uuid', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const tipo_texto = 'associacoes_historico_membros';
        const recurso_uuid = 'recurso-1';

        const result = await getFiqueDeOlho(tipo_texto, recurso_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/fique-de-olho/?tipo_texto=${tipo_texto}&recurso_uuid=${recurso_uuid}`,
            authHeader()
        );
        expect(result).toEqual(mockData);
    });

    test('getFiqueDeOlho deve chamar a API apenas com tipo_texto quando recurso_uuid não for informado', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const tipo_texto = 'associacoes_prestacao_contas';

        await getFiqueDeOlho(tipo_texto);

        expect(api.get).toHaveBeenCalledWith(
            `/api/fique-de-olho/?tipo_texto=${tipo_texto}`,
            authHeader()
        );
    });

    test('getFiqueDeOlho deve chamar a API apenas com recurso_uuid quando tipo_texto não for informado', async () => {
        api.get.mockResolvedValue({ data: mockData });
        const recurso_uuid = 'recurso-1';

        await getFiqueDeOlho(undefined, recurso_uuid);

        expect(api.get).toHaveBeenCalledWith(
            `/api/fique-de-olho/?recurso_uuid=${recurso_uuid}`,
            authHeader()
        );
    });

    test('getFiqueDeOlho deve chamar a API sem parâmetros quando nenhum argumento for informado', async () => {
        api.get.mockResolvedValue({ data: mockData });

        await getFiqueDeOlho();

        expect(api.get).toHaveBeenCalledWith(
            '/api/fique-de-olho/?',
            authHeader()
        );
    });

    test('getFiqueDeOlho deve retornar o erro quando a requisição falhar', async () => {
        const erro = new Error('Erro na API');
        api.get.mockRejectedValue(erro);

        await expect(getFiqueDeOlho('associacoes_historico_membros', 'recurso-1'))
            .rejects.toThrow('Erro na API');
    });
});
